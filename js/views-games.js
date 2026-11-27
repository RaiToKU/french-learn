/* 视图：游戏中心 + 配对 / 限时冲刺 / 听音选义 */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part;

  /* 游戏里只显示核心义项，避免长释义撑爆卡片 */
  function short(cn) {
    var t = String(cn || '').split('；')[0].replace(/（[^）]*）/g, '').trim();
    if (!t) t = String(cn || '');
    return t.length > 13 ? t.slice(0, 13) + '…' : t;
  }

  function playable(level) {
    return APP.catalog.lexicon.filter(function (i) {
      return (level === 'ALL' || i.lv === level) && i.w.length <= 18 && String(i.cn).length <= 24;
    });
  }

  /* ---------- 计时器（只更新 DOM，不整树重渲染） ---------- */
  APP.clock = {
    id: null, owner: null,
    start: function (owner, fn) {
      this.stop();
      this.owner = owner;
      this.id = setInterval(fn, 1000);
    },
    stop: function () {
      if (this.id) { clearInterval(this.id); this.id = null; }
      this.owner = null;
    }
  };

  /* ---------- 秒表：具名 tick，离开再回来可重启 ---------- */
  function matchTick() {
    var s = APP.session.match;
    if (!s || s.finished) return;
    s.left--;
    var t = document.getElementById('gameTimer');
    var bar = document.getElementById('gameTimerBar');
    if (t) t.textContent = s.left + 's';
    if (bar) bar.style.width = Math.max(0, s.left / 90 * 100) + '%';
    if (s.left <= 0) {
      s.finished = true;
      APP.clock.stop();
      s.result = APP.store.finishGame('match', s.matched, {perfect: s.matched === 8});
      APP.render();
    }
  }

  function sprintTick() {
    var s = APP.session.sprint;
    if (!s || s.finished) return;
    s.left--;
    var t = document.getElementById('gameTimer');
    var bar = document.getElementById('gameTimerBar');
    if (t) t.textContent = s.left + 's';
    if (bar) bar.style.width = Math.max(0, s.left / 60 * 100) + '%';
    if (s.left <= 0) {
      s.finished = true;
      APP.clock.stop();
      s.result = APP.store.finishGame('sprint', s.score, {perfect: false});
      APP.render();
    }
  }

  APP.gameClock = {match: matchTick, sprint: sprintTick, gconj: gconjTick};

  /* ---------- 通用：街机 HUD ---------- */
  P.hud = function (cells) {
    return '<div class="hud">' + cells.map(function (c) {
      return '<div class="hud-cell"><span class="hud-k">' + U.esc(c[0]) + '</span>' +
        '<span class="hud-v ' + (c[2] || '') + '">' + c[1] + '</span></div>';
    }).join('') + '</div>';
  };

  /* ---------- 通用：结束面板 ---------- */
  P.finish = function (o) {
    var pct = o.points
      ? (o.total ? Math.round((o.hits || 0) / o.total * 100) : 0)
      : (o.total ? Math.round(o.score / o.total * 100) : 0);
    var scoreLine = o.points
      ? o.score + ' <span class="muted small">分' + (o.hits != null ? ' · 答对 ' + o.hits + ' 题' : '') + '</span>'
      : o.score + ' <span class="muted small">/ ' + o.total + '</span>';
    var rank = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 55 ? 'B' : 'C';
    return '<div class="result-card">' +
      (o.newBest ? '<div class="result-flag">NEW HIGH SCORE</div>' : '') +
      '<div class="result-rank r-' + rank + '">' + rank + '</div>' +
      '<div class="result-emoji">' + (pct >= 70 ? '🎉' : '💪') + '</div>' +
      '<h2>' + U.esc(o.title) + '</h2>' +
      '<p class="result-score">' + scoreLine + '</p>' +
      '<p class="muted small">' + (o.newBest ? '刷新了个人最佳！' : (o.best ? '个人最佳 ' + o.best : '')) + (o.bonus ? ' · 获得 ' + o.bonus + ' XP' : '') + '</p>' +
      '<div class="row gap8" style="justify-content:center;margin-top:16px">' +
      '<button class="btn primary" data-act="' + o.restart + '">再来一局</button>' +
      '<a class="btn" href="#/games">返回游戏</a>' +
      '</div></div>';
  };

  /* ---------- 游戏中心 ---------- */
  APP.views.games = function () {
    var best = {};
    ['match', 'sprint', 'audio', 'conj', 'build', 'listen', 'quiz', 'close', 'conj2', 'spell'].forEach(function (k) { best[k] = APP.store.best(k); });
    var games = APP.GAMES.map(function (g) {
      return P.gameCard(Object.assign({}, g, {best: best[g.key] || ''}));
    }).join('');
    var trains = APP.TRAININGS.map(function (g) {
      return P.gameCard(Object.assign({}, g, {best: best[g.key] || ''}));
    }).join('');
    return {
      html:
        '<div class="page-head"><div><h1>游戏与训练</h1>' +
        '<p class="muted">每答对一题 +2 XP，完成一局 +5 XP；单局连击 10 也有徽章。</p></div></div>' +
        '<div class="card" style="margin-bottom:16px"><div class="row between" style="margin-bottom:6px">' +
        '<b style="font-size:13px">难度</b><span class="muted small">A1 入门 → B2 进阶，全站生效</span></div>' +
        P.levelChips(APP.ui.level, 'setLevel') +
        '<div class="row between" style="margin:12px 0 6px"><b style="font-size:13px">题量</b>' +
        '<span class="muted small">训练每轮多少题</span></div>' +
        P.countChips(APP.ui.count) + '</div>' +
        '<div class="section-head"><h2>小游戏</h2><span class="muted small">限时 / 配对 / 听力</span></div>' +
        '<div class="game-grid">' + games + '</div>' +
        '<div class="section-head" style="margin-top:22px"><h2>训练</h2><span class="muted small">较慢节奏，重理解</span></div>' +
        '<div class="game-grid">' + trains + '</div>'
    };
  };

  /* ---------- 1. 配对连连看 ---------- */
  function matchItems(level, n) {
    var pool = playable(level);
    var picked = [], usedShort = {};
    U.shuffle(pool).forEach(function (it) {
      if (picked.length >= n) return;
      var s2 = short(it.cn);
      if (usedShort[s2] || usedShort[it.w]) return;
      usedShort[s2] = 1; usedShort[it.w] = 1;
      picked.push(it);
    });
    var cards = [];
    picked.forEach(function (it, i) {
      cards.push({pid: i, text: it.w, kind: 'fr', id: it.id});
      cards.push({pid: i, text: short(it.cn), kind: 'cn', id: it.id});
    });
    return {pairs: picked, cards: U.shuffle(cards)};
  }

  APP.actions.startMatch = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startMatch(); })) return;
    var level = APP.ui.level;
    var pairs = Math.max(4, Math.min(10, Math.round(P.sessionSize(20) / 2)));
    var built = matchItems(level, pairs);
    APP.session.match = {total: pairs, 
      cards: built.cards.map(function (c) { return Object.assign({done: false, wrong: false}, c); }),
      pairs: built.pairs, sel: null, matched: 0, combo: 0, maxCombo: 0,
      score: 0, left: 90, finished: false
    };
    APP.clock.stop();
    APP.clock.start('match', matchTick);
    APP.render();
  };

  APP.views.match = function () {
    var s = APP.session.match;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">🧩 配对连连看</h1>' +
          '<p class="muted">成对的法语词与中文意思，90 秒内全部配完（组数随「题量」变化）。连击越多分越高。</p>' +
          '<div class="card" style="margin-top:12px">' + P.levelChips(APP.ui.level, 'setLevel') +
          '<div class="muted small" style="margin:10px 0 6px">题量（决定组数）</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startMatch">开始 90 秒</button></div>'
      };
    }
    if (s.finished) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        P.finish({title: '配对结束', score: s.matched, total: s.total || 8, best: s.result ? s.result.best : 0, newBest: s.result && s.result.newBest, bonus: s.result && s.result.bonus, restart: 'startMatch'})};
    }
    var grid = s.cards.map(function (c, i) {
      var cls = c.done ? 'done' : (c.wrong ? 'wrong' : '') + (s.sel === i ? ' sel' : '');
      return '<button class="mcard ' + cls + '" data-act="matchPick" data-i="' + i + '" ' + (c.done ? 'disabled' : '') + '>' +
        '<span class="mcard-kind">' + (c.kind === 'fr' ? 'FR' : '中') + '</span>' + U.esc(c.text) + '</button>';
    }).join('');
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a>' +
        '<button class="chip" data-act="startMatch">重开</button></div>' +
        P.hud([
          ['已配对', s.matched + '<span style="opacity:.45">/' + (s.total || 8) + '</span>', ''],
          ['连击', '×' + s.combo, s.combo > 1 ? 'hot' : ''],
          ['得分', String(s.score), 'lime']
        ]) +
        '<div class="timerbar"><i id="gameTimerBar" style="width:' + Math.max(0, s.left / 90 * 100) + '%"></i>' +
        '<span id="gameTimer">' + s.left + 's</span></div>' +
        '<div class="match-grid">' + grid + '</div>' +
        '<p class="small muted center" style="margin-top:10px">点一张法语卡，再点对应的中文卡</p>'
    };
  };

  APP.actions.matchPick = function (el) {
    var s = APP.session.match;
    if (!s || s.finished) return;
    var i = Number(el.dataset.i);
    var c = s.cards[i];
    if (!c || c.done) return;
    s.cards.forEach(function (x) { x.wrong = false; });

    if (s.sel === null || s.sel === undefined) { s.sel = i; APP.render(); return; }
    if (s.sel === i) { s.sel = null; APP.render(); return; }

    var a = s.cards[s.sel];
    var b = c;
    if (a.kind === b.kind) { s.sel = i; APP.render(); return; }

    if (a.pid === b.pid) {
      a.done = true; b.done = true;
      s.matched++;
      s.combo++;
      if (s.combo > s.maxCombo) { s.maxCombo = s.combo; APP.store.recordCombo(s.combo); }
      s.score += 10 + (s.combo - 1) * 2;
      APP.store.recordCorrect(1);
      s.sel = null;
      if (s.matched === s.total) {
        s.finished = true;
        APP.clock.stop();
        s.result = APP.store.finishGame('match', s.matched, {perfect: true});
      }
    } else {
      a.wrong = true; b.wrong = true;
      s.combo = 0;
      s.sel = null;
    }
    APP.render();
  };

  /* ---------- 2. 60 秒冲刺 ---------- */
  function sprintItems(level, n) {
    var pool = playable(level);
    var picked = U.shuffle(pool).slice(0, n);
    return picked.map(function (it) {
      var target = short(it.cn), used = {}, distract = [];
      used[target] = 1;
      U.shuffle(pool).forEach(function (x) {
        if (distract.length >= 3) return;
        var s2 = short(x.cn);
        if (used[s2] || s2 === target) return;
        used[s2] = 1; distract.push(s2);
      });
      var opts = U.shuffle([target].concat(distract));
      return {id: it.id, prompt: it.w, opts: opts, a: opts.indexOf(target), cn: target};
    });
  }

  APP.actions.startSprint = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startSprint(); })) return;
    var items = sprintItems(APP.ui.level, 30);
    APP.session.sprint = {items: items, idx: 0, score: 0, hits: 0, combo: 0, maxCombo: 0, left: 60, finished: false};
    APP.clock.stop();
    APP.clock.start('sprint', sprintTick);
    APP.render();
  };

  APP.views.sprint = function () {
    var s = APP.session.sprint;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">🏃 60 秒冲刺</h1>' +
          '<p class="muted">看图选义不如看词选义：看到法语，选出正确中文。答错扣 3 秒。</p>' +
          '<div class="card" style="margin-top:12px">' + P.levelChips(APP.ui.level, 'setLevel') +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startSprint">开始 60 秒</button></div>'
      };
    }
    if (s.finished || s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        P.finish({title: '冲刺结束', score: s.score, total: s.idx, hits: s.hits, points: true, best: s.result ? s.result.best : 0, newBest: s.result && s.result.newBest, bonus: s.result && s.result.bonus, restart: 'startSprint'})};
    }
    var it = s.items[s.idx];
    var o = U.optionOrder({q: it.prompt + s.idx, opts: it.opts, a: it.a});
    var letters = 'ABCD';
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a>' +
        '<button class="chip" data-act="startSprint">重开</button></div>' +
        P.hud([
          ['得分', String(s.score), ''],
          ['连击', '×' + s.combo, s.combo > 1 ? 'hot' : ''],
          ['答对', String(s.hits || 0), 'lime']
        ]) +
        '<div class="timerbar"><i id="gameTimerBar" style="width:' + Math.max(0, s.left / 60 * 100) + '%"></i>' +
        '<span id="gameTimer">' + s.left + 's</span></div>' +
        '<div class="prompt"><div class="label">选择正确的中文意思</div>' +
        '<div class="cn" style="font-size:26px;font-family:var(--serif)">' + U.esc(it.prompt) + '</div></div>' +
        '<div class="opts" style="margin-top:12px">' + o.opts.map(function (t, i) {
          return '<button class="opt" data-act="sprintPick" data-i="' + i + '" data-c="' + o.correct + '">' +
            '<span class="k">' + letters[i] + '</span><span>' + U.esc(t) + '</span></button>';
        }).join('') + '</div>'
    };
  };

  APP.actions.sprintPick = function (el) {
    var s = APP.session.sprint;
    if (!s || s.finished) return;
    var correct = Number(el.dataset.c);
    var picked = Number(el.dataset.i);
    if (picked === correct) {
      s.score += 10 + s.combo * 2;
      s.hits = (s.hits || 0) + 1;
      s.combo++;
      if (s.combo > s.maxCombo) { s.maxCombo = s.combo; APP.store.recordCombo(s.combo); }
      APP.store.recordCorrect(1);
    } else {
      s.combo = 0;
      s.left = Math.max(0, s.left - 3);
      U.toast('错了：' + s.items[s.idx].prompt + ' = ' + s.items[s.idx].cn);
    }
    s.idx++;
    if (s.idx >= s.items.length) {
      s.finished = true;
      APP.clock.stop();
      s.result = APP.store.finishGame('sprint', s.score);
    }
    APP.render();
  };

  /* ---------- 3. 听音选义 ---------- */
  function audioItems(level, n) {
    var pool = playable(level);
    var picked = U.shuffle(pool).slice(0, n);
    return picked.map(function (it) {
      var target = short(it.cn), used = {}, distract = [];
      used[target] = 1;
      U.shuffle(pool).forEach(function (x) {
        if (distract.length >= 3) return;
        var s2 = short(x.cn);
        if (used[s2] || s2 === target) return;
        used[s2] = 1; distract.push(s2);
      });
      var opts = U.shuffle([target].concat(distract));
      return {id: it.id, fr: it.w, ex: it.ex, cn: target, opts: opts, a: opts.indexOf(target)};
    });
  }

  APP.actions.startAudio = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startAudio(); })) return;
    APP.session.audio = {items: audioItems(APP.ui.level, P.sessionSize(24)), idx: 0, score: 0, finished: false, auto: true};
    APP.clock.stop();
    APP.render();
  };

  APP.views.audio = function () {
    var s = APP.session.audio;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">🎧 听音选义</h1>' +
          '<p class="muted">只播放法语，选对中文意思。可以慢速与重听——这是最接近真实听力的练习。</p>' +
          '<div class="card" style="margin-top:12px">' + P.levelChips(APP.ui.level, 'setLevel') +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startAudio">开始 12 题</button></div>' +
          (APP.speech.supported ? '' : '<p class="small" style="color:var(--red);margin-top:10px">此浏览器不支持语音合成，无法播放。</p>')
      };
    }
    if (s.finished || s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        P.finish({title: '听音结束', score: s.score, total: s.items.length, best: s.result ? s.result.best : 0, newBest: s.result && s.result.newBest, bonus: s.result && s.result.bonus, restart: 'startAudio'})};
    }
    var it = s.items[s.idx];
    var o = U.optionOrder({q: it.fr + s.idx, opts: it.opts, a: it.a});
    var letters = 'ABCD';
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        P.hud([
          ['进度', (s.idx + 1) + '<span style="opacity:.45">/' + s.items.length + '</span>', ''],
          ['答对', String(s.score), 'lime'],
          ['题号', String(s.idx + 1), 'hot']
        ]) +
        '<div class="prompt audio-prompt" style="text-align:center">' +
        '<div class="label">听这段法语，选出意思</div>' +
        '<div class="row gap8" style="justify-content:center;margin:14px 0 6px">' +
        '<button class="btn primary" style="font-size:16px;padding:14px 22px" data-act="audioPlay">▶ 播放</button>' +
        '<button class="btn" data-act="audioSlow">🐢 慢速</button>' +
        '</div>' +
        (s.revealed ? '<div class="answerline">' + U.esc(it.ex) + '</div>' : '') +
        '</div>' +
        '<div class="opts" style="margin-top:12px">' + o.opts.map(function (t, i) {
          return '<button class="opt" data-act="audioPick" data-i="' + i + '" data-c="' + o.correct + '">' +
            '<span class="k">' + letters[i] + '</span><span>' + U.esc(t) + '</span></button>';
        }).join('') + '</div>' +
        (s.checked ? '<div class="verdict show ' + (s.lastOk ? 'ok' : 'no') + '">' +
          (s.lastOk ? '✅ 听对了！' : '❌ 正确意思是：' + U.esc(it.cn)) +
          '<div class="row gap6" style="margin-top:8px"><button class="btn btn-sm primary" data-act="audioNext">下一题 →</button></div>' +
          '</div>' : '')
    };
  };

  APP.actions.audioPlay = function () {
    var s = APP.session.audio;
    if (!s) return;
    APP.speech.speak(s.items[s.idx].fr);
  };
  APP.actions.audioSlow = function () {
    var s = APP.session.audio;
    if (!s) return;
    APP.speech.speak(s.items[s.idx].fr, {rate: 0.65});
  };
  APP.actions.audioPick = function (el) {
    var s = APP.session.audio;
    if (!s || s.checked) return;
    var ok = Number(el.dataset.i) === Number(el.dataset.c);
    s.checked = true;
    s.lastOk = ok;
    s.revealed = true;
    if (ok) { s.score++; APP.store.recordCorrect(1); }
    APP.render();
  };
  APP.actions.audioNext = function () {
    var s = APP.session.audio;
    if (!s) return;
    s.idx++;
    s.checked = false;
    s.lastOk = false;
    s.revealed = false;
    if (s.idx >= s.items.length) {
      s.finished = true;
      s.result = APP.store.finishGame('audio', s.score);
    }
    APP.render();
    var cur = s.items[s.idx];
    if (cur && !s.finished) APP.speech.speak(cur.fr);
  };

  /* ---------- 4. 变位冲刺（60 秒） ---------- */
  function cjItems(n) {
    var pool = P.conjPool(), out = [];
    for (var i = 0; i < n; i++) {
      var it = P.conjItem(pool);
      if (it) out.push(it);
    }
    return out;
  }

  APP.actions.startGConj = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startGConj(); })) return;
    if (!APP.loader.formsLoaded() && !APP.loader.formsFailed) {
      U.toast('正在载入变位词库…');
      APP.loader.loadForms().then(function () { APP.actions.startGConj(); })
        .catch(function () { APP.actions.startGConj(); });
      return;
    }
    var built = cjItems(60);
    if (!built.length) { U.toast('变位题库暂不可用'); return; }
    APP.session.gconj = {items: built, idx: 0, score: 0, hits: 0, wrong: 0, combo: 0, maxCombo: 0, left: 60, finished: false};
    APP.clock.stop();
    APP.clock.start('gconj', gconjTick);
    APP.render();
  };

  function gconjTick() {
    var s = APP.session.gconj;
    if (!s || s.finished) return;
    s.left--;
    var t = document.getElementById('gameTimer');
    var bar = document.getElementById('gameTimerBar');
    if (t) t.textContent = s.left + 's';
    if (bar) bar.style.width = Math.max(0, s.left / 60 * 100) + '%';
    if (s.left <= 0) {
      s.finished = true;
      APP.clock.stop();
      s.result = APP.store.finishGame('gconj', s.score, {perfect: s.hits > 0 && s.wrong === 0});
      APP.render();
    }
  }

  APP.views.gconj = function () {
    var s = APP.session.gconj;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">变位冲刺</h1>' +
          '<p class="muted">60 秒内看「时式 + 人称」选出正确变位。答对连击加分，答错扣 3 秒。</p>' +
          '<div class="card" style="margin-top:12px"><div class="muted small" style="margin-bottom:6px">难度</div>' +
          P.levelChips(APP.ui.level, 'setLevel') +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startGConj">开始 60 秒</button></div>'
      };
    }
    if (s.finished || s.idx >= s.items.length) {
      return {
        html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          P.finish({
            title: '变位结束', score: s.score, total: s.hits, hits: s.hits, points: true,
            best: s.result ? s.result.best : 0, newBest: s.result && s.result.newBest,
            bonus: s.result && s.result.bonus, restart: 'startGConj'
          })
      };
    }
    var it = s.items[s.idx];
    var o = U.optionOrder({q: it.inf + it.tenseLabel + it.person + s.idx, opts: it.opts, a: it.opts.indexOf(it.answer)});
    var letters = 'ABCD';
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a>' +
        '<button class="chip" data-act="startGConj">重开</button></div>' +
        P.hud([
          ['得分', String(s.score), ''],
          ['连击', '×' + s.combo, s.combo > 1 ? 'hot' : ''],
          ['答对', String(s.hits || 0), 'lime']
        ]) +
        '<div class="timerbar"><i id="gameTimerBar" style="width:' + Math.max(0, s.left / 60 * 100) + '%"></i>' +
        '<span id="gameTimer">' + s.left + 's</span></div>' +
        '<div class="prompt"><div class="label">' + U.esc(it.tenseLabel) + ' · ' + U.esc(it.person) + '</div>' +
        '<div class="row between" style="align-items:baseline">' +
        '<span class="cn fr" style="font-size:26px">' + U.esc(it.inf) + '</span>' +
        '<span class="muted small">' + U.esc(it.cn) + '</span></div></div>' +
        '<div class="opts" style="margin-top:12px">' + o.opts.map(function (t, i) {
          return '<button class="opt" data-act="gconjPick" data-i="' + i + '" data-c="' + o.correct + '">' +
            '<span class="k">' + letters[i] + '</span><span class="fr">' + U.esc(t) + '</span></button>';
        }).join('') + '</div>'
    };
  };

  APP.actions.gconjPick = function (el) {
    var s = APP.session.gconj;
    if (!s || s.finished) return;
    var correct = Number(el.dataset.c), picked = Number(el.dataset.i);
    if (picked === correct) {
      s.score += 10 + s.combo * 2;
      s.hits = (s.hits || 0) + 1;
      s.combo++;
      if (s.combo > s.maxCombo) { s.maxCombo = s.combo; APP.store.recordCombo(s.combo); }
      APP.store.recordCorrect(1);
    } else {
      s.combo = 0;
      s.left = Math.max(0, s.left - 3);
    }
    s.idx++;
    if (s.left <= 0) { s.finished = true; APP.clock.stop(); s.result = APP.store.finishGame('gconj', s.score, {perfect: false}); }
    APP.render();
  };
})();
