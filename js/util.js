/* 通用工具 */
window.APP = window.APP || {};
APP.actions = APP.actions || {};
APP.views = APP.views || {};
APP.part = APP.part || {};
(function () {
  var U = {};

  /* 单色线性图标（跟随 currentColor，不用 emoji） */
  var IC = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">';
  U.ic = {
    sound: IC + '<path d="M3.6 9.4h3.6L12.6 5v14L7.2 14.6H3.6z" fill="currentColor"/>' +
      '<path d="M15.8 8.8a4.6 4.6 0 0 1 0 6.4M18.4 6.2a8.2 8.2 0 0 1 0 11.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  /* 轻量即时反馈（纯 DOM，无库） */
  U.fx = {
    pop: function (text, kind) {
      var el = document.createElement('div');
      el.className = 'fx-pop ' + (kind || '');
      el.textContent = text;
      document.body.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    },
    flash: function (kind) {
      var el = document.createElement('div');
      el.className = 'fx-flash ' + (kind || '');
      document.body.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 440);
    },
    ripple: function (host, x, y) {
      if (!host || !host.appendChild) return;
      var sp = document.createElement('span');
      sp.className = 'ripple';
      sp.style.left = x + 'px';
      sp.style.top = y + 'px';
      host.appendChild(sp);
      setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 520);
    }
  };

  U.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  U.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  U.hash = function (s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };

  /* 依据题干稳定打乱选项，保证多次渲染顺序一致，同时返回正确项的新下标 */
  U.optionOrder = function (q) {
    var pairs = q.opts.map(function (t, i) {
      return { t: t, i: i, k: U.hash(q.q + '|' + i) };
    });
    pairs.sort(function (a, b) { return a.k - b.k; });
    var correct = 0;
    pairs.forEach(function (p, idx) { if (p.i === q.a) correct = idx; });
    return { opts: pairs.map(function (p) { return p.t; }), correct: correct };
  };

  /* 归一化：小写、去重音、去标点、压缩空格（听写判分用） */
  U.norm = function (s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/œ/g, 'oe').replace(/æ/g, 'ae')
      .replace(/[’‘`'']/g, ' ')
      .replace(/[.,!?;:…«»""„"()\[\]\-–—_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  U.fmtTime = function (ts) {
    if (!ts) return '—';
    var d = new Date(ts), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  };

  U.dayKey = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  };

  U.splitSentences = function (text) {
    var out = [];
    var m = String(text || '').match(/[^.!?…]+[.!?…]*/g) || [];
    m.forEach(function (s) {
      s = s.trim();
      if (s) out.push(s);
    });
    return out;
  };

  U.wordCount = function (text) {
    return String(text || '').trim().split(/\s+/).length;
  };

  U.toast = function (msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(U._t);
    U._t = setTimeout(function () { el.classList.remove('show'); }, 1800);
  };

  U.uid = function () { return 'k' + Math.random().toString(36).slice(2, 9); };

  APP.util = U;
})();
