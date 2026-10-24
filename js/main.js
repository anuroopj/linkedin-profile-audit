
    // Google Apps Script Web App URL (deployed Code.gs)
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbww1ezXVw8tIIiGoV2tqT7vHQ1am6XP4KIEm6VUGu6D2O_C2jnU0gnjrC9Uzey--tlK/exec";

    const form = document.getElementById("auditForm");
    const submitBtn = document.getElementById("submitBtn");
    const statusBox = document.getElementById("formStatus");

    const fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      linkedin: document.getElementById("linkedin")
    };
    const errors = {
      name: document.getElementById("nameError"),
      email: document.getElementById("emailError"),
      linkedin: document.getElementById("linkedinError")
    };

    function setError(key, message) {
      errors[key].textContent = message;
      fields[key].classList.toggle("is-invalid", Boolean(message));
    }

    function validate() {
      let ok = true;
      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const linkedin = fields.linkedin.value.trim();

      if (!name) { setError("name", "Please enter your name."); ok = false; }
      else setError("name", "");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email address."); ok = false; }
      else setError("email", "");

      if (!linkedin || !/linkedin\.com\//i.test(linkedin)) { setError("linkedin", "Please enter a LinkedIn profile URL (e.g. linkedin.com/in/yourprofile)."); ok = false; }
      else setError("linkedin", "");

      return ok;
    }

    function showStatus(type, message) {
      statusBox.className = "form__status is-visible form__status--" + type;
      statusBox.textContent = message;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      statusBox.className = "form__status";
      if (!validate()) return;

      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const linkedin = fields.linkedin.value.trim();

      const url = SCRIPT_URL + "?" + new URLSearchParams({ name, email, linkedin });

      submitBtn.disabled = true;
      const originalLabel = submitBtn.firstChild.textContent;
      submitBtn.firstChild.textContent = "Generating your audit… ";

      try {
        // no-cors: the browser cannot read the response, so we assume the request reached the script.
        await fetch(url, { method: "GET", mode: "no-cors" });
        form.reset();
        showStatus("success", "Thanks! Your free audit is on its way to " + email + ".");
      } catch (err) {
        showStatus("error", "Something went wrong. Please check your connection and try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.firstChild.textContent = originalLabel;
      }
    });

    // FAQ accordion
    document.querySelectorAll(".faq__question").forEach(function (button) {
      button.addEventListener("click", function () {
        const item = button.closest(".faq__item");
        const isOpen = item.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });
  