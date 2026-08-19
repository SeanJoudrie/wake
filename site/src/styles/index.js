// Filters the index. It also returns absences, which is the point.
(function () {
  var input = document.getElementById("q");
  var toggle = document.querySelector(".drawer-toggle");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("drawer-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (!input) return;

  var groups = [].slice.call(document.querySelectorAll(".nav-group"));
  var gapsGroup = document.querySelector(".nav-gaps");
  var empty = document.querySelector(".nav-empty");

  function apply() {
    var q = input.value.trim().toLowerCase();
    var hits = 0;

    groups.forEach(function (group) {
      var isGaps = group === gapsGroup;
      var shown = 0;
      [].slice.call(group.querySelectorAll("li")).forEach(function (li) {
        var match = !q ? !isGaps : li.textContent.toLowerCase().indexOf(q) !== -1;
        li.hidden = !match;
        if (match) shown++;
      });
      group.hidden = shown === 0;
      var fold = group.querySelector(".nav-fold");
      if (fold && q) fold.open = shown > 0;
      hits += shown;
    });

    if (empty) empty.hidden = !(q && hits === 0);
  }

  input.addEventListener("input", apply);
  apply();
})();

// Section disclosures: bulk toggle, and never print a closed section.
(function () {
  function sections() {
    return [].slice.call(document.querySelectorAll(".section"));
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".open-all");
    if (!btn) return;
    var open = btn.getAttribute("aria-expanded") !== "true";
    var scope = btn.closest(".section-set") || document;
    [].slice.call(scope.querySelectorAll(".section")).forEach(function (d) {
      d.open = open;
    });
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close all sections" : "Open all sections";
  });

  // Index: open or shut every category at once.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".open-cats");
    if (!btn) return;
    var open = btn.getAttribute("aria-expanded") !== "true";
    [].slice.call(document.querySelectorAll(".cat")).forEach(function (d) {
      d.open = open;
    });
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close all categories" : "Open all categories";
  });

  // Narrow screens open on the stamp, not on six rows of filing data.
  var narrow = window.matchMedia("(max-width: 720px)");
  // querySelectorAll, not querySelector: the single-file build holds every entry at once.
  if (narrow.matches) {
    [].slice.call(document.querySelectorAll(".record")).forEach(function (r) { r.open = false; });
  }

  window.addEventListener("beforeprint", function () {
    [].slice.call(document.querySelectorAll(".section, .record")).forEach(function (d) {
      if (!d.open) { d.dataset.wasShut = "1"; d.open = true; }
    });
  });
  window.addEventListener("afterprint", function () {
    [].slice.call(document.querySelectorAll(".section, .record")).forEach(function (d) {
      if (d.dataset.wasShut) { d.open = false; delete d.dataset.wasShut; }
    });
  });
})();
