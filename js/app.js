/* 应用入口：目录索引、路由、渲染、全局交互 */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var appEl = null;
  var lastHash = null;

  /* ---------------- 语料懒加载 ---------------- */
  var LEVELS = ['A1', 'A2', 'B1', 'B2'];
  var loaded = {A1: 1};   /* A1 随页面同步载入，其余按需 */
  var pending = {};

  APP.loader = {
    levels: LEVELS,
    loaded: function (lv) { return !!loaded[lv]; },
    missing: function () { return LEVELS.filter(function (lv) { return !loaded[lv]; }); },
    allLoaded: function () { return APP.loader.missing().length === 0; },
    load: function (levels) {
      var todo = (levels || LEVELS).filter(function (lv) { return !loaded[lv]; });
      if (!todo.length) return Promise.resolve([]);
      return Promise.all(todo.map(function (lv) {
        if (pending[lv]) return pending[lv];
        pending[lv] = new Promise(function (resolve, reject) {
          var el = document.createElement('script');
          el.src = 'data/lexicon-' + lv.toLowerCase() + '.js';
          el.async = true;
          el.onload = function () { loaded[lv] = 1; delete pending[lv]; resolve(lv); };
          el.onerror = function () { delete pending[lv]; reject(new Error('载入失败 ' + lv)); };
          document.head.appendChild(el);
        });
        return pending[lv];
      }));
    },
    /* 需要全量语料的动作（复习/训练/游戏）：缺级别就先载入再执行 */
    ensureAll: function (then) {
      var miss = APP.loader.missing();
      if (!miss.length) return false;
      U.toast('正在载入 ' + miss.join(' / ') + ' …');
      APP.loader.load(miss).then(function () {
        rebuildCatalog();
        U.toast('语料已就绪');
        then && then();
      }).catch(function () { U.toast('语料载入失败，请检查网络后重试'); });
      return true;
    }
  };

  /* 载完一个级别：重建目录 → 刷新界面 */
  function afterLevelLoaded() {
    rebuildCatalog();
    var ae = document.activeElement;
    var typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA');
    if (typing) { refreshChips(); return; }   /* 别打断输入 */
    render();
  }

  function rebuildCatalog() {
    buildCatalog();
    verifyCardSignatures();
  }

  function refreshChips() {
    if (!appEl) return;
    var chips = appEl.querySelectorAll('[data-act="setLevel"],[data-act="lexLevel"]');
    for (var i = 0; i < chips.length; i++) {
      var lv = chips[i].getAttribute('data-v');
      if (lv && lv !== 'ALL' && APP.loader.loaded(lv)) {
        chips[i].classList.remove('loading');
        chips[i].removeAttribute('aria-disabled');
      }
    }
  }

  /* 空闲时依次预载 A2 → B1 → B2，载完即点亮 */
  function prefetch() {
    var queue = ['A2', 'B1', 'B2'];
    function next() {
      var lv = queue.shift();
      if (!lv) return;
      APP.loader.load([lv]).then(function () { afterLevelLoaded(); next(); }).catch(function () { queue.length = 0; });
    }
    var kick = function () { setTimeout(next, 300); };
    if (window.requestIdleCallback) window.requestIdleCallback(kick, {timeout: 1500});
    else setTimeout(kick, 900);
  }

  /* ---------------- 目录索引 ---------------- */
  function buildCatalog() {
    var c = {lexicon: [], frames: [], chunks: [], verbs: FR.VERBS || [], all: [], byId: {}};
    var used = {};
    /* 用内容指纹做 id：语料增删/排序不再让历史记录指错词 */
    function uid(prefix, seed) {
      var base = prefix + U.hash(seed);
      var id = base, n = 1;
      while (used[id]) { n++; id = base + '-' + n; }
      used[id] = 1;
      return id;
    }

    LEVELS.forEach(function (lv) {
      if (!(window.FR && FR.LEXICON && FR.LEXICON[lv])) return;
      FR.LEXICON[lv].forEach(function (e) {
        var it = {
          id: uid('lx:' + lv + ':', e.w + '|' + e.cn), type: 'lexicon', lv: lv, w: e.w, p: e.p,
          cn: e.cn, ex: e.ex, exCn: e.exCn, th: e.th, front: e.w
        };
        c.lexicon.push(it); c.all.push(it); c.byId[it.id] = it;
      });
    });

    FR.FRAMES.forEach(function (g) {
      g.items.forEach(function (e) {
        var it = {
          id: uid('fr:', e.fr + '|' + e.cn), type: 'frame', lv: e.lv || 'A2',
          fr: e.fr, cn: e.cn, note: e.note || '', cat: g.cat, front: e.fr
        };
        c.frames.push(it); c.all.push(it); c.byId[it.id] = it;
      });
    });

    FR.SCENES.forEach(function (s) {
      s.chunks.forEach(function (e) {
        var it = {
          id: uid('ch:', s.id + '|' + e.fr), type: 'chunk', lv: s.lv,
          fr: e.fr, cn: e.cn, note: e.note || '',
          sceneTitle: s.title, sceneId: s.id, front: e.fr
        };
        c.chunks.push(it); c.all.push(it); c.byId[it.id] = it;
      });
    });

    APP.catalog = c;
    APP.counts = {
      lexicon: c.lexicon.length,
      frames: c.frames.length,
      chunks: c.chunks.length,
      grammar: FR.GRAMMAR.length,
      quiz: FR.GRAMMAR.reduce(function (a, g) { return a + (g.quiz ? g.quiz.length : 0); }, 0),
      verbs: (FR.VERBS || []).length,
      reading: FR.READINGS.length
    };
  }

  /* ---------------- 状态 ---------------- */
  function initState() {
    APP.ui = {
      lexLevel: 'ALL', lexTheme: 'ALL', lexQuery: '', lexLimit: 60, lexOpen: null,
      gramLevel: 'ALL', gramCat: 'ALL', gramQuery: '',
      verbQuery: '', verb: (FR.VERBS && FR.VERBS[0]) ? FR.VERBS[0].inf : '',
      readCn: false,
      showCn: !APP.store.settings().hideCn,
      quiz: {},
      trainLevel: 'ALL',
      level: APP.store.settings().level || 'ALL',
      count: APP.store.settings().count || 10
    };
    APP.session = {build: null, listen: null, quiz: null, review: null, match: null, sprint: null, audio: null, gconj: null, judge: null, mix: null};
  }

  /* ---------------- 路由 ---------------- */
  function safeDecode(s) {
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }

  function parse() {
    var h = (location.hash || '#/home').split('?')[0];
    var m;
    h = h.replace(/^#\/core\//, '#/lib/');
    if (h === '' || h === '#/' || h === '#/home') return {v: 'home'};
    if ((m = h.match(/^#\/lib\/(lexicon|frames|grammar|verbs|reading)$/))) return {v: 'lib-' + m[1]};
    if ((m = h.match(/^#\/read\/(.+)$/))) return {v: 'read', id: safeDecode(m[1])};
    if (h === '#/scenes') return {v: 'scenes'};
    if ((m = h.match(/^#\/scene\/(.+)$/))) return {v: 'scene', id: safeDecode(m[1])};
    if (h === '#/games') return {v: 'games'};
    if (h === '#/games/match') return {v: 'match'};
    if (h === '#/games/sprint') return {v: 'sprint'};
    if (h === '#/games/audio') return {v: 'audio'};
    if (h === '#/games/conj') return {v: 'gconj'};
    if (h === '#/train/build') return {v: 'build'};
    if (h === '#/train/listen') return {v: 'listen'};
    if (h === '#/train/quiz') return {v: 'quiz'};
    if (h === '#/train/close') return {v: 'close'};
    if (h === '#/train/conj') return {v: 'conj'};
    if (h === '#/train/spell') return {v: 'spell'};
    if (h === '#/train/judge') return {v: 'judge'};
    if (h === '#/train/mix') return {v: 'mix'};
    if (h === '#/train') return {v: 'games'};
    if (h === '#/review') return {v: 'review'};
    if (h === '#/me') return {v: 'me'};
    return {v: 'home'};
  }

  var TAB_OF = {
    home: '#/home',
    'lib-lexicon': '#/lib', 'lib-frames': '#/lib', 'lib-grammar': '#/lib', 'lib-verbs': '#/lib', 'lib-reading': '#/lib', read: '#/lib',
    scenes: '#/lib', scene: '#/lib',
    games: '#/games', match: '#/games', sprint: '#/games', audio: '#/games', build: '#/games', listen: '#/games', quiz: '#/games',
    review: '#/review',
    me: '#/me'
  };

  function updateTabs(r) {
    var want = TAB_OF[r.v] || '';
    Array.prototype.forEach.call(document.querySelectorAll('#tabbar a'), function (a) {
      a.classList.toggle('on', a.getAttribute('data-tab') === want);
    });
  }

  function updateDue() {
    var el = document.getElementById('topDue');
    if (!el) return;
    var n = APP.store.dueCount();
    var xp = APP.store.stats().xp;
    el.innerHTML = '<span class="due-xp">⚡ ' + xp + '</span><span class="due-sep"></span><span>复习 <b>' + n + '</b></span>';
  }

  function focusSnapshot() {
    var a = document.activeElement;
    if (!a || !appEl.contains(a)) return null;
    if (a.id) return {id: a.id, start: a.selectionStart, end: a.selectionEnd};
    if (a.dataset && a.dataset.act) return {act: a.dataset.act, did: a.dataset.id || ''};
    return null;
  }

  function restoreFocus(info) {
    if (!info) return;
    var el = null;
    if (info.id) el = document.getElementById(info.id);
    else if (info.act) el = appEl.querySelector('[data-act="' + info.act + '"]' + (info.did ? '[data-id="' + info.did + '"]' : ''));
    if (!el) return;
    try {
      el.focus({preventScroll: true});
      if (info.id && typeof info.start === 'number' && el.setSelectionRange) {
        el.setSelectionRange(info.start, info.end);
      }
    } catch (e) {}
  }

  function markFrench() {
    Array.prototype.forEach.call(
      appEl.querySelectorAll('.fr, .w, .front-fr, .passage, .sent, .answerline, .tok, .vocab b, [data-say], .verb-inf'),
      function (el) { el.setAttribute('lang', 'fr'); }
    );
  }

  var GAME_VIEWS = {games: 1, match: 1, sprint: 1, audio: 1, gconj: 1, build: 1, listen: 1, quiz: 1, close: 1, conj: 1, spell: 1, judge: 1, mix: 1};

  function render() {
    var r = parse();
    document.body.setAttribute('data-mode', GAME_VIEWS[r.v] ? 'game' : 'study');
    var fn = APP.views[r.v] || APP.views.home;
    var focusInfo = focusSnapshot();
    var out = fn(r) || {html: ''};
    appEl.innerHTML = out.html;
    updateTabs(r);
    updateDue();
    markFrench();
    restoreFocus(focusInfo);
    if (out.after) out.after();

    /* 计时类视图之外停掉秒表；回到未完成的残局时重新起表 */
    var CLOCK_VIEWS = {match: 1, sprint: 1, gconj: 1};
    if (!CLOCK_VIEWS[r.v] && APP.clock) APP.clock.stop();
    if (CLOCK_VIEWS[r.v] && APP.gameClock && APP.clock && !APP.clock.id) {
      var live = APP.session[r.v];
      if (live && !live.finished) APP.clock.start(r.v, APP.gameClock[r.v]);
    }

    /* 听写 / 听音自动播放 */
    if (r.v === 'listen') {
      var ls = APP.session.listen;
      if (ls && ls.auto && ls.idx < ls.items.length) {
        ls.auto = false;
        APP.speech.speak(ls.items[ls.idx].fr);
      }
    }
    if (r.v === 'audio') {
      var as = APP.session.audio;
      if (as && as.auto && !as.finished && as.idx < as.items.length) {
        as.auto = false;
        APP.speech.speak(as.items[as.idx].fr);
      }
    }

    if (location.hash !== lastHash) { lastHash = location.hash; window.scrollTo(0, 0); }
  }

  APP.render = render;

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function refreshLexList() {
    var box = document.getElementById('lexList');
    if (box) box.innerHTML = APP.part.lexList();
    var cnt = document.getElementById('lexCount');
    if (cnt) {
      var n = APP.part.lexFiltered().length;
      cnt.textContent = '共 ' + n + ' 条 · 当前显示 ' + Math.min(n, APP.ui.lexLimit) + ' 条';
    }
  }

  /* ---------------- 动作 ---------------- */
  APP.actions = Object.assign(APP.actions, {
    /* 词汇 */
    goLex: function (el) { APP.ui.lexLevel = el.dataset.v; APP.ui.lexLimit = 60; go('#/lib/lexicon'); },
    lexLevel: function (el) {
      var v = el.dataset.v;
      var need = v === 'ALL' ? APP.loader.missing() : (APP.loader.loaded(v) ? [] : [v]);
      if (need.length) {
        U.toast('正在载入 ' + need.join(' / ') + ' …');
        APP.loader.load(need).then(function () {
          APP.ui.lexLevel = v; APP.ui.lexLimit = 60; rebuildCatalog(); render();
        }).catch(function () { U.toast('载入失败，请检查网络'); });
        return;
      }
      APP.ui.lexLevel = v; APP.ui.lexLimit = 60; render();
    },
    lexTheme: function (el) { APP.ui.lexTheme = el.dataset.v; APP.ui.lexLimit = 60; render(); },
    lexSearch: function (el) {
      APP.ui.lexQuery = el.value;
      APP.ui.lexLimit = 60;
      refreshLexList();
      /* 搜索要覆盖全部语料：缺级别时后台补载，载完刷新列表 */
      if (APP.ui.lexQuery.trim() && APP.loader.missing().length) {
        APP.loader.load(APP.loader.missing()).then(function () {
          rebuildCatalog();
          if (document.activeElement && document.activeElement.id === 'lexInput') refreshLexList();
          else render();
        }).catch(function () {});
      }
    },
    lexMore: function () { APP.ui.lexLimit += 60; refreshLexList(); },
    lexToggle: function (el) {
      var id = el.dataset.id;
      APP.ui.lexOpen = (APP.ui.lexOpen === id) ? null : id;
      refreshLexList();
      var card = document.querySelector('[data-act="lexToggle"][data-id="' + id + '"]');
      if (card) { try { card.focus({preventScroll: true}); } catch (e) {} }
    },
    lexStar: function (el) {
      var on = APP.store.toggleStar(el.dataset.id);
      el.classList.toggle('on', on);
      U.toast(on ? '已收藏' : '已取消收藏');
    },
    lexAdd: function (el) {
      var id = el.dataset.id;
      if (APP.store.has(id)) U.toast('已在复习队列中');
      else { APP.store.add(id); U.toast('已加入复习队列 +1 XP'); }
      el.classList.add('on');
      updateDue();
    },

    /* 语法 / 阅读 */
    gramLevel: function (el) { APP.ui.gramLevel = el.dataset.v; render(); },
    gramCat: function (el) { APP.ui.gramCat = el.dataset.v; render(); },
    gramSearch: function (el) { APP.ui.gramQuery = el.value; render(); },
    verbSearch: function (el) { APP.ui.verbQuery = el.value; render(); },
    quizPick: function (el) {
      var wrap = el.closest('.q');
      if (!wrap) return;
      var key = el.dataset.key;
      if (APP.ui.quiz[key] != null) return; /* 持久守卫：重渲染后也不能重复计分 */
      var picked = Number(el.dataset.i);
      var correct = Number(el.dataset.c);
      APP.ui.quiz[key] = picked;
      Array.prototype.forEach.call(wrap.querySelectorAll('.opt'), function (b) {
        var i = Number(b.dataset.i);
        b.classList.toggle('right', i === correct);
        b.classList.toggle('wrong', i === picked && i !== correct);
      });
      var why = wrap.querySelector('.why');
      if (why) why.classList.add('show');
      if (picked === correct) {
        APP.store.recordCorrect(1, 'grammar');
        updateDue();
      }
    },
    readAll: function (r) {
      var item = FR.READINGS.filter(function (x) { return x.id === r.dataset.id; })[0];
      if (item) APP.speech.speakList(U.splitSentences(item.fr));
    },
    readStop: function () { APP.speech.stop(); },
    readToggleCn: function (el) {
      APP.ui.readCn = !APP.ui.readCn;
      var box = document.querySelector('.reader-cn');
      if (box) box.classList.toggle('show', APP.ui.readCn);
      el.textContent = APP.ui.readCn ? '隐藏中文' : '显示中文';
    },

    /* 情景口语 */
    dlgPlay: function (el) {
      var s = FR.SCENES.filter(function (x) { return x.id === el.dataset.id; })[0];
      if (!s) return;
      var first = !APP.store.data.scenesSeen[s.id];
      APP.store.seeScene(s.id);
      if (first) { U.toast('场景已记录 +3 XP'); updateDue(); }
      var rows = document.querySelectorAll('[data-dlgrow]');
      APP.speech.speakList(s.dialogue.map(function (d) { return d.fr; }), {
        onstep: function (i) {
          Array.prototype.forEach.call(rows, function (row) { row.classList.remove('playing'); });
          if (rows[i]) rows[i].classList.add('playing');
        },
        onend: function () {
          Array.prototype.forEach.call(rows, function (row) { row.classList.remove('playing'); });
        }
      });
    },
    dlgStop: function () {
      APP.speech.stop();
      Array.prototype.forEach.call(document.querySelectorAll('[data-dlgrow]'), function (row) {
        row.classList.remove('playing');
      });
    },
    sceneCn: function (el) {
      APP.ui.showCn = !APP.ui.showCn;
      APP.store.setSetting('hideCn', !APP.ui.showCn);
      Array.prototype.forEach.call(document.querySelectorAll('.dlgrow .cn'), function (c) {
        c.classList.toggle('hide', !APP.ui.showCn);
      });
      el.textContent = APP.ui.showCn ? '隐藏中文' : '显示中文';
    },

    /* 训练设置 */
    setCount: function (el) {
      var v = el.dataset.v;
      APP.ui.count = (v === 'R') ? 'R' : Number(v);
      APP.store.setCount(APP.ui.count);
      render();
    },
    setLevel: function (el) {
      var v = el.dataset.v || 'ALL';
      var need = v === 'ALL' ? APP.loader.missing() : (APP.loader.loaded(v) ? [] : [v]);
      if (need.length) {
        U.toast('正在载入 ' + need.join(' / ') + ' …');
        APP.loader.load(need).then(function () {
          APP.ui.level = v;
          APP.store.setLevel(v);
          rebuildCatalog();
          render();
        }).catch(function () { U.toast('载入失败，请检查网络'); });
        return;
      }
      APP.ui.level = v;
      APP.store.setLevel(v);
      render();
    },
    trainLevel: function (el) {
      APP.ui.trainLevel = el.dataset.v;
      APP.session.build = null; APP.session.listen = null;
      APP.session.match = null; APP.session.sprint = null; APP.session.audio = null;
      if (APP.clock) APP.clock.stop();
      render();
    },
    setRate: function (el) {
      var v = Number(el.value);
      APP.store.setSetting('rate', v);
      Array.prototype.forEach.call(document.querySelectorAll('#rateLabel'), function (x) {
        x.textContent = v.toFixed(2).replace(/0$/, '') + '×';
      });
    },
    toggleHideCn: function (el) {
      APP.store.setSetting('hideCn', el.checked);
      APP.ui.showCn = !el.checked;
    },
    importData: function (el) {
      var f = el.files && el.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () { APP.applyImport(String(reader.result)); };
      reader.onerror = function () { U.toast('读取文件失败'); };
      reader.readAsText(f);
      el.value = '';
    },
    importText: function () {
      var ta = document.getElementById('importArea');
      if (!ta || !String(ta.value || '').trim()) { U.toast('先把备份 JSON 粘到文本框里'); return; }
      APP.applyImport(ta.value);
    },
    exportData: function () {
      var json = APP.store.exportJSON();
      try {
        var blob = new Blob([json], {type: 'application/json'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'frlearn-' + U.dayKey() + '.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
        APP.store.markBackup();
        U.toast('已导出备份文件');
        render();
      } catch (e) {
        U.toast('下载被浏览器拦截，改用「复制备份文本」');
      }
    },
    copyData: function () {
      var json = APP.store.exportJSON();
      function done() {
        APP.store.markBackup();
        U.toast('备份文本已复制到剪贴板');
        render();
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = json;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
        if (ok) done(); else U.toast('复制失败：请手动全选文本框内容复制');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(done, fallback);
      } else { fallback(); }
    },
    restoreBackup: function () {
      var info = APP.store.backupInfo();
      if (!info) { U.toast('还没有可用的自动备份'); return; }
      var ok = window.confirm('恢复到 ' + U.fmtTime(info.savedAt) + ' 的自动备份？\n\n' +
        info.cards + ' 张复习卡 · ' + info.xp + ' XP\n当前进度会被覆盖。');
      if (!ok) return;
      if (!APP.store.restoreBackup()) { U.toast('备份损坏，恢复失败'); return; }
      APP.session = {build: null, listen: null, quiz: null, review: null, match: null, sprint: null, audio: null, gconj: null, judge: null, mix: null};
      if (APP.verifyCards) APP.verifyCards();
      render();
      U.toast('已恢复到自动备份');
    },
    resetAll: function () {
      if (!window.confirm('清空全部学习记录？\n\n会自动留一份备份，可用「恢复自动备份」找回。')) return;
      APP.store.reset();
      APP.session = {build: null, listen: null, quiz: null, review: null, match: null, sprint: null, audio: null, gconj: null, judge: null, mix: null};
      APP.ui.quiz = {};
      if (APP.clock) APP.clock.stop();
      render();
      U.toast('已清空（可恢复自动备份）');
    },

    /* 复习 */
    startReview: function () {
      if (APP.loader.ensureAll(function () { APP.actions.startReview(); })) return;
      var lv = APP.ui.level || 'ALL';
      function inLevel(id) {
        var it = APP.catalog.byId[id];
        return !!it && (lv === 'ALL' || it.lv === lv);
      }
      var queue = APP.store.dueList().filter(inLevel).slice(0, 30);
      var need = Math.max(0, 12 - queue.length);
      if (need > 0) {
        var pool = APP.catalog.all.filter(function (i) { return !APP.store.has(i.id) && (lv === 'ALL' || i.lv === lv); }).slice(0, need);
        queue = queue.concat(pool.map(function (i) { return i.id; }));
      }
      if (!queue.length) { U.toast('没有可复习的内容，先去语库逛逛'); return; }
      APP.session.review = {queue: queue, i: 0, flipped: false, done: 0, again: 0};
      render();
    },
    flip: function () {
      var s = APP.session.review;
      if (!s) return;
      s.flipped = !s.flipped;
      render();
    },
    grade: function (el) {
      var s = APP.session.review;
      if (!s) return;
      var id = s.queue[s.i];
      var g = el.dataset.g;
      APP.store.grade(id, g);
      s.done++;
      if (g === 'again' && s.again < 20) { s.again++; s.queue.push(id); }
      s.i++;
      s.flipped = false;
      updateDue();
      render();
    },

    /* 组句 */
    buildPick: function (el) {
      var s = APP.session.build;
      if (!s) return;
      var it = s.items[s.idx];
      if (!it || it.checked) return;
      var id = Number(el.dataset.id);
      it.chosen.push(id);
      render();
      var slotTok = appEl.querySelector('[data-act="buildUnpick"][data-id="' + id + '"]');
      if (slotTok) { try { slotTok.focus({preventScroll: true}); } catch (e) {} }
    },
    buildUnpick: function (el) {
      var s = APP.session.build;
      if (!s) return;
      var it = s.items[s.idx];
      if (!it || it.checked) return;
      var i = it.chosen.indexOf(Number(el.dataset.id));
      if (i >= 0) it.chosen.splice(i, 1);
      render();
    },
    buildClear: function () {
      var s = APP.session.build;
      if (!s) return;
      s.items[s.idx].chosen = [];
      render();
    },
    buildCheck: function () {
      var s = APP.session.build;
      if (!s) return;
      var it = s.items[s.idx];
      if (!it.chosen.length) { U.toast('先点几个词块排一句'); return; }
      var said = it.chosen.map(function (cid) {
        var t = it.tokens.filter(function (x) { return x.id === cid; })[0];
        return t ? t.t : '';
      }).join(' ');
      it.ok = U.norm(said) === U.norm(it.answer);
      it.checked = true;
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (it.ok) { s.score++; APP.store.recordCorrect(1); }
      }
      render();
    },
    buildRetry: function () {
      var s = APP.session.build;
      if (!s) return;
      var it = s.items[s.idx];
      it.checked = false;
      it.ok = false;
      it.chosen = [];
      render();
    },
    buildSkip: function () {
      var s = APP.session.build;
      if (!s) return;
      s.idx++;
      render();
    },
    buildNext: function () {
      var s = APP.session.build;
      if (!s) return;
      s.idx++;
      render();
    },

    /* 听写 */
    listenPlay: function () {
      var s = APP.session.listen;
      if (!s) return;
      APP.speech.speak(s.items[s.idx].fr);
    },
    listenSlow: function () {
      var s = APP.session.listen;
      if (!s) return;
      APP.speech.speak(s.items[s.idx].fr, {rate: 0.65});
    },
    listenReveal: function () {
      var s = APP.session.listen;
      if (!s) return;
      s.items[s.idx].revealed = true;
      render();
      var inp = document.getElementById('listenInput');
      if (inp && !inp.disabled) inp.focus();
    },
    listenType: function (el) {
      var s = APP.session.listen;
      if (!s) return;
      s.items[s.idx].typed = el.value;
    },
    listenCheck: function () {
      var s = APP.session.listen;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.checked) return;
      var inp = document.getElementById('listenInput');
      if (inp) it.typed = inp.value;
      if (!String(it.typed || '').trim()) { U.toast('先写下你听到的句子'); return; }
      it.checked = true;
      it.ok = U.norm(it.typed) === U.norm(it.fr);
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (it.ok) { s.score++; APP.store.recordCorrect(1); }
      }
      render();
    },
    listenSkip: function () {
      var s = APP.session.listen;
      if (!s) return;
      s.idx++;
      s.auto = true;
      render();
    },
    listenNext: function () {
      var s = APP.session.listen;
      if (!s) return;
      s.idx++;
      s.auto = true;
      render();
    },

    /* 填空（语境产出） */
    closeType: function (el) {
      var s = APP.session.close;
      if (!s) return;
      s.items[s.idx].typed = el.value;
    },
    closeCheck: function () {
      var s = APP.session.close;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.checked) return;
      var inp = document.getElementById('closeInput');
      if (inp) it.typed = inp.value;
      if (!String(it.typed || '').trim()) { U.toast('先写出缺的词'); return; }
      it.checked = true;
      it.ok = U.norm(it.typed) === U.norm(it.w);
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (it.ok) { s.score++; APP.store.recordCorrect(1); }
      }
      render();
    },
    closeHint: function () {
      var s = APP.session.close;
      if (!s) return;
      s.items[s.idx].revealed = true;
      render();
    },
    closeSkip: function () {
      var s = APP.session.close;
      if (!s) return;
      s.idx++;
      render();
    },
    closeNext: function () {
      var s = APP.session.close;
      if (!s) return;
      s.idx++;
      render();
    },

    /* 变位速练 */
    conjPick: function (el) {
      var s = APP.session.conj;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.picked != null) return;
      var picked = Number(el.dataset.i);
      it.picked = picked;
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (it.opts[picked] === it.answer) { s.score++; APP.store.recordCorrect(1); }
      }
      render();
    },
    conjNext: function () {
      var s = APP.session.conj;
      if (!s) return;
      s.idx++;
      render();
    },

    /* 中译法拼写 */
    spellType: function (el) {
      var s = APP.session.spell;
      if (!s) return;
      s.items[s.idx].typed = el.value;
    },
    spellCheck: function () {
      var s = APP.session.spell;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.checked) return;
      var inp = document.getElementById('spellInput');
      if (inp) it.typed = inp.value;
      if (!String(it.typed || '').trim()) { U.toast('先写出法语词'); return; }
      it.checked = true;
      it.ok = U.norm(it.typed) === U.norm(it.w);
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (it.ok) { s.score++; APP.store.recordCorrect(1); }
      }
      render();
    },
    spellHint: function () {
      var s = APP.session.spell;
      if (!s) return;
      s.items[s.idx].revealed = true;
      render();
    },
    spellSkip: function () {
      var s = APP.session.spell;
      if (!s) return;
      s.idx++;
      render();
    },
    spellNext: function () {
      var s = APP.session.spell;
      if (!s) return;
      s.idx++;
      render();
    },

    /* 快判对错 */
    judgePick: function (el) {
      var s = APP.session.judge;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.ans != null) return;
      it.ans = el.dataset.v;
      var right = (it.ans === 'yes') === it.truth;
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (right) { s.score++; APP.store.recordCorrect(1); }
      }
      U.fx[ right ? 'pop' : 'flash' ](right ? '+1' : '×', right ? 'ok' : 'bad');
      render();
    },
    judgeNext: function () {
      var s = APP.session.judge;
      if (!s) return;
      s.idx++;
      render();
    },

    /* 综合挑战 */
    mixType: function (el) {
      var s = APP.session.mix;
      if (!s) return;
      s.items[s.idx].typed = el.value;
    },
    mixCheck: function () {
      var s = APP.session.mix;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.checked) return;
      var inp = document.getElementById('mixInput');
      if (inp) it.typed = inp.value;
      if (!String(it.typed || '').trim()) { U.toast('先写下答案'); return; }
      it.checked = true;
      it.ok = U.norm(it.typed) === U.norm(it.w);
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (it.ok) { s.score++; APP.store.recordCorrect(1); }
      }
      U.fx[ it.ok ? 'pop' : 'flash' ](it.ok ? '+1' : '×', it.ok ? 'ok' : 'bad');
      render();
    },
    mixPick: function (el) {
      var s = APP.session.mix;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.kind === 'judge') {
        if (it.ans) return;
        it.ans = el.dataset.v;
        var right = (it.ans === 'yes') === it.truth;
        if (!it.counted) {
          it.counted = true;
          s.answered = (s.answered || 0) + 1;
          if (right) { s.score++; APP.store.recordCorrect(1); }
        }
        U.fx[right ? 'pop' : 'flash'](right ? '+1' : '×', right ? 'ok' : 'bad');
        render();
        return;
      }
      if (it.picked != null) return;
      var picked = Number(el.dataset.i), correct = Number(el.dataset.c);
      it.picked = picked;
      if (!it.counted) {
        it.counted = true;
        s.answered = (s.answered || 0) + 1;
        if (picked === correct) { s.score++; APP.store.recordCorrect(1); }
      }
      U.fx[picked === correct ? 'pop' : 'flash'](picked === correct ? '+1' : '×', picked === correct ? 'ok' : 'bad');
      render();
    },
    mixNext: function () {
      var s = APP.session.mix;
      if (!s) return;
      s.idx++;
      render();
    },

    /* 语法小测 */
    dquizPick: function (el) {
      var s = APP.session.quiz;
      if (!s) return;
      var it = s.items[s.idx];
      if (it.picked != null) return;
      var picked = Number(el.dataset.i);
      it.picked = picked;
      s.answered = (s.answered || 0) + 1;
      if (picked === Number(el.dataset.c)) {
        s.score++;
        APP.store.recordCorrect(1, 'grammar');
        updateDue();
      }
      render();
    },
    dquizNext: function () {
      var s = APP.session.quiz;
      if (!s) return;
      s.idx++;
      render();
    }
  });

  /* 导入：先解析并展示摘要，用户确认后再覆盖 */
  APP.applyImport = function (text) {
    var obj;
    try { obj = JSON.parse(text); } catch (e) { U.toast('不是合法 JSON，导入失败'); return; }
    var r = APP.store.parseImport(obj);
    if (!r.ok) { U.toast('导入失败：' + r.error); return; }
    var sm = r.summary;
    var ok = window.confirm('导入这份备份？\n\n' +
      sm.cards + ' 张复习卡 · ' + sm.stars + ' 个收藏 · ' + sm.xp + ' XP\n' +
      '备份时间：' + (sm.savedAt ? U.fmtTime(sm.savedAt) : '未记录') + '\n\n' +
      '当前进度会被覆盖（覆盖前可先导出一次）。');
    if (!ok) return;
    var res = APP.store.importJSON(obj);
    if (!res.ok) { U.toast('导入失败：' + res.error); return; }
    APP.session = {build: null, listen: null, quiz: null, review: null, match: null, sprint: null, audio: null, gconj: null, judge: null, mix: null};
    if (APP.verifyCards) APP.verifyCards();
    render();
    U.toast('已导入 ' + sm.cards + ' 张卡 · ' + sm.xp + ' XP');
  };

  /* ---------------- 事件委托 ---------------- */
  function delegateClicks(e) {
    var sayEl = e.target.closest('[data-say]');
    if (sayEl) {
      e.preventDefault();
      APP.speech.speak(sayEl.getAttribute('data-say'), {rate: sayEl.hasAttribute('data-slow') ? 0.65 : undefined});
      return;
    }
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var fn = APP.actions[el.getAttribute('data-act')];
    if (!fn) return;
    if (el.tagName === 'BUTTON' || el.tagName === 'A') e.preventDefault();
    fn(el, e);
  }

  function delegateInputs(e) {
    var el = e.target.closest('[data-input]');
    if (!el) return;
    var fn = APP.actions[el.getAttribute('data-input')];
    if (fn) fn(el, e);
  }

  /* 词条插入/改序后，旧记录不能静默指到别的词上 */
  function levelOfCardId(id) {
    var m = /^lx:([AB]\d):/.exec(String(id || ''));
    return m ? m[1] : null;
  }

  function verifyCardSignatures() {
    var data = APP.store.data, changed = false, dropped = 0;
    Object.keys(data.stars || {}).forEach(function (id) {
      var lv = levelOfCardId(id);
      if (lv && !loaded[lv]) return;          /* 该级别还没载入，先别动 */
      if (!APP.catalog.byId[id]) { delete data.stars[id]; changed = true; }
    });
    Object.keys(data.cards).forEach(function (id) {
      var lv = levelOfCardId(id);
      if (lv && !loaded[lv]) return;          /* 同上 */
      var it = APP.catalog.byId[id];
      if (!it) { delete data.cards[id]; dropped++; changed = true; return; }
      var sig = String(it.front || '').slice(0, 24);
      var card = data.cards[id];
      if (!card.sig) { card.sig = sig; changed = true; }
      else if (card.sig !== sig) { delete data.cards[id]; changed = true; }
    });
    if (changed && APP.store.persist) APP.store.persist();
    if (dropped) U.toast('词表已更新，' + dropped + ' 条旧复习记录不再对应现有词条，已清理');
  }
  APP.verifyCards = verifyCardSignatures;

  function boot() {
    appEl = document.getElementById('app');
    buildCatalog();
    initState();
    verifyCardSignatures();

    /* 点击特效：可点元素上的水波纹（不干扰事件本身） */
    var RIPPLE_SEL = '.btn, .opt, .chip, .iconbtn, .tok, .mcard, .game-card, .tab, .badge-chip, .vocab, .verb-chip, .judge-btn';
    document.addEventListener('pointerdown', function (e) {
      var host = e.target.closest && e.target.closest(RIPPLE_SEL);
      if (!host || !U.fx) return;
      var r = host.getBoundingClientRect();
      U.fx.ripple(host, e.clientX - r.left, e.clientY - r.top);
    }, {passive: true});

    document.addEventListener('click', delegateClicks);
    if (typeof prefetch === 'function') prefetch();
    document.addEventListener('input', delegateInputs);
    document.addEventListener('change', delegateInputs);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var t = e.target.closest('[data-act],[data-say]');
        if (t && !/^(BUTTON|A|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
          e.preventDefault();
          t.click();
          return;
        }
      }
      if (e.key !== 'Enter') return;
      if (e.target && e.target.id === 'listenInput') {
        e.preventDefault();
        APP.actions.listenCheck();
      }
    });

    window.addEventListener('hashchange', function () {
      APP.speech.stop();
      render();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) APP.store.snapshot();
    });
    window.addEventListener('pagehide', function () { APP.store.snapshot(); });

    if (!location.hash) location.hash = '#/home';
    render();

    if (APP.store.wasRestored && APP.store.wasRestored()) {
      U.toast('主记录缺失，已从自动备份恢复进度');
    }
    if (APP.store.storageOK === false) {
      console.warn('[frlearn] localStorage 不可写：进度只在本次会话有效，请用「我的 → 数据与备份」导出');
    }
    if (!APP.speech.supported) console.warn('[frlearn] 当前浏览器不支持 speechSynthesis，朗读不可用');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
