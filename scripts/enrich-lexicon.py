# -*- coding: utf-8 -*-
"""给分级词表补标准字段：
- ipa   国际音标（来自卡组 words.tsv，覆盖全部词条）
- freq  词频（Lexique383，CC BY-SA 4.0：书面语 / 口语，单位「每百万词」）
- syl   音节数
- forms 词形变化（名词复数、形容词阴性等，取自 Lexique383 的屈折行）

用法：FRDECK=/tmp/frdeck2 LEXIQUE=/tmp/lexique/Lexique383/Lexique383.tsv python3 scripts/enrich-lexicon.py
产物：就地更新 data/lexicon-*.js（加 ipa 字段）+ 生成 data/lex-detail.js（freq/syl/forms）
"""
import csv, json, os, re, sys, tempfile

DECK = os.environ.get('FRDECK', '/tmp/frdeck2')
LEX = os.environ.get('LEXIQUE', '/tmp/lexique/Lexique383/Lexique383.tsv')
OUTDIR = os.path.join(os.path.dirname(__file__), '..', 'data')

CG = {'n.m.': 'NOM', 'n.f.': 'NOM', 'n.': 'NOM', 'n.m.pl.': 'NOM', 'n.f.pl.': 'NOM', 'n.m./n.f.': 'NOM',
      'v.': 'VER', 'adj.': 'ADJ', 'adv.': 'ADV', 'pron.': 'PRO', 'prép.': 'PREP',
      'conj.': 'CONJ', 'interj.': 'ONO', 'num.': 'NUM', 'art.': 'ART', 'loc.': 'LOC'}


def load_ipa():
    out = {}
    for r in csv.DictReader(open(os.path.join(DECK, 'words.tsv'), encoding='utf-8'), delimiter='\t'):
        w, ipa = r['word'].strip(), r['ipa'].strip()
        if w and ipa:
            out[w.lower()] = ipa
    return out


def load_lex():
    rows = list(csv.DictReader(open(LEX, encoding='utf-8'), delimiter='\t'))
    by_ortho, forms = {}, {}
    for r in rows:
        o = r['ortho'].strip().lower()
        if not o:
            continue
        by_ortho.setdefault(o, []).append(r)
        lem = r['lemme'].strip().lower()
        if r['islem'] == '0' and lem and lem != o:
            forms.setdefault(lem, []).append(r)
    return by_ortho, forms


def lookup(by_ortho, word):
    """Lexique383 用 ASCII 写法（oeuf/soeur），叠合字母要退一步查"""
    key = word.lower()
    if key in by_ortho:
        return by_ortho[key]
    alt = key.replace('œ', 'oe').replace('æ', 'ae')
    return by_ortho.get(alt, [])


def pick(rows, pos):
    want = CG.get(pos)
    if want:
        hit = [r for r in rows if r['cgram'] == want]
        if hit:
            return hit
    return rows


def nums(rows):
    b = max([float(r['freqlemlivres'] or 0) for r in rows] or [0])
    f = max([float(r['freqlemfilms2'] or 0) for r in rows] or [0])
    s = max([int(r['nbsyll'] or 0) for r in rows] or [0])
    return round(b, 2), round(f, 2), s


def clean_forms(rows, pos):
    out = []
    for r in rows:
        cg, gen, num = r['cgram'], r['genre'], r['nombre']
        o = r['ortho'].strip()
        if not o or o.lower() in [x.lower() for x in out]:
            continue
        if cg == 'NOM' and num == 'p':
            out.append(o)
        elif cg == 'ADJ' and gen == 'f':
            out.append(o)
        elif cg == 'ADJ' and num == 'p':
            out.append(o)
    return out[:4]


def write_atomic(path, text):
    """先写临时文件再替换，避免中途失败留下半更新"""
    d = os.path.dirname(os.path.abspath(path))
    fd, tmp = tempfile.mkstemp(dir=d, prefix='.tmp-', suffix='.js')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            f.write(text)
        os.replace(tmp, path)
    except Exception:
        if os.path.exists(tmp):
            os.replace(tmp, os.path.join(d, '.tmp-failed-' + os.path.basename(path)))
        raise


def main():
    ipa = load_ipa()
    by_ortho, forms = load_lex()
    detail = {}
    base = os.path.join(os.path.dirname(__file__), '..')

    for lv in ['a1', 'a2', 'b1', 'b2', 'c1']:
        path = os.path.join(OUTDIR, 'lexicon-%s.js' % lv)
        text = open(path, encoding='utf-8').read()
        head, body = text.split('[\n', 1)
        lines = body.rstrip().rstrip('];').rstrip().split('\n')
        out = []
        matched = 0
        for ln in lines:
            m = re.match(r'\s*\{w:("(?:[^"\\]|\\.)*"),p:("(?:[^"\\]|\\.)*"),(?:ipa:("(?:[^"\\]|\\.)*"),)?cn:', ln)
            if not m:
                out.append(ln)
                continue
            matched += 1
            w = json.loads(m.group(1))
            pos = json.loads(m.group(2))
            key = w.lower()
            ip = ipa.get(key, '')
            rows = lookup(by_ortho, key)
            rows2 = pick(rows, pos) if rows else []
            b, f, s = nums(rows2) if rows2 else (0, 0, 0)
            ff = clean_forms(forms.get(key, []), pos)
            if ip and 'ipa:' in ln:          # 已有音标：以卡组最新值为准
                ln = re.sub(r'ipa:"(?:[^"\\]|\\.)*"', 'ipa:' + json.dumps(ip, ensure_ascii=False), ln, count=1)
            if ip and 'ipa:' not in ln:
                ln = ln.replace('p:' + m.group(2) + ',', 'p:' + m.group(2) + ',ipa:' + json.dumps(ip, ensure_ascii=False) + ',', 1)
            out.append(ln)
            if rows2 or ff:
                detail[key] = [b, f, s] + ff
        if matched != len([x for x in lines if x.strip()]):
            raise SystemExit('%s 有 %d 行没匹配到字段模板（共 %d 行）——字段顺序变了？'
                             % (lv, len([x for x in lines if x.strip()]) - matched, len(lines)))
        write_atomic(path, head + '[\n' + '\n'.join(out) + '\n];\n')
        print(lv, 'ok', matched, '条')

    # 扩展词表也补词频/音节（它自带的 ipa 保留）
    ext_path = os.path.join(OUTDIR, 'lexicon-ext.js')
    if os.path.exists(ext_path):
        text = open(ext_path, encoding='utf-8').read()
        for m in re.finditer(r'\{w:("(?:[^"\\]|\\.)*"),p:("(?:[^"\\]|\\.)*"),cn:', text):
            w = json.loads(m.group(1)); pos = json.loads(m.group(2)); key = w.lower()
            rows = lookup(by_ortho, key)
            b, f, syl = nums(pick(rows, pos)) if rows else (0, 0, 0)
            ff = clean_forms(forms.get(key, []), pos)
            if rows or ff:
                detail.setdefault(key, [b, f, syl] + ff)
        print('ext →', len(detail), '共')

    js = ('/* 词条标准字段（懒加载，进词汇页/详情时才载入）\n'
          '   格式：词形小写 → [书面词频, 口语词频, 音节数, 变形…]（词频单位：每百万词）\n'
          '   词频与屈折来自 Lexique383（CC BY-SA 4.0，Boris New 等 / UCLouvain & Université Savoie Mont-Blanc）\n'
          '   音标 ipa 已写进各分级词表文件（来自卡组） */\n'
          'window.FR = window.FR || {};\nFR.LEX_DETAIL = ' + json.dumps(detail, ensure_ascii=False) + ';\n')
    write_atomic(os.path.join(OUTDIR, 'lex-detail.js'), js)
    print('lex-detail.js', round(len(js.encode()) / 1024), 'KB |', len(detail), '条')


if __name__ == '__main__':
    main()
