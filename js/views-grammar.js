/* 视图：语法字典（A1–B2 全覆盖 + 覆盖清单）/ 动词变位速查 */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part = APP.part || {};

  /* ---------- 通用题目渲染（精读 / 语法 / 小测共用） ---------- */
  P.quizHTML = function (q, key) {
    var o = U.optionOrder(q);
    var picked = APP.ui.quiz[key];
    var letters = 'ABCD';
    var opts = o.opts.map(function (t, i) {
      var cls = '';
      if (picked != null) {
        if (i === o.correct) cls = 'right';
        else if (i === picked) cls = 'wrong';
      }
      return '<button class="opt ' + cls + '" data-act="quizPick" data-key="' + key + '" data-i="' + i + '" data-c="' + o.correct + '">' +
        '<span class="k">' + letters[i] + '</span><span>' + U.esc(t) + '</span></button>';
    }).join('');
    return '<div class="q" data-qkey="' + key + '">' +
      '<div class="qt">' + U.esc(q.q) + '</div>' +
      '<div class="opts">' + opts + '</div>' +
      '<div class="why ' + (picked != null ? 'show' : '') + '">' + U.esc(q.why) + '</div>' +
      '</div>';
  };

  function grammarFiltered() {
    var ui = APP.ui;
    var q = (ui.gramQuery || '').trim().toLowerCase();
    return FR.GRAMMAR.filter(function (g) {
      if (ui.gramLevel !== 'ALL' && g.lv !== ui.gramLevel) return false;
      if (ui.gramCat !== 'ALL' && g.cat !== ui.gramCat) return false;
      if (q) {
        var hay = (g.title + ' ' + g.fr + ' ' + g.point + ' ' + g.cat).toLowerCase();
        if (hay.indexOf(q) < 0) return false;
      }
      return true;
    });
  }

  /* ---------- 覆盖清单 ---------- */
  function coverageHTML() {
    var levels = ['A1', 'A2', 'B1', 'B2'];
    var cats = FR.GRAMMAR_META.categories;
    var head = '<tr><th>类别</th>' + levels.map(function (l) { return '<th>' + l + '</th>'; }).join('') + '<th>合计</th></tr>';
    var rows = cats.map(function (cat) {
      var cells = levels.map(function (lv) {
        var n = FR.GRAMMAR.filter(function (g) { return g.cat === cat && g.lv === lv; }).length;
        return '<td class="' + (n ? 'has' : 'no') + '">' + (n || '·') + '</td>';
      }).join('');
      var total = FR.GRAMMAR.filter(function (g) { return g.cat === cat; }).length;
      return '<tr><td>' + U.esc(cat) + '</td>' + cells + '<td><b>' + total + '</b></td></tr>';
    }).join('');
    var totals = levels.map(function (lv) {
      return '<td><b>' + FR.GRAMMAR.filter(function (g) { return g.lv === lv; }).length + '</b></td>';
    }).join('');
    return '<details class="acc coverage">' +
      '<summary><span class="no">✓</span><span>覆盖清单（8 类 × A1–B2）</span><span class="arrow">▶</span></summary>' +
      '<div class="body">' +
      '<p class="small muted">' + U.esc(FR.GRAMMAR_META.basis) + ' 共 ' + FR.GRAMMAR.length + ' 个语法点、' + quizCount() + ' 道随堂题；下表可按类别核对覆盖情况。</p>' +
      '<div class="table-wrap"><table class="conj coverage-table"><thead>' + head + '</thead><tbody>' + rows +
      '<tr class="total-row"><td>合计</td>' + totals + '<td><b>' + FR.GRAMMAR.length + '</b></td></tr>' +
      '</tbody></table></div>' +
      '</div></details>';
  }

  function quizCount() {
    return FR.GRAMMAR.reduce(function (a, g) { return a + (g.quiz ? g.quiz.length : 0); }, 0);
  }

  APP.views['lib-grammar'] = function () {
    var list = grammarFiltered();
    var cats = ['ALL'].concat(FR.GRAMMAR_META.categories);

    var body = list.map(function (g, i) {
      var table = '';
      if (g.table) {
        table = '<div class="table-wrap"><table class="conj"><thead><tr>' +
          g.table.head.map(function (h) { return '<th>' + U.esc(h) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + g.table.rows.map(function (r) {
            return '<tr>' + r.map(function (c) { return '<td>' + U.esc(c) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>';
      }
      var exs = g.ex.map(function (e) {
        return '<div class="ex-row">' +
          '<button class="iconbtn say" data-say="' + U.esc(e.fr) + '" title="朗读">' + U.ic.sound + '</button>' +
          '<div><div class="fr">' + U.esc(e.fr) + '</div><div class="cn">' + U.esc(e.cn) + '</div></div></div>';
      }).join('');
      var quiz = (g.quiz || []).map(function (q, qi) {
        return P.quizHTML(q, g.id + ':' + qi);
      }).join('');
      return '<details class="acc">' +
        '<summary><span class="no">' + (i + 1) + '</span>' +
        '<span class="acc-title">' + U.esc(g.title) + '<i>' + U.esc(g.fr) + '</i></span>' +
        '<span class="tag lv">' + g.lv + '</span><span class="arrow">▶</span></summary>' +
        '<div class="body">' +
        '<div class="point">' + U.esc(g.point) + '</div>' +
        table +
        '<h4>例句</h4>' + exs +
        (g.pitfall ? '<div class="pitfall"><b>易错</b>' + U.esc(g.pitfall) + '</div>' : '') +
        (quiz ? '<div class="quizbox"><h4>随堂小测</h4>' + quiz + '</div>' : '') +
        '</div></details>';
    }).join('');

    return {
      html:
        P.libTabs('grammar') +
        '<div class="filterbar">' +
        '<div class="search"><i>🔍</i><input id="gramSearch" data-input="gramSearch" placeholder="搜语法点（中文/法语）" value="' + U.esc(APP.ui.gramQuery || '') + '" aria-label="搜索语法点"></div>' +
        P.levelChips(APP.ui.gramLevel, 'gramLevel', null, {levels: P.LEVELS_A2}) +
        '<div class="chips" style="margin-top:6px">' + cats.map(function (c) {
          return '<button class="chip mini ' + (APP.ui.gramCat === c ? 'on' : '') + '" data-act="gramCat" data-v="' + U.esc(c) + '">' +
            (c === 'ALL' ? '全部类别' : U.esc(c)) + '</button>';
        }).join('') + '</div>' +
        '</div>' +
        coverageHTML() +
        '<div class="progressline"><span>共 ' + list.length + ' 个语法点</span></div>' +
        (list.length ? body : '<div class="empty"><div class="big">🔍</div>没有匹配的语法点</div>')
    };
  };

  /* ---------- 动词变位速查 ---------- */
  function verbTable(v) {
    var persons = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'];
    var rows = FR.VERB_TENSES.map(function (t) {
      return '<tr><td class="tense">' + t.label + '</td>' +
        v[t.key].map(function (cell) { return '<td>' + U.esc(cell) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="table-wrap"><table class="conj verb-table">' +
      '<thead><tr><th></th>' + persons.map(function (p) { return '<th>' + p + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  APP.views['lib-verbs'] = function () {
    var q = (APP.ui.verbQuery || '').trim().toLowerCase();
    var list = FR.VERBS.filter(function (v) {
      if (!q) return true;
      return (v.inf + ' ' + v.cn).toLowerCase().indexOf(q) >= 0;
    });
    var sel = APP.ui.verb || FR.VERBS[0].inf;
    var cur = FR.VERBS.filter(function (v) { return v.inf === sel; })[0] || FR.VERBS[0];

    var chips = list.map(function (v) {
      return '<button class="verb-chip ' + (v.inf === cur.inf ? 'on' : '') + '" data-act="verbPick" data-v="' + U.esc(v.inf) + '">' +
        '<b>' + U.esc(v.inf) + '</b><i>' + U.esc(v.cn) + '</i></button>';
    }).join('');

    return {
      html:
        P.libTabs('verbs') +
        '<div class="filterbar"><div class="search"><i>🔍</i>' +
        '<input id="verbSearch" data-input="verbSearch" placeholder="搜动词（法语或中文）" value="' + U.esc(APP.ui.verbQuery || '') + '" aria-label="搜索动词"></div>' +
        '<div class="chips">' + chips + '</div></div>' +

        '<div class="card verb-detail">' +
        '<div class="row between"><h2 class="verb-inf">' + U.esc(cur.inf) + '</h2>' +
        '<span class="tag th">第 ' + cur.group + ' 组' + (cur.pronominal ? ' · 代词式' : '') + '</span></div>' +
        '<p class="muted small">' + U.esc(cur.cn) + ' · 助动词 ' + U.esc(cur.aux) + ' · 过去分词 ' + U.esc(cur.pp) + '</p>' +
        verbTable(cur) +
        '<p class="small" style="margin-top:10px">' + U.esc(cur.note) + '</p>' +
        '<div class="ex-row" style="margin-top:8px">' +
        '<button class="iconbtn say" data-say="' + U.esc(cur.ex.fr) + '" title="朗读">' + U.ic.sound + '</button>' +
        '<div><div class="fr">' + U.esc(cur.ex.fr) + '</div><div class="cn">' + U.esc(cur.ex.cn) + '</div></div>' +
        '</div></div>' +

        '<div class="callout" style="margin-top:14px"><h3>怎么用</h3>' +
        '<p class="small">先背现在时与复合过去时（最常用），再补未完成过去时；简单将来时与条件式现在时词干相同，条件式只是换词尾；虚拟式现在时看 ils 形式词干 + -e/-es/-e/-ions/-iez/-ent。</p></div>'
    };
  };

  APP.actions.verbPick = function (el) {
    APP.ui.verb = el.dataset.v;
    APP.render();
  };
})();
