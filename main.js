const revealElements = document.querySelectorAll(".reveal");
const projectCards = document.querySelectorAll(".project-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => observer.observe(el));

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        cardObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

projectCards.forEach((card, index) => {
  const angles = [-1.6, 1.2, -0.8, 1.7, -1.1, 0.9];
  card.style.rotate = `${angles[index % angles.length]}deg`;
  card.style.transitionDelay = `${index * 90}ms`;
  cardObserver.observe(card);
});

const form = document.querySelector("#contactForm");
const formStatus = document.querySelector(".form-status");

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Merci, ton message est bien note. Je te reponds vite.";
    form.reset();
  });
}

const pageName = document.body.dataset.page;
if (pageName) {
  const active = document.querySelector(`.nav-link[data-page="${pageName}"]`);
  if (active) {
    active.classList.add("active");
    active.setAttribute("aria-current", "page");
  }
}
