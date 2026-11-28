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

/* 4b. 核心与扩展不重叠、扩展内部不重复（import 脚本承诺的不变量） */
const coreForms = new Set();
CORE.forEach(function (lv) { (FR.LEXICON[lv] || []).forEach(function (e) { coreForms.add(e.w.toLowerCase()); }); });
const overlap = ext.filter(function (e) { return coreForms.has(e.w.toLowerCase()); });
if (overlap.length) fail('核心与扩展词形重叠: ' + overlap.slice(0, 5).map(function (e) { return e.w; }).join(','));
const seen = Object.create(null), dup = [];
ext.forEach(function (e) { var k = e.w.toLowerCase(); if (seen[k]) dup.push(e.w); seen[k] = 1; });
if (dup.length) fail('扩展词表内部重复: ' + dup.slice(0, 5).join(','));

/* 5. 词频/屈折数据 */
if (!FR.LEX_DETAIL || Object.keys(FR.LEX_DETAIL).length < 6000) fail('缺少词频/屈折数据');
/* 词频数据应覆盖所有核心单词（多词短语在 Lexique 里没有单条记录，属正常） */
const missingDetail = [];
CORE.forEach(function (lv) {
  (FR.LEXICON[lv] || []).forEach(function (e) {
    /* 只看普通小写单词：带空格/连字符/撇号/首字母大写的（固定短语、专名、代词式动词）Lexique 里未必有单条 */
    if (!/^[a-zàâäçéèêëîïôöùûüÿœæ]+$/.test(e.w)) return;
    if (!FR.LEX_DETAIL[e.w.toLowerCase()]) missingDetail.push(lv + ':' + e.w);
  });
});
if (missingDetail.length > 25) fail('词频数据漏了 ' + missingDetail.length + ' 个普通单词: ' + missingDetail.slice(0, 5).join(','));
console.log('词频漏项(普通单词)', missingDetail.length, missingDetail.slice(0, 6).join(','));

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
