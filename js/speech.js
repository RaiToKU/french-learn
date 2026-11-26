/* 法语朗读：浏览器内置 speechSynthesis，无需联网音频 */
window.APP = window.APP || {};
(function () {
  var supported = typeof window !== 'undefined' && !!window.speechSynthesis;
  var voice = null;
  var epoch = 0; // 播放令牌：停止或新请求会失效旧队列

  function pickVoice() {
    if (!supported) return;
    try {
      var vs = window.speechSynthesis.getVoices() || [];
      var fr = vs.filter(function (v) { return /^fr/i.test(v.lang || ''); });
      fr.sort(function (a, b) {
        return (/fr[-_]FR/i.test(b.lang) ? 1 : 0) - (/fr[-_]FR/i.test(a.lang) ? 1 : 0);
      });
      voice = fr[0] || null;
    } catch (e) { voice = null; }
  }
  if (supported) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  function rate() {
    var r = APP.store && APP.store.settings().rate;
    return r ? Number(r) : 1;
  }

  function cancelAll() {
    if (supported) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }

  /* 不停止当前队列的原子朗读 */
  function speakNow(text, opts) {
    if (!supported || !text) return false;
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = 'fr-FR';
    u.rate = opts.rate || rate();
    u.pitch = 1;
    if (voice) u.voice = voice;
    u.onend = function () { if (opts.onend) opts.onend(); };
    u.onerror = function () { if (opts.onend) opts.onend(); };
    try { window.speechSynthesis.speak(u); } catch (e) { return false; }
    return true;
  }

  var speech = {
    supported: supported,

    voiceName: function () { return voice ? voice.name + ' (' + voice.lang + ')' : ''; },

    stop: function () {
      epoch++;
      cancelAll();
    },

    speak: function (text, opts) {
      opts = opts || {};
      speech.stop();
      if (!supported || !text) return false;
      var my = epoch;
      return speakNow(text, {
        rate: opts.rate,
        onend: function () { if (my !== epoch) return; if (opts.onend) opts.onend(); }
      });
    },

    /* 顺序朗读多句，onstep(i) 用于高亮当前句 */
    speakList: function (list, opts) {
      opts = opts || {};
      if (!supported || !list || !list.length) return;
      speech.stop();
      var my = epoch;
      var i = 0;
      function next() {
        if (my !== epoch) return;
        if (i >= list.length) { if (opts.onend) opts.onend(); return; }
        var idx = i++;
        if (opts.onstep) opts.onstep(idx);
        var ok = speakNow(list[idx], {
          rate: opts.rate,
          onend: function () {
            if (my !== epoch) return;
            setTimeout(function () {
              if (my !== epoch) return;
              next();
            }, 180);
          }
        });
        if (!ok) { if (opts.onend) opts.onend(); }
      }
      next();
    }
  };

  APP.speech = speech;
})();
