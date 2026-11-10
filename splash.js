/* =====================================
   صفحة الترحيب - متجر كلمات المصطفى
   تظهر مرة واحدة في كل زيارة (جلسة تصفح)
   ===================================== */
(function () {
  "use strict";

  var KEY = "kalimat_splash_seen";
  var HOLD = 2900;   // مدة العرض قبل الإغلاق (مللي ثانية)
  var EXIT = 900;    // مدة حركة الإغلاق

  // لا تعرض الصفحة إذا شاهدها الزائر في هذه الزيارة
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
  } catch (e) { /* إن تعذر التخزين تُعرض الصفحة عادي */ }

  var LOGO = "data:image/png;base64,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";

  var css = [
    "html.ks-lock{overflow:hidden!important}",
    "#ks{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;",
    "direction:rtl;font-family:'Cairo','Segoe UI',Tahoma,sans-serif;overflow:hidden;",
    "background:radial-gradient(60% 55% at 50% 40%,#ffffff 0%,#eaf3ff 58%,#d3e6fb 100%);",
    "transition:transform " + EXIT + "ms cubic-bezier(.76,0,.24,1),border-radius " + EXIT + "ms cubic-bezier(.76,0,.24,1);",
    "will-change:transform}",
    "#ks.ks-out{transform:translateY(-102%);border-radius:0 0 50% 50%/0 0 14vh 14vh}",

    /* المحتوى */
    "#ks .ks-box{position:relative;display:flex;flex-direction:column;align-items:center;",
    "padding:0 24px;text-align:center}",

    /* موجات الإشارة: فكرة الاتصالات */
    "#ks .ks-stage{position:relative;width:min(64vw,340px);aspect-ratio:400/206;margin-bottom:34px}",
    "#ks .ks-wave{position:absolute;left:50%;top:50%;width:150%;aspect-ratio:1;border-radius:50%;",
    "border:1.5px solid rgba(22,119,232,.34);transform:translate(-50%,-50%) scale(.2);opacity:0;",
    "animation:ks-wave 2.6s cubic-bezier(.2,.6,.3,1) infinite}",
    "#ks .ks-wave:nth-child(2){animation-delay:.65s}",
    "#ks .ks-wave:nth-child(3){animation-delay:1.3s}",
    "@keyframes ks-wave{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}",
    "15%{opacity:.9}100%{transform:translate(-50%,-50%) scale(1.9);opacity:0}}",

    /* الشعار: يُكشف من اليمين لليسار */
    "#ks .ks-logo{position:relative;display:block;width:100%;height:100%;object-fit:contain;",
    "clip-path:inset(0 0 0 100%);transform:scale(.9);",
    "animation:ks-logo 1s cubic-bezier(.65,0,.2,1) .15s forwards}",
    "@keyframes ks-logo{0%{clip-path:inset(0 0 0 100%);transform:scale(.9)}",
    "100%{clip-path:inset(0 0 0 0);transform:scale(1)}}",

    /* النصوص */
    "#ks .ks-hello{margin:0;font-size:clamp(15px,3.6vw,19px);font-weight:600;color:#718198;",
    "opacity:0;transform:translateY(10px);animation:ks-up .7s ease .95s forwards}",
    "#ks .ks-name{margin:2px 0 0;font-size:clamp(25px,6.6vw,40px);font-weight:800;line-height:1.3;color:#0b4fa8;",
    "opacity:0;clip-path:inset(0 0 0 100%);animation:ks-name .9s cubic-bezier(.65,0,.2,1) 1.15s forwards}",
    "@keyframes ks-up{to{opacity:1;transform:none}}",
    "@keyframes ks-name{0%{opacity:1;clip-path:inset(0 0 0 100%)}100%{opacity:1;clip-path:inset(0 0 0 0)}}",

    /* شريط التحميل */
    "#ks .ks-bar{width:min(46vw,190px);height:3px;margin-top:30px;border-radius:3px;background:#cfe2f7;overflow:hidden;",
    "opacity:0;animation:ks-fade .4s ease .5s forwards}",
    "#ks .ks-bar i{display:block;height:100%;width:100%;border-radius:3px;transform-origin:right center;transform:scaleX(0);",
    "background:linear-gradient(270deg,#1677e8,#2db4e0);",
    "animation:ks-bar " + (HOLD - 700) + "ms cubic-bezier(.5,.1,.3,1) .6s forwards}",
    "@keyframes ks-fade{to{opacity:1}}",
    "@keyframes ks-bar{to{transform:scaleX(1)}}",

    /* زر التخطي */
    "#ks .ks-skip{position:absolute;bottom:max(26px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);",
    "background:none;border:0;font:600 14px 'Cairo',sans-serif;color:#718198;padding:8px 18px;border-radius:20px;",
    "cursor:pointer;opacity:0;animation:ks-fade .5s ease 1.2s forwards}",
    "#ks .ks-skip:hover{color:#0b4fa8;background:rgba(22,119,232,.08)}",
    "#ks .ks-skip:focus-visible{outline:2px solid #1677e8;outline-offset:2px}",

    /* تقليل الحركة */
    "@media (prefers-reduced-motion:reduce){",
    "#ks{transition:opacity .4s ease}",
    "#ks.ks-out{transform:none;opacity:0;border-radius:0}",
    "#ks .ks-wave{display:none}",
    "#ks .ks-logo,#ks .ks-name{animation:ks-fade .5s ease forwards;clip-path:none;transform:none;opacity:0}",
    "#ks .ks-hello{animation:ks-fade .5s ease .2s forwards;transform:none}",
    "#ks .ks-bar i{animation:ks-bar " + (HOLD - 700) + "ms linear .2s forwards}}"
  ].join("");

  var el = document.createElement("div");
  el.id = "ks";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "مرحباً بكم في كلمات المصطفى للاتصالات");
  el.innerHTML =
    "<style>" + css + "</style>" +
    '<div class="ks-box">' +
      '<div class="ks-stage" aria-hidden="true">' +
        '<span class="ks-wave"></span><span class="ks-wave"></span><span class="ks-wave"></span>' +
        '<img class="ks-logo" src="' + LOGO + '" alt="">' +
      "</div>" +
      '<p class="ks-hello">أهلاً بكم في</p>' +
      '<h1 class="ks-name">كلمات المصطفى للاتصالات</h1>' +
      '<div class="ks-bar" aria-hidden="true"><i></i></div>' +
    "</div>" +
    '<button type="button" class="ks-skip">تخطي</button>';

  var root = document.documentElement;
  root.classList.add("ks-lock");
  root.appendChild(el);

  var closed = false;
  function close() {
    if (closed) return;
    closed = true;
    el.classList.add("ks-out");
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
      root.classList.remove("ks-lock");
    }, EXIT + 80);
  }

  el.querySelector(".ks-skip").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  setTimeout(close, HOLD);

  // حماية: لا تبقى الصفحة أبداً أكثر من مدة معقولة
  setTimeout(function () {
    if (el.parentNode) el.parentNode.removeChild(el);
    root.classList.remove("ks-lock");
  }, HOLD + EXIT + 2500);
})();