/* PartyNest enquiry form: opens from the "Contact Us" tab, sends details to the owner's email via Web3Forms */
(function () {
  var ACCESS_KEY = "b5de5f14-592a-4e50-98ed-6402b76474c3";
  var ENDPOINT = "https://api.web3forms.com/submit";

  var PANEL_HTML =
    '<div class="pn-head">' +
      '<h2 id="pnTitle">Tell us what you need</h2>' +
      '<button type="button" class="pn-close" id="pnClose" aria-label="Close form">&times;</button>' +
    '</div>' +
    '<p class="pn-lead">Fill in your details and we will get back to you soon.</p>' +
    '<form id="pnForm" novalidate>' +
      '<input type="checkbox" name="botcheck" class="pn-hp" tabindex="-1" autocomplete="off">' +
      '<div class="pn-field"><label for="pnName">Your name *</label>' +
        '<input id="pnName" name="name" type="text" required autocomplete="name" placeholder="e.g. Aanya Sharma"></div>' +
      '<div class="pn-field"><label for="pnPhone">Mobile number *</label>' +
        '<input id="pnPhone" name="phone" type="tel" required inputmode="tel" autocomplete="tel" placeholder="e.g. 98XXXXXXXX"></div>' +
      '<div class="pn-field"><label for="pnEmail">Email (optional)</label>' +
        '<input id="pnEmail" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div>' +
      '<div class="pn-field"><label for="pnNeed">What do you need? *</label>' +
        '<select id="pnNeed" name="looking_for" required>' +
          '<option value="">Choose one</option>' +
          '<option>Birthday Decor</option>' +
          '<option>Custom Name Items</option>' +
          '<option>Gift Hamper</option>' +
          '<option>Other</option>' +
        '</select></div>' +
      '<div class="pn-field"><label for="pnDate">Party date (optional)</label>' +
        '<input id="pnDate" name="party_date" type="date"></div>' +
      '<div class="pn-field"><label for="pnArea">Delivery area *</label>' +
        '<select id="pnArea" name="delivery_area" required>' +
          '<option value="">Choose your area</option>' +
          '<option>Delhi</option><option>Noida</option><option>Gurgaon</option>' +
          '<option>Ghaziabad</option><option>Faridabad</option>' +
        '</select></div>' +
      '<div class="pn-field"><label for="pnMsg">Message (optional)</label>' +
        '<textarea id="pnMsg" name="message" rows="3" placeholder="Name, theme, colours or anything else we should know"></textarea></div>' +
      '<p class="pn-error" id="pnError" role="alert" hidden></p>' +
      '<button type="submit" class="btn pn-submit" id="pnSubmit">Send details&nbsp; &rarr;</button>' +
    '</form>' +
    '<div class="pn-success" id="pnSuccess" hidden>' +
      '<div class="pn-emoji">🎉</div>' +
      '<h3>Thank you!</h3>' +
      '<p>We have received your details and will contact you soon.</p>' +
      '<button type="button" class="btn" id="pnDone">Done</button>' +
    '</div>';

  function init() {
    var overlay = document.createElement("div");
    overlay.className = "pn-overlay";
    overlay.id = "pnOverlay";

    var panel = document.createElement("aside");
    panel.className = "pn-panel";
    panel.id = "pnPanel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "pnTitle");
    panel.innerHTML = PANEL_HTML;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    var form = document.getElementById("pnForm");
    var errorBox = document.getElementById("pnError");
    var success = document.getElementById("pnSuccess");
    var submitBtn = document.getElementById("pnSubmit");
    var lastFocus = null;

    var dateInput = document.getElementById("pnDate");
    try { dateInput.min = new Date().toISOString().slice(0, 10); } catch (e) {}

    function openForm() {
      lastFocus = document.activeElement;
      overlay.classList.add("open");
      panel.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(function () {
        var first = document.getElementById("pnName");
        if (first && !form.hidden) { first.focus(); }
      }, 300);
    }

    function closeForm() {
      overlay.classList.remove("open");
      panel.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
    }

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.hidden = false;
    }

    function resetForm() {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      errorBox.hidden = true;
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Send details&nbsp; &rarr;";
    }

    // Any element marked data-open-form opens the form
    document.addEventListener("click", function (e) {
      var opener = e.target.closest ? e.target.closest("[data-open-form]") : null;
      if (opener) {
        e.preventDefault();
        openForm();
        return;
      }
      // On pages that have no contact section (all pages except Home), "Contact" links open the form
      var link = e.target.closest ? e.target.closest('a[href="/#contact"], a[href="#contact"]') : null;
      if (link && !document.getElementById("contact")) {
        e.preventDefault();
        openForm();
      }
    });

    overlay.addEventListener("click", closeForm);
    document.getElementById("pnClose").addEventListener("click", closeForm);
    document.getElementById("pnDone").addEventListener("click", function () {
      closeForm();
      setTimeout(resetForm, 350);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("open")) { closeForm(); }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorBox.hidden = true;

      var name = form.elements["name"].value.trim();
      var phone = form.elements["phone"].value.trim();
      var need = form.elements["looking_for"].value;
      var area = form.elements["delivery_area"].value;
      var email = form.elements["email"].value.trim();

      if (!name) { showError("Please enter your name."); form.elements["name"].focus(); return; }
      if (!/^[0-9+\-\s()]{10,15}$/.test(phone) || phone.replace(/\D/g, "").length < 10) {
        showError("Please enter a valid mobile number.");
        form.elements["phone"].focus();
        return;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("Please enter a valid email, or leave it empty.");
        form.elements["email"].focus();
        return;
      }
      if (!need) { showError("Please choose what you need."); form.elements["looking_for"].focus(); return; }
      if (!area) { showError("Please choose your delivery area."); form.elements["delivery_area"].focus(); return; }

      var data = {
        access_key: ACCESS_KEY,
        subject: "New enquiry from PartyNest website",
        from_name: "PartyNest Website",
        name: name,
        phone: phone,
        looking_for: need,
        delivery_area: area,
        page: window.location.href
      };
      if (email) { data.email = email; }
      var date = form.elements["party_date"].value;
      if (date) { data.party_date = date; }
      var msg = form.elements["message"].value.trim();
      if (msg) { data.message = msg; }
      if (form.elements["botcheck"].checked) { data.botcheck = "true"; }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json && json.success) {
            form.hidden = true;
            success.hidden = false;
          } else {
            throw new Error("send failed");
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Send details&nbsp; &rarr;";
          showError("Sorry, we could not send your details. Please try again in a moment.");
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
