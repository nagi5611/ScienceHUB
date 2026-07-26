#!/bin/bash
# infra/fds-test/build-ami.sh
# Amazon Linux 2023 上で FDS をビルドし /opt/fds/bin/fds に配置する（AMI 作成前に実行）
set -euo pipefail

FDS_TAG="${FDS_TAG:-FDS-6.9.1}"
INSTALL_ROOT="/opt/fds"
FDS_BUILD_DIR="ompi_gnu_linux"

if [ "$(id -u)" -ne 0 ]; then
  echo "root で実行してください: sudo bash build-ami.sh"
  exit 1
fi

echo "==> パッケージをインストール"
dnf update -y
# AL2023 は curl-minimal が入っている。curl パッケージを足すと curl-minimal と競合するため入れない
dnf install -y git gcc gcc-c++ gcc-gfortran make openmpi-devel openmpi jq zip tar which

if ! command -v curl >/dev/null 2>&1; then
  echo "curl が見つかりません。curl-minimal をインストールします"
  dnf install -y curl-minimal
fi

echo "==> OpenMPI を PATH に追加（AL2023 には /etc/profile.d/openmpi.sh は無いことが多い）"
for openmpi_profile in /etc/profile.d/openmpi.sh /etc/profile.d/openmpi*.sh; do
  if [ -f "$openmpi_profile" ]; then
    # shellcheck disable=SC1090
    source "$openmpi_profile"
    break
  fi
done
export PATH="/usr/lib64/openmpi/bin:/usr/bin:${PATH}"
export LD_LIBRARY_PATH="/usr/lib64/openmpi/lib:${LD_LIBRARY_PATH:-}"

if ! command -v mpifort >/dev/null 2>&1; then
  echo "mpifort が見つかりません。openmpi-devel のインストールを確認してください"
  exit 1
fi

# MKL は任意（無くてもビルド可能な場合あり）。oneAPI を入れている場合のみ MKLROOT を使う
if [ -z "${MKLROOT:-}" ] && [ -d /opt/intel/oneapi/mkl/latest ]; then
  export MKLROOT=/opt/intel/oneapi/mkl/latest
  echo "MKLROOT=${MKLROOT}"
else
  echo "MKLROOT 未設定 — MKL なしでビルドを試します（リンクエラー時は Intel oneAPI MKL の導入を検討）"
fi

# t3.micro (1GB) で make -j4 すると gfortran が OOM kill されるため swap と -j1 を用意
ensure_build_swap() {
  local swap_gb="${FDS_SWAP_GB:-2}"
  local mem_kb
  mem_kb="$(awk '/MemTotal:/ {print $2}' /proc/meminfo)"
  if [ "${mem_kb:-0}" -lt 3000000 ] && ! swapon --show | grep -q .; then
    echo "==> メモリが少ないため ${swap_gb}GB の swap を追加（ビルド用）"
    fallocate -l "${swap_gb}G" /swapfile-fds-build || dd if=/dev/zero of=/swapfile-fds-build bs=1M count=$((swap_gb * 1024))
    chmod 600 /swapfile-fds-build
    mkswap /swapfile-fds-build
    swapon /swapfile-fds-build
  fi
}

resolve_build_jobs() {
  if [ -n "${FDS_BUILD_JOBS:-}" ]; then
    echo "${FDS_BUILD_JOBS}"
    return
  fi
  local mem_kb
  mem_kb="$(awk '/MemTotal:/ {print $2}' /proc/meminfo)"
  if [ "${mem_kb:-0}" -lt 2000000 ]; then
    echo 1
  elif [ "${mem_kb:-0}" -lt 4000000 ]; then
    echo 2
  else
    echo 4
  fi
}

ensure_build_swap
FDS_BUILD_JOBS="$(resolve_build_jobs)"
echo "==> 並列ビルド: make -j${FDS_BUILD_JOBS}"

WORKDIR="/tmp/fds-build"
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "==> FDS ソースを取得 (${FDS_TAG})"
git clone --branch "$FDS_TAG" --depth 1 https://github.com/firemodels/fds.git
cd fds/Build/"${FDS_BUILD_DIR}"

echo "==> FDS をビルド（ompi_gnu_linux / メモリ次第で 30〜90 分）"
make -j"${FDS_BUILD_JOBS}" VPATH="../../Source" -f ../makefile "${FDS_BUILD_DIR}"

BUILT_BIN="${WORKDIR}/fds/Build/${FDS_BUILD_DIR}/fds_ompi_gnu_linux"
if [ ! -x "$BUILT_BIN" ]; then
  BUILT_BIN="$(find "${WORKDIR}/fds/Build" -type f -name 'fds_ompi_gnu_linux' -perm -111 | head -n 1)"
fi
if [ -z "$BUILT_BIN" ] || [ ! -x "$BUILT_BIN" ]; then
  echo "FDS バイナリ (fds_ompi_gnu_linux) が見つかりません"
  exit 1
fi

echo "==> ${INSTALL_ROOT} に配置"
mkdir -p "${INSTALL_ROOT}/bin" "${INSTALL_ROOT}/lib"
install -m 0755 "$BUILT_BIN" "${INSTALL_ROOT}/lib/fds_ompi_gnu_linux"

cat >"${INSTALL_ROOT}/bin/fds" <<'WRAP'
#!/bin/bash
export PATH="/usr/lib64/openmpi/bin:/opt/fds/bin:${PATH}"
export LD_LIBRARY_PATH="/usr/lib64/openmpi/lib:${LD_LIBRARY_PATH:-}"
# EC2 user-data は root で動く。OpenMPI 4.x は root 実行を拒否するため明示的に許可
export OMPI_ALLOW_RUN_AS_ROOT=1
export OMPI_ALLOW_RUN_AS_ROOT_CONFIRM=1
exec mpiexec -n 1 /opt/fds/lib/fds_ompi_gnu_linux "$@"
WRAP
chmod 0755 "${INSTALL_ROOT}/bin/fds"

cat >/etc/profile.d/sciencehub-fds.sh <<'EOF'
export PATH="/opt/fds/bin:${PATH}"
export LD_LIBRARY_PATH="/usr/lib64/openmpi/lib:${LD_LIBRARY_PATH:-}"
EOF

echo "==> 動作確認"
"${INSTALL_ROOT}/bin/fds" -v

echo "完了: ${INSTALL_ROOT}/bin/fds"
echo "このインスタンスから AMI を作成し、AWS_EC2_FDS_AMI_ID に設定してください。"
