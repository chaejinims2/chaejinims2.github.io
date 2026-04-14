/**
 * section 레이아웃: 첫 페인트 전에 사이드바 위치·콤팩트 클래스를 적용하고,
 * right/bottom 일 때만 .app-main 열을 앞으로 옮긴다.
 * (section-boot.js와 클래스 규칙을 맞출 것 — FOUC 방지용 이중 적용)
 */
(function () {
  var pos = localStorage.getItem('sidebar-position') || 'left';
  if (localStorage.getItem('sidebar-compact') === '1' && pos === 'left') {
    document.body.classList.add('sidebar-compact');
  }
  if (pos === 'top') {
    document.body.classList.add('sidebar-top');
  } else if (pos === 'right' || pos === 'bottom') {
    document.body.classList.add(pos === 'right' ? 'sidebar-right' : 'sidebar-bottom');
    function reorderShell() {
      var shell = document.querySelector('.app-shell');
      var main = document.querySelector('.app-main');
      var sidebar = document.querySelector('.app-sidebar');
      if (shell && main && sidebar) {
        shell.insertBefore(main, sidebar);
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', reorderShell);
    } else {
      reorderShell();
    }
  }
})();
