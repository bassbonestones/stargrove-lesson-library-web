(() => {
  "use strict";
  const $ = (q) => document.querySelector(q);
  const $$ = (q) => Array.from(document.querySelectorAll(q));
  const search = $("#lesson-search");
  if (search) {
    const lessons = $$("[data-lesson]");
    const topics = $$("[data-topic]");
    const subjects = $$("[data-subject-section]");
    const count = $("#results-count");
    const empty = $("#empty-results");
    const update = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      lessons.forEach((item) => {
        const match = !query || item.dataset.search.includes(query);
        item.hidden = !match;
        if (match) visible++;
      });
      topics.forEach((t) => {
        t.hidden = !t.querySelector("[data-lesson]:not([hidden])");
      });
      subjects.forEach((s) => {
        s.hidden = !s.querySelector("[data-topic]:not([hidden])");
      });
      count.textContent = query ? `Showing ${visible} matching lesson${visible === 1 ? "" : "s"}` : `Showing all ${lessons.length} reviewed lessons`;
      if (empty) empty.hidden = visible > 0;
    };
    search.addEventListener("input", update);
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey) {
        event.preventDefault(); search.focus();
      }
      if (event.key === "Escape" && document.activeElement === search) search.blur();
    });
    update();
  }
  $$("[data-print]").forEach((button) => button.addEventListener("click", () => window.print()));
  const tabs = $$("[data-tab]");
  if (tabs.length) {
    const show = (key) => {
      tabs.forEach((tab) => {
        const active = tab.dataset.tab === key;
        tab.classList.toggle("is-active",active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
        const panel = $("#panel-"+tab.dataset.tab);
        if (panel) panel.hidden = !active;
      });
    };
    tabs.forEach((tab) => tab.addEventListener("click", () => {
      show(tab.dataset.tab);
      history.replaceState(null, "", "#"+tab.dataset.tab);
    }));
    const showHash = () => {
      const key = location.hash.slice(1);
      show(tabs.some((tab) => tab.dataset.tab === key) ? key : tabs[0].dataset.tab);
    };
    window.addEventListener("hashchange", showHash);
    window.addEventListener("popstate", showHash);
    tabs.forEach((tab, index) => tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    }));
    showHash();
  }
})();
