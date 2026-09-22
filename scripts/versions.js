(function () {
  var version = location.pathname.split("/")[2];
  fetch("/docs/versions.json").then(function (r) { return r.json(); }).then(function (data) {
    var style = document.createElement("style");
    style.textContent = ".docs-version{margin-left:auto;background:transparent;color:inherit;border:1px solid currentColor;border-radius:4px;padding:2px 6px;font:inherit}.wy-side-nav-search .docs-version{display:block;width:100%;margin:8px 0 0}";
    document.head.appendChild(style);
    var sel = document.createElement("select");
    sel.className = "docs-version";
    sel.setAttribute("aria-label", "Version");
    data.versions.forEach(function (v) {
      var o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      o.selected = v === version;
      sel.appendChild(o);
    });
    sel.onchange = function () {
      var p = location.pathname.split("/");
      p[2] = sel.value;
      location.href = p.join("/") + location.search + location.hash;
    };
    document.querySelector(".md-header__inner, .md-header-nav, .wy-side-nav-search").appendChild(sel);
  });
})();
