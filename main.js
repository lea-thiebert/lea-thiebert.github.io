// main.js — Portfolio Lea Thiebert
// Gère : l'état actif de la nav, les animations "reveal" au scroll,
// l'apparition des post-its / project-cards, les filtres de la page Projets,
// et le formulaire de contact.

document.addEventListener("DOMContentLoaded", () => {
	setActiveNavLink();
	setupRevealOnScroll();
	setupCardReveal();
	setupProjectFilters();
	setupContactForm();
});

/* ------------------------------------------------------------------ */
/* 1. Lien de navigation actif                                         */
/* ------------------------------------------------------------------ */
function setActiveNavLink() {
	const currentPage = document.body.dataset.page;
	if (!currentPage) return;

	document.querySelectorAll(".nav-link").forEach((link) => {
		if (link.dataset.page === currentPage) {
			link.classList.add("active");
			link.setAttribute("aria-current", "page");
		}
	});
}

/* ------------------------------------------------------------------ */
/* 2. Apparition douce des blocs .reveal au scroll                     */
/* ------------------------------------------------------------------ */
function setupRevealOnScroll() {
	const revealEls = document.querySelectorAll(".reveal");
	if (!revealEls.length) return;

	if (!("IntersectionObserver" in window)) {
		revealEls.forEach((el) => el.classList.add("visible"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					obs.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
	);

	revealEls.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* 3. Apparition en cascade des post-its / cartes projets              */
/* ------------------------------------------------------------------ */
function setupCardReveal() {
	const cards = document.querySelectorAll(".postit-link, .project-card");
	if (!cards.length) return;

	if (!("IntersectionObserver" in window)) {
		cards.forEach((el) => el.classList.add("revealed"));
		return;
	}

	const observer = new IntersectionObserver(
		(entries, obs) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const el = entry.target;
					// petit décalage pour un effet de cascade naturel
					const parent = el.closest("[data-project-grid]") || el.parentElement?.parentElement;
					const siblings = parent
						? Array.from(parent.querySelectorAll(".postit-link, .project-card"))
						: [];
					const index = siblings.indexOf(el);
					const delay = index >= 0 ? Math.min(index, 10) * 60 : 0;

					setTimeout(() => el.classList.add("revealed"), delay);
					obs.unobserve(el);
				}
			});
		},
		{ threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
	);

	cards.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* 4. Filtres + recherche sur la page Projets                          */
/* ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Récupération des éléments du DOM
  const searchInput = document.querySelector("[data-project-search]");
  const checkboxes = document.querySelectorAll('input[name="project-filter"]');
  const projectCards = document.querySelectorAll(".postit-card");
  const statusText = document.querySelector("[data-project-status]");
  const emptyMessage = document.querySelector("[data-project-empty]");

  // Si on n'est pas sur la page des projets, on arrête le script pour éviter les erreurs
  if (!searchInput || !projectCards.length) return;

  // 2. Fonction de filtrage globale
  function filterProjects() {
    const searchValue = searchInput.value.toLowerCase().trim();
    
    // Récupère la liste des valeurs des cases cochées
    const activeFilters = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value.toLowerCase());

    let visibleCount = 0;

    projectCards.forEach((card) => {
      const title = (card.dataset.projectTitle || "").toLowerCase();
      const tags = (card.dataset.tags || "").toLowerCase().split(" ");

      // Vérification 1 : La recherche texte correspond-elle au titre ou aux tags ?
      const matchesSearch =
        searchValue === "" ||
        title.includes(searchValue) ||
        tags.some((tag) => tag.includes(searchValue));

      // Vérification 2 : La carte possède-t-elle TOUS les domaines/tags cochés ?
      // (Si aucun filtre n'est coché, activeFilters est vide, donc tous les projets passent)
      const matchesCheckbox =
        activeFilters.length === 0 ||
        activeFilters.every((filter) => tags.includes(filter));

      // Affichage ou masquage de la carte
      if (matchesSearch && matchesCheckbox) {
        card.style.display = ""; // Rétablit le display par défaut (grid/flex/block)
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // 3. Mise à jour du compteur et du message d'état
    if (statusText) {
      statusText.textContent = `${visibleCount} projet${visibleCount > 1 ? "s" : ""} affiché${visibleCount > 1 ? "s" : ""}`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = visibleCount > 0;
    }
  }

  // 4. Écouteurs d'événements
  // Déclenche le filtre au fur et à mesure de la saisie dans le champ de recherche
  searchInput.addEventListener("input", filterProjects);

  // Déclenche le filtre à chaque fois qu'une case est cochée/décochée
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", filterProjects);
  });
});

