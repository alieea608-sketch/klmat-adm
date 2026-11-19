/* =====================================
   نافذة الترحيب - متجر كلمات المصطفى
   شبكة اتصال متحركة ← كشف الشعار من اليمين ← توهّج وحلقات ولمعة ونجوم
   ← أقسام المتجر ← إغلاق دائري ناعم. مع زر تخطي بحلقة تقدّم.
   تظهر مرة واحدة في كل جلسة تصفح.
===================================== */
(function () {
  "use strict";

  var KEY = "kalimat_splash_seen";
  var HOLD = 3200;   // مدة العرض قبل الإغلاق (مللي ثانية)
  var EXIT = 850;    // مدة حركة الإغلاق

  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, "1");
  } catch (e) { /* إن تعذر التخزين تُعرض النافذة عادي */ }

  var LOGO = "data:image/png;base64,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";

  var reduce = false;
  try { reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) {}
  var dark = document.documentElement.getAttribute("data-theme") === "dark";

  var css = `
html.ks-lock{overflow:hidden!important}
#ks{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;overflow:hidden;display:flex;flex-direction:column;
  align-items:center;justify-content:center;direction:rtl;
  font-family:'Cairo','Segoe UI',Tahoma,sans-serif;
  background:linear-gradient(160deg,#ffffff 0%,#f1f8ff 45%,#dcecfb 100%);
  -webkit-clip-path:circle(150% at 50% 50%);clip-path:circle(150% at 50% 50%);
  transition:clip-path ${EXIT}ms cubic-bezier(.76,0,.24,1),-webkit-clip-path ${EXIT}ms cubic-bezier(.76,0,.24,1)}
#ks.ks-out{-webkit-clip-path:circle(0% at 50% 50%);clip-path:circle(0% at 50% 50%)}

/* ===== الخلفية ===== */
#ks .ks-orb{position:absolute;border-radius:50%;pointer-events:none;will-change:transform;opacity:0}
#ks .ks-o1{width:68vmax;height:68vmax;top:-30vmax;right:-24vmax;
  background:radial-gradient(circle,rgba(45,180,224,.38) 0%,rgba(45,180,224,0) 65%);
  animation:ks-fade 1.4s ease .05s forwards,ks-d1 9s ease-in-out infinite alternate}
#ks .ks-o2{width:62vmax;height:62vmax;bottom:-28vmax;left:-22vmax;
  background:radial-gradient(circle,rgba(22,119,232,.28) 0%,rgba(22,119,232,0) 65%);
  animation:ks-fade 1.4s ease .05s forwards,ks-d2 11s ease-in-out infinite alternate}
@keyframes ks-d1{to{transform:translate(-8vmax,9vmax) scale(1.14)}}
@keyframes ks-d2{to{transform:translate(10vmax,-7vmax) scale(1.1)}}

#ks .ks-rays{position:absolute;left:50%;top:44%;width:150vmax;height:150vmax;margin:-75vmax 0 0 -75vmax;border-radius:50%;
  pointer-events:none;opacity:0;will-change:transform;
  background:repeating-conic-gradient(rgba(45,180,224,.16) 0deg 6deg,rgba(45,180,224,0) 6deg 18deg);
  -webkit-mask-image:radial-gradient(circle,#000 0%,rgba(0,0,0,.45) 18%,transparent 50%);
  mask-image:radial-gradient(circle,#000 0%,rgba(0,0,0,.45) 18%,transparent 50%);
  animation:ks-raysin 1.8s ease .7s forwards,ks-spin 60s linear infinite}
@keyframes ks-raysin{to{opacity:1}}
@keyframes ks-spin{to{transform:rotate(360deg)}}

#ks .ks-cv{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0;animation:ks-fade 1.2s ease .1s forwards}

/* ===== الشعار ===== */
#ks .ks-stage{position:relative;width:min(60vw,300px);animation:ks-float 3.8s ease-in-out 2s infinite;
  transition:transform ${EXIT}ms cubic-bezier(.76,0,.24,1),opacity ${Math.round(EXIT * .7)}ms ease}
#ks.ks-out .ks-stage{transform:scale(1.25);opacity:0;animation:none}

#ks .ks-glow{position:absolute;left:50%;top:50%;width:190%;aspect-ratio:1;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(45,180,224,.42) 0%,rgba(45,180,224,0) 62%);
  transform:translate(-50%,-50%) scale(.6);opacity:0;animation:ks-glow 2.6s ease-in-out 1s infinite alternate}
@keyframes ks-glow{0%{opacity:.55;transform:translate(-50%,-50%) scale(.85)}100%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}}

#ks .ks-ring{position:absolute;left:50%;top:50%;width:105%;aspect-ratio:1;border-radius:50%;pointer-events:none;
  border:1.5px solid rgba(22,119,232,.32);transform:translate(-50%,-50%) scale(.4);opacity:0;
  animation:ks-ring 3.2s cubic-bezier(.2,.6,.3,1) 1.15s infinite}
#ks .ks-r2{animation-delay:2.2s}
@keyframes ks-ring{0%{transform:translate(-50%,-50%) scale(.4);opacity:0}18%{opacity:.85}100%{transform:translate(-50%,-50%) scale(2);opacity:0}}

#ks .ks-card{position:relative;opacity:0;animation:ks-pop 1.3s cubic-bezier(.2,.8,.2,1) .4s forwards,ks-wipe 1.05s cubic-bezier(.65,0,.25,1) .4s both}
#ks .ks-lbox{position:relative;line-height:0}
#ks .ks-logo{display:block;width:100%;height:auto}
@keyframes ks-pop{0%{opacity:0;transform:scale(.88);filter:blur(10px)}55%{opacity:1;transform:scale(1.035);filter:blur(0)}100%{opacity:1;transform:none;filter:blur(0)}}
@keyframes ks-wipe{from{clip-path:inset(-60px -60px -60px 100%)}to{clip-path:inset(-60px -60px -60px -60px)}}

#ks .ks-shine{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;
  -webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;
  background:linear-gradient(105deg,transparent 36%,rgba(255,255,255,.98) 50%,transparent 64%);
  background-size:260% 100%;background-position:160% 0;animation:ks-shine 2.4s ease-in-out 1.5s infinite}
@keyframes ks-shine{0%{background-position:160% 0}55%,100%{background-position:-60% 0}}

/* نجوم لامعة */
#ks .ks-sp{position:absolute;left:var(--x);top:var(--y);width:var(--s);height:var(--s);
  margin:calc(var(--s) / -2) 0 0 calc(var(--s) / -2);opacity:0;pointer-events:none;
  background:radial-gradient(circle,#fff 0 14%,#2db4e0 62%);
  -webkit-clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);
  clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);
  animation:ks-tw 2.6s ease-in-out infinite;animation-delay:var(--dl)}
@keyframes ks-tw{0%,100%{opacity:0;transform:scale(.2) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(90deg)}}

/* ===== أقسام المتجر ===== */
#ks .ks-tags{position:relative;display:flex;align-items:center;justify-content:center;gap:9px;margin-top:34px;white-space:nowrap;
  font-size:clamp(11.5px,3.3vw,15px);font-weight:700;color:#4d6279;padding:0 10px;text-align:center}
#ks .ks-tags span{opacity:0;animation:ks-up .8s cubic-bezier(.2,.8,.2,1) both}
#ks .ks-tags .t1{animation-delay:1.7s}
#ks .ks-tags .t2{animation-delay:1.85s}
#ks .ks-tags .t3{animation-delay:2s}
#ks .ks-tags i{display:block;width:5px;height:5px;border-radius:50%;background:#2db4e0;opacity:0;animation:ks-fade .6s ease 1.9s forwards}
@keyframes ks-up{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:none}}
@keyframes ks-fade{to{opacity:1}}

/* ===== زر التخطي بحلقة تقدّم ===== */
#ks .ks-skip{position:absolute;left:50%;bottom:max(26px,env(safe-area-inset-bottom));transform:translateX(-50%);
  display:inline-flex;align-items:center;gap:10px;padding:6px 20px 6px 8px;border:1px solid rgba(22,119,232,.22);
  border-radius:999px;background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  font:700 14px 'Cairo','Segoe UI',Tahoma,sans-serif;color:#0b4fa8;cursor:pointer;
  box-shadow:0 6px 20px rgba(22,119,232,.14);
  opacity:0;animation:ks-skipin .6s ease 1s forwards;transition:background .25s,color .25s,border-color .25s}
#ks .ks-skip svg{width:30px;height:30px;display:block;overflow:visible}
#ks .ks-skip .trk{fill:none;stroke:rgba(22,119,232,.18);stroke-width:2.4}
#ks .ks-skip .prg{fill:none;stroke:#1677e8;stroke-width:2.4;stroke-linecap:round;
  stroke-dasharray:75.4;stroke-dashoffset:75.4;transform:rotate(-90deg);transform-origin:15px 15px;
  animation:ks-prog ${HOLD - 1000}ms linear 1s forwards}
#ks .ks-skip .chv{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;transition:transform .25s}
#ks .ks-skip:hover{background:#1677e8;border-color:#1677e8;color:#fff}
#ks .ks-skip:hover .prg{stroke:#fff}
#ks .ks-skip:hover .trk{stroke:rgba(255,255,255,.3)}
#ks .ks-skip:hover .chv{transform:translateX(-2px)}
#ks .ks-skip:active{transform:translateX(-50%) scale(.96)}
#ks .ks-skip:focus-visible{outline:2px solid #2db4e0;outline-offset:3px}
@keyframes ks-prog{to{stroke-dashoffset:0}}
@keyframes ks-skipin{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}

/* ===== الوضع الداكن للموقع ===== */
html[data-theme=dark] #ks{background:linear-gradient(160deg,#10283a 0%,#0a1b27 55%,#06111a 100%)}
html[data-theme=dark] #ks .ks-o1{opacity:.7}
html[data-theme=dark] #ks .ks-rays{background:repeating-conic-gradient(rgba(95,208,245,.14) 0deg 6deg,rgba(95,208,245,0) 6deg 18deg)}
html[data-theme=dark] #ks .ks-card{background:#fff;border-radius:24px;padding:14px 20px;box-shadow:0 18px 50px rgba(45,180,224,.25)}
html[data-theme=dark] #ks .ks-stage{width:min(54vw,260px)}
html[data-theme=dark] #ks .ks-ring{border-color:rgba(95,208,245,.34)}
html[data-theme=dark] #ks .ks-tags{color:#a9bccb}
html[data-theme=dark] #ks .ks-skip{background:rgba(255,255,255,.08);border-color:rgba(95,208,245,.28);color:#d5f2ff;box-shadow:none}
html[data-theme=dark] #ks .ks-skip .trk{stroke:rgba(95,208,245,.22)}
html[data-theme=dark] #ks .ks-skip .prg{stroke:#5fd0f5}
html[data-theme=dark] #ks .ks-skip:hover{background:#1677e8;color:#fff}

@media (prefers-reduced-motion:reduce){
  #ks{-webkit-clip-path:none;clip-path:none;transition:opacity .5s ease}
  #ks.ks-out{opacity:0;-webkit-clip-path:none;clip-path:none}
  #ks.ks-out .ks-stage{transform:none}
  #ks .ks-stage,#ks .ks-orb,#ks .ks-rays,#ks .ks-ring,#ks .ks-shine,#ks .ks-glow,#ks .ks-sp{animation:none}
  #ks .ks-ring,#ks .ks-shine,#ks .ks-sp{display:none}
  #ks .ks-orb,#ks .ks-glow{opacity:.8}
  #ks .ks-card{animation:ks-fade .6s ease forwards}
}`;

  var el = document.createElement("div");
  el.id = "ks";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", "مرحباً بكم في كلمات المصطفى للاتصالات");
  el.innerHTML =
    "<style>" + css + "</style>" +
    '<span class="ks-orb ks-o1"></span><span class="ks-orb ks-o2"></span>' +
    '<span class="ks-rays"></span>' +
    '<canvas class="ks-cv"></canvas>' +
    '<div class="ks-stage">' +
      '<span class="ks-glow"></span>' +
      '<span class="ks-ring ks-r1"></span><span class="ks-ring ks-r2"></span>' +
      '<div class="ks-card"><div class="ks-lbox">' +
        '<img class="ks-logo" src="' + LOGO + '" alt="كلمات المصطفى للاتصالات">' +
        '<span class="ks-shine"></span>' +
      "</div></div>" +
      '<i class="ks-sp" style="--x:4%;--y:10%;--s:16px;--dl:1.6s"></i>' +
      '<i class="ks-sp" style="--x:97%;--y:18%;--s:12px;--dl:2.3s"></i>' +
      '<i class="ks-sp" style="--x:10%;--y:98%;--s:11px;--dl:2.9s"></i>' +
      '<i class="ks-sp" style="--x:90%;--y:92%;--s:17px;--dl:2s"></i>' +
      '<i class="ks-sp" style="--x:50%;--y:-8%;--s:13px;--dl:2.6s"></i>' +
      '<i class="ks-sp" style="--x:102%;--y:56%;--s:10px;--dl:3.2s"></i>' +
    "</div>" +
    '<div class="ks-tags"><span class="t1">أجهزة ذكية</span><i></i><span class="t2">إكسسوارات</span><i></i><span class="t3">حاسبات</span></div>' +
    '<button type="button" class="ks-skip" aria-label="تخطي نافذة الترحيب">' +
      '<svg viewBox="0 0 30 30" aria-hidden="true">' +
        '<circle class="trk" cx="15" cy="15" r="12"/><circle class="prg" cx="15" cy="15" r="12"/>' +
        '<path class="chv" d="M16 10.5l-4.5 4.5 4.5 4.5"/><path class="chv" d="M20.5 10.5L16 15l4.5 4.5" transform="translate(-1.5 0)"/>' +
      "</svg><span>تخطي</span>" +
    "</button>";

  /* اللمعة تأخذ شكل الشعار نفسه */
  var shine = el.querySelector(".ks-shine");
  var mask = 'url("' + LOGO + '")';
  shine.style.webkitMaskImage = mask;
  shine.style.maskImage = mask;

  var root = document.documentElement;
  root.classList.add("ks-lock");
  root.appendChild(el);

  var closed = false;
  function cleanup() {
    closed = true;
    if (el.parentNode) el.parentNode.removeChild(el);
    root.classList.remove("ks-lock");
  }
  function close() {
    if (closed) return;
    closed = true;
    el.classList.add("ks-out");
    setTimeout(cleanup, EXIT + 80);
  }
  el.querySelector(".ks-skip").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  setTimeout(close, HOLD);
  setTimeout(cleanup, HOLD + EXIT + 1500);   // شبكة أمان

  /* ===== شبكة الاتصال المتحركة (نقاط وخطوط) ===== */
  if (reduce) { var c0 = el.querySelector(".ks-cv"); if (c0) c0.style.display = "none"; return; }
  try {
    var cv = el.querySelector(".ks-cv");
    var ctx = cv.getContext("2d");
    var W = window.innerWidth, H = window.innerHeight;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var N = W < 600 ? 34 : 60, LINK = W < 600 ? 105 : 140, nodes = [];
    var rgb = dark ? "95,208,245" : "22,119,232";
    for (var i = 0; i < N; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 26, r: 1.3 + Math.random() * 1.7 });
    }
    var last = 0;
    (function tick(now) {
      if (closed) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now;
      ctx.clearRect(0, 0, W, H);
      var k, j, a, b, dx, dy, d;
      for (k = 0; k < N; k++) {
        a = nodes[k];
        a.x += a.vx * dt; a.y += a.vy * dt;
        if (a.x < -10) a.x = W + 10; else if (a.x > W + 10) a.x = -10;
        if (a.y < -10) a.y = H + 10; else if (a.y > H + 10) a.y = -10;
      }
      ctx.lineWidth = 1;
      for (k = 0; k < N; k++) {
        a = nodes[k];
        for (j = k + 1; j < N; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            ctx.strokeStyle = "rgba(" + rgb + "," + (0.22 * (1 - Math.sqrt(d) / LINK)).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(" + rgb + ",.55)";
      for (k = 0; k < N; k++) {
        a = nodes[k];
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(tick);
    })(0);
  } catch (err) { /* إن تعذر الرسم تبقى بقية الحركات */ }
})();