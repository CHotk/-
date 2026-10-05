/* 讓滑鼠也能「按住拖曳」橫向捲動區塊（輪播、篩選列、評價列），方便在電腦上體驗手機版互動。
   只處理滑鼠；觸控裝置維持原生捲動。拖曳時暫時關閉 scroll-snap，放開後恢復並自動吸附。 */
(function () {
  var drag = null, moved = false;

  function scroller(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.scrollWidth > el.clientWidth + 2) {
        var ov = getComputedStyle(el).overflowX;
        if (ov === 'auto' || ov === 'scroll') return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('input,textarea,select,[contenteditable]')) return;
    var el = scroller(e.target);
    if (!el) return;
    drag = { el: el, x: e.clientX, sl: el.scrollLeft, snap: el.style.scrollSnapType, id: e.pointerId };
    moved = false;
  }, true);

  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) < 5) return;
    if (!moved) {
      moved = true;
      drag.el.style.scrollSnapType = 'none';
      drag.el.style.scrollBehavior = 'auto';
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }
    drag.el.scrollLeft = drag.sl - dx;
  });

  function end() {
    if (!drag) return;
    var el = drag.el, snap = drag.snap;
    if (moved) {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      el.style.scrollSnapType = snap;
      el.style.scrollBehavior = '';
      /* 拖曳結束後不要誤觸裡面的按鈕 */
      var stop = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
      document.addEventListener('click', stop, true);
      setTimeout(function () { document.removeEventListener('click', stop, true); }, 0);
    }
    drag = null;
  }
  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
})();
