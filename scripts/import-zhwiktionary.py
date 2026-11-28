# -*- coding: utf-8 -*-
"""扩展词表：从中文维基词典（kaikki.org 解析版，CC BY-SA 4.0）补充有中文释义的法语词。

只收「能确认是真词」的条目：
  · 单词形、法语拼写、词性在常用集合内
  · 在 Lexique383 里是词元（islem=1）且频次 > 0（语言学意义上的真词）
  · 释义含中文、长度合理
  · 不与现有 A1–C1 核心词表重复
没有 CECR 分级、没有例句 —— 因此单独标为 EXT，只用于查词，不进练习题库。

用法：python3 scripts/import-zhwiktionary.py [zhwik-fr.jsonl 路径]
"""
import csv, json, os, re, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/zhwik-fr.jsonl'
LEX = os.environ.get('LEXIQUE', '/tmp/lexique/Lexique383/Lexique383.tsv')
OUTDIR = os.path.join(os.path.dirname(__file__), '..', 'data')
POSMAP = {'noun': 'n.', 'verb': 'v.', 'adj': 'adj.', 'adv': 'adv.', 'pron': 'pron.',
          'prep': 'prép.', 'conj': 'conj.', 'intj': 'interj.', 'num': 'num.', 'article': 'art.'}
CJK = re.compile(r'[\u4e00-\u9fff]')
WORD_RE = re.compile(r"[a-zàâäçéèêëîïôöùûüÿœæ'’‑-]+")


def existing_words():
    out = set()
    for lv in ['a1', 'a2', 'b1', 'b2', 'c1']:
        p = os.path.join(OUTDIR, 'lexicon-%s.js' % lv)
        if not os.path.exists(p):
            continue
        for m in re.finditer(r'\{w:("(?:[^"\\]|\\.)*")', open(p, encoding='utf-8').read()):
            out.add(json.loads(m.group(1)).lower())
    return out


def lexique():
    out = {}
    for r in csv.DictReader(open(LEX, encoding='utf-8'), delimiter='\t'):
        o = r['ortho'].strip().lower()
        if r['islem'] != '1':
            continue
        f = float(r['freqlemfilms2'] or 0)
        b = float(r['freqlemlivres'] or 0)
        cur = out.get(o)
        if not cur or f > cur[0]:
            out[o] = (f, b, int(r['nbsyll'] or 0), r['cgram'])
    return out


INFLECT = re.compile(
    "^[A-Za-z\u00C0-\u017F\\-\u2019']+\\s*\u7684.*?"
    "(?:\u7b2c[\u4e00\u4e8c\u4e09]\u4eba|\u4eba\u7a31|\u4eba\u79f0|\u8907\u6578|\u590d\u6570|\u55ae\u6578|\u5355\u6570|"
    "\u9670\u6027|\u9633\u6027|\u967d\u6027|\u9634\u6027|\u5206\u8a5e|\u5206\u8bcd|\u904e\u53bb|\u8fc7\u53bb|"
    "\u73fe\u5728|\u73b0\u5728|\u5c07\u4f86|\u5c06\u6765|\u689d\u4ef6|\u6761\u4ef6|\u865b\u64ec|\u865a\u62df|"
    "\u547d\u4ee4\u5f0f|\u8b8a\u4f4d|\u53d8\u4f4d|\u8b8a\u5f62|\u53d8\u5f62|\u8a5e\u5f62|\u8bcd\u5f62)")
GRAM = re.compile(r'^(?:[（(].*?[）)]\s*)')


def clean_gloss(g):
    g = g.strip()
    g = re.sub(r'^(?:n\.\s*m\.|n\.\s*f\.|n\.m\.|n\.f\.|n\.|v\.|adj\.|adv\.|loc\.)\s*[:：]?\s*', '', g, flags=re.I)
    g = re.sub(r'\s+', ' ', g)
    return g.strip(' ；;，,')


def main():
    have = existing_words()
    lex = lexique()
    entries = []
    for line in open(SRC, encoding='utf-8'):
        try:
            e = json.loads(line)
        except Exception:
            continue
        w = (e.get('word') or '').strip()
        if not w or ' ' in w or not WORD_RE.fullmatch(w.lower()):
            continue
        pos = POSMAP.get(e.get('pos'))
        if not pos:
            continue
        glosses = []
        for s in (e.get('senses') or []):
            for g in (s.get('glosses') or []):
                g2 = clean_gloss(g)
                if not g2 or not CJK.search(g2) or not (2 <= len(g2) <= 80):
                    continue
                if INFLECT.search(g2) or re.match(r"^[A-Za-z\u00C0-\u017F'\u2019-]+\s*\u7684", g2):
                    continue                    # 「abattre 的第三人称单数现在时 / 的屈折」这类说明不是词义
                g2 = GRAM.sub('', g2).strip()
                if g2:
                    glosses.append(g2)
        if not glosses:
            continue
        key = w.lower()
        if key in have or key not in lex:
            continue
        freq_film, freq_book, nsyl, cgram = lex[key]
        if freq_film < 0.5:
            continue
        ipa = ''
        for snd in (e.get('sounds') or []):
            if snd.get('ipa'):
                ipa = snd['ipa']
                break
        seen, uniq = set(), []
        for g in glosses:
            if g not in seen:
                seen.add(g); uniq.append(g)
        cn = '；'.join(uniq[:2])
        entries.append(((key, POSMAP.get(e.get('pos'))), {'w': w, 'p': pos, 'cn': cn, 'th': '扩展', 'ipa': ipa}))

    # 同形词按 (词形, 词性) 排序后取第一条，保证重复运行结果稳定
    cands = {}
    # 同形同词性取「有音标 → 释义长 → 字典序」最优的那条，保证稳定且信息最全
    for k, v in sorted(entries, key=lambda kv: (kv[0][0], kv[0][1], 0 if kv[1]['ipa'] else 1, -len(kv[1]['cn']), kv[1]['cn'])):
        if k[0] not in cands:
            cands[k[0]] = v

    items = sorted(cands.values(), key=lambda x: x['w'].lower())
    head = ('/* 扩展词表（%d 条）：中文维基词典的法语词条，只用于查词，不进练习题库\n'
            '   来源：zh.wiktionary.org（CC BY-SA 4.0），经 kaikki.org 解析\n'
            '   筛选：真词（Lexique383 词元且口语频次 ≥0.5）、有中文释义、不与核心词表重复\n'
            '   字段：w 词形 / p 词性 / cn 中文释义 / ipa 音标（有则填） / th 固定为「扩展」 */\n'
            'window.FR = window.FR || {};\nFR.LEXICON = FR.LEXICON || {};\nFR.LEXICON.EXT = [\n') % len(items)
    body = ''.join('  {w:%s,p:%s,cn:%s,ipa:%s,th:"扩展"},\n' % (
        json.dumps(i['w'], ensure_ascii=False), json.dumps(i['p'], ensure_ascii=False),
        json.dumps(i['cn'], ensure_ascii=False), json.dumps(i['ipa'], ensure_ascii=False)) for i in items)
    text = head + body + '];\n'
    open(os.path.join(OUTDIR, 'lexicon-ext.js'), 'w', encoding='utf-8').write(text)
    print('lexicon-ext.js', len(items), '条', round(len(text.encode()) / 1024), 'KB',
          '| 带音标', sum(1 for i in items if i['ipa']))

    # meta 里记一笔（关于页/词库页展示用）
    meta_path = os.path.join(OUTDIR, 'lexicon-meta.js')
    txt = open(meta_path, encoding='utf-8').read()
    m = re.search(r'FR\.LEXICON_META\s*=\s*(\{.*\});', txt, re.S)
    if m:
        meta = json.loads(m.group(1))
        meta['ext'] = len(items)
        meta['totalAll'] = meta.get('total', 0) + len(items)
        open(meta_path, 'w', encoding='utf-8').write(
            '/* 语料元信息（很小，始终加载） */\nwindow.FR = window.FR || {};\nFR.LEXICON_META = '
            + json.dumps(meta, ensure_ascii=False) + ';\n')
        print('meta.ext →', len(items), '| totalAll', meta['totalAll'])


if __name__ == '__main__':
    main()
