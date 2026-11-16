/* =====================================================
   خانة «الأقسام» — كلمات المصطفى للاتصالات
   - زر «الأقسام» في شريط التنقل، وعند الضغط عليه تظهر كل الأقسام
     وأقسامها الفرعية في لوحة واحدة ليختار المستخدم ما يريد
   - تقرأ الأقسام تلقائياً من CATEGORIES (data.js)؛ أي قسم أو
     قسم فرعي جديد تضيفه هناك يظهر هنا بدون أي تعديل
   - الرابط ?sub=اسم_القسم يفتح القسم الفرعي مباشرة
   ===================================================== */
(function () {
  'use strict';
  if (window.__klMegaMenu) return;
  window.__klMegaMenu = true;

  /* ---------- أيقونات الأقسام الرئيسية ---------- */
  var CAT_ICONS = {
    smart: '<rect x="6" y="2.5" width="12" height="19" rx="2.8"/><path d="M10.5 18.5h3"/>',
    accessories: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6.5" rx="1.7"/><rect x="17" y="14" width="4" height="6.5" rx="1.7"/>',
    computers: '<rect x="4.5" y="5" width="15" height="10.5" rx="1.9"/><path d="M2.5 19h19"/>'
  };

  /* ---------- أيقونات الأقسام الفرعية ---------- */
  var ICONS = {
    'موبايلات': '<rect x="6" y="2.5" width="12" height="19" rx="2.8"/><path d="M10.5 18.5h3"/>',
    'تابلتات': '<rect x="4" y="3" width="16" height="18" rx="2.6"/><path d="M10.5 17.5h3"/>',
    'ساعات': '<rect x="7" y="6.5" width="10" height="11" rx="3"/><path d="M9 6.5l.7-3h4.6l.7 3M9 17.5l.7 3h4.6l.7-3M12 10v2.3l1.5.9"/>',
    'سماعات': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6.5" rx="1.7"/><rect x="17" y="14" width="4" height="6.5" rx="1.7"/>',
    'حافظات': '<rect x="6" y="2.5" width="12" height="19" rx="2.8"/><rect x="8.6" y="5" width="4.2" height="4.2" rx="1.1"/>',
    'شواحن': '<path d="M13 2.5L5.5 13.5H11l-1 8 8.5-11.5H13z"/>',
    'لابتوبات': '<rect x="4.5" y="5" width="15" height="10.5" rx="1.9"/><path d="M2.5 19h19"/>',
    'تجميعات': '<rect x="6.5" y="3" width="11" height="18" rx="2.2"/><circle cx="12" cy="8" r="1.6"/><path d="M9.5 15h5"/>',
    'شاشات': '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
    'مستعمل': '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8.5M4 4v4.5h4.5M4 13a8 8 0 0 0 14.5 4.5l1.5-2M20 20v-4.5h-4.5"/>',
    'تخزين': '<rect x="3.5" y="8" width="17" height="8" rx="2.2"/><circle cx="17" cy="12" r=".9"/><path d="M7 12h5"/>'
  };

  var GRID_ICON = '<rect x="4" y="4" width="7" height="7" rx="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.8"/>';

  /* احتياطي في حال لم تُحمَّل CATEGORIES */
  var FALLBACK = {
    smart: { title: 'الأجهزة الذكية', desc: 'الموبايلات والأجهزة الذكية', file: 'smart-devices.html', filters: [
      { key: 'موبايلات', label: 'الموبايلات' }, { key: 'تابلتات', label: 'التابلتات' },
      { key: 'ساعات', label: 'الساعات' }, { key: 'سماعات', label: 'السماعات' }] },
    accessories: { title: 'الإكسسوارات', desc: 'إكسسوارات وملحقات الأجهزة', file: 'accessories.html', filters: [
      { key: 'حافظات', label: 'الحافظات' }, { key: 'سماعات', label: 'السماعات' },
      { key: 'شواحن', label: 'الشواحن' }] },
    computers: { title: 'الحاسبات', desc: 'الحاسبات ومستلزماتها', file: 'computers.html', filters: [
      { key: 'لابتوبات', label: 'اللابتوبات' }, { key: 'تجميعات', label: 'التجميعات' },
      { key: 'شاشات', label: 'الشاشات' }, { key: 'تخزين', label: 'التخزين' }] }
  };

  function getCats() {
    try { if (typeof CATEGORIES !== 'undefined' && CATEGORIES) return CATEGORIES; } catch (e) {}
    return FALLBACK;
  }

  /* ---------- التصميم ---------- */
  var CSS = '' +
    '.kl-menu-wrap{z-index:70!important}' +
    '.kl-menu-in{position:relative}' +

    /* زر «الأقسام» داخل الشريط (نفس شكل بقية الأزرار) */
    '.kl-menu .kl-all-btn{display:flex;flex-direction:column;align-items:center;flex:1 1 0;min-width:0;' +
      'padding:10px 6px;margin:0;border:0;font:inherit;cursor:pointer;color:rgba(255,255,255,.95);' +
      'background:transparent;border-radius:999rem;-webkit-tap-highlight-color:transparent;' +
      'transition:background .18s cubic-bezier(.34,1.56,.64,1),color .18s,transform .18s cubic-bezier(.34,1.56,.64,1),box-shadow .3s}' +
    '.kl-menu .kl-all-btn .kl-ico{display:grid;place-items:center;line-height:0}' +
    '.kl-menu .kl-all-btn .ic{width:1.45rem;height:1.45rem;margin:0;fill:none;stroke:currentColor;stroke-width:1.8;' +
      'stroke-linecap:round;stroke-linejoin:round}' +
    '.kl-menu .kl-all-btn .kl-lbl{margin-top:5px;font-size:.85rem;font-weight:700;line-height:1.2;text-align:center}' +
    '.kl-menu .kl-all-btn:hover{color:#fff;background-color:rgba(255,255,255,.26)}' +
    '.kl-menu .kl-all-btn:active{transform:scale(.98)}' +
    '.kl-menu .kl-all-btn:focus-visible{outline:2px solid #fff;outline-offset:-3px}' +
    '.kl-menu .kl-all-btn[aria-expanded="true"]{background:#fff;color:var(--kl-turq-deep,#087f93)}' +
    '.kl-caret{display:inline-block;width:.62em;height:.62em;margin-inline-start:4px;vertical-align:middle;' +
      'fill:none;stroke:currentColor;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round;' +
      'transition:transform .28s cubic-bezier(.22,.8,.2,1)}' +
    '.kl-all-btn[aria-expanded="true"] .kl-caret{transform:rotate(180deg)}' +

    /* الخلفية المعتمة */
    '.kl-scrim{position:fixed;inset:0;background:rgba(4,40,56,.40);opacity:0;visibility:hidden;z-index:60;' +
      'transition:opacity .25s ease,visibility 0s linear .25s}' +
    '.kl-scrim.kl-show{opacity:1;visibility:visible;transition:opacity .25s ease,visibility 0s}' +

    /* اللوحة */
    '.kl-mega{position:absolute;top:100%;left:0;width:min(560px,calc(100vw - 24px));padding-top:12px;' +
      'opacity:0;visibility:hidden;transform:translateY(-8px) scale(.98);transform-origin:top center;' +
      'pointer-events:none;z-index:80;direction:rtl;' +
      'transition:opacity .22s ease,transform .26s cubic-bezier(.22,.8,.2,1),visibility 0s linear .26s}' +
    '.kl-mega.kl-show{opacity:1;visibility:visible;transform:none;pointer-events:auto;' +
      'transition:opacity .22s ease,transform .26s cubic-bezier(.22,.8,.2,1),visibility 0s}' +
    '.kl-mega-card{position:relative;background:#fff;border:1px solid rgba(8,127,147,.14);border-radius:28px;' +
      'padding:16px;box-shadow:0 24px 54px rgba(0,70,100,.26),0 4px 14px rgba(0,70,100,.10)}' +
    '.kl-mega-card::before{content:"";position:absolute;top:-7px;left:calc(var(--kl-arrow,50%) - 7px);' +
      'width:14px;height:14px;background:#fff;border-top:1px solid rgba(8,127,147,.14);' +
      'border-left:1px solid rgba(8,127,147,.14);transform:rotate(45deg);border-radius:4px 0 0 0}' +
    '.kl-mega-top{display:flex;align-items:center;justify-content:space-between;gap:10px;' +
      'padding:2px 4px 12px;margin-bottom:12px;border-bottom:1px dashed #cfe6ee}' +
    '.kl-mega-title{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.08rem;color:var(--kl-turq-deep,#087f93)}' +
    '.kl-mega-title i{display:grid;place-items:center;width:34px;height:34px;border-radius:12px;font-style:normal;' +
      'background:linear-gradient(135deg,var(--kl-turq,#0a9fb0),var(--kl-turq-mid,#1ab3cf));color:#fff}' +
    '.kl-mega-title i svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.kl-mega-title small{display:block;font-weight:600;font-size:.74rem;color:#7a8da0;margin-top:1px}' +
    '.kl-mega-close{flex:none;width:36px;height:36px;display:grid;place-items:center;border:0;border-radius:50%;' +
      'background:#eef6f8;color:#4d6676;cursor:pointer;transition:background .2s,color .2s,transform .2s}' +
    '.kl-mega-close svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}' +
    '.kl-mega-close:hover{background:var(--kl-turq-deep,#087f93);color:#fff;transform:rotate(90deg)}' +
    '.kl-mega-close:focus-visible{outline:2px solid var(--kl-turq,#0a9fb0);outline-offset:2px}' +

    '.kl-mega-body{max-height:min(68vh,560px);overflow-y:auto;overscroll-behavior:contain;padding:2px;' +
      'scrollbar-width:thin;scrollbar-color:#b9dbe4 transparent}' +
    '.kl-mega-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}' +

    /* شبكة الأقسام الفرعية فقط */
    '.kl-mega-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px}' +
    '.kl-mega a.kl-mg-link{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
      'gap:9px;padding:16px 8px 13px;min-width:0;text-align:center;border-radius:20px;background:linear-gradient(180deg,#eef8fa,#fff);' +
      'border:1.5px solid #dcedf2;color:#173a4a;text-decoration:none;' +
      'animation:kl-rise .4s cubic-bezier(.22,.8,.2,1) both;' +
      'transition:background .2s,border-color .2s,transform .2s,box-shadow .2s,color .2s}' +
    '@keyframes kl-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
    '.kl-mg-ico{flex:none;width:54px;height:54px;display:grid;place-items:center;border-radius:18px;color:#fff;' +
      'background:linear-gradient(135deg,var(--kl-turq,#0a9fb0),var(--kl-turq-mid,#1ab3cf));' +
      'box-shadow:0 6px 14px rgba(10,159,176,.26);transition:background .2s,color .2s,transform .25s cubic-bezier(.34,1.56,.64,1)}' +
    '.kl-mg-ico svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}' +
    '.kl-mg-ico em{font-style:normal;font-size:25px;line-height:1}' +
    '.kl-mg-lbl{display:block;max-width:100%;font-weight:800;font-size:.95rem;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.kl-mg-hint{display:block;margin-top:-5px;font-size:.68rem;font-weight:600;color:#7a8da0;transition:color .2s}' +
    '.kl-mega a.kl-mg-link:hover,.kl-mega a.kl-mg-link:focus-visible{' +
      'background:linear-gradient(135deg,var(--kl-turq,#0a9fb0),var(--kl-turq-mid,#1ab3cf));border-color:transparent;color:#fff;' +
      'transform:translateY(-3px);box-shadow:0 10px 22px rgba(10,159,176,.30);outline:none}' +
    '.kl-mega a.kl-mg-link:hover .kl-mg-ico,.kl-mega a.kl-mg-link:focus-visible .kl-mg-ico{' +
      'background:rgba(255,255,255,.24);box-shadow:none;transform:scale(1.08) rotate(-4deg)}' +
    '.kl-mega a.kl-mg-link:hover .kl-mg-hint,.kl-mega a.kl-mg-link:focus-visible .kl-mg-hint{color:rgba(255,255,255,.85)}' +
    '.kl-mega a.kl-mg-link.kl-current{border-color:var(--kl-turq,#0a9fb0);background:#e4f6f9}' +
    '.kl-mega a.kl-mg-link.kl-current:hover{border-color:transparent}' +

    /* موبايل */
    '@media (max-width:640px){' +
      '.kl-mega-card{padding:12px;border-radius:24px}' +
      '.kl-mega-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}' +
      '.kl-mega-body{max-height:min(66vh,520px)}' +
      '.kl-mega a.kl-mg-link{padding:13px 6px 11px;border-radius:18px}' +
      '.kl-mg-ico{width:46px;height:46px;border-radius:15px}' +
      '.kl-mg-ico svg{width:24px;height:24px}' +
      '.kl-mg-lbl{font-size:.88rem}' +
    '}' +
    /* شريط الأقسام على الجوال: 6 عناصر في صفين (3 × 2) لتظهر كل الأقسام بأسمائها كاملة */
    '@media (max-width:700px){' +
      '.kl-menu{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:7px;width:calc(100% - 16px);border-radius:26px}' +
      '.kl-menu>a,.kl-menu>.kl-all-btn{flex:none;width:auto;min-width:0;justify-content:center;padding:10px 4px 8px;border-radius:20px;overflow:visible}' +
      '.kl-menu>a .ic,.kl-menu>.kl-all-btn .ic{width:1.4rem;height:1.4rem}' +
      '.kl-menu>a .kl-lbl,.kl-menu>.kl-all-btn .kl-lbl{display:block;width:100%;margin-top:5px;padding:0;' +
        'font-size:clamp(.72rem,3.4vw,.84rem);line-height:1.3;text-align:center;white-space:nowrap}' +
      '.kl-menu>.kl-all-btn .kl-caret{display:none}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){' +
      '.kl-mega,.kl-mega.kl-show,.kl-scrim,.kl-caret,.kl-mega a.kl-mg-link,.kl-mg-ico{transition:none!important;animation:none!important}}';

  function injectCSS() {
    if (document.getElementById('klMegaCSS')) return;
    var s = document.createElement('style');
    s.id = 'klMegaCSS';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- أدوات ---------- */
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function svg(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + path + '</svg>';
  }
  function subIcon(f) {
    return ICONS[f.key] ? svg(ICONS[f.key]) : '<em aria-hidden="true">' + esc(f.icon || '•') + '</em>';
  }
  function catIcon(key, cat) {
    return CAT_ICONS[key] ? svg(CAT_ICONS[key]) : '<em aria-hidden="true">' + esc((cat && cat.icon) || '•') + '</em>';
  }
  function currentSub() { return new URLSearchParams(location.search).get('sub'); }
  function currentPage() { return document.body ? document.body.getAttribute('data-page') : ''; }

  /* تطبيق فلتر القسم الفرعي على أزرار الصفحة الحالية */
  function applySub(key) {
    var box = document.getElementById('filters');
    if (!box) return false;
    var btns = box.querySelectorAll('.filter-btn');
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute('data-key') === key) {
        if (!btns[i].classList.contains('active')) btns[i].click();
        return true;
      }
    }
    return false;
  }

  function syncURL(key) {
    try {
      var u = new URL(location.href);
      if (!key || key === 'all') u.searchParams.delete('sub'); else u.searchParams.set('sub', key);
      history.replaceState(null, '', u.pathname + u.search + u.hash);
    } catch (e) {}
  }

  /* ---------- الحالة ---------- */
  var cur = null;       // { btn, panel, container, isOpen }
  var scrim = null;

  function getScrim() {
    if (scrim && document.body.contains(scrim)) return scrim;
    scrim = document.createElement('div');
    scrim.className = 'kl-scrim';
    document.body.appendChild(scrim);
    scrim.addEventListener('click', function () { close(); });
    return scrim;
  }

  /* ---------- البناء ---------- */
  function panelHTML() {
    var cats = getCats();
    var items = [];
    var count = {};
    Object.keys(cats).forEach(function (ck) {
      var cat = cats[ck];
      if (!cat || !cat.file || !cat.filters) return;
      cat.filters.forEach(function (f) {
        var l = f.label || f.key;
        count[l] = (count[l] || 0) + 1;
        items.push({ ck: ck, cat: cat, f: f, label: l });
      });
    });

    /* أقسام فرعية فقط؛ إن تكرر الاسم (مثل السماعات) يظهر تحته اسم قسمه بخط صغير للتمييز */
    var links = items.map(function (it) {
      return '<a class="kl-mg-link" data-cat="' + esc(it.ck) + '" data-key="' + esc(it.f.key) + '" href="' +
        esc(it.cat.file) + '?sub=' + encodeURIComponent(it.f.key) + '">' +
        '<span class="kl-mg-ico">' + subIcon(it.f) + '</span>' +
        '<span class="kl-mg-lbl">' + esc(it.label) + '</span>' +
        (count[it.label] > 1 ? '<span class="kl-mg-hint">' + esc(it.cat.title) + '</span>' : '') +
      '</a>';
    }).join('');

    return '<div class="kl-mega-card">' +
      '<div class="kl-mega-top">' +
        '<div class="kl-mega-title"><i>' + svg(GRID_ICON) + '</i>' +
          '<span>الأقسام<small>اختر ما تريد تصفحه</small></span></div>' +
        '<button type="button" class="kl-mega-close" aria-label="إغلاق">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>' +
      '<div class="kl-mega-body"><div class="kl-mega-grid">' + links + '</div></div>' +
    '</div>';
  }

  function build(menu) {
    var container = menu.closest('.kl-menu-in') || menu.parentNode;

    /* زر «الأقسام» — يوضع بعد «الرئيسية» */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'kl-all-btn';
    btn.id = 'klAllBtn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'klMega');
    btn.innerHTML =
      '<span class="kl-ico"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + GRID_ICON + '</svg></span>' +
      '<span class="kl-lbl">الأقسام<svg class="kl-caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span>';
    var home = menu.querySelector('a[href="index.html"]');
    menu.insertBefore(btn, home ? home.nextSibling : menu.firstChild);

    /* اللوحة */
    var old = document.getElementById('klMega');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var panel = document.createElement('div');
    panel.className = 'kl-mega';
    panel.id = 'klMega';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'جميع الأقسام');
    panel.innerHTML = panelHTML();
    container.appendChild(panel);

    cur = { btn: btn, panel: panel, container: container, isOpen: false };
    wire(cur);
  }

  /* ---------- الفتح والإغلاق ---------- */
  function place(rec) {
    var c = rec.container.getBoundingClientRect();
    var r = rec.btn.getBoundingClientRect();
    var w = rec.panel.offsetWidth;
    var vw = document.documentElement.clientWidth;
    var center = r.left + r.width / 2;
    var left = Math.max(12, Math.min(center - w / 2, vw - w - 12));
    rec.panel.style.left = (left - c.left) + 'px';
    rec.panel.style.setProperty('--kl-arrow', Math.max(26, Math.min(center - left, w - 26)) + 'px');
  }

  function markCurrent(rec) {
    var page = currentPage(), sub = currentSub();
    var ls = rec.panel.querySelectorAll('.kl-mg-link');
    for (var i = 0; i < ls.length; i++) {
      ls[i].classList.toggle('kl-current',
        !!sub && ls[i].getAttribute('data-cat') === page && ls[i].getAttribute('data-key') === sub);
    }
  }

  function open() {
    if (!cur || cur.isOpen) return;
    place(cur);
    markCurrent(cur);
    cur.panel.classList.add('kl-show');
    cur.btn.setAttribute('aria-expanded', 'true');
    getScrim().classList.add('kl-show');
    cur.isOpen = true;
  }

  function close() {
    if (!cur || !cur.isOpen) return;
    cur.panel.classList.remove('kl-show');
    cur.btn.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.classList.remove('kl-show');
    cur.isOpen = false;
  }

  function wire(rec) {
    rec.btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (rec.isOpen) close(); else open();
    });

    rec.panel.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest && t.closest('.kl-mega-close')) { close(); rec.btn.focus(); return; }

      var sub = t.closest ? t.closest('a.kl-mg-link') : null;
      var head = t.closest ? t.closest('a.kl-col-head') : null;
      var link = sub || head;
      if (!link) return;

      /* نفس صفحة القسم: فلترة بدون إعادة تحميل */
      if (link.getAttribute('data-cat') === currentPage()) {
        var key = sub ? sub.getAttribute('data-key') : 'all';
        if (applySub(key)) {
          e.preventDefault();
          syncURL(key);
          close();
          var title = document.querySelector('.page-title');
          if (title && title.scrollIntoView) title.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      close();
    });

    /* لوحة المفاتيح */
    rec.panel.addEventListener('keydown', function (e) {
      var els = Array.prototype.slice.call(rec.panel.querySelectorAll('a.kl-mg-link, a.kl-col-head, .kl-mega-close'));
      var i = els.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length].focus(); }
    });
    rec.btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        open();
        var f = rec.panel.querySelector('a.kl-mg-link');
        if (f) f.focus();
      }
    });
  }

  /* إغلاق: نقر خارج اللوحة / Escape / تغيير الحجم */
  document.addEventListener('click', function (e) {
    if (!cur || !cur.isOpen) return;
    if (cur.panel.contains(e.target) || cur.btn.contains(e.target)) return;
    close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cur && cur.isOpen) { close(); cur.btn.focus(); }
  });
  window.addEventListener('resize', function () { if (cur && cur.isOpen) place(cur); });

  function initFromURL() {
    var sub = currentSub();
    var onCategoryPage = Object.keys(getCats()).indexOf(currentPage()) !== -1;
    if (!onCategoryPage) return;

    /* تحديث الرابط عند الضغط على أزرار الفلاتر الأصلية */
    document.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('#filters .filter-btn') : null;
      if (b) syncURL(b.getAttribute('data-key'));
    });

    if (!sub) return;
    var tries = 0;
    (function tryApply() {
      if (applySub(sub)) return;
      if (++tries < 60) setTimeout(tryApply, 100);   // حتى 6 ثوانٍ
    })();
  }

  function boot() {
    var menu = document.querySelector('.kl-menu');
    if (menu && !menu.querySelector('.kl-all-btn')) {
      injectCSS();
      build(menu);
    }
  }

  function start() {
    boot();
    initFromURL();
    var host = document.getElementById('site-header') || document.body;
    new MutationObserver(function () {
      var m = document.querySelector('.kl-menu');
      if (m && !m.querySelector('.kl-all-btn')) boot();
    }).observe(host, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();