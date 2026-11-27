/* 视图：首页 / 语库（词汇 · 句型骨架 · 精读） */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part = APP.part || {};

  /* ---------- 通用片段 ---------- */
  P.tag = function (txt, cls) {
    return '<span class="tag ' + (cls || '') + '">' + U.esc(txt) + '</span>';
  };

  P.say = function (text, label, cls) {
    return '<button class="btn btn-sm ' + (cls || 'blue') + '" data-say="' + U.esc(text) + '">' + (label || U.ic.sound + ' 朗读') + '</button>';
  };

  P.libTabs = function (active) {
    var c = APP.counts;
    var items = [
      ['lexicon', '词汇', c.lexiconTotal || c.lexicon],
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
    return '<div class="chips">' + lvs.map(function (lv) {
      var n = counts ? counts[lv] : null;
      var notLoaded = lv !== 'ALL' && ld && !ld.loaded(lv);
      return '<button class="chip ' + (active === lv ? 'on' : '') + (notLoaded ? ' loading' : '') +
        '" data-act="' + (act || 'lexLevel') + '" data-v="' + lv + '"' +
        (notLoaded ? ' aria-disabled="true" title="载入后可选中"' : '') + '>' +
        (lv === 'ALL' ? '全部' : lv) +
        (notLoaded ? ' <b class="chip-n">载入</b>' : (n ? ' <b class="chip-n">' + n + '</b>' : '')) +
        '</button>';
    }).join('') + '</div>';
  };

  /* 变位练习池：优先 1,384 个动词的现在时（懒加载），回落到手工 22 词 × 5 时式 */
  P.conjPool = function () {
    var out = [];
    if (window.FR && FR.VERB_FORMS) {
      Object.keys(FR.VERB_FORMS).forEach(function (inf) {
        var e = FR.VERB_FORMS[inf];
        if (!e || !e.f || e.f.length !== 6) return;
        var bad = e.f.some(function (f) { return !f || /^[—–-]+$/.test(f) || /^(j|m|t|s|n|qu)'/i.test(f); });
        if (bad) return;                       /* 残缺/带代词的形式不进题库 */
        out.push({inf: inf, cn: e.cn || '', tense: '现在时', forms: e.f});
      });
    }
    if (!out.length) {
      (FR.VERBS || []).forEach(function (v) {
        (FR.VERB_TENSES || []).forEach(function (t) {
          if (v[t.key]) out.push({inf: v.inf, cn: v.cn, tense: t.label, forms: v[t.key]});
        });
      });
    }
    return out;
  };

  P.CJ_PERSONS = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];

  P.conjItem = function (pool) {
    if (!pool || !pool.length) return null;
    var e = pool[Math.floor(Math.random() * pool.length)];
    if (!e || !e.forms || e.forms.length !== 6) return null;
    var pi = Math.floor(Math.random() * 6);
    var answer = e.forms[pi], seen = {}, opts = [answer];
    seen[answer] = 1;
    U.shuffle([0, 1, 2, 3, 4, 5].filter(function (i) { return i !== pi; })).forEach(function (i) {
      var f = e.forms[i];
      if (f && !seen[f] && opts.length < 4) { seen[f] = 1; opts.push(f); }
    });
    return {
      inf: e.inf, cn: e.cn, tenseLabel: e.tense, person: P.CJ_PERSONS[pi],
      answer: answer, opts: U.shuffle(opts)
    };
  };

  /* ---------- 首页 ---------- */
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

  function filteredLex() {
    var ui = APP.ui;
    var q = ui.lexQuery.trim().toLowerCase();
    return APP.catalog.lexicon.filter(function (it) {
      if (ui.lexLevel !== 'ALL' && it.lv !== ui.lexLevel) return false;
      if (ui.lexTheme !== 'ALL' && it.th !== ui.lexTheme) return false;
      if (q) {
        var hay = (it.w + ' ' + it.cn + ' ' + it.ex + ' ' + it.exCn + ' ' + it.th).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
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
      '<div class="w">' + U.esc(it.w) + '<span class="pos">' + U.esc(it.p) + '</span></div>' +
      '<div class="cn">' + U.esc(it.cn) + '</div>' +
      '</div>' +
      '<div class="acts">' +
      '<button class="iconbtn say" data-say="' + U.esc(it.w) + '" title="朗读">' + U.ic.sound + '</button>' +
      '<button class="iconbtn ' + (starred ? 'on' : '') + '" data-act="lexStar" data-id="' + it.id + '" title="收藏">★</button>' +
      '<button class="iconbtn ' + (added ? 'on' : '') + '" data-act="lexAdd" data-id="' + it.id + '" title="加入复习">＋</button>' +
      '</div></div>' +
      (open ?
        '<div class="ex">' +
        '<div class="fr">' + U.esc(it.ex) + '</div>' +
        '<div class="cn">' + U.esc(it.exCn) + '</div>' +
        '<div class="row wrap gap6" style="margin-top:9px">' +
        '<button class="btn btn-sm blue" data-say="' + U.esc(it.ex) + '">' + U.ic.sound + ' 例句</button>' +
        '<button class="btn btn-sm" data-say="' + U.esc(it.ex) + '" data-slow="1">🐢 慢速</button>' +
        '<button class="btn btn-sm" data-act="lexAdd" data-id="' + it.id + '">' + (added ? '已在复习' : '＋ 加入复习') + '</button>' +
        '</div>' +
        '<div class="tagline">' + P.tag(it.lv, 'lv') + P.tag(it.th, 'th') + '</div>' +
        '</div>' : '') +
      '</article>';
  }

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
    var themeOpts = ['ALL'].concat(themes());
    var meta = FR.LEXICON_META || {levels: {}, total: APP.counts.lexiconTotal, curated: 0};
    var counts = {ALL: meta.total || APP.counts.lexiconTotal};
    Object.keys(meta.levels || {}).forEach(function (lv) { counts[lv] = meta.levels[lv]; });
    return {
      html:
        P.libTabs('lexicon') +
        '<p class="source-line">标准词表 A1–C1 · <b>' + (meta.total || APP.counts.lexiconTotal) + '</b> 词' +
        '（' + Object.keys(meta.levels || {}).map(function (lv) {
          return lv + ' ' + (meta.levels[lv] || 0);
        }).join(' / ') + '）' +
        ' · 手工核心 ' + (meta.curated || 0) + ' 条 · 来源 the-only-french-deck（CC BY-NC-SA 4.0）</p>' +
        '<div class="filterbar">' +
        '<div class="search"><i>🔍</i><input id="lexSearch" data-input="lexSearch" placeholder="搜法语 / 中文 / 主题" value="' + U.esc(APP.ui.lexQuery) + '" aria-label="搜索词条"></div>' +
        P.levelChips(APP.ui.lexLevel, 'lexLevel', counts) +
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
