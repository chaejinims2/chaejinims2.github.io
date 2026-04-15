/**
 * section 레이아웃: 첫 페인트 전에 사이드바 위치(left|top)·콤팩트 클래스를 적용한다.
 * (section-boot.js와 클래스 규칙을 맞출 것 — FOUC 방지용 이중 적용)
 */
(function () {
  var pos = localStorage.getItem('sidebar-position') || 'left';
  if (pos !== 'left' && pos !== 'top') {
    pos = 'left';
    try { localStorage.setItem('sidebar-position', 'left'); } catch (e) {}
  }
  if (localStorage.getItem('sidebar-compact') === '1' && pos === 'left') {
    document.body.classList.add('sidebar-compact');
  }
  document.body.classList.remove('sidebar-right', 'sidebar-bottom');
  if (pos === 'top') {
    document.body.classList.add('sidebar-top');
  } else {
    document.body.classList.remove('sidebar-top');
  }
})();
