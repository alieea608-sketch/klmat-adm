/* =====================================
   مساعد اختيار الجهاز (هاتف أو تابلت) - متجر كلمات المصطفى
   يسأل الزبون عن ميزانيته واستخدامه (والماركة اختيارياً)
   ثم يعرض الهواتف المناسبة من منتجات المتجر الحقيقية.

   يُحمَّل قبل main.js ويُشغَّل منه عبر KLFinder.init(...)
   حقل "مناسب لـ" في لوحة الإدارة يُخزَّن في المنتج باسم uses
   وقيمه: gaming | camera | battery | work | basic
===================================== */

(function () {
  "use strict";

  /* ---------- الخيارات ---------- */

  const BUDGETS = [
    { id: "b1", label: "أقل من 300 ألف", hint: "اقتصادية",  min: 0,       max: 300000 },
    { id: "b2", label: "300 – 600 ألف",  hint: "متوسطة",    min: 300000,  max: 600000 },
    { id: "b3", label: "600 ألف – مليون", hint: "متقدمة",   min: 600000,  max: 1000000 },
    { id: "b4", label: "أكثر من مليون",  hint: "رائدة",     min: 1000000, max: Infinity }
  ];

  const USES = [
    { id: "gaming",  label: "ألعاب",        hint: "أداء قوي وشاشة سلسة",        to: "للألعاب" },
    { id: "camera",  label: "تصوير",        hint: "صور وفيديو بجودة عالية",     to: "للتصوير" },
    { id: "battery", label: "بطارية قوية",  hint: "تكفي يوماً كاملاً وأكثر",    to: "لمن يهمه عمر البطارية" },
    { id: "work",    label: "دراسة وعمل",   hint: "تطبيقات ومكالمات وملفات",    to: "للدراسة والعمل" },
    { id: "basic",   label: "استخدام عادي", hint: "اتصال وتصفح وتواصل اجتماعي", to: "للاستخدام اليومي" }
  ];

  const BRAND_NAMES = {
    apple: "Apple", samsung: "Samsung", redmi: "Redmi", xiaomi: "Xiaomi",
    tecno: "Tecno", honor: "Honor", zte: "ZTE", redmagic: "RedMagic",
    huawei: "Huawei", nubia: "Nubia", realme: "realme", motorola: "Motorola",
    poco: "POCO", other: "أخرى"
  };

  const TYPES = [
    { id: "phone",  label: "هاتف",  hint: "موبايلات ذكية بكل الماركات", icon: "basic",  one: "هاتف",  many: "الهواتف", pl: "هواتف" },
    { id: "tablet", label: "تابلت", hint: "شاشة كبيرة للدراسة والترفيه", icon: "tablet", one: "تابلت", many: "التابلتات", pl: "تابلتات" }
  ];
  const typeOf = id => TYPES.find(x => x.id === id) || TYPES[0];

  const NOTE_BUDGET = n => `لا توجد ${n} متوفرة ضمن هذه الميزانية حالياً، وهذه أقرب الخيارات إليها.`;
  const NOTE_BRAND  = n => `لا توجد ${n} من الماركة المختارة ضمن ميزانيتك، وهذه أنسب البدائل.`;
  const NOTE_USE    = n => `لم يُحدَّد بعد جهاز لهذا الاستخدام ضمن ميزانيتك، وهذه أفضل ${n} المتاحة فيها.`;

  /* ---------- أيقونات ---------- */

  const ICONS = {
    spark:   '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    gaming:  '<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-3.9 3.2l-1.5 7A2.5 2.5 0 0 0 5.2 18l1.6-1.6a2 2 0 0 1 1.4-.6h7.6a2 2 0 0 1 1.4.6l1.6 1.6a2.5 2.5 0 0 0 3.9-2.8l-1.5-7A4 4 0 0 0 17.3 5z"/>',
    camera:  '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    battery: '<rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2M6 11v2M10 11v2"/>',
    work:    '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    basic:   '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    tablet:  '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M11 17h2"/>',
    check:   '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    close:   '<path d="M6 6l12 12M18 6 6 18"/>',
    info:    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    star:    '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    back:    '<path d="m9 5 7 7-7 7"/>',
    cart:    '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>',
    edit:    '<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/>'
  };

  const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";

  const svg = (name, cls) =>
    `<svg class="kf-ic${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

  const esc = s => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  /* ---------- الحالة ---------- */

  let api = null;
  let host = null;
  let modal = null;
  let lastFocus = null;
  let state = fresh();

  function fresh() {
    return { step: 1, type: null, budget: null, uses: [], brands: [], used: false };
  }

  /* ---------- بيانات الهواتف ---------- */

  const priceOf = p => api.cardPrice(p).price;

  const isPhoneSub = s => /موبايل|هاتف|هواتف|جوال/.test(String(s || "")) && !/مستعمل/.test(String(s || ""));
  const isTabletSub = s => /تابلت|لوحي/.test(String(s || ""));
  const isUsedSub = s => /مستعمل/.test(String(s || ""));

  function phonePool(includeUsed, type) {
    const kind = type || "phone";
    return api.products().filter(p =>
      p && p.cat === "smart" &&
      (kind === "tablet"
        ? isTabletSub(p.sub)
        : (isPhoneSub(p.sub) || (includeUsed && isUsedSub(p.sub)))) &&
      api.isOrderable(p) && priceOf(p) > 0
    );
  }

  const inRange = (x, b) => x >= b.min && x <= b.max;
  const distance = (p, b) => {
    const x = priceOf(p);
    return x < b.min ? b.min - x : x > b.max ? x - b.max : 0;
  };

  function scoreOf(p, s, outOfBudget) {
    const b = s.budget;
    const tags = Array.isArray(p.uses) ? p.uses : [];
    const matched = [];
    let score = 0;

    s.uses.forEach(u => {
      if (tags.includes(u)) { matched.push(u); score += 100; }
    });
    if (s.uses.includes("basic") && !tags.length) score += 30;
    if (s.brands.includes(p.brand)) score += 60;

    const cp = api.cardPrice(p);
    const pct = cp.old > cp.price && cp.price > 0
      ? Math.round((1 - cp.price / cp.old) * 100) : 0;
    if (pct > 0) score += 15;

    const x = cp.price;
    if (outOfBudget) {
      score -= Math.min(60, distance(p, b) / Math.max(b.min || b.max, 100000) * 60);
    } else {
      // داخل الميزانية: الأقرب إلى سقفها يعطي مواصفات أعلى غالباً
      const span = b.max === Infinity ? 1500000 : b.max - b.min;
      score += 25 * Math.max(0, Math.min(1, (x - b.min) / span));
    }

    return { p, score, matched, pct };
  }

  function recommend(s) {
    const b = s.budget;
    const all = phonePool(s.used, s.type);
    const noun = typeOf(s.type).many;
    const pl = typeOf(s.type).pl;
    const notes = [];
    let list = all.filter(p => inRange(priceOf(p), b));
    let outOfBudget = false;

    if (!list.length) {
      outOfBudget = true;
      list = all.slice().sort((x, y) => distance(x, b) - distance(y, b)).slice(0, 8);
      if (list.length) notes.push(NOTE_BUDGET(pl));
    } else if (s.brands.length) {
      const byBrand = list.filter(p => s.brands.includes(p.brand));
      if (byBrand.length) list = byBrand;
      else notes.push(NOTE_BRAND(pl));
    }

    const ranked = list
      .map(p => scoreOf(p, s, outOfBudget))
      .sort((a, c) => c.score - a.score || priceOf(a.p) - priceOf(c.p))
      .slice(0, 4);

    const needsTags = s.uses.some(u => u !== "basic");
    if (needsTags && ranked.length && !ranked.some(r => r.matched.length)) {
      notes.push(NOTE_USE(noun));
    }

    ranked.forEach(r => {
      const why = [];
      if (r.matched.length) {
        why.push("مناسب " + r.matched
          .map(id => USES.find(u => u.id === id).to).join(" و"));
      }
      const x = priceOf(r.p);
      if (!outOfBudget) why.push("ضمن ميزانيتك");
      else if (x > b.max) why.push("أعلى من ميزانيتك بـ " + api.money(x - b.max));
      else why.push("أقل من ميزانيتك");
      if (s.brands.includes(r.p.brand)) why.push("من ماركتك المفضلة");
      if (r.pct > 0) why.push("عليه خصم " + r.pct + "%");
      r.why = why;
    });

    return { items: ranked, notes };
  }

  /* ---------- مكوّنات العرض ---------- */

  function tile(attrs, on, icon, title, hint, extra) {
    return `<button type="button" class="kf-opt${on ? " on" : ""}" ${attrs} aria-pressed="${on}">
      ${icon ? `<span class="kf-ico">${svg(icon)}</span>` : ""}
      ${extra || ""}
      <strong>${esc(title)}</strong>
      <small>${esc(hint)}</small>
      <span class="kf-tick">${svg("check")}</span>
    </button>`;
  }

  function viewType() {
    return `<h3 class="kf-q" tabindex="-1">ماذا تريد أن تشتري؟</h3>
      <p class="kf-qhint">اختر نوع الجهاز لنعرض لك ما يناسبه.</p>
      <div class="kf-grid kf-types">
        ${TYPES.map(x => {
          const has = phonePool(true, x.id).length > 0;
          return tile(`data-type="${x.id}"${has ? "" : " disabled"}`, state.type === x.id, x.icon, x.label, has ? x.hint : "غير متوفر حالياً");
        }).join("")}
      </div>`;
  }

  function viewBudget() {
    return `<h3 class="kf-q" tabindex="-1">كم ميزانيتك؟</h3>
      <p class="kf-qhint">اختر النطاق الأقرب لما تنوي دفعه، بالدينار العراقي.</p>
      <div class="kf-grid kf-budgets">
        ${BUDGETS.map((b, n) => tile(`data-budget="${b.id}"`, state.budget && state.budget.id === b.id, "", b.label, b.hint,
          `<span class="kf-level" aria-hidden="true">${[0, 1, 2, 3].map(k => `<i class="${k <= n ? "f" : ""}"></i>`).join("")}</span>`)).join("")}
      </div>`;
  }

  function viewUses() {
    return `<h3 class="kf-q" tabindex="-1">ما أهم استخدام ${state.type === "tablet" ? "للتابلت" : "للهاتف"}؟</h3>
      <p class="kf-qhint">يمكنك اختيار أكثر من استخدام.</p>
      <div class="kf-grid kf-uses">
        ${USES.map(u => tile(`data-use="${u.id}"`, state.uses.includes(u.id), u.id, u.label, u.hint)).join("")}
      </div>`;
  }

  function viewBrands() {
    const counts = {};
    phonePool(true, state.type).forEach(p => { counts[p.brand] = (counts[p.brand] || 0) + 1; });
    const brands = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    const hasUsed = state.type !== "tablet" && api.products().some(p => p && p.cat === "smart" && isUsedSub(p.sub) && api.isOrderable(p));

    const chip = (attr, on, name, logo) => `<button type="button" class="kf-chip${on ? " on" : ""}" ${attr} aria-pressed="${on}">
      ${logo ? `<img src="${logo}" alt="" width="22" height="22">` : ""}
      <span>${esc(name)}</span>
    </button>`;

    return `<h3 class="kf-q" tabindex="-1">هل تفضّل ماركة معينة؟</h3>
      <p class="kf-qhint">هذه الخطوة اختيارية، ويمكنك تجاوزها.</p>
      <div class="kf-chips">
        ${chip('data-brand="any"', !state.brands.length, "لا يهم", "")}
        ${brands.map(id => chip(`data-brand="${esc(id)}"`, state.brands.includes(id),
            BRAND_NAMES[id] || id, api.brandLogo ? api.brandLogo(id) : "")).join("")}
      </div>
      ${hasUsed ? `<label class="kf-switch">
        <input type="checkbox" id="kfUsed" ${state.used ? "checked" : ""}>
        <span class="kf-track" aria-hidden="true"></span>
        <span>أضف الهواتف المستعملة إلى النتائج</span>
      </label>` : ""}`;
  }

  function summaryText() {
    const parts = [];
    if (state.type) parts.push(["النوع", typeOf(state.type).label]);
    if (state.budget) parts.push(["الميزانية", state.budget.label]);
    if (state.uses.length) {
      parts.push(["الاستخدام", state.uses.map(id => USES.find(u => u.id === id).label).join("، ")]);
    }
    if (state.brands.length) {
      parts.push(["الماركة", state.brands.map(id => BRAND_NAMES[id] || id).join("، ")]);
    }
    return parts;
  }

  function waLink(items) {
    const lines = ["مرحباً، أحتاج مساعدة في اختيار " + typeOf(state.type).one + "."];
    summaryText().forEach(([k, v]) => lines.push(k + ": " + v));
    if (items && items.length) {
      lines.push("رشّحها لي المساعد: " + items.map(r => r.p.name).join("، "));
    }
    return "https://wa.me/" + api.phone + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function resultCard(it, i) {
    const p = it.p;
    const cp = api.cardPrice(p);
    const link = "product.html?id=" + encodeURIComponent(p.id);
    const pct = cp.old > cp.price && cp.price > 0 ? Math.round((1 - cp.price / cp.old) * 100) : 0;
    const emoji = esc(p.emoji || "📱");
    const img = p.images && p.images[0]
      ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" onerror="window.imgFail&&imgFail(this,'${emoji}')">`
      : `<span class="kf-emoji">${emoji}</span>`;
    const specs = Object.entries(p.specs || {})
      .filter(([k, v]) => k && v !== "" && v != null && typeof v !== "object").slice(0, 3);

    return `<article class="kf-rc${i === 0 ? " first" : ""}">
      <a class="kf-rc-img" href="${link}" aria-label="${esc(p.name)}">
        ${pct ? `<span class="kf-off">خصم ${pct}%</span>` : ""}${img}
      </a>
      <div class="kf-rc-body">
        ${i === 0 ? `<span class="kf-best">${svg("star")}الأنسب لك</span>` : ""}
        <h4><a href="${link}">${esc(p.name)}</a></h4>
        <ul class="kf-why">${it.why.map(w => `<li>${svg("check")}${esc(w)}</li>`).join("")}</ul>
        ${specs.length ? `<dl class="kf-specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
        <div class="kf-rc-foot">
          <div class="kf-price">
            ${cp.from ? "<small>من</small>" : ""}<b>${api.money(cp.price)}</b>${cp.old > cp.price ? `<s>${api.money(cp.old)}</s>` : ""}
          </div>
          <div class="kf-rc-actions">
            <a class="kf-btn sm" href="${link}">التفاصيل</a>
            <button type="button" class="kf-cart add-btn" data-id="${esc(p.id)}" aria-label="أضف ${esc(p.name)} للسلة" title="${(p.storages || []).length ? "اختر الذاكرة" : "أضف للسلة"}">${svg("cart")}</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function viewResults() {
    const r = recommend(state);
    const sum = summaryText()
      .map(([k, v]) => `<span class="kf-tag"><em>${esc(k)}</em>${esc(v)}</span>`).join("");

    if (!r.items.length) {
      return `<h3 class="kf-q" tabindex="-1">لا توجد ${typeOf(state.type).pl} متوفرة حالياً</h3>
        <p class="kf-qhint">تواصل معنا وسنساعدك في إيجاد الجهاز المناسب.</p>`;
    }

    return `<div class="kf-sum">
        <div class="kf-sum-tags">${sum}</div>
        <button type="button" class="kf-link" data-act="restart">${svg("edit")}<span>تعديل الاختيارات</span></button>
      </div>
      <h3 class="kf-q" tabindex="-1">${r.items.length === 1 ? "هذا أنسب " + typeOf(state.type).one + " لك" : "هذه أنسب " + typeOf(state.type).many + " لك"}</h3>
      ${r.notes.map(n => `<p class="kf-note">${svg("info")}<span>${esc(n)}</span></p>`).join("")}
      <div class="kf-results">
        ${r.items.map(resultCard).join("")}
      </div>`;
  }

  function foot() {
    const s = state;
    const back = `<button type="button" class="kf-btn ghost" data-act="back">رجوع</button>`;
    if (s.step === 1) return "";
    if (s.step === 2) return back;
    if (s.step === 3) {
      return back + `<button type="button" class="kf-btn" data-act="next" id="kfNext" ${s.uses.length ? "" : "disabled"}>التالي</button>`;
    }
    if (s.step === 4) {
      return back + `<button type="button" class="kf-btn" data-act="show">اعرض الأجهزة المناسبة</button>`;
    }
    const r = recommend(s);
    return `<button type="button" class="kf-btn ghost" data-act="restart">ابدأ من جديد</button>
      <div class="kf-foot-end">
        <a class="kf-btn wa" href="${esc(waLink(r.items))}" target="_blank" rel="noopener">
          <svg class="kf-ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>
          اسأل عبر واتساب
        </a>
        <a class="kf-btn" href="smart-devices.html">كل الأجهزة</a>
      </div>`;
  }

  const SUBS = {
    1: "الخطوة 1 من 4",
    2: "الخطوة 2 من 4",
    3: "الخطوة 3 من 4",
    4: "الخطوة 4 من 4",
    5: "اخترنا لك من منتجات المتجر المتوفرة"
  };

  function render() {
    const sheet = modal.querySelector(".kf-sheet");
    const body = modal.querySelector(".kf-body");

    body.innerHTML =
      state.step === 1 ? viewType() :
      state.step === 2 ? viewBudget() :
      state.step === 3 ? viewUses() :
      state.step === 4 ? viewBrands() : viewResults();

    modal.querySelector(".kf-foot").innerHTML = foot();
    modal.querySelector("#kfSub").textContent = SUBS[state.step];
    sheet.dataset.step = state.step;
    modal.querySelectorAll(".kf-progress i").forEach((el, i) => {
      el.classList.toggle("on", i < Math.min(state.step, 4) || state.step === 5);
    });

    body.scrollTop = 0;
    const q = body.querySelector(".kf-q");
    if (q) q.focus({ preventScroll: true });
  }

  /* ---------- فتح وإغلاق ---------- */

  function open() {
    if (!api || !modal) return;
    lastFocus = document.activeElement;
    state = fresh();
    modal.classList.add("open");
    document.body.classList.add("kf-lock");
    render();
  }

  function close() {
    if (!modal || !modal.classList.contains("open")) return;
    modal.classList.remove("open");
    document.body.classList.remove("kf-lock");
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function onKey(e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;

    const f = [...modal.querySelectorAll(
      'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
    )].filter(el => el.offsetParent !== null);
    if (!f.length) return;

    const first = f[0], last = f[f.length - 1];
    if (!modal.contains(document.activeElement)) { first.focus(); e.preventDefault(); }
    else if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  }

  function onClick(e) {
    const t = e.target;

    if (t.closest("[data-kf-close]")) { close(); return; }
    if (t.closest(".add-btn")) { close(); return; }   // السلة تُفتح بعدها من main.js

    const typ = t.closest("[data-type]");
    if (typ) {
      const nextType = typ.dataset.type;
      if (state.type !== nextType) { state.brands = []; state.used = false; }
      state.type = nextType;
      modal.querySelectorAll("[data-type]").forEach(el => {
        const on = el === typ;
        el.classList.toggle("on", on);
        el.setAttribute("aria-pressed", on);
      });
      setTimeout(() => { state.step = 2; render(); }, 180);
      return;
    }

    const bud = t.closest("[data-budget]");
    if (bud) {
      state.budget = BUDGETS.find(b => b.id === bud.dataset.budget) || null;
      modal.querySelectorAll("[data-budget]").forEach(el => {
        const on = el === bud;
        el.classList.toggle("on", on);
        el.setAttribute("aria-pressed", on);
      });
      setTimeout(() => { state.step = 3; render(); }, 180);
      return;
    }

    const use = t.closest("[data-use]");
    if (use) {
      const id = use.dataset.use;
      state.uses = state.uses.includes(id) ? state.uses.filter(x => x !== id) : [...state.uses, id];
      const on = state.uses.includes(id);
      use.classList.toggle("on", on);
      use.setAttribute("aria-pressed", on);
      const next = modal.querySelector("#kfNext");
      if (next) next.disabled = !state.uses.length;
      return;
    }

    const br = t.closest("[data-brand]");
    if (br) {
      const id = br.dataset.brand;
      if (id === "any") state.brands = [];
      else state.brands = state.brands.includes(id) ? state.brands.filter(x => x !== id) : [...state.brands, id];
      modal.querySelectorAll("[data-brand]").forEach(el => {
        const key = el.dataset.brand;
        const on = key === "any" ? !state.brands.length : state.brands.includes(key);
        el.classList.toggle("on", on);
        el.setAttribute("aria-pressed", on);
      });
      return;
    }

    const act = t.closest("[data-act]");
    if (!act) return;
    const a = act.dataset.act;
    if (a === "back") { state.step = Math.max(1, state.step - 1); render(); }
    else if (a === "next") { if (state.uses.length) { state.step = 4; render(); } }
    else if (a === "show") { state.step = 5; render(); }
    else if (a === "restart") { state = fresh(); render(); }
  }

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "kf-modal";
    modal.innerHTML = `
      <div class="kf-backdrop" data-kf-close></div>
      <div class="kf-sheet" role="dialog" aria-modal="true" aria-labelledby="kfTitle">
        <header class="kf-head">
          <span class="kf-mark">${svg("spark")}</span>
          <div class="kf-head-text">
            <h2 id="kfTitle">مساعد اختيار الجهاز</h2>
            <p id="kfSub"></p>
          </div>
          <button type="button" class="kf-x" data-kf-close aria-label="إغلاق">${svg("close")}</button>
          <div class="kf-progress" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        </header>
        <div class="kf-body"></div>
        <footer class="kf-foot"></footer>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", onClick);
    modal.addEventListener("change", e => {
      if (e.target.id === "kfUsed") state.used = e.target.checked;
    });
    document.addEventListener("keydown", onKey);
  }

  /* ---------- بطاقة الدعوة في الصفحة ---------- */

  function renderCta() {
    if (!host) return;
    const slim = api.page !== "home";
    host.classList.add("kf-cta");
    host.classList.toggle("kf-slim", slim);

    host.innerHTML = `
      <div class="kf-cta-copy">
        <span class="kf-cta-tag">${svg("spark")}مساعد الاختيار</span>
        <h2>محتار في اختيار هاتفك أو تابلتك؟</h2>
        <p>أجب عن أسئلة قصيرة، ونرشّح لك الأجهزة المناسبة لميزانيتك واستخدامك.</p>
        <button type="button" class="kf-cta-btn" data-kf-open>${svg("spark")}ساعدني أختار جهازي</button>
        <ul class="kf-cta-points">
          <li>${svg("check")}أقل من دقيقة</li>
          <li>${svg("check")}من منتجاتنا المتوفرة</li>
        </ul>
      </div>
      ${slim ? "" : `<ol class="kf-steps" aria-hidden="true">
        <li><b>1</b><span>هاتف أو تابلت</span></li>
        <li><b>2</b><span>ميزانيتك واستخدامك</span></li>
        <li class="end"><b>${svg("check")}</b><span>جهازك المناسب</span></li>
      </ol>`}`;
    host.hidden = false;
  }

  /* ---------- التشغيل ---------- */

  function init(options) {
    api = options;
    host = document.getElementById("phoneFinder");
    if (!host) { console.warn("[KLFinder] عنصر phoneFinder غير موجود في الصفحة. تأكد من رفع index.html الجديد."); return; }
    if (host.dataset.ready === "1") return;
    if (!phonePool(true, "phone").length && !phonePool(true, "tablet").length) {
      host.hidden = true;
      const all = api.products();
      console.warn("[KLFinder] لا توجد هواتف مؤهلة للمساعد. عدد منتجات الأجهزة الذكية:",
        all.filter(p => p && p.cat === "smart").length,
        "| التصنيفات الفرعية:", [...new Set(all.filter(p => p && p.cat === "smart").map(p => p.sub))],
        "| المتوفر منها للطلب:", all.filter(p => p && p.cat === "smart" && api.isOrderable(p)).length);
      return;
    }

    host.dataset.ready = "1";
    buildModal();
    renderCta();

    host.addEventListener("click", e => {
      if (e.target.closest("[data-kf-open]")) open();
    });
  }

  window.KLFinder = { init, open, close, _recommend: s => recommend(s), _budgets: BUDGETS };
})();