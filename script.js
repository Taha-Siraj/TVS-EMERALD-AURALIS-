const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const menuCloseIcon = document.getElementById("menu-close");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpening = !navLinks.classList.contains("show");
    navLinks.classList.toggle("show");
    navLinks.classList.toggle("animate-slide-in");
    if (menuCloseIcon) menuCloseIcon.classList.toggle("hidden", !isOpening);
    menuToggle.classList.toggle("hidden", isOpening);
  });

  if (menuCloseIcon) {
    menuCloseIcon.addEventListener("click", () => {
      navLinks.classList.remove("show", "animate-slide-in");
      menuCloseIcon.classList.add("hidden");
      menuToggle.classList.remove("hidden");
    });
  }

  document.querySelectorAll("#nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show", "animate-slide-in");
      if (menuCloseIcon) menuCloseIcon.classList.add("hidden");
      menuToggle.classList.remove("hidden");
    });
  });
}

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

setTimeout(() => {
  popup.style.display = "flex";
}, 5000);

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

    const name = form.querySelector("input[name='name']")?.value.trim() || "";
    const phoneInput = form.querySelector("input[type='tel']");
    const iti = window.intlTelInputGlobals?.getInstance(phoneInput);
    const fullPhone = iti ? iti.getNumber() : (phoneInput?.value || "").trim();
    const email = form.querySelector("input[type='email']")?.value.trim() || "";
    const comments = form.querySelector("textarea[name='Comments']")?.value.trim() ||
      form.querySelector("input[name='Comments']")?.value.trim() || "";

    if (!name || !fullPhone) {
      alert("Please fill all required fields!");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector("button[type='submit'], button");
    const originalText = submitBtn ? submitBtn.textContent : null;
    if (submitBtn) {
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;
    }

    // Prepare data for Google Apps Script
    const data = {
      name: name,
      email: email,
      phone: fullPhone,
      comments: comments
    };

    console.log('Sending data to Google Apps Script:', data);

    // Send data to Google Apps Script
    fetch('https://script.google.com/macros/s/AKfycbx5qiyl9PVpo6olZD-37tos3j5iQk6q5NRrq3sP7NKCMXFdBLdYNcT8HiB3o5_Wgn5g/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data)
    })
      .then(response => {
        console.log('Response received:', response);
        return 'success';
      })
      .then(result => {
        console.log('Success:', result);

        // Also send to WhatsApp as backup
        const whatsappNumber = "9632870766";
        const message = `📋 *New Lead Captured!*\n\n👤 Name: ${name}\n📞 Phone: ${fullPhone}\n📧 Email: ${email}\n💬 Comments: ${comments}\n\nLanding Page: TVS Emerald Auralis`;

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        // ✅ Google Conversion Tracking Code
        if (typeof gtag === "function") {
          gtag('event', 'conversion', {
            'send_to': 'AW-17534941505/UNmeCP7ur6gbEMHyp6lB'
          });
        }

        form.reset();
        alert("Thank you! Your information has been saved and our team will contact you shortly.");
      })
      .catch(error => {
        console.error('Error:', error);

        // Fallback: Send to WhatsApp only if Google Apps Script fails
        const whatsappNumber = "9632870766";
        const message = `📋 *New Lead Captured!*\n\n👤 Name: ${name}\n📞 Phone: ${fullPhone}\n📧 Email: ${email}\n💬 Comments: ${comments}\n\nLanding Page: TVS Emerald Auralis`;

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");

        // ✅ Google Conversion Tracking Code
        if (typeof gtag === "function") {
          gtag('event', 'conversion', {
            'send_to': 'AW-17534941505/UNmeCP7ur6gbEMHyp6lB'
          });
        }

        form.reset();
        alert("Thank you! Our team will contact you shortly. (Note: Data backup sent via WhatsApp)");
      })
      .finally(() => {
        // Reset button state
        if (submitBtn && originalText !== null) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      });
  });
});

document.querySelectorAll("form.lead-form input").forEach((input) => {
  const savedValue = localStorage.getItem(input.name);
  if (savedValue) input.value = savedValue;

  input.addEventListener("input", () => {
    localStorage.setItem(input.name, input.value);
  });
});
