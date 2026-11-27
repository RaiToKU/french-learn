/* 学习引擎：间隔重复 + XP / 等级 / 每日任务 / 徽章，全部存 localStorage */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var KEY = 'frlearn.v2';
  var BACKUP_KEY = 'frlearn.backup.v2';
  var LEGACY_KEY = 'frlearn.v1';
  var VERSION = 2;

  /* 某些环境（file:// 受限、隐私模式）写不进 localStorage，需要提前告诉用户 */
  var storageOK = (function () {
    try {
      localStorage.setItem('frlearn.probe', '1');
      localStorage.removeItem('frlearn.probe');
      return true;
    } catch (e) { return false; }
  })();
  var restoredFromBackup = false;

  function readRaw(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function writeRaw(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  var DAY = 86400000;
  var I = [0, 1, 3, 7, 14, 30, 60];

  var LEVELS = [
    {min: 0, title: '初识', cn: '刚认识字母表里的人'},
    {min: 80, title: '起步', cn: '能打招呼、点单'},
    {min: 220, title: '打卡学徒', cn: '坚持复习的习惯'},
    {min: 420, title: '语感养成', cn: '句子开始连成片'},
    {min: 700, title: '场景通关', cn: '12 个场景敢开口'},
    {min: 1050, title: '语法过关', cn: 'A1–A2 语法稳了'},
    {min: 1500, title: '听力突破', cn: '听写不再靠猜'},
    {min: 2050, title: '表达自如', cn: 'B1–B2 长句能撑住'},
    {min: 2700, title: '备考选手', cn: '冲刺 DELF 中'}
  ];

  function blank() {
    return {
      cards: {}, stars: {}, days: {}, settings: {rate: 1, hideCn: false, level: 'ALL', count: 10, conjTenses: ['pres']}, created: Date.now(),
      xp: 0,
      totals: {reviews: 0, correct: 0, games: 0, maxCombo: 0, grammarCorrect: 0},
      best: {match: 0, sprint: 0, audio: 0, build: 0, listen: 0, quiz: 0},
      claims: {}, scenesSeen: {}, lastBackupAt: 0
    };
  }

  function merge(o) {
    var b = blank();
    var cards = {};
    Object.keys(o.cards || {}).forEach(function (k) {
      var c = o.cards[k];
      if (c && typeof c === 'object' && typeof c.due === 'number' && typeof c.box === 'number') cards[k] = c;
    });
    return {
      cards: cards,
      stars: o.stars || b.stars,
      days: o.days || b.days,
      settings: Object.assign(b.settings, o.settings || {}),
      created: o.created || b.created,
      xp: typeof o.xp === 'number' ? o.xp : b.xp,
      totals: Object.assign(b.totals, o.totals || {}),
      best: Object.assign(b.best, o.best || {}),
      claims: o.claims || {},
      scenesSeen: o.scenesSeen || {},
      lastBackupAt: o.lastBackupAt || 0
    };
  }

  function load() {
    var raw = readRaw(KEY);
    if (raw) {
      try { return merge(JSON.parse(raw)); } catch (e) { /* 主记录损坏 → 试备份 */ }
    }
    var bak = readRaw(BACKUP_KEY);
    if (bak) {
      try {
        var b = JSON.parse(bak);
        var m = merge(b && b.data ? b.data : b);
        restoredFromBackup = true;
        return m;
      } catch (e) { /* 备份也坏了，继续降级 */ }
    }
    var legacy = readRaw(LEGACY_KEY);
    if (legacy) {
      try {
        var m2 = merge(JSON.parse(legacy));
        m2.totals.reviews = Object.keys(m2.cards).length;
        return m2;
      } catch (e) { /* ignore */ }
    }
    return blank();
  }

  var s = load();
  var lastSnap = 0;

  function save() {
    if (!storageOK) return false;
    return writeRaw(KEY, JSON.stringify(s));
  }

  /* 自动备份：同一份数据写到第二个键，主记录丢失/损坏时可回滚 */
  function snapshot(force) {
    if (!storageOK) return false;
    var now = Date.now();
    if (!force && now - lastSnap < 5 * 60 * 1000) return false;
    lastSnap = now;
    var ok = writeRaw(BACKUP_KEY, JSON.stringify({app: 'frlearn', version: VERSION, savedAt: now, data: s}));
    if (ok) s.lastBackupAt = now;
    return ok;
  }

  function backupInfo() {
    var raw = readRaw(BACKUP_KEY);
    if (!raw) return null;
    try {
      var b = JSON.parse(raw);
      var d = b && b.data ? b.data : b;
      return {
        savedAt: b.savedAt || 0,
        cards: d && d.cards ? Object.keys(d.cards).length : 0,
        xp: (d && d.xp) || 0
      };
    } catch (e) { return null; }
  }

  function today() {
    var k = U.dayKey();
    if (!s.days[k]) s.days[k] = {r: 0, n: 0, c: 0, g: 0};
    var d = s.days[k];
    if (typeof d.c !== 'number') d.c = 0;
    if (typeof d.g !== 'number') d.g = 0;
    return d;
  }

  function streak() {
    var n = 0, d = new Date();
    if (!(s.days[U.dayKey(d)] && s.days[U.dayKey(d)].r > 0)) d.setDate(d.getDate() - 1);
    while (s.days[U.dayKey(d)] && s.days[U.dayKey(d)].r > 0) {
      n++; d.setDate(d.getDate() - 1);
    }
    return n;
  }

  function levelInfo() {
    var lv = 0;
    for (var i = 0; i < LEVELS.length; i++) if (s.xp >= LEVELS[i].min) lv = i;
    var cur = LEVELS[lv], next = LEVELS[lv + 1] || null;
    var span = next ? next.min - cur.min : 0;
    var into = s.xp - cur.min;
    return {
      index: lv + 1,
      title: cur.title,
      desc: cur.cn,
      xp: s.xp,
      next: next ? next.min : null,
      nextTitle: next ? next.title : null,
      pct: next ? Math.max(4, Math.min(100, Math.round(into / span * 100))) : 100,
      toNext: next ? next.min - s.xp : 0
    };
  }

  function addXp(n, kind) {
    if (!n) return;
    s.xp += n;
    if (kind === 'correct') s.totals.correct++;
    save();
  }

  var QUESTS = [
    {id: 'review10', label: '复习 10 张卡片', goal: 10, xp: 20, field: 'r'},
    {id: 'correct20', label: '答对 20 道题', goal: 20, xp: 20, field: 'c'},
    {id: 'games2', label: '完成 2 局训练/游戏', goal: 2, xp: 20, field: 'g'}
  ];

  var BADGES = [
    {id: 'first', icon: '🎬', title: '初次登场', desc: '完成第一局游戏或训练', goal: 1, get: function (t) { return t.games; }},
    {id: 'combo', icon: '⚡', title: '连击达人', desc: '单局连击达到 10', goal: 10, get: function (t) { return t.maxCombo; }},
    {id: 'review100', icon: '🔁', title: '复习上瘾', desc: '累计复习 100 次', goal: 100, get: function (t) { return t.reviews; }},
    {id: 'learned100', icon: '📚', title: '词汇掌舵', desc: '掌握 100 个词条/句式', goal: 100, get: function () { return store.learnedCount(); }},
    {id: 'correct200', icon: '🎯', title: '手感在线', desc: '累计答对 200 题', goal: 200, get: function (t) { return t.correct; }},
    {id: 'grammar50', icon: '📐', title: '语法控', desc: '语法题答对 50 道', goal: 50, get: function (t) { return t.grammarCorrect; }},
    {id: 'streak7', icon: '🔥', title: '七日不断', desc: '连续学习 7 天', goal: 7, get: function () { return streak(); }},
    {id: 'streak30', icon: '🏔', title: '三十日山脉', desc: '连续学习 30 天', goal: 30, get: function () { return streak(); }},
    {id: 'sprint20', icon: '🏃', title: '冲刺好手', desc: '限时冲刺得分 ≥ 20', goal: 20, get: function () { return s.best.sprint; }},
    {id: 'match8', icon: '🧩', title: '配对大师', desc: '配对模式一局清空 8 对', goal: 8, get: function () { return s.best.match; }},
    {id: 'audio15', icon: '🎧', title: '耳朵醒了', desc: '听音选义单局得分 ≥ 10', goal: 10, get: function () { return s.best.audio; }},
    {id: 'scenes12', icon: '🎭', title: '场景通关', desc: '12 个情景对话全部练过', goal: 12, get: function () { return Object.keys(s.scenesSeen).length; }}
  ];

  if (restoredFromBackup) { writeRaw(KEY, JSON.stringify(s)); }
  if (storageOK) snapshot(true);

  var store = {
    get data() { return s; },
    storageOK: storageOK,
    wasRestored: function () { return restoredFromBackup; },

    /* ---------- 卡片与复习 ---------- */
    has: function (id) { return !!s.cards[id]; },

    add: function (id) {
      if (s.cards[id]) return s.cards[id];
      s.cards[id] = {box: 0, due: Date.now(), reps: 0, lapses: 0, last: 0};
      today().n++;
      addXp(1);
      save();
      return s.cards[id];
    },

    card: function (id) { return s.cards[id] || null; },

    grade: function (id, g) {
      var c = store.add(id);
      var now = Date.now();
      if (g === 'again') {
        c.box = 0; c.due = now + DAY; c.lapses = (c.lapses || 0) + 1;
      } else if (g === 'hard') {
        c.box = Math.max(0, c.box - 1);
        c.due = now + Math.max(0.4, I[c.box] * 0.5) * DAY;
      } else if (g === 'good') {
        c.box = Math.min(6, c.box + 1);
        c.due = now + I[c.box] * DAY;
      } else {
        c.box = Math.min(6, c.box + 2);
        c.due = now + I[c.box] * DAY;
      }
      if (g !== 'again') c.reps = (c.reps || 0) + 1;
      c.last = now;
      today().r++;
      s.totals.reviews++;
      addXp(2);
      save();
      return c;
    },

    dueList: function () {
      var now = Date.now();
      return Object.keys(s.cards)
        .filter(function (id) { return s.cards[id].due <= now; })
        .sort(function (a, b) { return s.cards[a].due - s.cards[b].due; });
    },

    dueCount: function () { return store.dueList().length; },

    isLearned: function (id) { return !!s.cards[id] && s.cards[id].box >= 3; },

    learnedCount: function () {
      var n = 0;
      Object.keys(s.cards).forEach(function (id) { if (s.cards[id].box >= 3) n++; });
      return n;
    },

    /* ---------- 收藏 ---------- */
    isStar: function (id) { return !!s.stars[id]; },
    toggleStar: function (id) {
      if (s.stars[id]) { delete s.stars[id]; } else { s.stars[id] = 1; }
      save();
      return !!s.stars[id];
    },
    starCount: function () { return Object.keys(s.stars).length; },

    /* ---------- 设置 ---------- */
    settings: function () { return s.settings; },
    setLevel: function (lv) { s.settings.level = lv || 'ALL'; save(); },
    setCount: function (n) { s.settings.count = n; save(); },
    setConjTenses: function (list) { s.settings.conjTenses = list; save(); },
    setSetting: function (k, v) { s.settings[k] = v; save(); },

    /* ---------- 计分 ---------- */
    addXp: addXp,

    recordCorrect: function (n, kind) {
      n = n || 1;
      s.totals.correct += n;
      if (kind === 'grammar') s.totals.grammarCorrect += n;
      today().c += n;
      addXp(2 * n);
      save();
    },

    recordCombo: function (c) {
      if (c > s.totals.maxCombo) s.totals.maxCombo = c;
      save();
    },

    finishGame: function (game, score, opts) {
      opts = opts || {};
      today().g++;
      s.totals.games++;
      var best = s.best[game] || 0;
      if (score > best) s.best[game] = score;
      var bonus = 5 + (opts.perfect ? 10 : 0);
      addXp(bonus);
      save();
      return {best: s.best[game], bonus: bonus, newBest: score > best};
    },

    best: function (game) { return s.best[game] || 0; },

    seeScene: function (id) {
      if (s.scenesSeen[id]) return;
      s.scenesSeen[id] = 1;
      addXp(3);
      save();
    },

    /* ---------- 每日任务 ---------- */
    quests: function () {
      var d = today();
      var claims = s.claims[U.dayKey()] || {};
      return QUESTS.map(function (q) {
        var p = d[q.field] || 0;
        return {
          id: q.id, label: q.label, goal: q.goal, xp: q.xp,
          progress: Math.min(p, q.goal), done: p >= q.goal,
          claimed: !!claims[q.id]
        };
      });
    },

    claimQuests: function () {
      var k = U.dayKey();
      if (!s.claims[k]) s.claims[k] = {};
      var gained = 0;
      store.quests().forEach(function (q) {
        if (q.done && !s.claims[k][q.id]) {
          s.claims[k][q.id] = 1;
          gained += q.xp;
        }
      });
      if (gained) { addXp(gained); save(); }
      return gained;
    },

    /* ---------- 徽章 ---------- */
    badges: function () {
      return BADGES.map(function (b) {
        var v = 0;
        try { v = b.get(s.totals) || 0; } catch (e) { v = 0; }
        return {
          id: b.id, icon: b.icon, title: b.title, desc: b.desc, goal: b.goal,
          value: v, unlocked: v >= b.goal,
          pct: Math.min(100, Math.round(v / b.goal * 100))
        };
      });
    },

    /* ---------- 汇总 ---------- */
    stats: function () {
      var now = Date.now(), due = 0, total = 0;
      Object.keys(s.cards).forEach(function (id) {
        var c = s.cards[id];
        total++;
        if (c.due <= now) due++;
      });
      return {
        due: due, total: total, learned: store.learnedCount(),
        streak: streak(), stars: store.starCount(),
        today: today().r, todayCorrect: today().c, todayGames: today().g,
        xp: s.xp, level: levelInfo(),
        badges: store.badges().filter(function (b) { return b.unlocked; }).length,
        scenesSeen: Object.keys(s.scenesSeen).length
      };
    },

    persist: function () { save(); },

    snapshot: function () { return snapshot(true); },
    backupInfo: backupInfo,

    /* 导出：带版本号与时间戳，便于以后兼容旧文件 */
    exportPayload: function () {
      return {app: 'frlearn', version: VERSION, savedAt: Date.now(), data: s};
    },
    exportJSON: function () { return JSON.stringify(store.exportPayload(), null, 2); },

    /* 导入：兼容「带外壳」与「裸数据」两种文件；返回摘要而不是布尔，便于二次确认 */
    parseImport: function (o) {
      if (!o || typeof o !== 'object') return {ok: false, error: '不是合法的 JSON 对象'};
      var d = o.data || o;
      if (!d || typeof d !== 'object' || !d.cards || typeof d.cards !== 'object') {
        return {ok: false, error: '缺少 cards 字段，可能不是本应用的备份'};
      }
      var m = merge(d);
      var cards = Object.keys(m.cards).length;
      return {
        ok: true,
        data: m,
        summary: {
          cards: cards,
          xp: m.xp || 0,
          stars: Object.keys(m.stars || {}).length,
          savedAt: o.savedAt || 0,
          version: o.version || 1
        }
      };
    },

    importJSON: function (o) {
      var r = store.parseImport(o);
      if (!r.ok) return r;
      s = r.data;
      save();
      snapshot(true);
      return r;
    },

    /* 回滚到自动备份 */
    restoreBackup: function () {
      var raw = readRaw(BACKUP_KEY);
      if (!raw) return false;
      try {
        var b = JSON.parse(raw);
        s = merge(b && b.data ? b.data : b);
        save();
        return true;
      } catch (e) { return false; }
    },

    markBackup: function () { s.lastBackupAt = Date.now(); save(); },

    reset: function () {
      snapshot(true); /* 清空前留一份，可回滚 */
      s = blank();
      save();
    }
  };

  APP.store = store;
})();
