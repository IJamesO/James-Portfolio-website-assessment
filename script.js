// Progressive JS: typed text, scroll reveal, back-to-top, lightbox, contact/booking handling
document.addEventListener('DOMContentLoaded', () => {

  /* Typed text (if element exists) */
  (function typedText() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const messages = [
      "Business Management with Innovation and Technology student.",
      "Passionate about digital transformation and cybersecurity.",
      "Transforming business ideas into digital solutions."
    ];
    let mi = 0, ci = 0;
    const typeSpeed = 45, backSpeed = 25, pause = 1600;
    let deleting = false;
    function tick() {
      const txt = messages[mi];
      if (!deleting) {
        el.textContent = txt.slice(0, ci + 1);
        ci++;
        if (ci === txt.length) { deleting = true; setTimeout(tick, pause); }
        else setTimeout(tick, typeSpeed);
      } else {
        el.textContent = txt.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; mi = (mi + 1) % messages.length; setTimeout(tick, 200); }
        else setTimeout(tick, backSpeed);
      }
    }
    tick();
  })();

  /* Scroll reveal */
  const reveal = () => {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 80) el.classList.add('visible');
    });
  };
  reveal();
  window.addEventListener('scroll', reveal);
  window.addEventListener('resize', reveal);

  /* Back-to-top */
  const back = document.getElementById('backToTop');
  if (back) {
    const toggle = () => back.style.display = (window.scrollY > 300 ? 'block' : 'none');
    toggle();
    window.addEventListener('scroll', toggle);
    back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Lightbox controls (safe checks) */
  window.openLightbox = function(id) {
    const lb = document.getElementById(id);
    if (!lb) return;
    lb.classList.add('show');
    lb.setAttribute('aria-hidden', 'false');
    // trap focus could be added later
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = function(e, id) {
    const lb = document.getElementById(id);
    if (!lb) return;
    // close if background clicked or close button clicked
    if (e.target === lb || e.target.classList.contains('close-btn')) {
      lb.classList.remove('show');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };
  // enable keyboard close (Esc)
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      document.querySelectorAll('.lightbox.show').forEach(lb => {
        lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow = '';
      });
    }
  });

  /* Contact form submit -> mailto (client-side validation) */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const feedback = document.getElementById('formFeedback');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('name') || {}).value?.trim() || '';
      const email = (document.getElementById('email') || {}).value?.trim() || '';
      const message = (document.getElementById('message') || {}).value?.trim() || '';
      if (!name || !email || !message) {
        feedback.textContent = 'Please complete all fields.';
        feedback.style.color = 'var(--gold)';
        return;
      }
      // simple email pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.style.color = 'var(--gold)';
        return;
      }
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
      window.location.href = `mailto:s.o.igbe@edu.salford.ac.uk?subject=${subject}&body=${body}`;
      feedback.textContent = 'Your email client should open. Please send to complete contact.';
      feedback.style.color = 'var(--accent)';
    });
  }

  /* Booking form -> mailto with validation */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const bf = document.getElementById('bookingFeedback');
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = (document.getElementById('bdate') || {}).value || '';
      const time = (document.getElementById('btime') || {}).value || '';
      const people = (document.getElementById('bpeople') || {}).value || '';
      const name = (document.getElementById('bname') || {}).value?.trim() || '';
      const email = (document.getElementById('bemail') || {}).value?.trim() || '';
      if (!date || !time || !people || !name || !email) {
        if (bf) { bf.textContent = 'Please fill all booking fields.'; bf.style.color = 'var(--gold)'; }
        return;
      }
      // date not in past (compare at local time)
      const picked = new Date(`${date}T${time}`);
      const now = new Date();
      if (isNaN(picked.getTime())) {
        if (bf) { bf.textContent = 'Please choose a valid date and time.'; bf.style.color = 'var(--gold)'; }
        return;
      }
      if (picked < now) {
        if (bf) { bf.textContent = 'Please select a future date & time.'; bf.style.color = 'var(--gold)'; }
        return;
      }
      const subject = encodeURIComponent(`Booking request — ${name} (${date} ${time})`);
      const body = encodeURIComponent(`Booking details:\nDate: ${date}\nTime: ${time}\nPeople: ${people}\nName: ${name}\nEmail: ${email}\n\nPlease confirm availability.`);
      window.location.href = `mailto:restaurant@example.com?subject=${subject}&body=${body}`;
      if (bf) { bf.textContent = 'A booking email has been generated in your email client.'; bf.style.color = 'var(--accent)'; }
    });
  }

  /* Enable keyboard activation for .cert-card buttons */
  document.querySelectorAll('.cert-card[role="button"]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.click();
      }
    });
  });

});

// ---------- KEYBOARD LIGHTBOX NAVIGATION ----------
const projectIds = ["project1", "project2", "project3"];
let currentProjectIndex = -1;

function openLightbox(id) {
  const lb = document.getElementById(id);
  lb.classList.add("show");
  lb.style.display = "flex";
  lb.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  currentProjectIndex = projectIds.indexOf(id);
}

window.closeLightbox = function(e, id) {
  const lb = document.getElementById(id);

  if (e.target.classList.contains("lightbox") || e.target.classList.contains("close-btn")) {
    lb.classList.remove("show");
    lb.style.display = "none";
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentProjectIndex = -1;
  }
};

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (currentProjectIndex === -1) return; // no lightbox open

  if (e.key === "Escape") {
    const openBox = document.getElementById(projectIds[currentProjectIndex]);
    openBox.style.display = "none";
    currentProjectIndex = -1;
    document.body.style.overflow = "";
  }

  if (e.key === "ArrowRight") {
    currentProjectIndex = (currentProjectIndex + 1) % projectIds.length;
    openLightbox(projectIds[currentProjectIndex]);
  }

  if (e.key === "ArrowLeft") {
    currentProjectIndex = (currentProjectIndex - 1 + projectIds.length) % projectIds.length;
    openLightbox(projectIds[currentProjectIndex]);
  }
});

// COOKIE CONSENT LOGIC ------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");
    const denyBtn = document.getElementById("denyCookies");

    // Check if cookie already set
    if (!localStorage.getItem("cookieConsent")) {
        banner.style.display = "block";
    }

    // Accept cookies
    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        banner.style.display = "none";
    });

    // Deny cookies
    denyBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "denied");
        banner.style.display = "none";
    });
});
