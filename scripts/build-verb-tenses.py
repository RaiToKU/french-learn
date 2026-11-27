# -*- coding: utf-8 -*-
"""从卡组的 présent / passé composé 推齐其余时式，供「变位练习」多选使用。

依据：卡组 tracking/conjugations.tsv 提供现在时六人称与复合过去时（助动词 + 过去分词，1,389 个动词）；
其余时式用标准构词规则 + 少量不规则词干表推导（不是逐词猜测，规则写在下面，且用 data/verbs.js
手工校对的 22 个动词 × 5 时式做回归校验，见 --check）。
"""
import csv, json, os, re, sys

DECK = os.environ.get('FRDECK', '/tmp/frdeck2')
OUTDIR = os.path.join(os.path.dirname(__file__), '..', 'data')

# 将来时词干（标准不规则表；卡组自带 99 个词根的优先用卡组的）
FUT_STEM = {
    'être': 'ser', 'avoir': 'aur', 'aller': 'ir', 'faire': 'fer', 'pouvoir': 'pourr',
    'vouloir': 'voudr', 'devoir': 'devr', 'savoir': 'saur', 'voir': 'verr', 'venir': 'viendr',
    'tenir': 'tiendr', 'prendre': 'prendr', 'mettre': 'mettr', 'dire': 'dir', 'écrire': 'écrir',
    'boire': 'boir', 'croire': 'croir', 'connaître': 'connaîtr', 'courir': 'courr',
    'mourir': 'mourr', 'valoir': 'vaudr', 'falloir': 'faudr', 'pleuvoir': 'pleuvr',
    'recevoir': 'recevr', 'vivre': 'vivr', 'suivre': 'suivr', 's’asseoir': 'assoir',
    's\'asseoir': 'assoir', 'envoyer': 'enverr', 'appeler': 'appeller', 'jeter': 'jetter',
    'acheter': 'achèter', 'lever': 'lèver', 'peser': 'pèser', 'mener': 'mèner',
    'payer': 'paier', 'essayer': 'essaier', 'nettoyer': 'nettoier', 'employer': 'emploier',
}
SUBJ_BASE = {
    'être': 'soi', 'avoir': 'ai', 'aller': 'aill', 'faire': 'fass', 'pouvoir': 'puiss',
    'savoir': 'sach', 'vouloir': 'veuill', 'valoir': 'vaill', 'falloir': 'faill',
    'pleuvoir': 'pleuv', 'voir': 'voi', 'croire': 'croi',
}
# 虚拟式六个人称都用不规则词干的动词（其余不规则只影响 1/2/3/6，nous-vous 取现在时词干）
SUBJ_BASE_ALL = {'faire', 'pouvoir', 'savoir', 'valoir', 'falloir', 'pleuvoir'}

IMPV_SPECIAL = {
    'être': ['sois', 'soyons', 'soyez'],
    'avoir': ['aie', 'ayons', 'ayez'],
    'savoir': ['sache', 'sachons', 'sachez'],
    'vouloir': ['veuille', 'veuillons', 'veuillez'],
}
PERSONS = ['je', 'tu', 'il', 'nous', 'vous', 'ils']
IMP_END = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient']
FUT_END = ['ai', 'as', 'a', 'ons', 'ez', 'ont']
COND_END = IMP_END
SUBJ_END = ['e', 'es', 'e', 'ions', 'iez', 'ent']


def strip_pron(forms):
    out = []
    for p in forms:
        p = p.replace('’', "'").strip()
        p = re.sub(r'^(?:je|tu|il|elle|on|nous|vous|ils|elles)\s+', '', p, flags=re.I)
        p = re.sub(r"^(?:j|m|t|s|n|qu)'", '', p, flags=re.I)
        out.append(p.strip())
    return out


def load_deck():
    verbs = {}
    for row in csv.DictReader(open(os.path.join(DECK, 'conjugations.tsv'), encoding='utf-8'), delimiter='\t'):
        inf = (row.get('word') or '').strip()
        raw = row.get('conjugation') or ''
        seg = {}
        for part in raw.split('|'):
            part = part.strip()
            if ':' in part:
                k, v = part.split(':', 1)
                seg[k.strip()] = v.strip()
        if not inf or '现在时' not in seg:
            continue
        if ' ' in inf:            # 多词短语（faire semblant 等）不放进变位题库
            continue
        pres = strip_pron([p for p in seg['现在时'].split(',')])
        if len(pres) != 6 or any(not p or re.fullmatch(r'[—–-]+', p) for p in pres):
            continue
        pc = seg.get('复合过去时', '')
        m = re.match(r'(avoir|être)\s+(.+)$', pc.strip())
        if not m:
            continue
        aux, pp = m.group(1), m.group(2).strip()
        stem = (seg.get('将来时词根') or '').strip().rstrip('-')
        verbs[inf] = {'pres': pres, 'aux': aux, 'pp': pp, 'stem': stem or None}
    return verbs


def group_of(inf):
    low = inf.lower()
    if low.endswith('er'):
        return 1
    if low.endswith('ir'):
        return 2
    return 3


def futur_stem(inf, e):
    if e['stem']:
        return e['stem']
    if inf in FUT_STEM:
        return FUT_STEM[inf]
    low = inf.lower()
    if low.endswith('re'):
        return inf[:-1]
    return inf


def imparfait(inf, e):
    if inf == 'être':
        return ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient']
    nous = e['pres'][3]
    if not nous.endswith('ons'):
        return None                     # 推不出就整条时式跳过，不硬凑
    stem = nous[:-3]
    return [stem + end for end in IMP_END]


def build(inf, e):
    fut_stem = futur_stem(inf, e)
    nous = e['pres'][3]
    pres = e['pres']
    imp = imparfait(inf, e)
    fut = [fut_stem + end for end in FUT_END]
    cond = [fut_stem + end for end in COND_END]
    # 虚拟式：不规则词干表 > 由 ils 形推导
    nous_stem = nous[:-3] if nous.endswith('ons') else nous
    if inf in SUBJ_BASE:
        base = SUBJ_BASE[inf]
        if inf in SUBJ_BASE_ALL:
            subj = [base + end for end in SUBJ_END]
        # 1/2/3/6 用不规则词干，nous/vous 仍取现在时 nous 形式（allions / voulions / voyions）
        elif nous.endswith('ons'):
            subj = [base + 'e', base + 'es', base + 'e', nous_stem + 'ions', nous_stem + 'iez', base + 'ent']
        else:
            subj = [base + end for end in SUBJ_END]
    else:
        ils = pres[5]
        base = ils[:-3] if ils.endswith('ent') else ils
        subj = [base + 'e', base + 'es', base + 'e', nous_stem + 'ions', nous_stem + 'iez', base + 'ent']
    if inf == 'être':
        subj = ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient']
    if inf == 'avoir':
        subj = ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient']
    # 复合过去时：être 助动词按阳性默认（复数加 s）
    if e['aux'] == 'être':
        pc = [e['pp'], e['pp'], e['pp'], e['pp'] + 's', e['pp'] + 's', e['pp'] + 's']
        pc = [e['aux'] + ' ' + x for x in pc]
    else:
        pc = [e['aux'] + ' ' + e['pp']] * 6
    # 命令式
    if inf in IMPV_SPECIAL:
        impv = IMPV_SPECIAL[inf]
    else:
        tu = pres[1]
        if group_of(inf) == 1 and tu.endswith('es'):
            tu = tu[:-1]
        elif group_of(inf) == 1 and tu.endswith('s'):
            tu = tu[:-1]
        impv = [tu, pres[3], pres[4]]
    return {'pres': pres, 'pc': pc, 'imp': imp, 'fut': fut, 'cond': cond, 'subj': subj, 'impv': impv}


def main():
    check = '--check' in sys.argv
    deck = load_deck()
    built = {inf: build(inf, e) for inf, e in deck.items()}
    print('推导完成：', len(built), '个动词')

    # 回归校验：与手工校对的 22 词 × 5 时式比对
    import subprocess
    out = subprocess.run(['node', '-e', "global.window=global;require('./data/verbs.js');"
                          "console.log(JSON.stringify(FR.VERBS.map(v=>({inf:v.inf,pres:v.pres,imp:v.imp,fut:v.fut,cond:v.cond,subj:v.subj}))))"],
                         capture_output=True, text=True, cwd=os.path.join(os.path.dirname(__file__), '..'))
    curated = json.loads(out.stdout)
    stat = {}
    bad = []
    for v in curated:
        if v['inf'].startswith('se ') or v['inf'].startswith("s'"):
            continue
        got = built.get(v['inf'])
        if not got:
            bad.append((v['inf'], 'missing', '', ''))
            continue
        for tense in ['pres', 'imp', 'fut', 'cond', 'subj']:
            ok = got[tense] == v[tense]
            stat.setdefault(tense, [0, 0])
            stat[tense][0] += 1 if ok else 0
            stat[tense][1] += 1
            if not ok:
                bad.append((v['inf'], tense, ' '.join(v[tense]), ' '.join(got[tense])))
    for t, (ok, tot) in sorted(stat.items()):
        print(f'  校验 {t}: {ok}/{tot}')
    if bad:
        print('  不一致明细（前 12）:')
        for inf, t, want, got in bad[:12]:
            print(f'    {inf} · {t}\n      期望 {want}\n      得到 {got}')
    if check:
        return 0 if not bad else 1

    # 输出：基础时式（全部动词）+ 高级时式（全部动词）两个文件，按练习选择加载
    gloss = {}
    for lv in ['a1', 'a2', 'b1', 'b2', 'c1']:
        path = os.path.join(OUTDIR, 'lexicon-' + lv + '.js')
        if not os.path.exists(path):
            continue
        text = open(path, encoding='utf-8').read()
        for m in re.finditer(r'\{w:("(?:[^"\\]|\\.)*"),p:.*?cn:("(?:[^"\\]|\\.)*")', text):
            gloss[json.loads(m.group(1)).lower()] = json.loads(m.group(2))

    # 紧凑格式："释义|时式1|时式2…"，每个时式内部用逗号分隔六个人称（运行期 split 还原）
    base = {}
    adv = {}
    for inf, t in built.items():
        cn = gloss.get(inf.lower(), '')
        base[inf] = '|'.join([cn.replace('|', ' '),
                              ','.join(t['pres']), ','.join(t['pc']),
                              ','.join(t['imp']) if t['imp'] else '',
                              ','.join(t['impv'])])
        adv[inf] = '|'.join([','.join(t['fut']), ','.join(t['cond']), ','.join(t['subj'])])

    def write(fn, var, data, comment):
        text = ('/* %s\n   来自 the-only-french-deck（CC BY-NC-SA 4.0），由 scripts/build-verb-tenses.py 生成 */\n'
                'window.FR = window.FR || {};\n%s = %s;\n') % (comment, var, json.dumps(data, ensure_ascii=False))
        open(os.path.join(OUTDIR, fn), 'w', encoding='utf-8').write(text)
        print(f'  {fn}: {round(len(text.encode())/1024)}KB')

    write('verb-forms.js', 'FR.VERB_FORMS', base, '变位练习基础时式（%d 个动词）：pres|pc|imp|impv —— 每条 "释义|时式…"，时式内逗号分隔六人称' % len(base))
    write('verb-tenses.js', 'FR.VERB_TENSES_ADV', adv, '变位练习进阶时式（%d 个动词）：fut|cond|subj' % len(adv))

    # 回填 meta.verbs（关于页要显示这个数，但不该为此去加载变位文件）
    meta_path = os.path.join(OUTDIR, 'lexicon-meta.js')
    if os.path.exists(meta_path):
        txt = open(meta_path, encoding='utf-8').read()
        txt = re.sub(r'"verbs":\s*\d+', '"verbs": %d' % len(base), txt, count=1)
        open(meta_path, 'w', encoding='utf-8').write(txt)
        print('  meta.verbs →', len(base))
    return 0


if __name__ == '__main__':
    sys.exit(main())
