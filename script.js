const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const menuOpenIcon = document.getElementById("menu-open");
const menuCloseIcon = document.getElementById("menu-close");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  navLinks.classList.toggle("animate-slide-in"); 
  menuOpenIcon.classList.toggle("hidden");
  menuCloseIcon.classList.toggle("hidden");
  
});

document.querySelectorAll("#nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show", "animate-slide-in");
    menuOpenIcon.classList.remove("hidden");
    menuCloseIcon.classList.add("hidden");
  });
});

const inputs = document.querySelectorAll("#phone");
inputs.forEach((input) => {
  window.intlTelInput(input, {
    initialCountry: "in",
    preferredCountries: ["in", "us", "gb"],
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  });
});

const popup = document.getElementById("popup");
const openBtns = document.querySelectorAll(".open-popup");
const closeBtn = document.querySelector(".close");

openBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    popup.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});

document.querySelectorAll("form.lead-form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector("input[name='name']").value.trim();
    const phoneInput = form.querySelector("input[type='tel']");
    const iti = window.intlTelInputGlobals.getInstance(phoneInput);
    const fullPhone = iti.getNumber();

    if (!name || !fullPhone) {
      alert("Please fill all fields!");
      return;
    }

    const whatsappNumber = "919876543210"; 

    const message = `📋 *New Lead Captured!*\n\n👤 Name: ${name}\n📞 Phone: ${fullPhone}\n\nLanding Page: TVS Emerald Auralis`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");

    form.reset();
    alert("Thank you! Our team will contact you shortly.");
  });
});
