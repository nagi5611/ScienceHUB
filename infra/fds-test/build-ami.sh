#!/bin/bash
# infra/fds-test/build-ami.sh
# Amazon Linux 2023 上で FDS をビルドし /opt/fds/bin/fds に配置する（AMI 作成前に実行）
set -euo pipefail

FDS_TAG="${FDS_TAG:-FDS-6.9.1}"
INSTALL_ROOT="/opt/fds"

if [ "$(id -u)" -ne 0 ]; then
  echo "root で実行してください: sudo bash build-ami.sh"
  exit 1
fi

echo "==> パッケージをインストール"
dnf update -y
dnf install -y git gcc gcc-c++ gcc-gfortran make openmpi-devel openmpi jq curl zip tar which

echo "==> OpenMPI を有効化"
# shellcheck disable=SC1091
source /etc/profile.d/openmpi.sh || true
export PATH="/usr/lib64/openmpi/bin:${PATH}"
export LD_LIBRARY_PATH="/usr/lib64/openmpi/lib:${LD_LIBRARY_PATH:-}"

WORKDIR="/tmp/fds-build"
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "==> FDS ソースを取得 (${FDS_TAG})"
git clone --depth 1 --branch "$FDS_TAG" https://github.com/firemodels/fds.git
cd fds/Build

echo "==> FDS をビルド（数十分かかります）"
./build_fds.sh

BUILT_BIN="$(find "$WORKDIR/fds/Build" -type f -name fds -perm -111 | head -n 1)"
if [ -z "$BUILT_BIN" ]; then
  echo "FDS バイナリが見つかりません"
  exit 1
fi

echo "==> ${INSTALL_ROOT}/bin に配置"
mkdir -p "${INSTALL_ROOT}/bin"
install -m 0755 "$BUILT_BIN" "${INSTALL_ROOT}/bin/fds"

cat >/etc/profile.d/sciencehub-fds.sh <<'EOF'
export PATH="/opt/fds/bin:${PATH}"
EOF

echo "==> 動作確認"
"${INSTALL_ROOT}/bin/fds" -v || true

echo "完了: ${INSTALL_ROOT}/bin/fds"
echo "このインスタンスから AMI を作成し、AWS_EC2_FDS_AMI_ID に設定してください。"
