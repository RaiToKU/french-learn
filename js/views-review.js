/* 视图：复习（间隔重复）/ 我的（等级 · 徽章 · 设置） */
window.APP = window.APP || {};
(function () {
  var U = APP.util;
  var P = APP.part;

  function ring(lv, size) {
    var r = 52, dash = Math.round(2 * Math.PI * r * lv.pct / 100);
    return '<div class="ring ' + (size === 'sm' ? 'ring-sm' : '') + '">' +
      '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle class="ring-bg" cx="60" cy="60" r="' + r + '"></circle>' +
      '<circle class="ring-fg" cx="60" cy="60" r="' + r + '" stroke-dasharray="' + dash + ' 327"></circle>' +
      '</svg>' +
      '<div class="ring-txt"><b>Lv.' + lv.index + '</b><span>' + U.esc(lv.title) + '</span></div></div>';
  }

  /* ---------------- 复习 ---------------- */
  APP.views.review = function () {
    var st = APP.store.stats();
    var s = APP.session.review;

    if (!s) {
      var totalAll = (FR.LEXICON_META && FR.LEXICON_META.total) || APP.catalog.all.length;
      var newLeft = Math.max(0, totalAll - st.learned);
      var queue = st.due > 0 ? Math.min(30, st.due) : 12;
      return {
        html:
          '<div class="page-head"><div><h1>复习</h1>' +
          '<p class="muted">间隔重复：忘记→明天再来；记得→间隔逐步拉长到 2 个月。</p></div></div>' +
          '<div class="card" style="margin-bottom:12px"><div class="row between" style="margin-bottom:6px">' +
          '<b style="font-size:13px">难度</b><span class="muted small">只复习某一级别</span></div>' +
          P.levelChips(APP.ui.level, 'setLevel') + '</div>' +
          '<div class="stat-row">' +
          '<div class="stat"><b>' + st.due + '</b><span>待复习</span></div>' +
          '<div class="stat"><b>' + st.learned + '</b><span>已掌握</span></div>' +
          '<div class="stat"><b>' + st.streak + '</b><span>连续天数</span></div>' +
          '</div>' +
          '<button class="btn primary wide" style="margin-top:14px" data-act="startReview" ' + (st.due + newLeft === 0 ? 'disabled' : '') + '>' +
          (st.due > 0 ? '复习 ' + Math.max(1, queue) + ' 张' : '学习新词') + ' →</button>' +
          '<p class="muted small center" style="margin-top:10px">还有 ' + newLeft + ' 个词条/句式未进入复习队列 · 每张 +2 XP</p>' +
          '<div class="section"><div class="section-head"><h2>复习说明</h2></div>' +
          '<div class="card"><p class="small">队列先排到期卡片，不足 12 张时自动补入新内容（A1→C1 顺序）。' +
          '「忘记」会排到明天并当场再练一次；「模糊」间隔缩短；「记得」按 1→3→7→14→30→60 天推进。</p></div></div>'
      };
    }

    if (s.i >= s.queue.length) {
      return {
        html:
          '<div class="result-card">' +
          '<div class="result-emoji">✅</div>' +
          '<h2>本轮复习完成</h2>' +
          '<p class="muted">复习 ' + s.done + ' 次 · 忘记 ' + s.again + ' 次 · +' + (s.done * 2) + ' XP</p>' +
          '<div class="row gap8" style="justify-content:center;margin-top:16px">' +
          '<button class="btn primary" data-act="startReview">继续复习</button>' +
          '<a class="btn" href="#/home">回首页</a></div></div>'
      };
    }

    var id = s.queue[s.i];
    var item = APP.catalog.byId[id];
    if (!item) { s.i++; return APP.views.review(); }

    var badge = item.type === 'lexicon' ? '词汇' : (item.type === 'frame' ? '句型骨架' : '情景关键句');
    var front, back;
    if (item.type === 'lexicon') {
      front = '<div class="front"><div class="front-fr">' + U.esc(item.w) + '</div>' +
        '<div class="muted small" style="margin-top:6px">' + U.esc(item.p) + '</div></div>';
      back = '<div class="back"><div class="cn">' + U.esc(item.cn) + '</div>' +
        (item.ex ? '<div class="ex">' + U.esc(item.ex) +
          '<div class="muted small" style="margin-top:4px">' + U.esc(item.exCn || '') + '</div></div>' : '') + '</div>';
    } else {
      front = '<div class="front"><div class="front-fr" style="font-size:21px">' + U.esc(item.fr) + '</div></div>';
      back = '<div class="back"><div class="cn">' + U.esc(item.cn) + '</div>' +
        (item.note ? '<div class="ex">' + U.esc(item.note) + '</div>' : '') + '</div>';
    }
    var speakText = item.type === 'lexicon' ? item.w : item.fr;

    return {
      html:
        '<div class="row between" style="margin-bottom:10px">' +
        '<span class="tag lv">' + U.esc(item.lv === 'EXT' ? '扩展' : (item.lv || '')) + '</span>' +
        '<span class="muted small">' + (s.i + 1) + ' / ' + s.queue.length + ' · ' + badge + '</span></div>' +
        '<div class="flash ' + (s.flipped ? 'flipped' : '') + '" data-act="flip" role="button" tabindex="0" aria-label="翻转卡片">' +
        '<div class="face">' + front + back +
        '<div class="hint">' + (s.flipped ? '点卡片可翻回' : '想一想它的意思，然后点卡片看答案') + '</div>' +
        '</div></div>' +
        '<div class="row gap8" style="justify-content:center;margin-top:10px">' +
        '<button class="btn btn-sm blue" data-say="' + U.esc(speakText) + '">' + U.ic.sound + ' 朗读</button>' +
        (item.ex ? '<button class="btn btn-sm" data-say="' + U.esc(item.ex) + '" data-slow="1">🐢 慢速例句</button>' : '') +
        '</div>' +
        (s.flipped ?
          '<div class="grade">' +
          '<button class="btn danger" data-act="grade" data-g="again">忘记<small>明天再来</small></button>' +
          '<button class="btn" data-act="grade" data-g="hard">模糊<small>间隔缩短</small></button>' +
          '<button class="btn primary" data-act="grade" data-g="good">记得<small>间隔拉长</small></button>' +
          '</div>' :
          '<button class="btn primary wide" style="margin-top:12px" data-act="flip">显示答案</button>')
    };
  };

  /* ---------------- 我的 ---------------- */
  APP.views.me = function () {
    var st = APP.store.stats();
    var s = APP.store.settings();
    var backup = APP.store.backupInfo ? APP.store.backupInfo() : null;
    var lastBackup = Math.max(APP.store.data.lastBackupAt || 0, (backup && backup.savedAt) || 0);
    var backupLabel = lastBackup ? U.fmtTime(lastBackup) : '从未';
    var staleBackup = st.total > 10 && (!lastBackup || Date.now() - lastBackup > 7 * 86400000);
    var badges = APP.store.badges();
    var unlocked = badges.filter(function (b) { return b.unlocked; }).length;

    var badgeGrid = badges.map(function (b) {
      return '<div class="badge ' + (b.unlocked ? 'on' : '') + '">' +
        '<div class="badge-ico">' + b.icon + '</div>' +
        '<div class="badge-body"><b>' + U.esc(b.title) + '</b>' +
        '<p class="small">' + U.esc(b.desc) + '</p>' +
        (b.unlocked ? '<span class="badge-done">已点亮</span>' :
          '<div class="bar" style="margin-top:6px"><i style="width:' + b.pct + '%"></i></div>') +
        '</div></div>';
    }).join('');

    return {
      html:
        '<div class="page-head"><div><h1>我的</h1><p class="muted">等级、徽章与数据都在这一页。</p></div></div>' +

        '<section class="profile-card">' +
        ring(st.level) +
        '<div class="profile-main">' +
        '<h2>Lv.' + st.level.index + ' · ' + U.esc(st.level.title) + '</h2>' +
        '<p class="muted small">' + U.esc(st.level.desc) + '</p>' +
        '<p class="small">' + st.xp + ' XP' + (st.level.next ? ' · 还差 ' + st.level.toNext + ' XP 升到「' + U.esc(st.level.nextTitle) + '」' : '') + '</p>' +
        '</div></section>' +

        '<div class="stat-row">' +
        '<div class="stat"><b>' + st.learned + '</b><span>已掌握</span></div>' +
        '<div class="stat"><b>' + st.total + '</b><span>在学卡片</span></div>' +
        '<div class="stat"><b>' + st.due + '</b><span>待复习</span></div>' +
        '<div class="stat"><b>' + st.stars + '</b><span>收藏</span></div>' +
        '<div class="stat"><b>' + st.streak + '</b><span>连续天数</span></div>' +
        '<div class="stat"><b>' + st.todayCorrect + '</b><span>今日答对</span></div>' +
        '</div>' +

        '<section class="section"><div class="section-head"><h2>徽章</h2><span class="muted small">' + unlocked + ' / ' + badges.length + '</span></div>' +
        '<div class="badge-grid">' + badgeGrid + '</div></section>' +

        '<section class="section"><div class="section-head"><h2>最佳成绩</h2></div>' +
        '<div class="best-grid">' +
        [['match', '配对连连看', '对'], ['sprint', '60 秒冲刺', '分'], ['audio', '听音选义', '题'], ['gconj', '变位冲刺', '分'],
          ['build', '组句训练', '句'], ['listen', '听力听写', '句'], ['quiz', '语法小测', '题'],
          ['close', '补全填空', '题'], ['conj', '变位速练', '题'], ['spell', '中译法拼写', '题'],
          ['judge', '快判对错', '题'], ['mix', '综合挑战', '题']].map(function (x) {
          return '<div class="best-item"><span>' + x[1] + '</span><b>' + (APP.store.best(x[0]) || 0) + ' <i>' + x[2] + '</i></b></div>';
        }).join('') +
        '</div></section>' +

        '<section class="section"><div class="section-head"><h2>数据与备份</h2>' +
        '<span class="muted small">存本机，可导出带走</span></div><div class="card">' +
        (APP.store.storageOK
          ? '<p class="small">进度自动存在浏览器（localStorage），关掉网页不丢；清缓存、换浏览器或换设备会丢，请定期导出备份。</p>'
          : '<p class="small" style="color:var(--red)">当前环境无法写入浏览器存储（file:// 受限或隐私模式），进度只在本次会话有效——请导出备份，或换 http 本地服务打开。</p>') +
        '<p class="small muted" style="margin-top:6px">' +
        '本机记录：' + st.total + ' 张复习卡 · ' + st.xp + ' XP · 上次备份 ' + backupLabel +
        '</p>' +
        (staleBackup ? '<p class="small" style="color:var(--accent);margin-top:4px">已经有一段时间没备份了，建议现在导出一次（换设备/清缓存会丢）。</p>' : '') +
        '<div class="row wrap gap8" style="margin-top:10px">' +
        '<button class="btn primary" data-act="exportData">导出备份文件</button>' +
        '<button class="btn" data-act="copyData">复制备份文本</button>' +
        '</div>' +
        '<div class="divider"></div>' +
        '<p class="small muted">导入：选择导出的 .json 文件，或直接把备份文本粘到下面。</p>' +
        '<label class="btn" style="cursor:pointer;margin-top:8px">选择文件导入' +
        '<input type="file" accept="application/json,.json" data-input="importData" style="display:none"></label>' +
        '<textarea id="importArea" class="input" rows="3" placeholder="粘贴备份 JSON 后点右侧按钮" style="margin-top:8px;font-family:var(--mono,monospace);font-size:12px"></textarea>' +
        '<button class="btn" style="margin-top:8px" data-act="importText">从文本导入</button>' +
        '<div class="divider"></div>' +
        '<p class="small muted">自动备份：每次打开/关闭页面会把进度另存一份，主记录损坏可回滚。</p>' +
        '<div class="row wrap gap8" style="margin-top:8px">' +
        '<button class="btn" data-act="restoreBackup">恢复自动备份' + (backup ? '（' + backupLabel + '）' : '') + '</button>' +
        '<button class="btn danger" data-act="resetAll">清空进度</button>' +
        '</div></div></section>' +

        '<section class="section"><div class="section-head"><h2>设置</h2></div><div class="card">' +
        '<div class="row between"><label class="small" for="rateRange">朗读语速</label><span class="muted small" id="rateLabel">' + s.rate + '×</span></div>' +
        '<input id="rateRange" type="range" min="0.5" max="1.3" step="0.05" value="' + s.rate + '" data-input="setRate" aria-label="朗读语速" style="width:100%;margin-top:8px">' +
        '<div class="divider"></div>' +
        '<label class="row between" style="cursor:pointer"><span class="small">情景对话默认隐藏中文</span>' +
        '<input type="checkbox" data-input="toggleHideCn" ' + (s.hideCn ? 'checked' : '') + ' style="width:18px;height:18px"></label>' +
        '<p class="muted small" style="margin:8px 0 0">语音：' + (APP.speech.supported ? (APP.speech.voiceName() || '系统默认法语语音') : '不支持') + '</p>' +
        '</div></section>' +

        '<section class="section"><div class="section-head"><h2>关于</h2></div><div class="card"><p class="small">' +
        '语库：词汇 ' + (FR.LEXICON_META && FR.LEXICON_META.totalAll || APP.counts.lexiconTotal || APP.counts.lexicon) +
        ' 条（核心 ' + (FR.LEXICON_META && FR.LEXICON_META.total || APP.counts.lexicon) + ' + 扩展 ' +
        (FR.LEXICON_META && FR.LEXICON_META.ext || 0) + '）· 句型骨架 ' + APP.counts.frames + ' 个 · 语法点 ' + APP.counts.grammar +
        ' 个（' + APP.counts.quiz + ' 道题）· 动词变位 ' + APP.counts.verbs + ' 个 · 精读 ' + APP.counts.reading +
        ' 篇 · 情景对话 ' + FR.SCENES.length + ' 个。' +
        '变位练习池 ' + ((FR.LEXICON_META && FR.LEXICON_META.verbs) || 0) + ' 个动词（现在时）。' +
        '朗读使用浏览器 speechSynthesis；无账号、无网络请求。</p>' +
        '<p class="small muted" style="margin-top:8px">版本 v' + U.esc(APP.version || '1.0.0') + ' · 语料 ' +
          U.esc(String((FR.LEXICON_META && FR.LEXICON_META.totalAll) || APP.counts.lexicon)) + ' 词（核心 A1–C1 ' +
          U.esc(String((FR.LEXICON_META && FR.LEXICON_META.total) || APP.counts.lexicon)) + ' + 扩展 ' +
          U.esc(String((FR.LEXICON_META && FR.LEXICON_META.ext) || 0)) + '）</p>' +
        (FR.LEXICON_META ? '<p class="small muted" style="margin-top:8px">词汇分级与中文释义、例句来源：' +
          U.esc(FR.LEXICON_META.source) + '，分级依据 ' + U.esc(FR.LEXICON_META.basis) + '，许可 ' +
          U.esc(FR.LEXICON_META.license) + '。本应用为非商业学习用途，衍生内容沿用同一许可。</p>' : '') +
        '</div></section>'
    };
  };
})();
