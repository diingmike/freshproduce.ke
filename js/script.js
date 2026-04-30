// script for year
    document.getElementById("year").textContent = new Date().getFullYear();

/* =============================================================
   main.js — Fresh Produce Exporters KE
   Handles: mobile menu toggle, dynamic header spacer
   ============================================================= */

(function () {
  'use strict';

  /* ── Element refs ── */
  const header     = document.getElementById('header-cover');
  const spacer     = document.getElementById('header-spacer');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  /* ── Dynamic spacer height ──────────────────────────────────
     Keeps body content from hiding under the fixed header
     across all breakpoints, even if fonts haven't loaded yet.
  ──────────────────────────────────────────────────────────── */
  function syncSpacerHeight() {
    if (header && spacer) {
      spacer.style.height = header.offsetHeight + 'px';
    }
  }

  // Run on load, resize, and after fonts
  syncSpacerHeight();
  window.addEventListener('resize', syncSpacerHeight);
  document.fonts && document.fonts.ready.then(syncSpacerHeight);

  /* ── Mobile menu toggle ─────────────────────────────────── */
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('is-open');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    syncSpacerHeight(); // header grows when menu opens
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    setTimeout(syncSpacerHeight, 400); // wait for 0.38s max-height transition
  }

  hamburger.addEventListener('click', function () {
    mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  /* Close when any link inside the menu is tapped */
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close on outside click */
  document.addEventListener('click', function (e) {
    if (
      mobileMenu.classList.contains('is-open') &&
      !hamburger.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

})();

/* ============================================================
   Banner Carousel — 10-second auto-rotate
   ============================================================ */
(function () {
    'use strict';

    const section     = document.getElementById('bannerSection');
    if (!section) return;

    const slides      = section.querySelectorAll('.slide');
    const dots        = section.querySelectorAll('.dot');
    const progressBar = document.getElementById('progressBar');
    const counter     = document.getElementById('counterCurrent');
    const prevBtn     = document.getElementById('prevBtn');
    const nextBtn     = document.getElementById('nextBtn');

    const total       = slides.length;
    let   current     = 0;
    let   timer;

    function goTo(index)
    {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = (index + total) % total;

        slides[current].classList.add('active');
        dots[current].classList.add('active');

        if (counter)
            counter.textContent = String(current + 1).padStart(2, '0');

        resetProgress();
    }

    function resetProgress()
    {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';

        requestAnimationFrame(function ()
        {
            requestAnimationFrame(function ()
            {
                progressBar.style.transition = 'width 10s linear';
                progressBar.style.width = '100%';
            });
        });
    }

    function startTimer()
    {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, 10000);
    }

    /* Dot clicks */
    dots.forEach(function (dot)
    {
        dot.addEventListener('click', function ()
        {
            goTo(parseInt(dot.dataset.index, 10));
            startTimer();
        });
    });

    /* Arrow clicks */
    if (prevBtn)
        prevBtn.addEventListener('click', function () { goTo(current - 1); startTimer(); });

    if (nextBtn)
        nextBtn.addEventListener('click', function () { goTo(current + 1); startTimer(); });

    /* Touch/swipe support */
    let touchStartX = 0;

    section.addEventListener('touchstart', function (e)
    {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    section.addEventListener('touchend', function (e)
    {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40)
        {
            goTo(diff > 0 ? current + 1 : current - 1);
            startTimer();
        }
    }, { passive: true });

    /* Initialise */
    resetProgress();
    startTimer();

})();