// main.js — Portfolio Lea Thiebert
// Gère : l'état actif de la nav, les animations "reveal" au scroll,
// l'apparition des post-its / project-cards, les filtres de la page Projets,
// et les carrousels par phases.

document.addEventListener("DOMContentLoaded", () => {
    setActiveNavLink();
    setupRevealOnScroll();
    setupCardReveal();
    setupProjectFilters();
    setupImageCarousels();
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
function setupProjectFilters() {
    const searchInput = document.querySelector("[data-project-search]");
    const checkboxes = document.querySelectorAll('input[name="project-filter"]');
    const projectCards = document.querySelectorAll(".postit-card");
    const statusText = document.querySelector("[data-project-status]");
    const emptyMessage = document.querySelector("[data-project-empty]");

    if (!searchInput || !projectCards.length) return;

    function filterProjects() {
        const searchValue = searchInput.value.toLowerCase().trim();
        const activeFilters = Array.from(checkboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value.toLowerCase());

        let visibleCount = 0;

        projectCards.forEach((card) => {
            const title = (card.dataset.projectTitle || "").toLowerCase();
            const tags = (card.dataset.tags || "").toLowerCase().split(" ");

            const matchesSearch =
                searchValue === "" ||
                title.includes(searchValue) ||
                tags.some((tag) => tag.includes(searchValue));

            const matchesCheckbox =
                activeFilters.length === 0 ||
                activeFilters.every((filter) => tags.includes(filter));

            if (matchesSearch && matchesCheckbox) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        if (statusText) {
            statusText.textContent = `${visibleCount} projet${visibleCount > 1 ? "s" : ""} affiché${visibleCount > 1 ? "s" : ""}`;
        }

        if (emptyMessage) {
            emptyMessage.hidden = visibleCount > 0;
        }
    }

    searchInput.addEventListener("input", filterProjects);
    checkboxes.forEach((cb) => cb.addEventListener("change", filterProjects));
}

/* ------------------------------------------------------------------ */
/* 5. Carrousels d'images & gestion des Phases (Onglets)              */
/* ------------------------------------------------------------------ */
function setupImageCarousels() {
    const phaseBtns = document.querySelectorAll('.phase-btn');
    const carousels = document.querySelectorAll('.image-carousel');

    if (!carousels.length) return;

    // --- Bascule entre Phase 1, Phase 2... ---
    phaseBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            phaseBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            carousels.forEach((carousel) => {
                if (carousel.id === targetId) {
                    carousel.classList.add('active');
                } else {
                    carousel.classList.remove('active');
                }
            });
        });
    });

    // --- Défilement des images pour chaque carrousel ---
    carousels.forEach((carousel) => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        if (!slides.length) return;

        function updateCarousel() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }
    });
}