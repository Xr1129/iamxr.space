#!/usr/bin/env bash
# ============================================================
# 博客图片上传脚本
# 用法:
#   ./scripts/upload-image.sh <图片路径> <文章slug> [自定义文件名]
#
# 示例:
#   ./scripts/upload-image.sh ~/Desktop/cover.png hello-world
#   ./scripts/upload-image.sh photo.jpg deploy-notes diagram
# ============================================================
set -e

# ---------- 配置 ----------
SERVER="root@iamxr.space"
REMOTE_DIR="/var/www/iamxr.space/public/images/posts"

# ---------- 参数 ----------
FILE="$1"
SLUG="$2"
NAME="${3:-$(basename "$FILE")}"

if [ -z "$FILE" ] || [ -z "$SLUG" ]; then
  echo "用法: $0 <图片路径> <文章slug> [自定义文件名]"
  echo "示例: $0 ~/Desktop/cover.png hello-world"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "❌ 文件不存在: $FILE"
  exit 1
fi

# ---------- 上传 ----------
echo "📤 上传 $FILE → $SERVER:$REMOTE_DIR/$SLUG/$NAME"
ssh "$SERVER" "mkdir -p $REMOTE_DIR/$SLUG"
scp "$FILE" "$SERVER:$REMOTE_DIR/$SLUG/$NAME"

echo ""
echo "✅ 上传完成！"
echo ""
echo "📝 在 MDX 中使用："
echo "   ![描述](/images/posts/$SLUG/$NAME)"
echo ""
echo "   或用优化组件："
echo "   <Image src=\"/images/posts/$SLUG/$NAME\" alt=\"描述\" width={800} height={600} />"
