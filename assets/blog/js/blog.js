/* Research blog — shared behaviour for pages under /blog/.
   - Theme toggle: same localStorage key ("theme") and data-theme attribute as the homepage.
   - Copy buttons for citation blocks.
   No dependencies; safe to load with `defer`. */
(function () {
  "use strict";

  /* ---- Theme toggle ---- */
  var btn = document.getElementById("theme-toggle");
  function current() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function updateLabel() {
    if (!btn) return;
    var isDark = current() === "dark";
    btn.textContent = isDark ? "Light mode" : "Dark mode";
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
  }
  if (btn) {
    updateLabel();
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      updateLabel();
    });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () { updateLabel(); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---- Copy buttons: <div class="bibtex"><button class="copy-btn" data-copy="#id">…</button><pre id="id">…</pre></div> ---- */
  Array.prototype.forEach.call(document.querySelectorAll(".copy-btn[data-copy]"), function (b) {
    b.addEventListener("click", function () {
      var target = document.querySelector(b.getAttribute("data-copy"));
      if (!target) return;
      var text = target.textContent;
      var done = function () {
        var old = b.textContent;
        b.textContent = "Copied";
        setTimeout(function () { b.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var r = document.createRange();
        r.selectNodeContents(target);
        var s = window.getSelection();
        s.removeAllRanges();
        s.addRange(r);
        try { document.execCommand("copy"); done(); } catch (e) {}
        s.removeAllRanges();
      }
    });
  });
})();
