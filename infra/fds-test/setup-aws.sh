#!/bin/bash
# infra/fds-test/setup-aws.sh
# テスト用 EC2 のセキュリティグループとデフォルト VPC サブネット ID を表示する
set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-1}"
SG_NAME="${SG_NAME:-sciencehub-fds-test}"

echo "リージョン: ${REGION}"

VPC_ID="$(aws ec2 describe-vpcs --region "$REGION" --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
if [ -z "$VPC_ID" ] || [ "$VPC_ID" = "None" ]; then
  echo "デフォルト VPC が見つかりません。VPC / サブネットは手動で用意してください。"
  exit 1
fi

SUBNET_ID="$(aws ec2 describe-subnets --region "$REGION" --filters Name=vpc-id,Values="$VPC_ID" --query 'Subnets[0].SubnetId' --output text)"
echo "AWS_EC2_SUBNET_ID=${SUBNET_ID}"

EXISTING_SG="$(aws ec2 describe-security-groups --region "$REGION" --filters Name=group-name,Values="$SG_NAME" Name=vpc-id,Values="$VPC_ID" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)"

if [ -n "$EXISTING_SG" ] && [ "$EXISTING_SG" != "None" ]; then
  SG_ID="$EXISTING_SG"
  echo "既存のセキュリティグループを使用: ${SG_ID}"
else
  SG_ID="$(aws ec2 create-security-group --region "$REGION" --group-name "$SG_NAME" --description "ScienceHUB FDS test (egress HTTPS only)" --vpc-id "$VPC_ID" --query 'GroupId' --output text)"
  aws ec2 authorize-security-group-egress --region "$REGION" --group-id "$SG_ID" --ip-permissions IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges='[{CidrIp=0.0.0.0/0,Description=HTTPS}]' >/dev/null || true
  echo "セキュリティグループを作成: ${SG_ID}"
fi

echo "AWS_EC2_SECURITY_GROUP_ID=${SG_ID}"
echo ""
echo "次に IAM ユーザーを作成し infra/fds-test/iam-policy.json をアタッチしてください。"
