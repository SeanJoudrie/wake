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
      hits += shown;
    });

    if (empty) empty.hidden = !(q && hits === 0);
  }

  input.addEventListener("input", apply);
  apply();
})();
