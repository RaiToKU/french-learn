# 语料来源与许可（NOTICE）

本应用为个人非商业学习用途。词汇语料并非自撰，按以下来源与许可使用：

## 1. 词汇分级与释义（主体）

- 来源：[bonorca/the-only-french-deck](https://github.com/bonorca/the-only-french-deck)（面向中文学习者的 Anki 法语卡组）
- 内容：约 6,900 词的**分级（A1–C1）**、中文释义、法语例句与中文翻译
- 分级依据（该卡组自述）：合并 Wiktionary OpenSubtitles Top 20K 法语词频（取前 5000 并归并原形）、CLE 教材 A1–B2 生词、[FLELex](https://cental.uclouvain.be/)（UCLouvain CENTAL）A1–B2 分级词表
- 许可：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)

本应用取其中 **A1–C1 共 6,998 条（A1 820 / A2 1,387 / B1 2,228 / B2 2,109 / C1 454）**，字段 `w / p / cn / ex / exCn` 直接来自该卡组；`th`（主题）为本项目按中文释义关键词自动归类的辅助标签，不属于原作内容。

## 2. 手工整理部分

- 263 条核心交际词条（问候、场景高频、常用动词等）：本项目自行撰写，含自编例句；其中 203 条与上述词表重名，采用手写版本覆盖（例句更简单、更适合入门）。
- 其余模块（句型骨架 72 句、语法点 71 个、动词变位 22 组、精读 8 篇、情景对话 12 个）均为本项目自行撰写。

## 3. 使用约束

- 依 CC BY-NC-SA 4.0：**不得用于商业用途**；转载或改编需署名并沿用同一许可。
- 若需商业使用，请替换 `data/lexicon.js` 中的第三方词条（保留 NOTICE 中的来源说明或改用自建词表）。

## 4. 生成方式（可复现）

`data/lexicon.js` 由脚本从上述卡组的 `words.tsv / meanings.tsv / examples.tsv` 生成：
过滤 A1–B2 → 解析词性（取词表标签，阴阳性取释义首段）→ 清洗释义 → 取第 1 条例句 → 主题自动归类 → 与手写词条合并去重。脚本未随包分发，可按 NOTICE 描述自行复现。
