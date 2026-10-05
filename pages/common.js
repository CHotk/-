/* 所有頁面共用：
   1. 左上角「回首頁」按鈕（在入口頁的預覽視窗裡不顯示）
   2. 滑鼠按住左右拖曳橫向捲動區塊（輪播、篩選列）
   3. 手機模式：滑鼠按住上下拖曳捲動頁面，像手指滑動（由入口頁預覽的「手機」模式開啟，或網址加 ?touch=1）
   只處理滑鼠；真正的觸控裝置維持原生行為。 */
(function () {
  var inFrame = window.top !== window;

  /* ---------- 1. 回首頁 ---------- */
  if (!inFrame) {
    var st = document.createElement('style');
    st.textContent =
      '.home-btn{position:fixed;z-index:2147483000;left:calc(env(safe-area-inset-left,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 12px);' +
      'height:42px;padding:0 16px 0 12px;display:inline-flex;align-items:center;gap:6px;border-radius:99px;' +
      'background:rgba(15,16,22,.72);color:#fff;border:1px solid rgba(255,255,255,.22);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
      'font:500 13px/1 system-ui,"Noto Sans TC",sans-serif;letter-spacing:.04em;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.3);transition:transform .25s,background .25s}' +
      '.home-btn:hover{background:rgba(15,16,22,.92);transform:translateX(-2px)}.home-btn:active{transform:scale(.96)}' +
      '.home-btn:focus-visible{outline:2px solid #ff7a45;outline-offset:3px}' +
      /* 讓頁面原本固定在左上的導覽往右讓出位置 */
      'body.has-home .nav,body.has-home .top,body.has-home nav:not(.tabs){padding-left:calc(var(--gut,18px) + 92px)!important}';
    document.head.appendChild(st);
    var a = document.createElement('a');
    a.className = 'home-btn';
    a.href = '../index.html';
    a.setAttribute('aria-label', '回到合輯首頁');
    a.innerHTML = '<span aria-hidden="true">←</span>首頁';
    document.body.appendChild(a);
    document.body.classList.add('has-home');
  }

  /* ---------- 2 + 3. 滑鼠拖曳 ---------- */
  var touchSim = /[?&]touch=1/.test(location.search);
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'touchSim') touchSim = !!e.data.on;
  });

  var D = null, suppress = false;

  function scrollerX(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollWidth > el.clientWidth + 2) {
        var o = getComputedStyle(el).overflowX;
        if (o === 'auto' || o === 'scroll') return el;
      }
      el = el.parentElement;
    }
    return null;
  }
  function scrollerY(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollHeight > el.clientHeight + 2) {
        var o = getComputedStyle(el).overflowY;
        if (o === 'auto' || o === 'scroll') return el;
      }
      el = el.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    var t = e.target;
    if (t.closest('input,textarea,select,[contenteditable]')) return;
    D = {
      id: e.pointerId, x: e.clientX, y: e.clientY, axis: null,
      hx: scrollerX(t), vy: t.closest('.grab,[data-nodrag]') ? null : scrollerY(t),
      slx: 0, sty: 0, v: 0, lt: 0, ly: e.clientY, snap: '', moved: false
    };
    if (D.hx) { D.slx = D.hx.scrollLeft; D.snap = D.hx.style.scrollSnapType; }
    if (D.vy) D.sty = D.vy.scrollTop;
    D.lt = performance.now();
  }, true);

  document.addEventListener('pointermove', function (e) {
    if (!D || e.pointerId !== D.id) return;
    if (e.buttons === 0) { finish(); return; }
    var dx = e.clientX - D.x, dy = e.clientY - D.y;
    if (!D.axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) > Math.abs(dy) && D.hx) D.axis = 'x';
      else if (Math.abs(dy) >= Math.abs(dx) && touchSim && D.vy) D.axis = 'y';
      else { D = null; return; }
      D.moved = true;
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      try { getSelection().removeAllRanges(); } catch (x) {}
      if (D.axis === 'x') {
        D.hx.style.scrollSnapType = 'none';
        D.hx.style.scrollBehavior = 'auto';
      } else {
        document.documentElement.style.scrollBehavior = 'auto';
        D.vy.style.scrollBehavior = 'auto';
      }
    }
    if (D.axis === 'x') {
      D.hx.scrollLeft = D.slx - dx;
    } else {
      D.vy.scrollTop = D.sty - dy;
      var now = performance.now(), dt = Math.max(1, now - D.lt);
      D.v = D.v * .6 + ((e.clientY - D.ly) / dt) * .4;
      D.lt = now; D.ly = e.clientY;
    }
  });

  function finish() {
    if (!D) return;
    var d = D; D = null;
    if (!d.moved) return;
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    /* 拖曳後不要誤觸底下的按鈕或連結 */
    var stop = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
    document.addEventListener('click', stop, true);
    setTimeout(function () { document.removeEventListener('click', stop, true); }, 0);
    if (d.axis === 'x') {
      d.hx.style.scrollSnapType = d.snap;
      d.hx.style.scrollBehavior = '';
    } else {
      /* 慣性滑行 */
      var v = d.v * 16, el = d.vy;
      (function glide() {
        if (Math.abs(v) < .4) {
          document.documentElement.style.scrollBehavior = '';
          el.style.scrollBehavior = '';
          return;
        }
        el.scrollTop -= v; v *= .95;
        requestAnimationFrame(glide);
      })();
    }
  }
  document.addEventListener('pointerup', finish);
  document.addEventListener('pointercancel', finish);
  window.addEventListener('blur', finish);
})();
