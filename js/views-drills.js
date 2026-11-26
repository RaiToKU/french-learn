/* 视图：训练（组句 / 听写 / 语法小测） */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part;

  function tokensOf(sentence) {
    return sentence.split(/\s+/).map(function (t) {
      return t.replace(/^[«""]+/, '').replace(/[.,!?;:»""…]+$/, '');
    }).filter(Boolean);
  }

  function sentencePool(level) {
    var out = [];
    APP.catalog.lexicon.forEach(function (it) {
      if (level !== 'ALL' && it.lv !== level) return;
      if (!it.ex) return;
      out.push({id: it.id, fr: it.ex, cn: it.exCn});
    });
    APP.catalog.frames.forEach(function (it) {
      if (level !== 'ALL' && it.lv !== level) return;
      out.push({id: it.id, fr: it.fr, cn: it.cn});
    });
    if (level === 'ALL') {
      APP.catalog.chunks.forEach(function (it) {
        out.push({id: it.id, fr: it.fr, cn: it.cn});
      });
    }
    return out.filter(function (x) {
      var n = tokensOf(x.fr).length;
      return n >= 4 && n <= 11;
    });
  }

  function sample(level, n) {
    var pool = sentencePool(level), seen = {}, uniq = [];
    pool.forEach(function (x) { if (!seen[x.fr]) { seen[x.fr] = 1; uniq.push(x); } });
    return U.shuffle(uniq).slice(0, Math.min(n, uniq.length));
  }

  function levelBar() {
    return '<div class="muted small" style="margin-bottom:6px">难度</div>' +
      P.levelChips(APP.ui.level, 'setLevel');
  }

  function progressLine(s) {
    var n = s.items.length, i = Math.min(s.idx + 1, n);
    var acc = (s.answered || 0) ? Math.round(s.score / s.answered * 100) : 0;
    return P.hud([
      ['进度', i + '<span style="opacity:.45">/' + n + '</span>', ''],
      ['正确', String(s.score), 'lime'],
      ['正确率', acc + '<span style="opacity:.45">%</span>', acc >= 70 ? 'lime' : 'hot']
    ]);
  }

  function finishIfNeeded(s, key) {
    if (!s.finished) {
      s.finished = true;
      s.result = APP.store.finishGame(key, s.score, {perfect: s.answered > 0 && s.score === s.answered});
    }
    return s.result || {};
  }

  function resultScreen(s, key, title) {
    var r = finishIfNeeded(s, key);
    return P.finish({
      title: title, score: s.score, total: s.answered || s.items.length,
      best: r.best, newBest: r.newBest, bonus: r.bonus, restart: s.restart
    });
  }

  /* ---------------- 组句训练 ---------------- */
  APP.actions.startBuild = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startBuild(); })) return;
    var items = sample(APP.ui.level, P.sessionSize(12)).map(function (x) {
      var toks = U.shuffle(tokensOf(x.fr).map(function (t, i) { return {t: t, id: i}; }));
      return {id: x.id, cn: x.cn, answer: x.fr, tokens: toks, chosen: [], checked: false, ok: false, counted: false};
    });
    APP.session.build = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startBuild'};
    APP.render();
  };

  APP.views.build = function () {
    var s = APP.session.build;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">🧱 组句训练</h1>' +
          '<p class="muted">看中文，把打乱的词排成一句话。句型素材来自核心语库与情景语库。</p>' +
          '<div class="card" style="margin-top:12px">' + levelBar() +
          '<div class="muted small" style="margin:10px 0 6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startBuild">开始练习</button></div>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'build', '组句完成')};
    }

    var it = s.items[s.idx];
    var chosen = it.chosen.map(function (cid) {
      return it.tokens.filter(function (x) { return x.id === cid; })[0];
    }).filter(Boolean);
    var pool = it.tokens.filter(function (t) { return it.chosen.indexOf(t.id) < 0; });

    var verdict = '';
    if (it.checked) {
      verdict = '<div class="verdict show ' + (it.ok ? 'ok' : 'no') + '">' +
        (it.ok ? '✅ 完全正确！' : '❌ 还差一点') +
        '<div class="answerline">' + U.esc(it.answer) + '</div>' +
        '<div class="row wrap gap6" style="margin-top:8px">' +
        P.say(it.answer, U.ic.sound + ' 听正确句子') +
        (it.ok ? '' : '<button class="btn btn-sm" data-act="buildRetry">再试一次</button>') +
        '<button class="btn btn-sm primary" data-act="buildNext">下一题 →</button>' +
        '</div></div>';
    }

    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="prompt"><div class="label">把词排成这句话</div>' +
        '<div class="cn">' + U.esc(it.cn) + '</div></div>' +
        '<div class="slot ' + (chosen.length ? 'filled' : '') + '" style="margin-top:12px">' +
        (chosen.length ? chosen.map(function (t) {
          return '<button class="tok in-slot" data-act="buildUnpick" data-id="' + t.id + '">' + U.esc(t.t) + '</button>';
        }).join('') : '<span class="ph">点击下方词块，按顺序排列</span>') +
        '</div>' +
        '<div class="pool">' + pool.map(function (t) {
          return '<button class="tok" data-act="buildPick" data-id="' + t.id + '">' + U.esc(t.t) + '</button>';
        }).join('') + '</div>' +
        '<div class="row wrap gap8" style="margin-top:14px">' +
        '<button class="btn primary" data-act="buildCheck" ' + (it.checked ? 'disabled' : '') + '>检查</button>' +
        '<button class="btn" data-act="buildClear" ' + (it.checked ? 'disabled' : '') + '>清空重排</button>' +
        '<button class="btn ghost" data-act="buildSkip">跳过</button>' +
        '</div>' + verdict
    };
  };

  /* ---------------- 听力听写 ---------------- */
  APP.actions.startListen = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startListen(); })) return;
    var items = sample(APP.ui.level, P.sessionSize(12)).map(function (x) {
      return {id: x.id, fr: x.fr, cn: x.cn, typed: '', checked: false, ok: false, revealed: false, counted: false};
    });
    APP.session.listen = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startListen', auto: true};
    APP.render();
  };

  APP.views.listen = function () {
    var s = APP.session.listen;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">✍️ 听力听写</h1>' +
          '<p class="muted">点播放听一句法语，凭听到的内容写下来（重音符号可不写，判分忽略大小写与标点）。</p>' +
          '<div class="card" style="margin-top:12px">' + levelBar() +
          '<div class="muted small" style="margin:10px 0 6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startListen">开始练习</button></div>' +
          (APP.speech.supported ? '' : '<p class="small" style="color:var(--red);margin-top:10px">此浏览器不支持语音合成，听写无法播放音频。</p>')
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'listen', '听写完成')};
    }

    var it = s.items[s.idx];
    var verdict = '';
    if (it.checked) {
      verdict = '<div class="verdict show ' + (it.ok ? 'ok' : 'no') + '">' +
        (it.ok ? '✅ 听对了！' : '❌ 原句是：') +
        '<div class="answerline">' + U.esc(it.fr) + '</div>' +
        '<div class="muted small" style="margin-top:4px">' + U.esc(it.cn) + '</div>' +
        '<div class="row wrap gap6" style="margin-top:8px">' +
        P.say(it.fr, U.ic.sound + ' 再听一遍') +
        '<button class="btn btn-sm primary" data-act="listenNext">下一题 →</button></div></div>';
    }

    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="prompt" style="text-align:center">' +
        '<div class="label">听写这一句</div>' +
        '<button class="btn primary" style="font-size:16px;padding:14px 22px;margin:8px 0" data-act="listenPlay">▶ 播放</button>' +
        '<div class="row gap8" style="justify-content:center">' +
        '<button class="btn btn-sm" data-act="listenSlow">🐢 慢速</button>' +
        (it.revealed ? '<span class="small muted">译文：' + U.esc(it.cn) + '</span>' : '<button class="btn btn-sm" data-act="listenReveal">💡 看中文提示</button>') +
        '</div></div>' +
        '<input class="input" id="listenInput" data-input="listenType" placeholder="写下你听到的法语句子…" value="' + U.esc(it.typed) + '" style="margin-top:14px" ' + (it.checked ? 'disabled' : '') + ' aria-label="听写输入框">' +
        '<div class="row wrap gap8" style="margin-top:12px">' +
        '<button class="btn primary" data-act="listenCheck" ' + (it.checked ? 'disabled' : '') + '>检查</button>' +
        '<button class="btn ghost" data-act="listenSkip">跳过</button>' +
        '</div>' + verdict
    };
  };

  /* ---------------- 语法小测 ---------------- */
  APP.actions.startQuiz = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startQuiz(); })) return;
    var pool = [];
    FR.GRAMMAR.forEach(function (g) {
      (g.quiz || []).forEach(function (q, i) {
        pool.push({q: q, key: g.id + ':' + i, lv: g.lv, title: g.title});
      });
    });
    var items = U.shuffle(pool).slice(0, P.sessionSize(40)).map(function (x) {
      return {q: x.q, key: x.key, lv: x.lv, title: x.title, picked: null};
    });
    APP.session.quiz = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startQuiz'};
    APP.render();
  };

  APP.views.quiz = function () {
    var s = APP.session.quiz;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">📐 语法小测</h1>' +
          '<p class="muted">随机抽 10 题，覆盖 A1–B2 语法点。答错会给出解析。</p>' +
          '<button class="btn primary wide" style="margin-top:14px" data-act="startQuiz">开始练习</button>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'quiz', '小测完成')};
    }
    var it = s.items[s.idx];
    var o = U.optionOrder(it.q);
    var letters = 'ABCD';
    var opts = o.opts.map(function (t, i) {
      var cls = '';
      if (it.picked != null) {
        if (i === o.correct) cls = 'right';
        else if (i === it.picked) cls = 'wrong';
      }
      return '<button class="opt ' + cls + '" data-act="dquizPick" data-i="' + i + '" data-c="' + o.correct + '">' +
        '<span class="k">' + letters[i] + '</span><span>' + U.esc(t) + '</span></button>';
    }).join('');
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="progressline" style="margin-bottom:6px"><span class="tag lv">' + it.lv + '</span>' +
        '<span class="muted small">' + U.esc(it.title) + '</span></div>' +
        '<div class="q"><div class="qt" style="font-size:16px">' + U.esc(it.q.q) + '</div>' +
        '<div class="opts">' + opts + '</div>' +
        (it.picked != null ? '<div class="why show">' + U.esc(it.q.why) +
          '<div style="margin-top:10px"><button class="btn btn-sm primary" data-act="dquizNext">下一题 →</button></div></div>' : '') +
        '</div>'
    };
  };

  /* ---------------- 填空：语境里补出那个词 ---------------- */
  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function clozeHit(it) {
    var re = new RegExp('(^|[^A-Za-zÀ-ÿ])(' + escRe(it.w) + ')(?=[^A-Za-zÀ-ÿ]|$)', 'i');
    var m = re.exec(it.ex);
    if (!m) return null;
    var start = m.index + m[1].length;
    return {before: it.ex.slice(0, start), after: it.ex.slice(start + m[2].length)};
  }

  function hintOf(w) {
    return w.charAt(0) + ' · '.concat(new Array(Math.max(1, w.length - 1)).fill('·').join('')) +
      ' (' + w.length + ' 个字母)';
  }

  APP.actions.startClose = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startClose(); })) return;
    var lv = APP.ui.level;
    var pool = APP.catalog.lexicon.filter(function (it) {
      if (lv !== 'ALL' && it.lv !== lv) return false;
      return !!(it.ex && it.w && clozeHit(it));
    });
    var items = U.shuffle(pool).slice(0, P.sessionSize(40)).map(function (it) {
      var h = clozeHit(it);
      return {
        id: it.id, w: it.w, lv: it.lv, cn: it.cn, exCn: it.exCn || '',
        before: h.before, after: h.after, typed: '', checked: false, ok: false, revealed: false, counted: false
      };
    });
    APP.session.close = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startClose'};
    APP.render();
  };

  APP.views.close = function () {
    var s = APP.session.close;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">补全填空</h1>' +
          '<p class="muted">给一句真实的例句，中间挖掉一个词，靠语境把它写回来。重音符号可以不写。</p>' +
          '<div class="card" style="margin-top:12px">' + levelBar() +
          '<div class="muted small" style="margin:10px 0 6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startClose">开始练习</button></div>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'close', '填空完成')};
    }
    var it = s.items[s.idx];
    var verdict = '';
    if (it.checked) {
      verdict = '<div class="verdict show ' + (it.ok ? 'ok' : 'no') + '">' +
        (it.ok ? '✅ 就是这个词' : '❌ 答案是') +
        '<div class="answerline">' + U.esc(it.w) + ' — ' + U.esc(it.cn) + '</div>' +
        (it.exCn ? '<div class="muted small" style="margin-top:4px">' + U.esc(it.exCn) + '</div>' : '') +
        '<div class="row wrap gap6" style="margin-top:8px">' +
        '<button class="btn btn-sm primary" data-act="closeNext">下一题 →</button></div></div>';
    }
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="prompt">' +
        '<div class="label"><span class="tag lv">' + it.lv + '</span> 补出空缺的词</div>' +
        '<p class="passage" style="font-size:17px;margin-top:6px">' +
        U.esc(it.before) + '<span class="blank">' + (it.checked ? U.esc(it.w) : '＿＿＿') + '</span>' + U.esc(it.after) +
        '</p>' +
        (it.revealed && !it.checked ? '<div class="muted small" style="margin-top:8px">提示：' + U.esc(it.cn) + ' · ' + hintOf(it.w) + '</div>' : '') +
        '</div>' +
        '<input class="input" id="closeInput" data-input="closeType" placeholder="写出缺的词…" value="' + U.esc(it.typed) + '" style="margin-top:14px" ' + (it.checked ? 'disabled' : '') + ' aria-label="填空输入框">' +
        '<div class="row wrap gap8" style="margin-top:12px">' +
        '<button class="btn primary" data-act="closeCheck" ' + (it.checked ? 'disabled' : '') + '>检查</button>' +
        (it.revealed ? '' : '<button class="btn" data-act="closeHint" ' + (it.checked ? 'disabled' : '') + '>看提示</button>') +
        '<button class="btn ghost" data-act="closeSkip">跳过</button>' +
        '</div>' + verdict
    };
  };

  /* ---------------- 变位速练 ---------------- */
  var PERSONS = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];

  function conjOpts(v, tense, pi) {
    var answer = v[tense][pi], seen = {}, opts = [answer];
    seen[answer] = 1;
    var idxs = [0, 1, 2, 3, 4, 5].filter(function (i) { return i !== pi; });
    var sameTense = U.shuffle(idxs), otherTense = U.shuffle(FR.VERB_TENSES.map(function (t) { return t.key; })
      .filter(function (k) { return k !== tense; }));
    function push(form) {
      if (!form || seen[form] || opts.length >= 4) return;
      seen[form] = 1; opts.push(form);
    }
    /* 两个同时间不同人称（考词尾）+ 一个其他时式（考时式区分） */
    sameTense.forEach(function (i) { if (opts.length < 3) push(v[tense][i]); });
    otherTense.forEach(function (k) { U.shuffle([0, 1, 2, 3, 4, 5]).forEach(function (i) { push(v[k][i]); }); });
    return U.shuffle(opts);
  }

  APP.actions.startConj = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startConj(); })) return;
    var keys = FR.VERB_TENSES.map(function (t) { return t.key; });
    var items = U.shuffle(FR.VERBS).slice(0, Math.min(P.sessionSize(20), FR.VERBS.length)).map(function (v) {
      var tk = keys[Math.floor(Math.random() * keys.length)];
      var pi = Math.floor(Math.random() * 6);
      var label = (FR.VERB_TENSES.filter(function (t) { return t.key === tk; })[0] || {}).label || tk;
      return {
        inf: v.inf, cn: v.cn, tense: tk, tenseLabel: label, pi: pi,
        person: PERSONS[pi], pronominal: !!v.pronominal,
        answer: v[tk][pi], opts: conjOpts(v, tk, pi), picked: null, counted: false
      };
    });
    APP.session.conj = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startConj'};
    APP.render();
  };

  APP.views.conj = function () {
    var s = APP.session.conj;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">变位速练</h1>' +
          '<p class="muted">给动词、时式和主语，选出正确的变位形式。选项里混了同时式其他人称和其他时式，专治「形近混淆」。</p>' +
          '<div class="card" style="margin-top:12px"><div class="muted small" style="margin-bottom:6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startConj">开始练习</button></div>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'conj', '变位完成')};
    }
    var it = s.items[s.idx];
    var letters = 'ABCD';
    var opts = it.opts.map(function (form, i) {
      var cls = '';
      if (it.picked != null) {
        if (form === it.answer) cls = 'right';
        else if (i === it.picked) cls = 'wrong';
      }
      return '<button class="opt ' + cls + '" data-act="conjPick" data-i="' + i + '">' +
        '<span class="k">' + letters[i] + '</span><span class="fr">' + U.esc(form) + '</span></button>';
    }).join('');
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="prompt">' +
        '<div class="label">' + U.esc(it.tenseLabel) + ' · ' + U.esc(it.person) + '</div>' +
        '<div class="row between" style="align-items:baseline">' +
        '<span class="verb-inf fr">' + U.esc(it.inf) + '</span>' +
        '<span class="muted small">' + U.esc(it.cn) + '</span></div>' +
        '</div>' +
        '<div class="opts" style="margin-top:12px">' + opts + '</div>' +
        (it.picked != null ? '<div class="verdict show ' + (it.opts[it.picked] === it.answer ? 'ok' : 'no') + '">' +
          (it.opts[it.picked] === it.answer ? '✅ 正确' : '❌ 正确形式是 ' + U.esc(it.answer)) +
          '<div class="answerline fr">' + U.esc(it.person) + ' ' + U.esc(it.answer) + '</div>' +
          '<div class="row wrap gap6" style="margin-top:8px">' +
          P.say(it.person + ' ' + it.answer, U.ic.sound + ' 听一听') +
          '<button class="btn btn-sm primary" data-act="conjNext">下一题 →</button></div></div>' : '')
    };
  };

  /* ---------------- 中→法 拼写（主动产出） ---------------- */
  APP.actions.startSpell = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startSpell(); })) return;
    var lv = APP.ui.level;
    var pool = APP.catalog.lexicon.filter(function (it) {
      if (lv !== 'ALL' && it.lv !== lv) return false;
      return it.w.length >= 3 && it.w.length <= 22 && String(it.cn).length <= 26;
    });
    var items = U.shuffle(pool).slice(0, P.sessionSize(40)).map(function (it) {
      return {id: it.id, w: it.w, cn: it.cn, pos: it.pos, lv: it.lv, typed: '', checked: false, ok: false, revealed: false, counted: false};
    });
    APP.session.spell = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startSpell'};
    APP.render();
  };

  APP.views.spell = function () {
    var s = APP.session.spell;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">中译法拼写</h1>' +
          '<p class="muted">只看中文，把法语词写出来——这是最接近「真的会用」的练法，专治只会认不会写。</p>' +
          '<div class="card" style="margin-top:12px">' + levelBar() +
          '<div class="muted small" style="margin:10px 0 6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startSpell">开始练习</button></div>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'spell', '拼写完成')};
    }
    var it = s.items[s.idx];
    var verdict = '';
    if (it.checked) {
      verdict = '<div class="verdict show ' + (it.ok ? 'ok' : 'no') + '">' +
        (it.ok ? '✅ 写对了' : '❌ 正确写法') +
        '<div class="answerline fr">' + U.esc(it.w) + '</div>' +
        '<div class="row wrap gap6" style="margin-top:8px">' +
        P.say(it.w, U.ic.sound + ' 听发音') +
        '<button class="btn btn-sm primary" data-act="spellNext">下一题 →</button></div></div>';
    }
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="prompt" style="text-align:center">' +
        '<div class="label"><span class="tag lv">' + it.lv + '</span> 写出对应的法语词</div>' +
        '<div class="cn" style="font-size:20px;margin-top:6px">' + U.esc(it.cn) + '</div>' +
        '<div class="muted small" style="margin-top:6px">' + U.esc(it.pos || '') + (it.revealed && !it.checked ? ' · 提示：' + hintOf(it.w) : '') + '</div>' +
        '</div>' +
        '<input class="input" id="spellInput" data-input="spellType" placeholder="法语写法…" value="' + U.esc(it.typed) + '" style="margin-top:14px" ' + (it.checked ? 'disabled' : '') + ' aria-label="拼写输入框">' +
        '<div class="row wrap gap8" style="margin-top:12px">' +
        '<button class="btn primary" data-act="spellCheck" ' + (it.checked ? 'disabled' : '') + '>检查</button>' +
        (it.revealed ? '' : '<button class="btn" data-act="spellHint" ' + (it.checked ? 'disabled' : '') + '>看提示</button>') +
        '<button class="btn ghost" data-act="spellSkip">跳过</button>' +
        '</div>' + verdict
    };
  };

  /* ---------------- 快判对错 ---------------- */
  APP.actions.startJudge = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startJudge(); })) return;
    var lv = APP.ui.level;
    var pool = APP.catalog.lexicon.filter(function (it) {
      return (lv === 'ALL' || it.lv === lv) && it.w.length <= 14 && String(it.cn).length <= 20;
    });
    var picked = U.shuffle(pool).slice(0, P.sessionSize(40));
    var items = picked.map(function (it, i) {
      var truth = Math.random() < 0.5;
      var other = picked[(i + 1 + Math.floor(Math.random() * (picked.length - 1))) % picked.length];
      var shown = (truth || !other || other.cn === it.cn) ? it.cn : other.cn;
      return {id: it.id, w: it.w, cn: it.cn, shown: shown, truth: shown === it.cn, ans: null, counted: false};
    });
    APP.session.judge = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startJudge'};
    APP.render();
  };

  APP.views.judge = function () {
    var s = APP.session.judge;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">快判对错</h1>' +
          '<p class="muted">给出一个法语词和一条中文释义，判断配得对不对。速度优先，别想太久。</p>' +
          '<div class="card" style="margin-top:12px">' + levelBar() +
          '<div class="muted small" style="margin:10px 0 6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startJudge">开始练习</button></div>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'judge', '判断完成')};
    }
    var it = s.items[s.idx];
    var done = it.ans != null;
    var right = done && ((it.ans === 'yes') === it.truth);
    var verdict = done ? '<div class="verdict show ' + (right ? 'ok' : 'no') + '">' +
      (right ? '✅ 判对了' : '❌ 判断错了') +
      '<div class="answerline fr">' + U.esc(it.w) + ' — ' + U.esc(it.cn) + '</div>' +
      '<div class="row wrap gap6" style="margin-top:8px">' +
      P.say(it.w, U.ic.sound + ' 听发音') +
      '<button class="btn btn-sm primary" data-act="judgeNext">下一题 →</button></div></div>' : '';
    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a></div>' +
        progressLine(s) +
        '<div class="prompt" style="text-align:center">' +
        '<div class="label">配得对吗？</div>' +
        '<div class="cn fr" style="font-size:30px;margin-top:6px">' + U.esc(it.w) + '</div>' +
        '<div class="note" style="margin-top:12px;display:inline-block;font-size:15px">' + U.esc(it.shown) + '</div>' +
        '</div>' +
        '<div class="judge-row">' +
        '<button class="judge-btn yes ' + (it.ans === 'yes' ? 'picked' : '') + '" data-act="judgePick" data-v="yes" ' + (done ? 'disabled' : '') + '>✓ 对得上</button>' +
        '<button class="judge-btn no ' + (it.ans === 'no' ? 'picked' : '') + '" data-act="judgePick" data-v="no" ' + (done ? 'disabled' : '') + '>✗ 配错了</button>' +
        '</div>' + verdict
    };
  };

  /* ---------------- 综合挑战（随机混练） ---------------- */
  function mixLexicon(lv) {
    return APP.catalog.lexicon.filter(function (it) {
      return (lv === 'ALL' || it.lv === lv) && it.w.length <= 16;
    });
  }

  function mixItem(kind, lv) {
    var pool = mixLexicon(lv);
    if (!pool.length) return null;
    var it = pool[Math.floor(Math.random() * pool.length)];
    if (kind === 'judge') {
      var other = pool[Math.floor(Math.random() * pool.length)];
      var truth = Math.random() < 0.5;
      var shown = (truth || other.cn === it.cn) ? it.cn : other.cn;
      return {kind: 'judge', w: it.w, cn: it.cn, shown: shown, truth: shown === it.cn, ans: null, counted: false};
    }
    if (kind === 'close') {
      var hit = clozeHit(it);
      if (!hit) return null;
      return {kind: 'close', w: it.w, cn: it.cn, exCn: it.exCn || '', before: hit.before, after: hit.after,
        typed: '', checked: false, ok: false, counted: false};
    }
    if (kind === 'spell') {
      return {kind: 'spell', w: it.w, cn: it.cn, pos: it.pos, typed: '', checked: false, ok: false, counted: false};
    }
    if (kind === 'conj') {
      var v = FR.VERBS[Math.floor(Math.random() * FR.VERBS.length)];
      var tk = FR.VERB_TENSES[Math.floor(Math.random() * FR.VERB_TENSES.length)].key;
      var pi = Math.floor(Math.random() * 6);
      return {kind: 'conj', inf: v.inf, cn: v.cn, person: PERSONS[pi],
        tenseLabel: (FR.VERB_TENSES.filter(function (t) { return t.key === tk; })[0] || {}).label || tk,
        answer: v[tk][pi], opts: conjOpts(v, tk, pi), picked: null, counted: false};
    }
    /* gram */
    var g = FR.GRAMMAR[Math.floor(Math.random() * FR.GRAMMAR.length)];
    var qs = g.quiz || [];
    if (!qs.length) return null;
    var q = qs[Math.floor(Math.random() * qs.length)];
    return {kind: 'gram', q: q, title: g.title, lv: g.lv, picked: null, counted: false};
  }

  APP.actions.startMix = function () {
    if (APP.loader.ensureAll(function () { APP.actions.startMix(); })) return;
    var kinds = ['judge', 'close', 'spell', 'conj', 'gram'];
    var n = P.sessionSize(30), items = [], guard = 0;
    while (items.length < n && guard++ < n * 12) {
      var x = mixItem(kinds[Math.floor(Math.random() * kinds.length)], APP.ui.level);
      if (x) items.push(x);
    }
    APP.session.mix = {items: items, idx: 0, score: 0, answered: 0, finished: false, restart: 'startMix'};
    APP.render();
  };

  APP.views.mix = function () {
    var s = APP.session.mix;
    if (!s) {
      return {
        html:
          '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
          '<h1 class="game-title">综合挑战</h1>' +
          '<p class="muted">每道题随机换花样：判断对错、例句挖空、变位、拼写、语法题轮着来。每次打开顺序和题型都不一样。</p>' +
          '<div class="card" style="margin-top:12px">' + levelBar() +
          '<div class="muted small" style="margin:10px 0 6px">本次题量</div>' + P.countChips(APP.ui.count) +
          '<button class="btn primary wide" style="margin-top:12px" data-act="startMix">开始练习</button></div>'
      };
    }
    if (s.idx >= s.items.length) {
      return {html: '<div class="row between" style="margin-bottom:10px"><a class="chip" href="#/games">← 游戏</a></div>' +
        resultScreen(s, 'mix', '挑战完成')};
    }
    var it = s.items[s.idx];
    var letters = 'ABCD', body = '', verdict = '';

    if (it.kind === 'judge') {
      var right = it.ans != null && ((it.ans === 'yes') === it.truth);
      body = '<div class="prompt" style="text-align:center">' +
        '<div class="label">配得对吗？</div>' +
        '<div class="cn fr" style="font-size:28px;margin-top:6px">' + U.esc(it.w) + '</div>' +
        '<div class="note" style="margin-top:12px;display:inline-block">' + U.esc(it.shown) + '</div></div>' +
        '<div class="judge-row">' +
        '<button class="judge-btn yes ' + (it.ans === 'yes' ? 'picked' : '') + '" data-act="mixPick" data-v="yes" ' + (it.ans ? 'disabled' : '') + '>✓ 对得上</button>' +
        '<button class="judge-btn no ' + (it.ans === 'no' ? 'picked' : '') + '" data-act="mixPick" data-v="no" ' + (it.ans ? 'disabled' : '') + '>✗ 配错了</button>' +
        '</div>';
      if (it.ans != null) {
        verdict = '<div class="verdict show ' + (right ? 'ok' : 'no') + '">' + (right ? '✅ 判对了' : '❌ 判断错了') +
          '<div class="answerline fr">' + U.esc(it.w) + ' — ' + U.esc(it.cn) + '</div>' +
          '<button class="btn btn-sm primary" style="margin-top:8px" data-act="mixNext">下一题 →</button></div>';
      }
    } else if (it.kind === 'close') {
      body = '<div class="prompt"><div class="label">补出空缺的词</div>' +
        '<p class="passage" style="font-size:17px;margin-top:6px">' + U.esc(it.before) +
        '<span class="blank">' + (it.checked ? U.esc(it.w) : '＿＿＿') + '</span>' + U.esc(it.after) + '</p></div>' +
        '<input class="input" id="mixInput" data-input="mixType" value="' + U.esc(it.typed) + '" placeholder="写出缺的词…" style="margin-top:12px" ' + (it.checked ? 'disabled' : '') + '>' +
        '<div class="row wrap gap8" style="margin-top:12px">' +
        '<button class="btn primary" data-act="mixCheck" ' + (it.checked ? 'disabled' : '') + '>检查</button>' +
        '<button class="btn ghost" data-act="mixNext">跳过</button></div>';
      if (it.checked) {
        verdict = '<div class="verdict show ' + (it.ok ? 'ok' : 'no') + '">' +
          (it.ok ? '✅ 正确' : '❌ 答案是 ' + U.esc(it.w)) + '<div class="muted small">' + U.esc(it.cn) + '</div>' +
          '<button class="btn btn-sm primary" style="margin-top:8px" data-act="mixNext">下一题 →</button></div>';
      }
    } else if (it.kind === 'spell') {
      body = '<div class="prompt" style="text-align:center"><div class="label">写出对应的法语词</div>' +
        '<div class="cn" style="font-size:20px;margin-top:6px">' + U.esc(it.cn) + '</div></div>' +
        '<input class="input" id="mixInput" data-input="mixType" value="' + U.esc(it.typed) + '" placeholder="法语写法…" style="margin-top:12px" ' + (it.checked ? 'disabled' : '') + '>' +
        '<div class="row wrap gap8" style="margin-top:12px">' +
        '<button class="btn primary" data-act="mixCheck" ' + (it.checked ? 'disabled' : '') + '>检查</button>' +
        '<button class="btn ghost" data-act="mixNext">跳过</button></div>';
      if (it.checked) {
        verdict = '<div class="verdict show ' + (it.ok ? 'ok' : 'no') + '">' +
          (it.ok ? '✅ 写对了' : '❌ 正确写法 ') + '<div class="answerline fr">' + U.esc(it.w) + '</div>' +
          '<button class="btn btn-sm primary" style="margin-top:8px" data-act="mixNext">下一题 →</button></div>';
      }
    } else if (it.kind === 'conj') {
      var co = U.optionOrder({q: it.inf + it.tenseLabel + it.person, opts: it.opts, a: it.opts.indexOf(it.answer)});
      body = '<div class="prompt"><div class="label">' + U.esc(it.tenseLabel) + ' · ' + U.esc(it.person) + '</div>' +
        '<div class="row between" style="align-items:baseline">' +
        '<span class="cn fr" style="font-size:24px">' + U.esc(it.inf) + '</span>' +
        '<span class="muted small">' + U.esc(it.cn) + '</span></div></div>' +
        '<div class="opts" style="margin-top:12px">' + co.opts.map(function (t, i) {
          return '<button class="opt" data-act="mixPick" data-i="' + i + '" data-c="' + co.correct + '">' +
            '<span class="k">' + letters[i] + '</span><span class="fr">' + U.esc(t) + '</span></button>';
        }).join('') + '</div>';
      if (it.picked != null) {
        verdict = '<div class="verdict show ' + (co.opts[it.picked] === it.answer ? 'ok' : 'no') + '">' +
          (co.opts[it.picked] === it.answer ? '✅ 正确' : '❌ 正确形式是 ' + U.esc(it.answer)) +
          '<button class="btn btn-sm primary" style="margin-top:8px" data-act="mixNext">下一题 →</button></div>';
      }
    } else {
      var go = U.optionOrder(it.q);
      body = '<div class="q"><div class="qt" style="font-size:16px">' + U.esc(it.q.q) + '</div>' +
        '<div class="opts">' + go.opts.map(function (t, i) {
          return '<button class="opt ' + (it.picked != null ? (i === go.correct ? 'right' : (i === it.picked ? 'wrong' : '')) : '') +
            '" data-act="mixPick" data-i="' + i + '" data-c="' + go.correct + '">' +
            '<span class="k">' + letters[i] + '</span><span>' + U.esc(t) + '</span></button>';
        }).join('') + '</div></div>';
      if (it.picked != null) {
        verdict = '<div class="why show">' + U.esc(it.q.why) +
          '<button class="btn btn-sm primary" style="margin-top:8px" data-act="mixNext">下一题 →</button></div>';
      }
    }

    return {
      html:
        '<div class="row between" style="margin-bottom:8px"><a class="chip" href="#/games">← 退出</a>' +
        '<span class="chip">' + (it.kind === 'judge' ? '判断' : it.kind === 'close' ? '填空' : it.kind === 'spell' ? '拼写' : it.kind === 'conj' ? '变位' : '语法') + '</span></div>' +
        progressLine(s) + body + verdict
    };
  };
})();
