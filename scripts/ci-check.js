/* 发布前语料自检（workflow 与本地共用一套逻辑）
   用法：node scripts/ci-check.js */
global.window = global;
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILES = ['data/lexicon-meta.js', 'data/lexicon-a1.js', 'data/lexicon-a2.js',
  'data/lexicon-b1.js', 'data/lexicon-b2.js', 'data/lexicon-c1.js', 'data/lexicon-ext.js',
  'data/lex-detail.js', 'data/verb-forms.js', 'data/verb-tenses.js',
  'data/grammar.js', 'data/verbs.js', 'data/frames.js', 'data/readings.js', 'data/scenarios.js'];
FILES.forEach(function (f) { require(path.join(ROOT, f)); });

const CORE = ['A1', 'A2', 'B1', 'B2', 'C1'];
const fail = function (msg) { console.error('✗', msg); process.exit(1); };
const meta = FR.LEXICON_META || {};
const ext = FR.LEXICON.EXT || [];

/* 1. 核心词表 */
const lx = CORE.reduce(function (a, lv) { return a + (FR.LEXICON[lv] || []).length; }, 0);
console.log('levels', Object.keys(FR.LEXICON).sort().join(','), '| core', lx, '| ext', ext.length);
if (lx < 6900) fail('核心词表太少: ' + lx);
CORE.forEach(function (lv) { if ((FR.LEXICON[lv] || []).length < 400) fail(lv + ' 词条过少'); });

/* 2. meta 与实际文件一致（首屏展示的就是 meta） */
if (Object.keys(meta.levels || {}).sort().join(',') !== CORE.slice().sort().join(',')) fail('meta.levels 与文件不一致');
if (Object.values(meta.levels || {}).reduce(function (a, b) { return a + b; }, 0) !== lx || meta.total !== lx) fail('meta 总量不一致');

/* 3. 核心词条字段齐全（释义 + 例句） */
const dirty = CORE.flatMap(function (lv) {
  return (FR.LEXICON[lv] || []).filter(function (e) { return !e.w || !e.p || !e.cn || !e.ex || !e.exCn; })
    .map(function (e) { return lv + ':' + e.w; });
});
if (dirty.length) fail('词条字段缺失: ' + dirty.slice(0, 5).join(','));

/* 4. 扩展词表：条数、字段、meta */
if (ext.length < 1500) fail('扩展词表太少: ' + ext.length);
if (meta.ext !== ext.length) fail('meta.ext 不一致');
if (meta.totalAll !== meta.total + ext.length) fail('meta.totalAll 不一致');
const extDirty = ext.filter(function (e) { return !e.w || !e.p || !e.cn; }).length;
if (extDirty) fail('扩展词条字段缺失: ' + extDirty);

/* 5. 词频/屈折数据 */
if (!FR.LEX_DETAIL || Object.keys(FR.LEX_DETAIL).length < 6000) fail('缺少词频/屈折数据');

/* 6. 变位池：基础/进阶条数一致、形式六项且干净 */
const verbs = Object.keys(FR.VERB_FORMS || {}).length;
if (verbs < 1000) fail('变位池太小: ' + verbs);
if (meta.verbs !== verbs) fail('meta.verbs 不一致');
if (Object.keys(FR.VERB_TENSES_ADV || {}).length !== verbs) fail('进阶时式条数不匹配');
const badForms = Object.entries(FR.VERB_FORMS).filter(function (kv) {
  const parts = String(kv[1]).split('|');
  return [1, 2, 3].some(function (i) {
    const list = (parts[i] || '').split(',');
    return list.length !== 6 || list.some(function (x) {
      return !x || /^[—–-]+$/.test(x) || /^(j|m|t|s|n|qu)'/i.test(x);
    });
  });
});
if (badForms.length) fail('变位形式异常: ' + badForms.slice(0, 3).map(function (x) { return x[0]; }).join(','));

/* 7. 其它语料 */
const g = (FR.GRAMMAR || []).length, v = (FR.VERBS || []).length, s = (FR.SCENES || []).length;
if (g < 60 || v < 20 || s < 10) fail('语法/动词/情景数量异常');
console.log('lexicon', lx, '+', ext.length, '| grammar', g, '| verbs', v, '| scenes', s, '| verb-forms', verbs);
console.log('✓ CI 自检通过');
