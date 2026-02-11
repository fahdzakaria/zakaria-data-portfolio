const translations = {
  fr: {
    skip_content: "Aller au contenu principal",
    nav_projects: "Projets",
    nav_timeline: "Formation",
    nav_quality: "Qualite",
    nav_skills: "Competences",
    nav_contact: "Contact",
    hero_eyebrow: "Data Engineering Portfolio",
    hero_title: "Je concois des pipelines data robustes qui transforment des donnees en decisions concretes.",
    hero_copy:
      "Etudiant Epitech Nice (filiere Intelligence Artificielle & Big Data), je construis des flux de donnees de bout en bout: ingestion, transformation, modelisation SQL, orchestration et visualisation.",
    hero_btn_projects: "Voir les projets",
    hero_btn_contact: "Me contacter",
    about_title: "Profil",
    about_edu_title: "Formation",
    about_edu_copy:
      "Architecte de Systemes d'Information (RNCP Niv. 7) a Epitech, option IA & Big Data (2026-2028). Parcours universitaire prealable en informatique.",
    about_goal_title: "Objectif",
    about_goal_copy:
      "Contribuer a des projets Data/IA en transformant des donnees complexes en insights exploitables pour la decision.",
    flow_title: "Pipeline interactif",
    flow_copy: "Sequence d'execution appliquee sur mes projets pour garantir qualite et robustesse.",
    flow_extract: "Sources API / CSV controlees et traceables.",
    flow_transform: "Normalisation, controles qualite, metriques.",
    flow_load: "Upsert idempotent, indexation, SQL performant.",
    flow_observe: "Tests, logs, dashboards actionnables.",
    projects_title: "Projets",
    search_label: "Recherche projet",
    search_placeholder: "Rechercher un projet ou une stack...",
    filter_all: "Tous",
    immo_desc:
      "Pipeline Zillow ZHVI vers Postgres avec transformations MoM/YoY, chargement idempotent et dashboard de pilotage.",
    crypto_desc:
      "Ingestion CoinGecko resiliente: retries/backoff, tolerance d'erreur par coin, upsert SQL et vues materialisees.",
    project_case_study: "Case study",
    empty_state: "Aucun projet ne correspond.",
    timeline_title: "Formation",
    timeline_copy: "Parcours academique en informatique, data et IA.",
    timeline_item_bac_title: "Baccalaureat General - Mention Bien",
    timeline_item_bac_copy: "Option Mathematiques / NSI - Lycee Gustave Flaubert.",
    timeline_item_uni_title: "Universite d'Avignon",
    timeline_item_uni_copy: "Parcours informatique et bases en developpement logiciel.",
    timeline_item_mtp_title: "Universite de Montpellier",
    timeline_item_mtp_copy: "Approfondissement des approches data et IA appliquees.",
    timeline_item_epitech_title: "Epitech Nice - RNCP 7",
    timeline_item_epitech_copy: "Architecte SI, specialisation Intelligence Artificielle & Big Data.",
    proof_title: "Proof of quality",
    proof_test_title: "Tests",
    proof_test_copy: "Validation des transformations et des comportements critiques via Pytest.",
    proof_data_title: "Fiabilite data",
    proof_data_copy: "Schemas explicites, contraintes SQL et chargements idempotents.",
    proof_ops_title: "Operations",
    proof_ops_copy: "Docker Compose, Makefile et runbooks pour un setup reproductible.",
    proof_bi_title: "Lecture metier",
    proof_bi_copy: "Dashboards Metabase pour piloter tendances, comparatifs et anomalies.",
    skills_title: "Competences",
    skill_1_title: "Data Engineering",
    skill_1_copy: "ETL, ingestion API, batch processing, qualite des donnees.",
    skill_2_title: "Data Platform",
    skill_2_copy: "PostgreSQL, modelisation analytique, performance SQL.",
    skill_3_title: "Orchestration",
    skill_3_copy: "Airflow, planification, retries, reprise sur incident.",
    skill_4_title: "Visualization",
    skill_4_copy: "Metabase, storytelling KPI et dashboards decisionnels.",
    contact_title: "Contact",
    contact_copy: "Recherche contrat d'apprentissage / mission data engineering. Base a Cannes (06400).",
    contact_name: "Nom",
    contact_email: "Email",
    contact_message: "Message",
    contact_send: "Envoyer",
    contact_status_sending: "Envoi en cours...",
    contact_status_success: "Message envoye. Merci !",
    contact_status_error: "Echec de l'envoi. Vous pouvez aussi me contacter par email.",
    case_back: "Retour au portfolio",
    case_problem: "Probleme et objectif",
    case_arch: "Architecture",
    case_decisions: "Decisions techniques",
    case_impact: "Impact",
    case_links: "Liens projet",
    case_sql: "Voir une requete SQL representative"
  },
  en: {
    skip_content: "Skip to main content",
    nav_projects: "Projects",
    nav_timeline: "Education",
    nav_quality: "Quality",
    nav_skills: "Skills",
    nav_contact: "Contact",
    hero_eyebrow: "Data Engineering Portfolio",
    hero_title: "I design robust data pipelines that turn raw data into concrete decisions.",
    hero_copy:
      "Epitech Nice student (AI & Big Data track), I ship end-to-end flows: ingestion, transformations, SQL modeling, orchestration, and visualization.",
    hero_btn_projects: "View projects",
    hero_btn_contact: "Contact me",
    about_title: "Profile",
    about_edu_title: "Education",
    about_edu_copy:
      "Information Systems Architect (RNCP level 7) at Epitech, AI & Big Data specialization (2026-2028), with prior university studies in computer science.",
    about_goal_title: "Objective",
    about_goal_copy:
      "Contribute to Data/AI initiatives by turning complex datasets into actionable insights.",
    flow_title: "Interactive pipeline",
    flow_copy: "Execution sequence used across my projects to ensure robustness and quality.",
    flow_extract: "Validated and traceable API / CSV sources.",
    flow_transform: "Normalization, quality checks, metrics.",
    flow_load: "Idempotent upsert, indexing, optimized SQL.",
    flow_observe: "Tests, logs, and actionable dashboards.",
    projects_title: "Projects",
    search_label: "Project search",
    search_placeholder: "Search by project name or stack...",
    filter_all: "All",
    immo_desc:
      "Zillow ZHVI to Postgres pipeline with MoM/YoY transforms, idempotent loading, and management dashboards.",
    crypto_desc:
      "Resilient CoinGecko ingestion with retries/backoff, per-coin error tolerance, SQL upsert, and materialized views.",
    project_case_study: "Case study",
    empty_state: "No project matches your filters.",
    timeline_title: "Education",
    timeline_copy: "Academic path in software engineering, data, and AI.",
    timeline_item_bac_title: "General Baccalaureate - Honors",
    timeline_item_bac_copy: "Mathematics / Computer Science track.",
    timeline_item_uni_title: "University of Avignon",
    timeline_item_uni_copy: "Computer science studies and software foundations.",
    timeline_item_mtp_title: "University of Montpellier",
    timeline_item_mtp_copy: "Advanced focus on data and applied AI.",
    timeline_item_epitech_title: "Epitech Nice - RNCP 7",
    timeline_item_epitech_copy: "Information Systems Architect, AI & Big Data specialization.",
    proof_title: "Proof of quality",
    proof_test_title: "Testing",
    proof_test_copy: "Critical transformations and behavior validated through Pytest suites.",
    proof_data_title: "Data reliability",
    proof_data_copy: "Explicit schemas, SQL constraints, and idempotent loading patterns.",
    proof_ops_title: "Operations",
    proof_ops_copy: "Docker Compose, Makefile commands, and reproducible runbooks.",
    proof_bi_title: "Business visibility",
    proof_bi_copy: "Metabase dashboards for trend tracking, comparison, and anomaly review.",
    skills_title: "Skills",
    skill_1_title: "Data Engineering",
    skill_1_copy: "ETL, API ingestion, batch processing, and data quality.",
    skill_2_title: "Data Platform",
    skill_2_copy: "PostgreSQL, analytics modeling, and SQL performance tuning.",
    skill_3_title: "Orchestration",
    skill_3_copy: "Airflow scheduling, retries, and failure recovery.",
    skill_4_title: "Visualization",
    skill_4_copy: "Metabase KPI storytelling and decision-focused dashboards.",
    contact_title: "Contact",
    contact_copy: "Open to apprenticeship contracts or data engineering roles. Based in Cannes (06400).",
    contact_name: "Name",
    contact_email: "Email",
    contact_message: "Message",
    contact_send: "Send",
    contact_status_sending: "Sending...",
    contact_status_success: "Message sent. Thank you!",
    contact_status_error: "Message failed. You can also contact me by email.",
    case_back: "Back to portfolio",
    case_problem: "Problem and goal",
    case_arch: "Architecture",
    case_decisions: "Technical decisions",
    case_impact: "Impact",
    case_links: "Project links",
    case_sql: "Show representative SQL query"
  }
};

const menuBtn = document.getElementById("menuBtn");
const siteHeader = document.querySelector(".site-header");
const siteNav = document.getElementById("siteNav");
const filtersWrap = document.getElementById("projectFilters");
const projectGrid = document.getElementById("projectGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const progressBar = document.getElementById("progressBar");
const reveals = document.querySelectorAll(".reveal");
const flowNodes = document.querySelectorAll(".flow-node");
const langSwitch = document.getElementById("langSwitch");
const tiltCards = document.querySelectorAll(".project-card");

let activeFilter = "all";
let activeLang = localStorage.getItem("portfolio_lang") || "fr";
let previousScrollY = window.scrollY;

function updateProgress() {
  if (!progressBar) return;
  const top = document.documentElement.scrollTop || document.body.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight || 1;
  progressBar.style.width = `${Math.min(100, (top / height) * 100)}%`;
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.fr;
  document.documentElement.lang = lang;
  if (langSwitch) langSwitch.textContent = lang === "fr" ? "EN" : "FR";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) node.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (dict[key]) node.setAttribute("placeholder", dict[key]);
  });
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in")),
    { threshold: 0.1 }
  );
  reveals.forEach((item) => observer.observe(item));
}

function runFlowAnimation() {
  if (!flowNodes.length) return;
  let index = 0;
  setInterval(() => {
    flowNodes.forEach((node) => node.classList.remove("is-active"));
    flowNodes[index % flowNodes.length].classList.add("is-active");
    index += 1;
  }, 1700);
}

function applyProjectFilters() {
  if (!projectGrid) return;
  const cards = Array.from(projectGrid.querySelectorAll(".project-card"));
  const query = (searchInput?.value || "").toLowerCase().trim();
  cards.forEach((card) => {
    const name = (card.dataset.name || "").toLowerCase();
    const categories = (card.dataset.category || "").toLowerCase();
    const stack = (card.dataset.stack || "").toLowerCase();
    const matchFilter = activeFilter === "all" || categories.includes(activeFilter);
    const matchSearch = !query || name.includes(query) || stack.includes(query);
    card.classList.toggle("is-hidden", !(matchFilter && matchSearch));
  });

  const visible = cards.filter((card) => !card.classList.contains("is-hidden"));
  visible.sort((a, b) => Number(b.dataset.impact || 0) - Number(a.dataset.impact || 0));
  visible.forEach((card) => projectGrid.appendChild(card));

  if (emptyState) emptyState.classList.toggle("is-visible", visible.length === 0);
}

function bindCardTilt() {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 6;
      const rotateX = (0.5 - (y / rect.height)) * 6;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initPageTransitions() {
  if (!document.startViewTransition) return;
  document.querySelectorAll("a[href]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      document.startViewTransition(() => {
        window.location.href = url.href;
      });
    });
  });
}

function bindUi() {
  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (filtersWrap) {
    filtersWrap.addEventListener("click", (event) => {
      const btn = event.target.closest(".filter");
      if (!btn) return;
      filtersWrap.querySelectorAll(".filter").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      activeFilter = btn.dataset.filter || "all";
      applyProjectFilters();
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyProjectFilters);
  if (langSwitch) {
    langSwitch.addEventListener("click", () => {
      activeLang = activeLang === "fr" ? "en" : "fr";
      localStorage.setItem("portfolio_lang", activeLang);
      applyLanguage(activeLang);
    });
  }
}

function handleHeaderVisibilityOnScroll() {
  if (!siteHeader) return;
  const currentY = window.scrollY;
  const menuOpen = siteNav?.classList.contains("is-open");
  if (menuOpen) {
    previousScrollY = currentY;
    return;
  }

  if (currentY <= 8) {
    siteHeader.classList.remove("header-hidden");
    previousScrollY = currentY;
    return;
  }

  if (currentY > previousScrollY + 6) {
    siteHeader.classList.add("header-hidden");
  } else if (currentY < previousScrollY - 6) {
    siteHeader.classList.remove("header-hidden");
  }

  previousScrollY = currentY;
}

function boot() {
  bindUi();
  applyLanguage(activeLang);
  applyProjectFilters();
  revealOnScroll();
  runFlowAnimation();
  bindCardTilt();
  initPageTransitions();
  updateProgress();
  window.addEventListener("scroll", () => {
    updateProgress();
    handleHeaderVisibilityOnScroll();
  }, { passive: true });
  const yearNode = document.getElementById("year");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
}

boot();
