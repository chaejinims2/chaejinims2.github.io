(function () {
    var apiUrl = "{{ site.visitor_count_api }}";
    var elToday = document.getElementById('startup-count-today');
    var elTotal = document.getElementById('startup-count-total');
    function setToday(n) { if (elToday) elToday.textContent = typeof n === 'number' ? n : '-'; }
    function setTotal(n) { if (elTotal) elTotal.textContent = typeof n === 'number' ? n : '-'; }
    function tryCountApi() {
        var ns = 'chaejinims2.github.io';
        var today = new Date();
        var dateKey = 'daily-' + today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        Promise.all([
            fetch('https://api.countapi.xyz/hit/' + encodeURIComponent(ns) + '/' + encodeURIComponent(dateKey)).then(function (r) { return r.json(); }).then(function (d) { return d && d.value != null ? d.value : null; }).catch(function () { return null; }),
            fetch('https://api.countapi.xyz/hit/' + encodeURIComponent(ns) + '/total').then(function (r) { return r.json(); }).then(function (d) { return d && d.value != null ? d.value : null; }).catch(function () { return null; })
        ]).then(function (r) { setToday(r[0]); setTotal(r[1]); });
    }
    if (apiUrl) {
        fetch(apiUrl, { method: 'GET', credentials: 'omit' })
            .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(function (d) {
                var t = d && (d.today != null || d.total != null) ? { today: d.today, total: d.total } : null;
                if (t) { setToday(t.today); setTotal(t.total); } else tryCountApi();
            })
            .catch(function () { tryCountApi(); });
    } else {
        tryCountApi();
    }
})();