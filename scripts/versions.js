(function () {
  function version() {
    return location.pathname.split("/")[2];
  }

  function initVersion() {
    fetch("/docs/versions.json").then(function (r) { return r.json(); }).then(function (data) {
      var sel = document.createElement("select");
      sel.className = "docs-version";
      sel.setAttribute("aria-label", "Version");
      data.versions.forEach(function (v) {
        var o = document.createElement("option");
        o.value = v;
        o.textContent = v;
        o.selected = v === version();
        sel.appendChild(o);
      });
      sel.onchange = function () {
        var p = location.pathname.split("/");
        p[2] = sel.value;
        var href = p.join("/") + location.search + location.hash;
        if (window.navigate) window.navigate(href);
        else location.href = href;
      };
      var slot = document.querySelector(".docs-version-slot");
      if (!slot) return;
      var label = document.createElement("label");
      label.className = "docs-version-label";
      label.appendChild(document.createTextNode("Version"));
      label.appendChild(sel);
      slot.replaceChildren(label);
      var panel = document.querySelector(".docs-version-panel");
      if (!panel) return;
      panel.replaceChildren();
      data.versions.forEach(function (v) {
        var a = document.createElement("a");
        var p = location.pathname.split("/");
        p[2] = v;
        a.href = p.join("/") + location.search + location.hash;
        a.textContent = v;
        if (v === version()) a.className = "active";
        panel.appendChild(a);
      });
    });
  }

  function initSearch() {
    var root = document.querySelector(".docs-search");
    var input = root && root.querySelector("input");
    var list = root && root.querySelector(".docs-search-list");
    if (!input) return;
    var pages = [];
    function esc(s) {
      return s.replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    function run() {
      var words = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      list.innerHTML = "";
      if (!words.length) { list.hidden = true; return; }
      list.hidden = false;
      var hits = pages.filter(function (p) {
        var hay = (p.t + " " + p.s).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) !== -1; });
      }).sort(function (a, b) {
        function score(p) {
          var t = p.t.toLowerCase();
          return words.reduce(function (n, w) { return n + (t.indexOf(w) !== -1 ? 1 : 0); }, 0);
        }
        return score(b) - score(a);
      }).slice(0, 12);
      if (!hits.length) {
        list.innerHTML = '<div class="docs-search-empty">No results</div>';
        return;
      }
      var re = new RegExp(words.map(function (w) {
        return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }).join("|"), "ig");
      function mark(s) { return esc(s).replace(re, "<mark>$&</mark>"); }
      hits.forEach(function (p) {
        var low = p.s.toLowerCase();
        var at = -1;
        words.some(function (w) { at = low.indexOf(w); return at !== -1; });
        var start = Math.max(0, at - 36);
        var snip = (start ? "…" : "") + p.s.slice(start, start + 140);
        var a = document.createElement("a");
        a.href = p.u;
        a.innerHTML = "<strong>" + mark(p.t) + "</strong><span>" + mark(snip) + "</span>";
        list.appendChild(a);
      });
    }
    input.addEventListener("input", run);
    input.addEventListener("focus", function () { if (input.value.trim()) run(); });
    input.addEventListener("keydown", function (e) {
      var links = [].slice.call(list.querySelectorAll("a"));
      var i = links.findIndex(function (a) { return a.classList.contains("active"); });
      if (e.key === "Escape") { list.hidden = true; return; }
      if (!links.length || (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter")) return;
      e.preventDefault();
      if (e.key === "Enter") {
        var href = (links[i] || links[0]).href;
        if (window.navigate) window.navigate(href);
        else location.href = href;
        return;
      }
      if (i >= 0) links[i].classList.remove("active");
      i = e.key === "ArrowDown" ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
      links[i].classList.add("active");
      links[i].scrollIntoView({ block: "nearest" });
    });
    fetch("/docs/" + version() + "/search.json").then(function (r) { return r.json(); }).then(function (data) {
      pages = data;
      if (input.value.trim()) run();
    });
  }

  document.addEventListener("click", function (e) {
    var root = document.querySelector(".docs-search");
    var list = root && root.querySelector(".docs-search-list");
    if (!root || !list || root.contains(e.target)) return;
    list.hidden = true;
  });

  var tip;
  function hideTip() { if (tip) { tip.remove(); tip = null; } }
  document.addEventListener("mouseover", function (e) {
    var a = e.target.closest && e.target.closest(".docs-toc a");
    hideTip();
    if (!a || a.scrollWidth <= a.clientWidth) return;
    var r = a.getBoundingClientRect();
    tip = document.createElement("div");
    tip.className = "docs-toc-tip";
    tip.textContent = a.textContent;
    tip.style.left = r.left + "px";
    tip.style.top = r.top + "px";
    document.body.appendChild(tip);
    if (r.left + tip.offsetWidth > innerWidth - 8) {
      tip.style.whiteSpace = "normal";
      tip.style.maxWidth = (innerWidth - r.left - 8) + "px";
    }
  });
  document.addEventListener("scroll", hideTip, true);

  function fitSides() {
    var boxes = document.querySelectorAll(".docs-nav, .docs-side");
    if (!boxes.length) return;
    if (innerWidth <= 1100) {
      boxes.forEach(function (el) { el.style.top = el.style.height = ""; });
      return;
    }
    var header = document.querySelector(".header");
    var footer = document.querySelector(".footer");
    var top = (header ? header.offsetHeight : 71) + 16;
    var edge = footer ? Math.min(innerHeight, footer.getBoundingClientRect().top) : innerHeight;
    var h = Math.max(0, edge - top - 16);
    boxes.forEach(function (el) {
      el.style.top = top + "px";
      el.style.height = h + "px";
    });
  }
  document.addEventListener("scroll", fitSides, { capture: true, passive: true });
  window.addEventListener("resize", fitSides);
  fitSides();

  function initNav() {
    var nav = document.querySelector(".docs-nav");
    if (!nav || nav.dataset.ready) return;
    nav.dataset.ready = "1";
    var key = "docs-nav:" + version();
    function path(d) {
      var parts = [], n = d;
      while (n && n !== nav) {
        if (n.tagName === "DETAILS") parts.unshift(n.querySelector(":scope > summary").textContent);
        n = n.parentElement;
      }
      return parts.join("\n");
    }
    var saved = JSON.parse(sessionStorage.getItem(key) || "{}");
    nav.querySelectorAll("details").forEach(function (d) {
      if (path(d) in saved) d.open = saved[path(d)];
      if (d.querySelector("a.active")) d.open = true;
    });
    function store() {
      var state = {};
      nav.querySelectorAll("details").forEach(function (d) { state[path(d)] = d.open; });
      sessionStorage.setItem(key, JSON.stringify(state));
    }
    store();
    nav.addEventListener("toggle", store, true);
  }

  window.initDocs = function () {
    var page = document.querySelector(".docs-page");
    if (!page || page.dataset.docsReady) return;
    page.dataset.docsReady = "1";
    initVersion();
    initSearch();
    initNav();
    fitSides();
  };
  if (document.querySelector(".docs-page")) window.initDocs();
})();
