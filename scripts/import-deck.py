# -*- coding: utf-8 -*-
"""把标准分级词表（A1–B2）+ 手写核心词条 合成为 data/lexicon.js"""
import csv, collections, json, re, unicodedata, os

DECK = os.environ.get('FRDECK', '/tmp/frdeck2')
OUTDIR = '/Users/yagamiraito/Documents/mvp/french-learn/data'

# ---------- 主题归类 ----------
THEMES = [
    ('饮食', ['吃','喝','餐','菜','饭','面包','肉','鱼','蔬菜','水果','咖啡','茶','酒','糖','盐','厨','味道','菜单','餐厅','饿','渴','汤','奶酪','甜','辣','牛奶','鸡蛋']),
    ('健康与身体', ['身体','病','医','药','医院','疼','痛','健康','感冒','伤','手术','治疗','发烧','药方','体温','疲劳','锻炼','呼吸','血','心脏','感染']),
    ('出行与旅行', ['车','火车','飞机','机场','地铁','公交','票','车站','旅行','旅游','酒店','行李','护照','出发','到达','路','街','桥','交通','司机','停车','船','骑车','散步','迷路']),
    ('购物与金钱', ['钱','价','支付','买','卖','银行','账户','发票','账单','便宜','贵','商店','超市','购物','付款','卡','欧元','预算','收入','支出','贷款','现金','找零','消费','商品','租']),
    ('工作与学习', ['工作','学习','课','考试','学校','大学','公司','任务','项目','会议','研究','招聘','职业','办公','同事','老板','面试','简历','实习','培训','毕业','专业','作业','图书馆','老师','学生','工资']),
    ('情绪与性格', ['高兴','开心','难过','生气','害怕','担心','紧张','焦虑','骄傲','失望','惊讶','性格','害羞','勇敢','耐心','嫉妒','后悔','害怕','无聊','有趣','烦恼','感动','喜欢','讨厌','爱','恨','乐观','悲观']),
    ('人物与身份', ['人','男','女','孩子','朋友','邻居','陌生','客人','主人','居民','公','市民','老人','少年','青年','父母','兄','姐','弟','妹','夫妻','某人','大家','人们']),
    ('时间与数量', ['首先','起初','一开始','最初','时间','小时','分钟','秒','天','周','月','年','昨天','今天','明天','现在','过去','将来','早','晚','夜','午','世纪','季节','春','夏','秋','冬','第一','半','倍','数字','百','千','万','频率','常常','偶尔','立刻','已','曾经']),
    ('居住与环境', ['房子','住','租','楼','房','屋','室','厨','浴室','家具','城市','村','区','建筑','天气','雨','雪','风','太阳','云','冷','热','气候','环境','污染','自然','树','花','动物','森林','海','山','空气','温度']),
    ('社会与新闻', ['社会','政治','法律','政府','权利','移民','教育','经济','失业','税','选举','新闻','媒体','战争','犯罪','警察','法庭','公民','政策','改革','企业','市场','危机','罢工','协会','组织','国际']),
    ('观点与论证', ['认为','观点','理由','证明','因此','结论','讨论','分析','主张','争论','同意','反对','支持','批评','假设','例子','事实','证据','论证','意见','立场','评价']),
    ('功能词与连接', ['因为','所以','但是','如果','虽然','以及','或者','然而','因此','此外','并且','相反','尽管','否则','由于','介词','连词','冠词','代词','副词','疑问','感叹']),
    ('交际与礼貌', ['你好','再见','谢谢','抱歉','对不起','请','礼貌','问候','打扰','欢迎','恭喜','祝福','称呼','介绍','聊天','交谈','谈话','回复','邀请']),
    ('抽象与概念', ['观念','概念','情况','状态','关系','方式','结果','原因','目的','意义','条件','过程','变化','区别','特点','现象','趋势','范围','程度','可能','必要','重要','需要','原则','方法','作用','影响','能力','机会','困难']),
    ('描述与状态', ['大','小','高','低','长','短','新','旧','好','坏','快','慢','容易','困难','重要','漂亮','美丽','丑','干净','脏','强','弱','轻','重','宽','窄','颜色','红','蓝','绿','黄','黑','白','安静','吵','满','空','亮','暗','丰富','复杂','简单']),
    ('日常动作', ['打开','关上','关掉','扔','捡','推','拉','搬','装修','切','煮','穿','脱','起床','打扫','整理','准备','继续','停止','结束','坐','站','睡','洗','跑']),
]
THEME_FALLBACK = '常用词'

POS_MAP = {
    '动词': 'v.', '名词': 'n.', '名词 · 阳性': 'n.m.', '名词 · 阴性': 'n.f.',
    '形容词': 'adj.', '形容词 · 阴阳同形': 'adj.', '副词': 'adv.',
    '代词': 'pron.', '介词': 'prép.', '连词': 'conj.', '感叹词': 'interj.',
    '数词': 'num.', '短语': 'loc.', '习语': 'loc.', '名词短语': 'loc.',
}

def theme_of(cn):
    for name, keys in THEMES:
        for k in keys:
            if k in cn:
                return name
    return THEME_FALLBACK

TAG_POS = {'n': 'n.', 'v': 'v.', 'adj': 'adj.', 'adv': 'adv.', 'pro': 'pron.',
           'prep': 'prép.', 'conj': 'conj.', 'int': 'interj.', 'num': 'num.', 'loc': 'loc.',
           'det': 'art.', 'art': 'art.', 'abbr': 'abrég.'}

def parse_meanings(m):
    """返回（性别提示, 合并释义）：词性以词表标签为准，这里只取性别与中文释义"""
    parts = [p.strip() for p in m.split('|') if p.strip()]
    gender = ''
    gloss_parts = []
    for p in parts:
        h = re.match(r'^【(.*)】$', p)
        if h:
            head = h.group(1)
            if '阳性' in head: gender = 'm'
            elif '阴性' in head: gender = 'f'
            continue
        if re.match(r"^(l'|le |la |les |un |une |des |du )", p):
            continue
        probe = re.sub(r'(阳性|阴性)\s*[mf]\.?', '', p)
        probe = re.sub(r'[\s/·、()（）]', '', probe)
        if not re.search(r'[\u4e00-\u9fff]', probe) or re.fullmatch(r'(阳性|阴性)+', probe):
            continue                        # 去掉性别标记后没有实义中文 → 不是释义
        if not re.search(r'[\u4e00-\u9fff]', p):   # 纯法语片段＝形态说明（faux / fausse 等）
            continue
        gloss_parts.append(p)
    seen, uniq = set(), []
    for g in gloss_parts:
        if g not in seen:
            seen.add(g); uniq.append(g)
    uniq = [re.sub(r'\s*[（(]仅?(?:阳性|阴性)[）)]', '', u).strip(' 、；') for u in uniq]
    uniq = [u for u in uniq if u]
    gloss = '；'.join(uniq)
    if not gloss:
        gloss = '；'.join(re.sub(r'[【】]', '', p).strip() for p in parts if re.sub(r'[【】]', '', p).strip())
    if len(gloss) > 90:
        gloss = gloss[:89] + '…'
    return gender, gloss

def pos_of(tags, gender):
    t = [x for x in tags.split() if not x.startswith('CECR::')]
    if not t:
        return '—'
    # 多词性时优先 名词 > 动词 > 形容词 > 副词 > 其他（学习者更需要知道名词阴阳性）
    order = ['n', 'v', 'adj', 'adv', 'pro', 'prep', 'int', 'conj', 'num', 'loc', 'det', 'abbr', 'art']
    t.sort(key=lambda x: order.index(x) if x in order else 99)
    base = TAG_POS.get(t[0], t[0] + '.')
    if t[0] == 'n' and gender:
        base = 'n.' + gender + '.'
    return base
    return base

# ---------- 读标准词表 ----------
words = list(csv.DictReader(open(os.path.join(DECK, 'words.tsv')), delimiter='\t'))
mean  = {r['word']: r['meanings'] for r in csv.DictReader(open(os.path.join(DECK, 'meanings.tsv')), delimiter='\t')}
exs   = collections.defaultdict(list)
for r in csv.DictReader(open(os.path.join(DECK, 'examples.tsv')), delimiter='\t'):
    exs[r['word']].append(r)

LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']
std = {lv: [] for lv in LEVELS}
for w in words:
    tags = w['tags'].split()
    lvls = [t.split('::')[1] for t in tags if t.startswith('CECR::')]
    if not lvls or lvls[0] not in LEVELS:
        continue
    lv = lvls[0]
    gender, gloss = parse_meanings(mean.get(w['word'], ''))
    if not gloss:
        continue
    pos = pos_of(w['tags'], gender)
    ex = sorted(exs[w['word']], key=lambda r: int(r['n']))[0] if exs[w['word']] else None
    std[lv].append({
        'w': w['word'], 'p': pos, 'cn': gloss,
        'ex': ex['french'] if ex else '', 'exCn': ex['chinese'] if ex else '',
        'th': theme_of(gloss),
    })

# ---------- 合并手写核心词条（同名保留手写版，主题映射到新体系） ----------
CUR_MAP = {
    '问候与礼貌': '交际与礼貌', '人物与身份': '人物与身份', '时间与数字': '时间与数量',
    '日常动作': '日常动作', '食物餐饮': '饮食', '出行场所': '出行与旅行',
    '描述与状态': '描述与状态', '连接与功能词': '功能词与连接', '日常生活': '常用词',
    '连接副词': '功能词与连接', '旅行交通': '出行与旅行', '购物服务': '购物与金钱',
    '健康身体': '健康与身体', '工作学习': '工作与学习', '情绪性格': '情绪与性格',
    '天气环境': '居住与环境', '观点论证': '观点与论证', '社会议题': '社会与新闻',
    '社会生活': '社会与新闻',
}
curated = json.load(open(os.path.join(os.path.dirname(__file__), 'curated.json'), encoding='utf-8'))
by_word = {}
for lv in LEVELS:
    for e in std[lv]:
        by_word[e['w'].lower()] = (lv, e)
merged_curated = 0
replaced = 0
for c in curated:
    w = c['w'].lower()
    if w in by_word:
        lv, e = by_word[w]
        e.update({'w': c['w'], 'p': c['p'], 'cn': c['cn'], 'ex': c['ex'], 'exCn': c['exCn'],
                  'th': CUR_MAP.get(c['th'], '常用词')})
        replaced += 1
        continue
    std[c['lv']].append({
        'w': c['w'], 'p': c['p'], 'cn': c['cn'], 'ex': c['ex'], 'exCn': c['exCn'],
        'th': CUR_MAP.get(c['th'], '常用词'),
    })
    by_word[w] = (c['lv'], None)
    merged_curated += 1

# ---------- 输出 ----------
def js_str(s):
    return json.dumps(s, ensure_ascii=False)

HEAD = """/* 核心语库 · 词汇 {lv}（懒加载：选中该级别或需要全量时才载入）
   分级与释义来源：the-only-french-deck（CC BY-NC-SA 4.0）
   字段：w 词形 / p 词性 / cn 中文释义 / ex 例句 / exCn 例句翻译 / th 主题
   由 scripts/import-deck.py 生成，勿手改 */
window.FR = window.FR || {};
FR.LEXICON = FR.LEXICON || {};
FR.LEXICON.{lv} = [
"""
counts = {}
for lv in LEVELS:
    items = sorted(std[lv], key=lambda e: (e['w'].lower().replace("'", ''),))
    counts[lv] = len(items)
    body = ''.join(
        '  {w:%s,p:%s,cn:%s,ex:%s,exCn:%s,th:%s},\n' % (
            js_str(e['w']), js_str(e['p']), js_str(e['cn']), js_str(e['ex']), js_str(e['exCn']), js_str(e['th']))
        for e in items)
    text = HEAD.replace('{lv}', lv) + body + '];\n'
    fn = os.path.join(OUTDIR, 'lexicon-' + lv.lower() + '.js')
    open(fn, 'w', encoding='utf-8').write(text)
    print(lv, len(items), round(len(text.encode()) / 1024), 'KB')

total = sum(counts.values())
meta = {
    'verbs': 0,   # 占位，下面生成变位池后回填
    'source': 'the-only-french-deck（Anki 法语卡组，A1–C1 分级）',
    'basis': 'Wiktionary OpenSubtitles Top20K 词频 + CLE 教材 A1–B2 生词 + FLELex（UCLouvain CENTAL）A1–B2 分级',
    'license': 'CC BY-NC-SA 4.0（署名 · 非商业 · 相同方式共享）',
    'levels': counts,
    'total': total,
    'curated': merged_curated,
    'themes': [t[0] for t in THEMES] + [THEME_FALLBACK],
}
open(os.path.join(OUTDIR, 'lexicon-meta.js'), 'w', encoding='utf-8').write(
    '/* 语料元信息（很小，始终加载） */\nwindow.FR = window.FR || {};\nFR.LEXICON_META = '
    + json.dumps(meta, ensure_ascii=False) + ';\n')

# 变位文件由 scripts/build-verb-tenses.py 生成（现为多时式，含推导规则与回归校验）
meta['verbs'] = 0

print('levels', counts, 'total', total, '| 手写新增', merged_curated, '覆盖', replaced)


print('无例句', sum(1 for lv in LEVELS for e in std[lv] if not e['ex']))
