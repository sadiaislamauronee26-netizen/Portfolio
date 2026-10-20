/* =============================================================
   Sadia Islam Auronee — Portfolio
   Lightweight vanilla JS · script.js
   ============================================================= */

/* Wait until the DOM is fully parsed before running */
document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------
     1. STICKY NAVBAR — add blur/shadow state on scroll
     ----------------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  // Runs on every scroll frame (rAF-throttled for performance)
  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    toggleToTop(window.scrollY);
    updateActiveLink();
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  /* -----------------------------------------------------------
     2. MOBILE MENU — hamburger toggle
     ----------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu when clicking anywhere outside of it
  document.addEventListener("click", (event) => {
    if (
      navMenu.classList.contains("is-open") &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  // Close the menu with the Escape key (accessibility)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  /* -----------------------------------------------------------
     3. SMOOTH SCROLLING for every internal anchor link
        (covers navbar, CTA buttons and footer links)
     ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      // Ignore empty or placeholder anchors like "#"
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Keep the URL hash tidy without triggering a jumpy jump
      history.pushState(null, "", targetId);
      closeMenu(); // collapse mobile menu after navigating
    });
  });

  /* -----------------------------------------------------------
     4. ACTIVE NAV LINK — highlight the section in view
     ----------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function updateActiveLink() {
    const marker = window.scrollY + 140; // small offset for the sticky nav

    let currentId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = "#" + section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === currentId);
    });
  }

  /* -----------------------------------------------------------
     5. SCROLL REVEAL — gently animate cards into view
        (adds the .is-visible class used by the .reveal styles)
     ----------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    ".card, .section__head, .hero__content, .hero__visual"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // only animate once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Fallback: simply show everything
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* -----------------------------------------------------------
     6. BACK-TO-TOP BUTTON
     ----------------------------------------------------------- */
  const toTop = document.getElementById("to-top");

  function toggleToTop(scrollY) {
    toTop.classList.toggle("is-visible", scrollY > 480);
  }

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* -----------------------------------------------------------
     7. CONTACT FORM — client-side validation + friendly status
        (no backend; replace with Formspree/EmailJS to go live)
     ----------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  // Simple, readable email pattern check
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent the default page reload

    // Grab the actual input elements (getElementById avoids HTMLFormElement's
    // built-in `name`/`action` property shadowing)
    const fields = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      subject: document.getElementById("subject"),
      message: document.getElementById("message"),
    };

    // Reset previous visual states
    Object.values(fields).forEach((f) => f.classList.remove("is-valid", "is-invalid"));
    status.classList.remove("is-error");

    // Validate each required field
    const problems = [];
    if (fields.name.value.trim().length < 2) {
      fields.name.classList.add("is-invalid");
      problems.push("name");
    }
    if (!isEmail(fields.email.value.trim())) {
      fields.email.classList.add("is-invalid");
      problems.push("email");
    }
    if (fields.subject.value.trim().length < 2) {
      fields.subject.classList.add("is-invalid");
      problems.push("subject");
    }
    if (fields.message.value.trim().length < 10) {
      fields.message.classList.add("is-invalid");
      problems.push("message");
    }

    if (problems.length) {
      status.textContent = `Please fill in: ${problems.join(", ")}.`;
      status.classList.add("is-error");
      return;
    }

    // Everything looks good — mark valid and confirm to the visitor
    Object.values(fields).forEach((f) => f.classList.add("is-valid"));
    status.textContent = "✅ Thank you! Your message is ready — I'll reply soon.";
    form.reset();

    // Clear the green highlights shortly after
    setTimeout(() => {
      Object.values(fields).forEach((f) => f.classList.remove("is-valid"));
    }, 3500);
  });

  /* -----------------------------------------------------------
     8. INITIAL STATE — run once on page load
     ----------------------------------------------------------- */
  onScroll();
});
