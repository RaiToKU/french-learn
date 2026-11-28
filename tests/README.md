# 回归测试（无依赖，跑真实浏览器）

每个 `*.html` 是一个自检页：用 iframe 打开 `../index.html#/路由`，驱动真实交互，把 `断言名:ok|FAIL(细节)`
拼进 `document.title`。跑完用 `--dump-dom` 取标题即可。

```bash
bash tests/run.sh          # 默认端口 8899，自动起本地静态服务
bash tests/run.sh 9000     # 换端口
CHROME=/path/to/chrome bash tests/run.sh
```

| 文件 | 覆盖 |
| --- | --- |
| `_test*.html` | 逐轮功能的细粒度回归（冒烟、题量、变位冲刺、懒加载、C1 保卡、数据安全、竞态、时式契约、失败回落…） |
| `_walk1.html` | 24 条路由全部渲染 + 无 JS 报错 |
| `_walk2.html` | 语法 / 动词 / 精读 / 情景 / 复习 / 导出导入 |
| `_walk3.html` | 12 种练习（训练 8 + 游戏 4）：开始 → 作答 → 下一题 |
| `_walk4.html` `_walk4b.html` | 复习评分、任务/等级、收藏与复习卡跨刷新持久化 |
| `_walk5.html` | 390 / 834 / 1280 三档布局：无横向溢出、无超宽元素、触屏点击目标 |
| `_walk6.html` | 语法随堂题、精读理解题、情景播放、变位表切换 |
| `_walk7.html` | 答对计数与重复点击防重（`APP.ui.quiz` 守卫） |
| `_walk8.html` | 扩展词加进复习队列后，复习卡片正常渲染（无 undefined） |
| `_walk9.html` | 扩展词表载入失败 → chip 变「重试」→ 点击恢复 |
| `_walk10.html` | 计数不闪烁 / 词频按需加载 / 扩展 chip 单次下载 / 扩展卡校验与幽灵卡清理 |

注意：headless Chrome 的最小窗口宽度约 500px，直接用 `--window-size=390` 截图会看起来被裁；
测窄屏要用 iframe 指定宽度（`_walk5.html?w=390` 就是这么做的）。
