#!/usr/bin/env bash
# 一次性部署：创建仓库 → 推送 → 启用 GitHub Pages（Actions 作为来源）
# 前提：gh auth login -h github.com
set -euo pipefail

REPO="${1:-french-learn}"
VIS="${2:-public}"

command -v gh >/dev/null || { echo "缺少 gh CLI：brew install gh"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "先认证一次：gh auth login -h github.com"; exit 1; }

OWNER="$(gh api user -q .login)"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[ "$BRANCH" = "HEAD" ] && { echo "还没提交，先 git add -A && git commit"; exit 1; }

if git remote get-url origin >/dev/null 2>&1; then
  echo "已有 remote：$(git remote get-url origin)"
  git push -u origin "$BRANCH"
else
  gh repo create "$OWNER/$REPO" "--$VIS" --source . --remote origin --push
fi

if gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null
else
  gh api -X POST "repos/$OWNER/$REPO/pages" -f build_type=workflow >/dev/null
fi

LOWER="$(echo "$OWNER" | tr '[:upper:]' '[:lower:]')"
echo
echo "仓库   https://github.com/$OWNER/$REPO"
echo "站点   https://$LOWER.github.io/$REPO/   （首次约 1 分钟生效）"
echo "流水线 gh run watch"
