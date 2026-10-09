/* Update these two settings with the business's real contact details. */
const BUSINESS_CONTACT = {
  email: "destiny01694@gmail.com",
  whatsapp: "254722177221",
};

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("open");
  }
});

const whatsappMessage = "Hello Supertech Steel Fabrication, I would like to enquire about a project.";
document.querySelectorAll("[data-wa]").forEach((link) => {
  const phone = BUSINESS_CONTACT.whatsapp.replace(/\D/g, "");
  link.href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

// Service cards take visitors straight to the quote form with their service selected.
const serviceSelect = document.querySelector("#project-type");
document.querySelectorAll(".service-card > a").forEach((link) => {
  link.addEventListener("click", () => {
    const title = link.closest(".service-card").querySelector("h3").textContent.trim();
    const option = [...serviceSelect.options].find((item) => item.textContent.trim() === title);
    if (option) serviceSelect.value = option.value;
  });
});

// Reveal content as it enters view for a little more movement while scrolling.
document.documentElement.classList.add("js-enabled");
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".service-card, .gallery-item, .intro-content, .about-copy, .quote-form").forEach((item) => {
  item.classList.add("reveal-on-scroll");
  revealObserver.observe(item);
});

document.querySelector("#year").textContent = new Date().getFullYear();

const form = document.querySelector("#quote-form");
const feedback = document.querySelector("#form-feedback");
const fields = [...form.querySelectorAll("input, select, textarea")];

function setError(field, message) {
  const error = field.parentElement.querySelector(".field-error");
  error.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(field) {
  const value = field.value.trim();
  let message = "";
  if (!value) message = "Please complete this field.";
  else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    message = "Enter a valid email address.";
  } else if (field.name === "description" && value.length < 10) {
    message = "Please add a little more detail (at least 10 characters).";
  }
  setError(field, message);
  return !message;
}

fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateField(field);
  });
  field.addEventListener("change", () => validateField(field));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const allValid = fields.map(validateField).every(Boolean);
  feedback.className = "form-feedback";
  if (!allValid) {
    feedback.textContent = "Please check the highlighted fields and try again.";
    feedback.classList.add("error");
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const values = new FormData(form);
  const subject = `Quote request — ${values.get("type")}`;
  const body = [
    "Hello Supertech Steel Fabrication,",
    "",
    "I would like to request a quote for:",
    `Project type: ${values.get("type")}`,
    `Project location: ${values.get("location")}`,
    "",
    "Project details:",
    values.get("description"),
    "",
    `Name: ${values.get("name")}`,
    `Phone or email: ${values.get("contact")}`,
  ].join("\n");

  feedback.textContent = BUSINESS_CONTACT.email
    ? "Opening your email app with the quote request…"
    : "Opening your email app with the request ready. Add the business email in script.js to pre-address it.";
  feedback.classList.add("success");
  window.location.href = `mailto:${encodeURIComponent(BUSINESS_CONTACT.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
