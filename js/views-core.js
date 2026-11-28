/* 视图：首页 / 语库（词汇 · 句型骨架 · 精读） */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part = APP.part || {};

  /* ---------- 通用片段 ---------- */
  P.tag = function (txt, cls) {
    var label = txt === 'EXT' ? '扩展' : txt;
    return '<span class="tag ' + (cls || '') + '">' + U.esc(label) + '</span>';
  };

  P.say = function (text, label, cls) {
    return '<button class="btn btn-sm ' + (cls || 'blue') + '" data-say="' + U.esc(text) + '">' + (label || U.ic.sound + ' 朗读') + '</button>';
  };

  P.libTabs = function (active) {
    var c = APP.counts;
    var items = [
      ['lexicon', '词汇', (c.lexiconTotal || c.lexicon) + (c.ext || 0)],
      ['frames', '句型骨架', c.frames],
      ['grammar', '语法字典', c.grammar],
      ['verbs', '动词变位', c.verbs],
      ['reading', '精读', c.reading],
      ['scenes', '情景口语', FR.SCENES.length]
    ];
    var href = {scenes: '#/scenes'};
    return '<div class="tabstrip">' + items.map(function (it) {
      var on = active === it[0] ? ' on' : '';
      return '<a class="tab' + on + '" href="' + (href[it[0]] || ('#/lib/' + it[0])) + '">' +
        it[1] + '<b>' + it[2] + '</b></a>';
    }).join('') + '</div>';
  };

  P.countChips = function (active, act) {
    var opts = [['5', '5 题'], ['10', '10 题'], ['20', '20 题'], ['30', '30 题'], ['R', '随机']];
    return '<div class="chips">' + opts.map(function (o) {
      var on = (String(active) === o[0]) ? ' on' : '';
      return '<button class="chip' + on + '" data-act="' + (act || 'setCount') + '" data-v="' + o[0] + '">' +
        U.esc(o[1]) + '</button>';
    }).join('') + '</div>';
  };

  /* 本次练习实际题量：选了「随机」就每次给 6–20 之间 */
  P.sessionSize = function (max) {
    var v = APP.ui.count;
    var n = (v === 'R' || v == null) ? (6 + Math.floor(Math.random() * 15)) : Number(v);
    return Math.max(3, Math.min(n, max || 60));
  };

  P.ALL_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1'];
  P.LEVELS_A2 = ['ALL', 'A1', 'A2', 'B1', 'B2'];

  P.levelChips = function (active, act, counts, opts) {
    var lvs = (opts && opts.levels) || P.ALL_LEVELS;
    var ld = APP.loader;
    return '<div class="chips wrap">' + lvs.map(function (lv) {
      var n = counts ? counts[lv] : null;
      var failed = lv === 'EXT' && ld && ld.extFailed;
      var notLoaded = !failed && lv !== 'ALL' && ld && !ld.loaded(lv);
      if (failed) {
        return '<button class="chip" data-act="reloadExt" title="扩展词表没载入成功，点这里重试">扩展 <b class="chip-n">重试</b></button>';
      }
      return '<button class="chip ' + (active === lv ? 'on' : '') + (notLoaded ? ' loading' : '') +
        '" data-act="' + (act || 'lexLevel') + '" data-v="' + lv + '"' +
        (notLoaded ? ' aria-disabled="true" title="载入后可选中"' : '') + '>' +
        (lv === 'ALL' ? '全部' : (lv === 'EXT' ? '扩展' : lv)) +
        (notLoaded ? ' <b class="chip-n">载入</b>' : (n ? ' <b class="chip-n">' + n + '</b>' : '')) +
        '</button>';
    }).join('') + '</div>';
  };

  /* ---------- 变位：数据解析 / 出题 ---------- */
  P.CJ_PERSONS = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];

  P.CJ_TENSES = [
    {key: 'pres', label: '现在时', fr: 'présent', src: 'base'},
    {key: 'imp', label: '未完成过去时', fr: 'imparfait', src: 'base'},
    {key: 'pc', label: '复合过去时', fr: 'passé composé', src: 'base'},
    {key: 'fut', label: '简单将来时', fr: 'futur simple', src: 'adv'},
    {key: 'cond', label: '条件式现在时', fr: 'conditionnel présent', src: 'adv'},
    {key: 'subj', label: '虚拟式现在时', fr: 'subjonctif présent', src: 'adv'},
    {key: 'impv', label: '命令式', fr: 'impératif', src: 'base', persons: [1, 3, 4]}
  ];

  /* 基础文件（现在时/复合过去时/未完成过去时/命令式）解析为对象，缓存 */
  P.verbForms = function () {
    if (P._vf) return P._vf;
    var raw = window.FR && FR.VERB_FORMS;
    if (!raw) return null;                    /* 别缓存 null：文件晚到时要能重新解析 */
    var map = {};
    Object.keys(raw).forEach(function (inf) {
      var parts = String(raw[inf]).split('|');
      if (parts.length !== 5) return;          /* 释义里混进 | 会静默错位，直接跳过 */
      map[inf] = {
        cn: parts[0] || '',
        pres: (parts[1] || '').split(','),
        pc: (parts[2] || '').split(','),
        imp: (parts[3] || '').split(','),
        impv: (parts[4] || '').split(',')
      };
    });
    return (P._vf = map);
  };

  /* 进阶文件（简单将来时/条件式/虚拟式） */
  P.verbAdv = function () {
    if (P._va) return P._va;
    var raw = window.FR && FR.VERB_TENSES_ADV;
    if (!raw) return null;
    var map = {};
    Object.keys(raw).forEach(function (inf) {
      var parts = String(raw[inf]).split('|');
      if (parts.length !== 3) return;
      map[inf] = {fut: (parts[0] || '').split(','), cond: (parts[1] || '').split(','), subj: (parts[2] || '').split(',')};
    });
    return (P._va = map);
  };

  P.cjTense = function (key) {
    var hit = null;
    P.CJ_TENSES.forEach(function (t) { if (t.key === key) hit = t; });
    return hit;
  };

  /* 选中的时式是否有数据；用于「至少选一个」「该时式暂无数据」提示 */
  P.cjAvailable = function (key) {
    var t = P.cjTense(key);
    if (!t) return false;
    var src = t.src === 'adv' ? P.verbAdv() : P.verbForms();
    if (!src) return false;
    var need = (t.persons || [0, 1, 2, 3, 4, 5]).length;
    return Object.keys(src).some(function (inf) {
      var f = src[inf] && src[inf][key];
      return f && f.length >= Math.max(3, need) && !f.some(function (x) { return !x || /^[—–-]+$/.test(x); });
    });
  };

  /* 按选中的时式组池；每条 = 一个「动词 × 时式」，slots/labels 处理命令式只有 3 个人称的情况 */
  P.conjPool = function (keys) {
    var wanted = (keys && keys.length) ? keys : ['pres'];
    var base = P.verbForms(), adv = P.verbAdv();
    var out = [];
    wanted.forEach(function (key) {
      var t = P.cjTense(key);
      if (!t) return;
      var src = t.src === 'adv' ? adv : base;
      if (!src) return;
      var labels = t.persons || [0, 1, 2, 3, 4, 5];
      Object.keys(src).forEach(function (inf) {
        var forms = src[inf] && src[inf][key];
        if (!forms || !forms.length) return;
        if (forms.some(function (f) { return !f || /^[—–-]+$/.test(f); })) return;
        var slots = labels.map(function (_, i) { return i; }).filter(function (i) { return i < forms.length; });
        if (slots.length < 3) return;            /* 凑不出 3 个选项的就不出题 */
        out.push({
          inf: inf, cn: (base && base[inf] && base[inf].cn) || '',
          tenseKey: key, tenseLabel: t.label, forms: forms,
          slots: slots, labels: labels.slice(0, slots.length)
        });
      });
    });
    if (!out.length) {                        /* 数据未到时回落到手工 22 词 */
      (FR.VERBS || []).forEach(function (v) {
        (FR.VERB_TENSES || []).forEach(function (t) {
          if (!v[t.key]) return;
          out.push({
            inf: v.inf, cn: v.cn, tenseKey: t.key, tenseLabel: t.label, forms: v[t.key],
            slots: [0, 1, 2, 3, 4, 5], labels: [0, 1, 2, 3, 4, 5]
          });
        });
      });
    }
    return out;
  };

  /* 选中的时式里，哪些实际没有题目（文件缺失 / 该时式为空） */
  P.cjEmptyTenses = function (keys) {
    return (keys || []).filter(function (k) { return !P.cjAvailable(k); }).map(function (k) {
      var t = P.cjTense(k);
      return t ? t.label : k;
    });
  };

  /* 一条题：动词 × 时式 × 人称，选项取同动词同时式的其他人称 */
  P.conjItem = function (pool) {
    if (!pool || !pool.length) return null;
    var e = pool[Math.floor(Math.random() * pool.length)];
    if (!e || !e.forms || !e.forms.length) return null;
    var slots = e.slots || [0, 1, 2, 3, 4, 5], labels = e.labels || slots;
    var k = Math.floor(Math.random() * slots.length);
    var slot = slots[k];
    var answer = e.forms[slot];
    if (!answer) return null;
    var seen = {}, opts = [answer];
    seen[answer] = 1;
    U.shuffle(slots.filter(function (i) { return i !== slot; })).forEach(function (i) {
      var f = e.forms[i];
      if (f && !seen[f] && opts.length < 4) { seen[f] = 1; opts.push(f); }
    });
    /* 复合过去时（avoir 助动词）六个人称同形，去重后凑不满选项：用别的动词的该人称形式补足 */
    if (opts.length < 3) {
      U.shuffle(pool.filter(function (x) {
        return x !== e && x.tenseKey === e.tenseKey && x.inf !== e.inf;
      })).forEach(function (o) {
        var f = o.forms[o.slots && o.slots.indexOf(k) >= 0 ? k : (o.slots ? o.slots[0] : 0)] || o.forms[0];
        if (f && !seen[f] && opts.length < 4) { seen[f] = 1; opts.push(f); }
      });
    }
    if (opts.length < 3) return null;          /* 仍然凑不齐就换一道，不硬凑 */
    return {
      inf: e.inf, cn: e.cn, tenseKey: e.tenseKey, tenseLabel: e.tenseLabel,
      person: P.CJ_PERSONS[labels[k]], slot: slot, answer: answer, opts: U.shuffle(opts)
    };
  };

  /* 词条是不是动词：先看词性，再看 meta 里的动词清单（词性标成名词但实际也作动词的，如 lever / déjeuner） */
  P.inVerbSet = function (word) {
    var list = FR.LEXICON_META && FR.LEXICON_META.verbSet;
    if (!list) return false;
    if (!P._vset) { P._vset = {}; list.forEach(function (x) { P._vset[x] = 1; }); }
    var w = String(word || '').toLowerCase();
    var bare = w.replace(/\s+(?:de|d['’]|à|a|sur|dans|avec|pour|chez|qch|qqn|quelqu'un|quelque\s+chose)\b.*$/, '').trim();
    var hit = false;
    [w, bare].forEach(function (cand) {
      if (hit || !cand) return;
      if (P._vset[cand]) { hit = true; return; }
      var m = /^(?:se\s+|s['’])/.exec(cand);
      if (m && P._vset[cand.slice(m[0].length)]) hit = true;
    });
    return hit;
  };

  /* 词典详情里的「最基础变位」：只看现在时；代词式动词用基础动词的形式 + 自反代词 */
  var REFLEX = ['me', 'te', 'se', 'nous', 'vous', 'se'];
  /* h aspiré 不省音：se hisser → me hisse（错写成 m'hisse 就是硬错） */
  var H_ASPIRE = ['hisser', 'heurter', 'hâter', 'hausser', 'harceler', 'haïr', 'hocher', 'hêler', 'humer', 'huer', 'houspiller', 'honnir', 'happer', 'harnacher'];
  /* 单数代词遇元音省音（je m'appelle / il s'appelle），nous / vous 永不舍音 */
  function reflexPrefix(i, form) {
    var pron = REFLEX[i];
    if (i === 3 || i === 4) return pron + ' ';
    var f = String(form || '').toLowerCase();
    if (/^h/.test(f) && H_ASPIRE.some(function (v) { return f.indexOf(v) === 0; })) return pron + ' ';
    return /^[aeiouyéèêàâîôûh]/.test(f) ? pron.charAt(0) + "'" : pron + ' ';
  }

  P.verbPres = function (word) {
    var base = P.verbForms();
    if (!base) return null;
    var w = String(word || '').toLowerCase();
    /* 带补语的词条（s'occuper de / renoncer à / dépendre de）先剥掉补语，再试代词式还原 */
    var bare = w.replace(/\s+(?:de|d['’]|à|a|sur|dans|avec|pour|chez|qch|qqn|quelqu'un|quelque\s+chose)\b.*$/, '').trim();
    var hit = null, reflex = false;
    [w, bare].forEach(function (cand) {
      if (!cand || hit) return;
      if (base[cand]) { hit = base[cand]; return; }
      var m = /^(?:se\s+|s['’])/.exec(cand);
      if (m && base[cand.slice(m[0].length)]) { hit = base[cand.slice(m[0].length)]; reflex = true; }
    });
    if (!hit || !hit.pres || hit.pres.length !== 6 || hit.pres.some(function (f) { return !f; })) return null;
    if (!reflex) return {forms: hit.pres, reflex: false};
    return {
      reflex: true,
      forms: hit.pres.map(function (f, i) { return reflexPrefix(i, f) + f; })
    };
  };

  /* ---------- 首页 ---------- */  /* ---------- 首页 ---------- */
  P.questRow = function (q) {
    var pct = Math.round(q.progress / q.goal * 100);
    return '<div class="quest ' + (q.done ? 'done' : '') + '">' +
      '<div class="quest-main">' +
      '<div class="quest-title">' + U.esc(q.label) + '</div>' +
      '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="quest-meta">' + q.progress + ' / ' + q.goal + (q.done ? ' · 已完成' : '') + '</div>' +
      '</div>' +
      '<div class="quest-xp">+' + q.xp + ' XP</div>' +
      '</div>';
  };

  P.gameCard = function (g) {
    return '<a class="game-card" href="' + g.href + '">' +
      '<div class="game-ico">' + (g.svg || g.icon) + '</div>' +
      '<div class="game-body"><h3>' + g.title + '</h3><p>' + g.desc + '</p>' +
      (g.best ? '<div class="game-best">最佳 ' + g.best + '</div>' : '') +
      '</div><span class="game-play" aria-hidden="true">▶</span></a>';
  };

  APP.GAMES = [
    {key: 'match', href: '#/games/match', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='2.5' y='2.5' width='9.5' height='9.5' rx='2.2' fill='currentColor'/><rect x='12' y='12' width='9.5' height='9.5' rx='2.2' fill='currentColor' opacity='.5'/></svg>", title: '配对连连看', desc: '法语和中文配对，连击越快分越高'},
    {key: 'sprint', href: '#/games/sprint', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M13.5 2 5.5 13.2h5.2L9.4 22l8.1-11.4h-5.2L13.5 2Z' fill='currentColor'/></svg>", title: '60 秒冲刺', desc: '限时抢答，答错扣时间'},
    {key: 'audio', href: '#/games/audio', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 14v-2a8 8 0 0 1 16 0v2' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><rect x='2.6' y='13.4' width='4.2' height='6.4' rx='1.8' fill='currentColor'/><rect x='17.2' y='13.4' width='4.2' height='6.4' rx='1.8' fill='currentColor'/></svg>", title: '听音选义', desc: '只放声音，选对中文意思'},
    {key: 'conj', href: '#/games/conj', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 5h16M4 12h16M4 19h9' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><circle cx='18.5' cy='19' r='2.5' fill='currentColor'/></svg>", title: '变位冲刺', desc: '60 秒内选对动词变位，答错扣时间'}
  ];

  APP.TRAININGS = [
    {key: 'build', href: '#/train/build', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='2.5' y='13' width='8' height='8' rx='2' fill='currentColor'/><rect x='13.5' y='13' width='8' height='8' rx='2' fill='currentColor' opacity='.55'/><rect x='8' y='3' width='8' height='8' rx='2' fill='currentColor' opacity='.8'/></svg>", title: '组句训练', desc: '把打乱的词排成正确句子'},
    {key: 'listen', href: '#/train/listen', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M3.5 20.5 4.6 16 15.6 5l3.4 3.4L8 19.4l-4.5 1.1Z' fill='currentColor'/></svg>", title: '听力听写', desc: '听一句写一句，可慢速重听'},
    {key: 'quiz', href: '#/train/quiz', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='2.8' y='2.8' width='18.4' height='18.4' rx='4.6' fill='none' stroke='currentColor' stroke-width='2.1'/><path d='M7.6 12.4 10.8 15.6 16.6 8.8' fill='none' stroke='currentColor' stroke-width='2.1' stroke-linecap='round' stroke-linejoin='round'/></svg>", title: '语法小测', desc: '从 103 道题随机抽 10 道'},
    {key: 'close', href: '#/train/close', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M3 7h6M15 7h6M3 17h6M15 17h6' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><rect x='9' y='4.4' width='6' height='5.2' rx='1.4' fill='currentColor'/><rect x='9' y='14.4' width='6' height='5.2' rx='1.4' fill='currentColor'/></svg>", title: '补全填空', desc: '例句挖空，靠语境写回那个词'},
    {key: 'conj', href: '#/train/conj', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 5h16M4 12h16M4 19h9' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><circle cx='18.5' cy='19' r='2.5' fill='currentColor'/></svg>", title: '变位速练', desc: '动词 × 时式 × 人称，选对形式'},
    {key: 'spell', href: '#/train/spell', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 6.5V4h9v2.5M8.5 4v16M6.5 20h4' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M15.5 13.5 20 18l-1.2 1.6L14 15z' fill='currentColor'/></svg>", title: '中译法拼写', desc: '只看中文，把法语词写出来'},
    {key: 'judge', href: '#/train/judge', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 12.5 9 17.5 20 6.5' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/><path d='M4 6.5h6M15 17.5h5' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' opacity='.55'/></svg>", title: '快判对错', desc: '词义配对对不对，凭直觉快速判断'},
    {key: 'mix', href: '#/train/mix', svg: "<svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='3' width='7.5' height='7.5' rx='2' fill='currentColor'/><circle cx='17.2' cy='6.7' r='3.6' fill='currentColor' opacity='.6'/><path d='M6.7 14v7M3.2 17.5h7' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><rect x='14' y='14' width='7' height='7' rx='2' fill='currentColor' opacity='.8'/></svg>", title: '综合挑战', desc: '五种题型随机混排，每次都不一样'}
  ];


  APP.views.home = function () {
    var gained = APP.store.claimQuests(); /* 先结算任务，避免顶栏与英雄区 XP 不同步 */
    if (gained) U.toast('每日任务完成，+' + gained + ' XP');
    var st = APP.store.stats();
    var lv = st.level;
    var quests = APP.store.quests();

    var ring = 2 * Math.PI * 52;
    var dash = Math.round(ring * lv.pct / 100);

    var lvCards = ['A1', 'A2', 'B1', 'B2', 'C1'].map(function (level) {
      var list = APP.catalog.lexicon.filter(function (i) { return i.lv === level; });
      var learned = list.filter(function (i) { return APP.store.isLearned(i.id); }).length;
      var pct = list.length ? Math.round(learned / list.length * 100) : 0;
      return '<button class="card mini-level" data-act="goLex" data-v="' + level + '">' +
        '<div class="row between"><b>' + level + '</b><span class="muted small">' + learned + '/' + list.length + '</span></div>' +
        '<div class="bar"><i style="width:' + pct + '%"></i></div></button>';
    }).join('');

    var badges = APP.store.badges().filter(function (b) { return b.unlocked; }).slice(-6);
    var badgeStrip = badges.length
      ? badges.map(function (b) { return '<span class="badge-chip" title="' + U.esc(b.desc) + '">' + b.icon + ' ' + U.esc(b.title) + '</span>'; }).join('')
      : '<span class="muted small">还没有徽章，去玩一局就点亮第一个</span>';

    var sceneCards = FR.SCENES.slice(0, 4).map(function (s) {
      return '<a class="scene-mini" href="#/scene/' + s.id + '">' +
        '<span class="scene-mini-ico">' + s.icon + '</span>' +
        '<span><b>' + U.esc(s.title) + '</b><i>' + U.esc(s.titleFr) + ' · ' + s.lv + '</i></span></a>';
    }).join('');

    return {
      html:
        '<div class="page-head">' +
        '<div><h1>Bonjour 👋</h1><p class="muted">今天先开口 10 分钟，比背 50 个单词有用。</p></div>' +
        '<div class="head-stats">' +
        '<span class="pill fire" title="连续学习天数">🔥 ' + st.streak + '</span>' +
        '<span class="pill xp" title="经验值">⚡ ' + st.xp + ' XP</span>' +
        '</div></div>' +

        '<section class="hero-dash">' +
        '<div class="ring">' +
        '<svg viewBox="0 0 120 120" aria-hidden="true">' +
        '<circle class="ring-bg" cx="60" cy="60" r="52"></circle>' +
        '<circle class="ring-fg" cx="60" cy="60" r="52" stroke-dasharray="' + dash + ' ' + Math.round(ring) + '"></circle>' +
        '</svg>' +
        '<div class="ring-txt"><b>Lv.' + lv.index + '</b><span>' + U.esc(lv.title) + '</span></div>' +
        '</div>' +
        '<div class="hero-dash-main">' +
        '<h2>' + U.esc(lv.title) + ' · <span class="muted small">' + U.esc(lv.desc) + '</span></h2>' +
        '<p class="muted small">' + (lv.next ? ('还差 ' + lv.toNext + ' XP 升到「' + U.esc(lv.nextTitle) + '」') : '已到最高等级，继续保持') + '</p>' +
        '<div class="row wrap gap8" style="margin-top:10px">' +
        '<a class="btn primary" href="#/review">' + (st.due > 0 ? '复习 ' + st.due + ' 张' : '学习新词') + '</a>' +
        '<a class="btn ghost" href="#/games">去玩一局</a>' +
        '</div></div>' +
        '<div class="hero-stats">' +
        '<div><b>' + st.due + '</b><span>待复习</span></div>' +
        '<div><b>' + st.learned + '</b><span>已掌握</span></div>' +
        '<div><b>' + st.streak + '</b><span>连续天数</span></div>' +
        '<div><b>' + st.todayCorrect + '</b><span>今日答对</span></div>' +
        '</div>' +
        '</section>' +

        '<section class="section">' +
        '<div class="section-head"><h2>今日任务</h2><span class="muted small">每天重置 · 完成自动加 XP</span></div>' +
        '<div class="quests">' + quests.map(P.questRow).join('') + '</div>' +
        '</section>' +

        '<section class="section">' +
        '<div class="section-head"><h2>小游戏</h2><a class="muted small" href="#/games">全部 →</a></div>' +
        '<div class="game-grid">' + APP.GAMES.map(function (g) {
          return P.gameCard(Object.assign({}, g, {best: APP.store.best(g.key) || ''}));
        }).join('') + '</div>' +
        '</section>' +

        '<section class="section">' +
        '<div class="section-head"><h2>训练</h2><span class="muted small">输入型练习，配合游戏更稳</span></div>' +
        '<div class="game-grid">' + APP.TRAININGS.map(function (g) {
          return P.gameCard(Object.assign({}, g, {best: APP.store.best(g.key) || ''}));
        }).join('') + '</div>' +
        '</section>' +

        '<section class="section">' +
        '<div class="section-head"><h2>等级进度</h2><a class="muted small" href="#/lib/lexicon">进入语库 →</a></div>' +
        '<div class="mini-levels">' + lvCards + '</div>' +
        '</section>' +

        '<section class="section">' +
        '<div class="section-head"><h2>徽章</h2><a class="muted small" href="#/me">全部 →</a></div>' +
        '<div class="badge-strip">' + badgeStrip + '</div>' +
        '</section>' +

        '<section class="section">' +
        '<div class="section-head"><h2>情景口语</h2><a class="muted small" href="#/scenes">12 个场景 →</a></div>' +
        '<div class="scene-grid">' + sceneCards + '</div>' +
        '</section>' +

        '<p class="footer-note">朗读由浏览器语音合成提供 · 进度只存在本机 · 建议每天 10 分钟</p>'
    };
  };

  /* ---------- 词汇 ---------- */
  function themes() {
    var seen = {}, out = [];
    APP.catalog.lexicon.forEach(function (i) {
      if (!seen[i.th]) { seen[i.th] = 1; out.push(i.th); }
    });
    return out;
  }

  function lexAll() {
    var core = APP.catalog.lexicon;
    var ext = APP.catalog.ext || [];
    return ext.length ? core.concat(ext) : core;
  }

  function filteredLex() {
    var ui = APP.ui;
    var q = ui.lexQuery.trim().toLowerCase();
    return lexAll().filter(function (it) {
      if (ui.lexLevel !== 'ALL' && it.lv !== ui.lexLevel) return false;
      if (ui.lexTheme !== 'ALL' && it.th !== ui.lexTheme) return false;
      if (q) {
        /* 关键词查询：法语输入只匹配词形（忽略重音），中文输入只匹配释义；
           「中文 + 拉丁」混排拆开分别匹配（AND）；例句/翻译/主题不参与命中 */
        var hasCJK = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(q);
        if (hasCJK) {
          var cjkPart = q.replace(/[^\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g, '');
          var latinPart = U.norm(q.replace(/[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff00-\uffef]/g, ''));
          if (cjkPart && String(it.cn || '').toLowerCase().indexOf(cjkPart) < 0) return false;
          if (latinPart && U.norm(it.w).indexOf(latinPart) < 0) return false;
        } else {
          var nq = U.norm(q);
          if (!nq) return true;                 /* 纯符号/空白：视为没有关键词 */
          if (U.norm(it.w).indexOf(nq) < 0) return false;
        }
      }
      return true;
    });
  }

  function lexItemHTML(it) {
    var store = APP.store;
    var open = APP.ui.lexOpen === it.id;
    var starred = store.isStar(it.id);
    var added = store.has(it.id);
    return '<article class="word ' + (open ? 'open' : '') + '" data-act="lexToggle" data-id="' + it.id + '" role="button" tabindex="0" aria-expanded="' + (open ? 'true' : 'false') + '">' +
      '<div class="top">' +
      '<div class="word-main">' +
      '<div class="w">' + U.esc(it.w) +
        (it.ipa ? '<span class="ipa">' + U.esc(it.ipa) + '</span>' : '') +
        '<span class="pos">' + U.esc(it.p) + '</span></div>' +
      '<div class="cn">' + U.esc(it.cn) + '</div>' +
      '</div>' +
      '<div class="acts">' +
      '<button class="iconbtn say" data-say="' + U.esc(it.w) + '" title="朗读">' + U.ic.sound + '</button>' +
      '<button class="iconbtn ' + (starred ? 'on' : '') + '" data-act="lexStar" data-id="' + it.id + '" title="收藏">★</button>' +
      '<button class="iconbtn ' + (added ? 'on' : '') + '" data-act="lexAdd" data-id="' + it.id + '" title="加入复习">＋</button>' +
      '</div></div>' +
      (open ?
        P.lexMetaBlock(it) +
        P.lexConjBlock(it) +
        (it.ext ?
          '<div class="conj-note">扩展词条：暂无例句（来自中文维基词典 CC BY-SA 4.0）</div>' :
        '<div class="ex">' +
        '<div class="fr">' + U.esc(it.ex) + '</div>' +
        '<div class="cn">' + U.esc(it.exCn) + '</div>' +
        '<div class="row wrap gap6" style="margin-top:9px">' +
        '<button class="btn btn-sm blue" data-say="' + U.esc(it.ex) + '">' + U.ic.sound + ' 例句</button>' +
        '<button class="btn btn-sm" data-say="' + U.esc(it.ex) + '" data-slow="1">🐢 慢速</button>' +
        '<button class="btn btn-sm" data-act="lexAdd" data-id="' + it.id + '">' + (added ? '已在复习' : '＋ 加入复习') + '</button>' +
        '</div>' +
        '<div class="tagline">' + P.tag(it.lv, 'lv') + P.tag(it.th, 'th') + '</div>' +
        '</div>') : '') +
      '</article>';
  }

  /* 词条详情里的标准字段：词频 / 音节 / 词形变化 */
  P.lexMetaBlock = function (it) {
    var all = (FR.LEX_DETAIL || {})[String(it.w || '').toLowerCase()];
    if (!all) {
      if (!APP.loader.detailLoaded() && !APP.loader.detailFailed) {
        return '<div class="conj-note">词频与词形变化载入中…</div>';
      }
      return '';
    }
    var book = all[0] || 0, film = all[1] || 0, syl = all[2] || 0;
    var forms = all.slice(3).filter(Boolean);
    function fmt(n) {
      if (!n) return '—';
      return n >= 100 ? Math.round(n) : (Math.round(n * 10) / 10);
    }
    var cells = [
      ['书面词频', fmt(book) + ' <span class="unit">/百万</span>'],
      ['口语词频', fmt(film) + ' <span class="unit">/百万</span>'],
      ['音节', syl ? syl + ' 个' : '—']
    ];
    return '<div class="meta-grid">' + cells.map(function (c) {
      return '<div class="meta-cell"><div class="k">' + c[0] + '</div><div class="v">' + c[1] + '</div></div>';
    }).join('') + '</div>' +
      (forms.length ? '<div class="meta-forms"><span class="k">词形变化</span>' +
        forms.map(function (f) { return '<b>' + U.esc(f) + '</b>'; }).join('') + '</div>' : '') +
      '<div class="meta-src">词频与屈折来自 Lexique383（CC BY-SA 4.0）</div>';
  };

  /* 词条详情里的变位（只放最基础的现在时） */
  P.lexConjBlock = function (it) {
    var posIsVerb = /^v\./.test(String(it.p || ''));
    var isVerbPos = posIsVerb || P.inVerbSet(it.w);
    var got = P.verbPres(it.w);
    var forms = got && got.forms;
    if (!forms) {
      if (!isVerbPos) {
        return '<div class="conj-note">该词条是名词/形容词，没有变位（动词才有现在时）</div>';
      }
      if (!APP.loader.formsLoaded() && !APP.loader.formsFailed) {
        return '<div class="conj-box"><div class="muted small">变位载入中…</div></div>';
      }
      if (APP.loader.formsFailed) {
        return '<div class="conj-note">变位数据没载入成功，稍后重试或刷新页面</div>';
      }
      return '<div class="conj-box"><div class="muted small">这一条没有变位数据（无人称动词或固定搭配）</div></div>';
    }
    var rows = forms.map(function (f, i) {
      return '<div class="conj-row"><span class="p">' + P.CJ_PERSONS[i] + '</span><span class="f">' + U.esc(f) + '</span></div>';
    }).join('');
    return '<div class="conj-box">' +
      '<div class="row between" style="margin-bottom:4px"><b class="small">现在时' +
        (got.reflex ? '（代词式）' : (posIsVerb ? '' : '（该词亦作动词）')) + '</b>' +
      '<span class="muted small">' + U.esc(it.w) + '</span></div>' + rows + '</div>';
  };

  /* 变位练习：时式多选 */
  P.conjTenseChips = function (selected) {
    selected = selected || ['pres'];
    var avail = P.verbForms() || P.verbAdv();
    return '<div class="chips wrap">' + P.CJ_TENSES.map(function (t) {
      var on = selected.indexOf(t.key) >= 0;
      var ready = P.cjAvailable(t.key);
      return '<button class="chip mini ' + (on ? 'on' : '') + (avail && !ready ? ' loading' : '') +
        '" data-act="conjTense" data-v="' + t.key + '"' + (avail && !ready ? ' aria-disabled="true"' : '') + '>' +
        t.label + '</button>';
    }).join('') + '</div>';
  };

  P.lexFiltered = filteredLex;

  P.lexList = function () {
    var list = filteredLex();
    var show = list.slice(0, APP.ui.lexLimit);
    var html = show.map(lexItemHTML).join('');
    if (!list.length) {
      html = '<div class="empty"><div class="big">🔍</div>没有匹配的词条，换个关键词试试</div>';
    } else if (list.length > show.length) {
      html += '<button class="btn wide" style="margin-top:12px" data-act="lexMore">显示更多（还有 ' + (list.length - show.length) + ' 条）</button>';
    }
    return html;
  };

  APP.views['lib-lexicon'] = function () {
    /* 扩展词表与词频数据：进页面后台拉，载完重绘（不影响首屏） */
    if (!APP.loader.extLoaded() && !APP.loader.extFailed) {
      APP.loader.loadExt().then(function () { if (APP.ui) APP.render(); }).catch(function () {});
    }
    if (!APP.loader.detailLoaded() && !APP.loader.detailFailed) {
      APP.loader.loadDetail().catch(function () {});
    }
    var themeOpts = ['ALL'].concat(themes());
    var meta = FR.LEXICON_META || {levels: {}, total: APP.counts.lexiconTotal, curated: 0};
    var extN = (APP.catalog.ext || []).length;
    var counts = {ALL: (meta.total || APP.counts.lexiconTotal) + extN};
    Object.keys(meta.levels || {}).forEach(function (lv) { counts[lv] = meta.levels[lv]; });
    if (extN) counts.EXT = extN;
    return {
      html:
        P.libTabs('lexicon') +
        '<p class="source-line">核心词表 A1–C1 · <b>' + (meta.total || APP.counts.lexiconTotal) + '</b> 词' +
        '（' + Object.keys(meta.levels || {}).map(function (lv) {
          return lv + ' ' + (meta.levels[lv] || 0);
        }).join(' / ') + '）' +
        ' · 手工核心 ' + (meta.curated || 0) + ' 条 · 来源 the-only-french-deck（CC BY-NC-SA 4.0）</p>' +
        '<p class="source-line">扩展词表 · <b>' + extN + '</b> 条（中文维基词典 CC BY-SA 4.0，只有释义/音标，暂无例句与分级，不进练习）</p>' +
        '<div class="filterbar">' +
        '<div class="search"><i>🔍</i><input id="lexSearch" data-input="lexSearch" placeholder="法语词（自动忽略重音）/ 中文释义" value="' + U.esc(APP.ui.lexQuery) + '" aria-label="搜索词条"></div>' +
        P.levelChips(APP.ui.lexLevel, 'lexLevel', counts, {levels: P.ALL_LEVELS.concat(['EXT'])}) +
        '<div class="chips" style="margin-top:6px">' + themeOpts.map(function (th) {
          return '<button class="chip mini ' + (APP.ui.lexTheme === th ? 'on' : '') + '" data-act="lexTheme" data-v="' + U.esc(th) + '">' +
            (th === 'ALL' ? '全部主题' : U.esc(th)) + '</button>';
        }).join('') + '</div>' +
        '</div>' +
        '<div class="progressline"><span id="lexCount">共 ' + filteredLex().length + ' 条 · 当前显示 ' +
        Math.min(filteredLex().length, APP.ui.lexLimit) + ' 条</span></div>' +
        '<div id="lexList">' + P.lexList() + '</div>'
    };
  };

  /* ---------- 句型骨架 ---------- */
  APP.views['lib-frames'] = function () {
    var frameIds = {};
    APP.catalog.frames.forEach(function (x) { frameIds[x.fr + '|' + x.cn] = x.id; });
    var html = FR.FRAMES.map(function (g) {
      var items = g.items.map(function (it) {
        var id = frameIds[it.fr + '|' + it.cn];
        var starred = APP.store.isStar(id);
        var added = APP.store.has(id);
        return '<div class="chunk">' +
          '<div class="chunk-main">' +
          '<div class="fr">' + U.esc(it.fr) + '</div>' +
          '<div class="cn">' + U.esc(it.cn) + '</div>' +
          (it.note ? '<div class="note">' + U.esc(it.note) + '</div>' : '') +
          '</div>' +
          '<div class="row gap6" style="flex:none">' +
          '<button class="iconbtn say" data-say="' + U.esc(it.fr) + '" title="朗读">' + U.ic.sound + '</button>' +
          '<button class="iconbtn ' + (starred ? 'on' : '') + '" data-act="lexStar" data-id="' + id + '" title="收藏">★</button>' +
          '<button class="iconbtn ' + (added ? 'on' : '') + '" data-act="lexAdd" data-id="' + id + '" title="加入复习">＋</button>' +
          '</div></div>';
      }).join('');
      return '<section class="card" style="margin-top:12px">' +
        '<div class="row between" style="margin-bottom:4px"><h3>' + U.esc(g.cat) + '</h3>' +
        '<span class="muted small">' + g.items.length + ' 句</span></div>' +
        '<p class="muted small" style="margin-bottom:8px">' + U.esc(g.hint) + '</p>' +
        items + '</section>';
    }).join('');
    return {
      html:
        P.libTabs('frames') +
        '<div class="callout">' +
        '<h3>先背框架，再填内容</h3>' +
        '<p class="small">「只会蹦单词」的本质是缺少句子骨架。这里按交际功能整理 72 个可复用句式：把关键词填进去，句子就完整了。</p></div>' +
        html
    };
  };

  /* ---------- 精读 ---------- */
  APP.views['lib-reading'] = function () {
    var groups = P.ALL_LEVELS.filter(function (lv) { return lv !== 'ALL'; }).map(function (lv) {
      var list = FR.READINGS.filter(function (r) { return r.lv === lv; });
      if (!list.length) return '';
      return '<h2 class="group-title">' + lv + '</h2>' +
        list.map(function (r) {
          return '<a class="card tap read-card" href="#/read/' + r.id + '">' +
            '<div class="row between"><h3>' + U.esc(r.title) + '</h3>' + P.tag(r.lv, 'lv') + '</div>' +
            '<p class="muted small" style="margin-top:3px">' + U.esc(r.titleCn) + ' · ' + U.wordCount(r.fr) + ' 词 · ' + r.qs.length + ' 道理解题</p>' +
            '</a>';
        }).join('');
    }).join('');
    return {
      html:
        P.libTabs('reading') +
        '<div class="callout"><h3>长文不靠硬啃</h3>' +
        '<p class="small">点句子即可朗读，先听后看译，再做题确认理解。建议顺序：盲听 → 看原文 → 查生词 → 做题。</p></div>' +
        groups
    };
  };

  APP.views.read = function (r) {
    var item = FR.READINGS.filter(function (x) { return x.id === r.id; })[0];
    if (!item) return {html: '<div class="empty"><div class="big">🤔</div>找不到这篇</div>'};
    var sents = U.splitSentences(item.fr);
    var passage = sents.map(function (s) {
      return '<span class="sent" data-say="' + U.esc(s) + '" role="button" tabindex="0">' + U.esc(s) + '</span> ';
    }).join('');
    var vocab = item.vocab.map(function (v) {
      return '<span class="vocab" role="button" tabindex="0" data-say="' + U.esc(v.w) + '"><b>' + U.esc(v.w) + '</b>' + U.esc(v.cn) + '</span>';
    }).join('');
    var qs = item.qs.map(function (q, i) { return APP.part.quizHTML(q, 'read:' + item.id + ':' + i); }).join('');
    return {
      html:
        '<div class="row between" style="margin-bottom:10px">' +
        '<a class="chip" href="#/lib/reading">← 精读</a>' + P.tag(item.lv, 'lv') + '</div>' +
        '<h1 class="read-title">' + U.esc(item.title) + '</h1>' +
        '<p class="muted small">' + U.esc(item.titleCn) + ' · ' + U.wordCount(item.fr) + ' 词</p>' +
        '<div class="row wrap gap6" style="margin:12px 0">' +
        '<button class="btn btn-sm primary" data-act="readAll" data-id="' + item.id + '">' + U.ic.sound + ' 整篇朗读</button>' +
        '<button class="btn btn-sm" data-act="readToggleCn">' + (APP.ui.readCn ? '隐藏中文' : '显示中文') + '</button>' +
        '<button class="btn btn-sm" data-act="readStop">⏹ 停止</button>' +
        '</div>' +
        '<div class="card"><div class="passage">' + passage + '</div>' +
        '<div class="reader-cn ' + (APP.ui.readCn ? 'show' : '') + '">' + U.esc(item.cn) + '</div></div>' +
        '<div class="section"><h2 class="group-title">生词卡</h2><div class="vocablist">' + vocab + '</div></div>' +
        '<div class="section"><h2 class="group-title">理解题</h2>' + qs + '</div>'
    };
  };
})();
