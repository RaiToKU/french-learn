#!/usr/bin/env bash
# 全量回归：起本地静态服务 → 逐个跑 tests/*.html（每个页面把断言结果写进 document.title）→ 汇总
# 用法：bash tests/run.sh [端口]
set -u
PORT="${1:-8899}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$CHROME" ]; then echo "找不到 Chrome，请设置 CHROME 环境变量"; exit 2; fi

( cd "$ROOT" && python3 -m http.server "$PORT" >/tmp/fr-test-server.log 2>&1 & echo $! >/tmp/fr-test-server.pid )
sleep 1
trap 'kill "$(cat /tmp/fr-test-server.pid)" 2>/dev/null' EXIT

total=0; failed=0
for f in "$ROOT"/tests/*.html; do
  name="$(basename "$f")"
  out=$("$CHROME" --headless=new --disable-gpu --no-sandbox \
        --user-data-dir="/tmp/fr-test-$RANDOM" --window-size=560,960 \
        --virtual-time-budget=60000 --dump-dom "http://127.0.0.1:$PORT/tests/$name" 2>/dev/null \
        | grep -o '<title>[^<]*' | sed 's/<title>//')
  ok=$(echo "$out" | grep -o ':ok' | wc -l | tr -d ' ')
  bad=$(echo "$out" | tr '|' '\n' | grep ':FAIL' | sed 's/^ *//' | tr '\n' ' ')
  total=$((total + ok))
  printf '%-16s %3s ok %s\n' "$name" "$ok" "${bad:+| $bad}"
  [ -n "$bad" ] && failed=1
done
echo "—— 合计 $total 项断言 $([ $failed -eq 0 ] && echo '全部通过' || echo '有失败')"
exit $failed
