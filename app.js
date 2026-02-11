const menuBtn = document.getElementById("menuBtn");
const siteNav = document.getElementById("siteNav");
const filtersWrap = document.getElementById("projectFilters");
const projectCards = document.querySelectorAll(".project-card");
const counters = document.querySelectorAll(".metric-number");
const reveals = document.querySelectorAll(".reveal");

if (menuBtn && siteNav) {
  menuBtn.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");
  });
}

if (filtersWrap) {
  filtersWrap.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter");
    if (!btn) return;

    const active = filtersWrap.querySelector(".filter.is-active");
    if (active) active.classList.remove("is-active");
    btn.classList.add("is-active");

    const selected = btn.dataset.filter;
    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const isVisible = selected === "all" || categories.includes(selected);
      card.classList.toggle("is-hidden", !isVisible);
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  { threshold: 0.12 }
);

reveals.forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const target = Number(node.dataset.target || 0);
      const duration = 850;
      const step = Math.max(1, Math.ceil(target / (duration / 16)));
      let value = 0;

      const timer = setInterval(() => {
        value += step;
        if (value >= target) {
          value = target;
          clearInterval(timer);
        }
        node.textContent = String(value);
      }, 16);

      observer.unobserve(node);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
