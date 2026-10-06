(function () {
  var m = document.getElementById("mn"),
    b = document.getElementById("bg");
  function t(o) {
    m.classList.toggle("open", o);
    m.setAttribute("aria-hidden", !o);
    b.setAttribute("aria-expanded", o);
    document.body.style.overflow = o ? "hidden" : "";
  }
  b.onclick = function () {
    t(true);
  };
  document.getElementById("cl").onclick = function () {
    t(false);
  };
  m.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      t(false);
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") t(false);
  });
})();
var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.getElementById("yr").textContent = new Date().getFullYear();

/* form */
var f = document.getElementById("f"),
  fb = document.getElementById("fbox"),
  S = {
    form: f,
    load: document.getElementById("st-load"),
    ok: document.getElementById("st-ok"),
    err: document.getElementById("st-err"),
  };
function show(n) {
  Object.keys(S).forEach(function (k) {
    S[k].hidden = k !== n;
  });
}
f.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!f.checkValidity()) {
    f.reportValidity();
    return;
  }
  if (f.elements.website.value) {
    f.reset();
    show("ok");
    return;
  }
  var d = {};
  new FormData(f).forEach(function (v, k) {
    d[k] = v;
  });
  delete d.website;
  fb.style.setProperty("--form-h", f.offsetHeight + "px");
  show("load");
  fetch("https://submit-form.com/msRoBphP3", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(d),
  })
    .then(function (r) {
      if (r.ok) {
        f.reset();
        show("ok");
      } else show("err");
    })
    .catch(function (x) {
      console.error("Ошибка:", x);
      show("err");
    });
});

document.getElementById("retry").onclick = function () {
  show("form");
};

/* counters */
var cs = document.querySelectorAll("[data-count]");
function rc(el, v) {
  var dc = (el.dataset.count.split(".")[1] || "").length;
  el.textContent =
    v.toLocaleString("ru-RU", {
      minimumFractionDigits: dc,
      maximumFractionDigits: dc,
    }) + (el.dataset.suffix || "");
}
function ac(el, dur) {
  var t = +el.dataset.count,
    st = performance.now();
  (function fr(n) {
    var p = Math.min((n - st) / dur, 1);
    rc(el, t * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(fr);
  })(st);
}
if (!rm && "IntersectionObserver" in window) {
  cs.forEach(function (el) {
    rc(el, 0);
  });
  var io = new IntersectionObserver(
    function (es, o) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          ac(e.target, 2000);
          o.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 },
  );
  cs.forEach(function (el) {
    io.observe(el);
  });
}

/* плавный переход по якорям без #hash в адресной строке */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  var id = link.getAttribute("href");
  if (id === "#") return;
  link.addEventListener("click", function (e) {
    var target = id === "#top" ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* подсветка ссылки текущей секции (десктопное меню и мобильное) */
var navLinks = Array.prototype.slice.call(
  document.querySelectorAll("header nav a, .menu li a"),
);
function updateActive() {
  var current = null;
  var atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 4;
  navLinks.forEach(function (link) {
    var s = document.querySelector(link.getAttribute("href"));
    if (s && s.getBoundingClientRect().top <= 120)
      current = link.getAttribute("href");
  });
  if (atBottom) current = "#contact";
  navLinks.forEach(function (link) {
    var on = link.getAttribute("href") === current;
    link.classList.toggle("active", on);
    if (on) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
window.addEventListener("scroll", updateActive, { passive: true });
updateActive();

AOS.init({
  once: true,
});
