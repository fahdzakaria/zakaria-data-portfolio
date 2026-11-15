// Comportements partagés par toutes les pages : menu mobile, lien actif,
// apparition au défilement, onglets du bloc compétences, formulaire, année.

document.documentElement.classList.remove("no-js");

// Menu mobile
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const ouvert = nav.classList.toggle("ouvert");
    menuBtn.setAttribute("aria-expanded", String(ouvert));
    menuBtn.textContent = ouvert ? "Fermer" : "Menu";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("ouvert")) {
      nav.classList.remove("ouvert");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "Menu";
      menuBtn.focus();
    }
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("ouvert");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "Menu";
    }),
  );
}

// Lien du menu correspondant à la section visible
const liens = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
const sections = liens.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if (sections.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entrees) =>
      entrees.forEach((e) => {
        if (!e.isIntersecting) return;
        liens.forEach((a) =>
          a.getAttribute("href") === `#${e.target.id}`
            ? a.setAttribute("aria-current", "true")
            : a.removeAttribute("aria-current"),
        );
      }),
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((s) => io.observe(s));
  // En bas de page, la dernière section n'atteint jamais le milieu de l'écran
  window.addEventListener(
    "scroll",
    () => {
      if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
      const dernier = liens[liens.length - 1];
      liens.forEach((a) => (a === dernier ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    },
    { passive: true },
  );
}

// Apparition douce au défilement (une seule fois)
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entrees) =>
      entrees.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vu");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -60px 0px" },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("vu"));
}

// Onglets (bloc compétences façon « code »)
document.querySelectorAll("[data-onglets]").forEach((bloc) => {
  const boutons = [...bloc.querySelectorAll('[role="tab"]')];
  const panneaux = [...bloc.querySelectorAll('[role="tabpanel"]')];
  const choisir = (i) => {
    boutons.forEach((b, j) => {
      b.setAttribute("aria-selected", String(i === j));
      b.tabIndex = i === j ? 0 : -1;
    });
    panneaux.forEach((p, j) => (p.hidden = i !== j));
  };
  boutons.forEach((b, i) => {
    b.addEventListener("click", () => choisir(i));
    b.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = (i + (e.key === "ArrowRight" ? 1 : boutons.length - 1)) % boutons.length;
      choisir(n);
      boutons[n].focus();
    });
  });
  choisir(0);
});

// Bandeau : piste doublée pour un défilement sans couture
const piste = document.getElementById("tickerPiste");
if (piste) piste.innerHTML += piste.innerHTML;

// Formulaire de contact (FormSubmit, envoi sans quitter la page)
const form = document.getElementById("contactForm");
const statut = document.getElementById("formStatut");
if (form && statut) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statut.textContent = "Envoi en cours…";
    try {
      const url = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      const rep = await fetch(url, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
      // FormSubmit répond 200 même en cas d'échec : le verdict est dans le JSON
      const donnees = await rep.json().catch(() => ({}));
      if (!rep.ok || String(donnees.success) !== "true") throw new Error(String(rep.status));
      form.reset();
      statut.textContent = "Message envoyé, merci ! Je réponds rapidement.";
    } catch {
      statut.textContent = "L'envoi a échoué. Écrivez-moi directement à fahed.zakaria@epitech.eu.";
    }
  });
}

// Année du pied de page
const annee = document.getElementById("annee");
if (annee) annee.textContent = String(new Date().getFullYear());
