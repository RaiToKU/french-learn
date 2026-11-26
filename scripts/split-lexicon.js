/* 把 data/lexicon.js（单文件全量）拆成按级别懒加载的 4 个文件 + 1 个 meta 文件。
   用法：node scripts/split-lexicon.js [源文件]
   产物：data/lexicon-a1.js / -a2.js / -b1.js / -b2.js / data/lexicon-meta.js */
const fs = require('fs');
const path = require('path');
const src = process.argv[2] || path.join(__dirname, '..', 'data', 'lexicon.js');
global.window = global;
require(path.resolve(src));
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const outDir = path.join(__dirname, '..', 'data');
let total = 0;
LEVELS.forEach(function (lv) {
  const list = (FR.LEXICON || {})[lv] || [];
  total += list.length;
  const body = `/* 核心语库 · 词汇 ${lv}（懒加载：选中该级别或需要全量时才载入）
   字段：w 词形 / p 词性 / cn 中文释义 / ex 例句 / exCn 例句翻译 / th 主题
   由 scripts/split-lexicon.js 从原始单文件生成，勿手改 */
window.FR = window.FR || {};
FR.LEXICON = FR.LEXICON || {};
FR.LEXICON.${lv} = ${JSON.stringify(list)};
`;
  const file = path.join(outDir, 'lexicon-' + lv.toLowerCase() + '.js');
  fs.writeFileSync(file, body);
  console.log(lv, list.length, '→', path.basename(file), (fs.statSync(file).size / 1024).toFixed(0) + 'KB');
});
const meta = FR.LEXICON_META || {};
fs.writeFileSync(path.join(outDir, 'lexicon-meta.js'),
  `/* 语料元信息（很小，始终加载；用于来源说明与总量展示） */\nwindow.FR = window.FR || {};\nFR.LEXICON_META = ${JSON.stringify(meta, null, 0)};\n`);
console.log('meta → lexicon-meta.js', (fs.statSync(path.join(outDir, 'lexicon-meta.js')).size / 1024).toFixed(1) + 'KB');
console.log('total', total);
