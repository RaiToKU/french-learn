/* 视图：情景口语语库 */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part;

  APP.views.scenes = function () {
    var cards = FR.SCENES.map(function (s) {
      var seen = APP.store.data.scenesSeen[s.id];
      return '<a class="scene" href="#/scene/' + s.id + '">' +
        '<div class="ico">' + s.icon + '</div>' +
        '<div class="scene-body">' +
        '<h3>' + U.esc(s.title) + (seen ? ' <span class="dot-done" title="已练过">✓</span>' : '') + '</h3>' +
        '<p>' + U.esc(s.titleFr) + ' · ' + s.lv + ' · ' + s.chunks.length + ' 关键句 / ' + s.dialogue.length + ' 轮对话</p>' +
        '</div></a>';
    }).join('');
    return {
      html:
        P.libTabs('scenes') +
        '<div class="page-head"><div><h1>情景口语</h1>' +
        '<p class="muted">按真实场景整理：先背关键句，再走完整对话，最后看文化提示。每句都能单独朗读。</p></div></div>' +
        '<div class="scene-grid">' + cards + '</div>'
    };
  };

  APP.views.scene = function (r) {
    var s = FR.SCENES.filter(function (x) { return x.id === r.id; })[0];
    if (!s) return {html: '<div class="empty"><div class="big">🤔</div>找不到这个场景</div>'};
    var showCn = APP.ui.showCn;

    var dlg = s.dialogue.map(function (d, i) {
      return '<div class="dlgrow ' + (d.side === 'b' ? 'b' : 'a') + '" data-dlgrow="' + i + '">' +
        '<div class="who">' + U.esc(d.who.slice(0, 2)) + '</div>' +
        '<div class="bub">' +
        '<div class="fr">' + U.esc(d.fr) + '</div>' +
        '<div class="cn ' + (showCn ? '' : 'hide') + '">' + U.esc(d.cn) + '</div>' +
        '<div class="tools">' +
        '<button class="btn btn-sm" data-say="' + U.esc(d.fr) + '">' + U.ic.sound + ' 单句</button>' +
        '<button class="btn btn-sm" data-say="' + U.esc(d.fr) + '" data-slow="1">🐢 慢速</button>' +
        '</div></div></div>';
    }).join('');

    var chunkIds = {};
    APP.catalog.chunks.forEach(function (x) { chunkIds[x.sceneId + '|' + x.fr] = x.id; });
    var chunks = s.chunks.map(function (c) {
      var id = chunkIds[s.id + '|' + c.fr];
      var starred = APP.store.isStar(id);
      var added = APP.store.has(id);
      return '<div class="chunk">' +
        '<div class="chunk-main">' +
        '<div class="fr">' + U.esc(c.fr) + '</div>' +
        '<div class="cn">' + U.esc(c.cn) + '</div>' +
        (c.note ? '<div class="note">' + U.esc(c.note) + '</div>' : '') +
        '</div>' +
        '<div class="row gap6" style="flex:none">' +
        '<button class="iconbtn say" data-say="' + U.esc(c.fr) + '" title="朗读">' + U.ic.sound + '</button>' +
        '<button class="iconbtn ' + (starred ? 'on' : '') + '" data-act="lexStar" data-id="' + id + '" title="收藏">★</button>' +
        '<button class="iconbtn ' + (added ? 'on' : '') + '" data-act="lexAdd" data-id="' + id + '" title="加入复习">＋</button>' +
        '</div></div>';
    }).join('');

    var vocab = s.vocab.map(function (v) {
      return '<span class="vocab" role="button" tabindex="0" data-say="' + U.esc(v.w) + '"><b>' + U.esc(v.w) + '</b>' + U.esc(v.cn) + '</span>';
    }).join('');

    return {
      html:
        '<div class="row between" style="margin-bottom:10px">' +
        '<a class="chip" href="#/scenes">← 情景口语</a>' + P.tag(s.lv, 'lv') + '</div>' +
        '<div class="scene-head">' +
        '<div class="scene-head-ico">' + s.icon + '</div>' +
        '<div><h1>' + U.esc(s.title) + '</h1><p class="muted small">' + U.esc(s.titleFr) + '</p></div></div>' +
        '<div class="callout" style="margin-top:10px"><p class="small"><b>目标：</b>' + U.esc(s.goal) + '</p></div>' +

        '<section class="section"><div class="section-head"><h2>关键句</h2><span class="muted small">' + s.chunks.length + ' 句</span></div>' +
        '<div class="card" style="padding:4px 14px">' + chunks + '</div></section>' +

        '<section class="section"><div class="section-head"><h2>对话演练</h2><span class="muted small">可整段连播</span></div>' +
        '<div class="row wrap gap6" style="margin-bottom:10px">' +
        '<button class="btn btn-sm primary" data-act="dlgPlay" data-id="' + s.id + '">▶ 连播对话</button>' +
        '<button class="btn btn-sm" data-act="dlgStop">⏹ 停止</button>' +
        '<button class="btn btn-sm" data-act="sceneCn">' + (showCn ? '隐藏中文' : '显示中文') + '</button>' +
        '</div>' + dlg + '</section>' +

        '<section class="section"><div class="section-head"><h2>高频词</h2><span class="muted small">点一下听发音</span></div>' +
        '<div class="vocablist">' + vocab + '</div></section>' +

        '<section class="section"><div class="section-head"><h2>文化提示</h2><span class="muted small">别踩坑</span></div>' +
        '<div class="card tip-card"><p class="small">' + U.esc(s.tip) + '</p></div></section>'
    };
  };
})();
