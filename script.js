const BUSINESS = Object.freeze({
  name: "Supertech Engineering Works",
  whatsapp: "254717722177",
  phone: "+254717722177",
  phoneDisplay: "+2547 17722177",
  location: "Kamulu, opposite Kanjo",
});

// Add or edit customer feedback here. A review appears only when its
// quote is filled in and approved is set to true.
const TESTIMONIALS = [
  { name: "Mr. Onyango", project: "Gazebo Design & Construction", quote: "The gazebo you built for us is excellent! I really love the design. The finishing and overall look are impressive, and I’m happy with the work you’ve done.", approved: true },
  { name: "Ms. Lillian", project: "Roofing Works", quote: "Supertech Engineering Works did a fantastic job on our roofing. The results were great, and their professionalism throughout the work really stood out. I would gladly recommend their services.", approved: true },
  { name: "Mr. Mwangi", project: "Workshop & Workmanship", quote: "Commendable work! The team demonstrated a strong work ethic and delivered a job worth appreciating. Their dedication and commitment to quality are impressive.", approved: true },
];

const testimonialGrid = document.querySelector("#testimonial-grid");
const testimonialEmpty = document.querySelector("#testimonial-empty");
const approvedTestimonials = TESTIMONIALS.filter((item) => item.approved && item.quote.trim());
approvedTestimonials.forEach((item) => {
  const card = document.createElement("article");
  card.className = "testimonial-card";
  const quote = document.createElement("blockquote");
  quote.textContent = item.quote;
  const byline = document.createElement("div");
  byline.className = "testimonial-byline";
  const name = document.createElement("strong");
  name.textContent = item.name;
  const project = document.createElement("span");
  project.textContent = item.project;
  byline.append(name, project);
  card.append(quote, byline);
  testimonialGrid.append(card);
});
if (approvedTestimonials.length) testimonialEmpty.hidden = true;

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

function whatsappUrl(message) {
  return "https://wa.me/" + BUSINESS.whatsapp + "?text=" + encodeURIComponent(message);
}
document.querySelectorAll("[data-wa]").forEach((link) => {
  const message = link.dataset.message || "Hello " + BUSINESS.name + ", I would like to discuss a project.";
  link.href = whatsappUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
document.querySelectorAll("[data-service]").forEach((link) => {
  link.href = whatsappUrl("Hello " + BUSINESS.name + ", I would like to discuss: " + link.dataset.service + ".");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
document.querySelectorAll('[data-contact="phone"]').forEach((link) => {
  link.href = "tel:" + BUSINESS.phone;
  link.textContent = BUSINESS.phoneDisplay;
});
document.querySelectorAll('[data-contact="location"]').forEach((link) => {
  link.href = "https://maps.google.com/?q=" + encodeURIComponent(BUSINESS.location);
  if (link.querySelector("span")) link.firstChild.textContent = BUSINESS.location + " ";
  else link.textContent = BUSINESS.location + " ↗";
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

const photoLoop = document.querySelector("#project-photo-loop");
const photoLoopToggle = document.querySelector("#photo-loop-toggle");
photoLoopToggle.addEventListener("click", () => {
  const paused = photoLoop.classList.toggle("is-paused");
  photoLoopToggle.setAttribute("aria-label", paused ? "Resume image movement" : "Pause image movement");
  photoLoopToggle.innerHTML = paused
    ? 'Resume movement <span aria-hidden="true">▶</span>'
    : 'Pause movement <span aria-hidden="true">Ⅱ</span>';
});

// Give every portfolio image an accessible, keyboard-friendly full-screen view.
const lightbox = document.querySelector("#project-lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCategory = lightbox.querySelector(".lightbox-category");
const lightboxTitle = lightbox.querySelector(".lightbox-title");
const lightboxPosition = lightbox.querySelector(".lightbox-position");
const portfolioCards = [...document.querySelectorAll(".photo-loop-group:first-child .loop-card")];
let activePhoto = 0;
function showPortfolioPhoto(index) {
  activePhoto = (index + portfolioCards.length) % portfolioCards.length;
  const card = portfolioCards[activePhoto];
  const image = card.querySelector("img");
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCategory.textContent = card.querySelector("figcaption").textContent;
  lightboxTitle.textContent = image.alt;
  lightboxPosition.textContent = String(activePhoto + 1).padStart(2, "0") + " / " + String(portfolioCards.length).padStart(2, "0");
}
function openPortfolioPhoto(index) {
  showPortfolioPhoto(index);
  lightbox.showModal();
}
portfolioCards.forEach((card, index) => {
  card.addEventListener("click", () => openPortfolioPhoto(index));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPortfolioPhoto(index);
    }
  });
});
lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-previous").addEventListener("click", () => showPortfolioPhoto(activePhoto - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPortfolioPhoto(activePhoto + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showPortfolioPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPortfolioPhoto(activePhoto + 1);
});

const inquiryForm = document.querySelector("#inquiry-form");
const inquiryFeedback = document.querySelector("#form-feedback");
const requiredFields = [...inquiryForm.querySelectorAll("[required]")];
function updateFieldError(field) {
  let message = "";
  const value = field.value.trim();
  if (!value) message = "Please complete this field.";
  else if (field.name === "description" && value.length < 10) message = "Please add a little more detail (at least 10 characters).";
  field.closest(".field").querySelector(".field-error").textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}
requiredFields.forEach((field) => {
  field.addEventListener("blur", () => updateFieldError(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") updateFieldError(field);
  });
  field.addEventListener("change", () => updateFieldError(field));
});
inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = requiredFields.map(updateFieldError).every(Boolean);
  inquiryFeedback.className = "form-feedback";
  if (!valid) {
    inquiryFeedback.textContent = "Please check the highlighted fields before continuing.";
    inquiryFeedback.classList.add("error");
    inquiryForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }
  const values = new FormData(inquiryForm);
  const lines = [
    "Hello " + BUSINESS.name + ", I would like to discuss a project.",
    "",
    "Name: " + values.get("name").trim(),
    "Phone: " + values.get("phone").trim(),
    "Project location: " + values.get("location").trim(),
    "Project type: " + values.get("type"),
    "Project details: " + values.get("description").trim(),
  ];
  const budget = values.get("budget").trim();
  const contact = values.get("contact");
  if (budget) lines.push("Budget range (KSH): " + budget);
  if (contact) lines.push("Preferred contact: " + contact);
  inquiryFeedback.textContent = "Your message is ready. Review it in WhatsApp and send when you’re happy with the details.";
  inquiryFeedback.classList.add("success");
  window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".service-card,.intro-copy,.why-lead,.inquiry-form").forEach((item) => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
}
