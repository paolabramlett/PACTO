/* ================================================================
   PACTO arquitectura — script.js
   · Animaciones de scroll (IntersectionObserver)
   · Parallax del hero
   · Acordeón de preguntas frecuentes
   · Fade del indicador de scroll
   ================================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------- */

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Activa el sistema de animaciones solo si el JS carga
  // (así el contenido es visible sin JS)
  document.body.setAttribute('data-anim', '');


  /* ---------------------------------------------------------------
     IntersectionObserver — reveal general (.js-reveal)
     --------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.js-reveal, .pull-quote'
  );

  if (revealTargets.length && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    // Sin JS o reduced-motion: hacer todo visible inmediatamente
    revealTargets.forEach((el) => el.classList.add('visible'));
  }


  /* ---------------------------------------------------------------
     Portafolio — reveal escalonado por tarjeta
     --------------------------------------------------------------- */
  const portfolioCards = document.querySelectorAll('.project-card');

  if (portfolioCards.length && !prefersReducedMotion) {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(portfolioCards).indexOf(entry.target);
            // Cada tarjeta aparece 120ms después que la anterior
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, idx * 120);
            cardObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    portfolioCards.forEach((card) => cardObserver.observe(card));
  }


  /* ---------------------------------------------------------------
     Pasos del proceso — reveal escalonado en cascada
     Grid 2×2: aparecen casi al mismo tiempo, en diagonal
     01 → 02 → 03 → 04 con 80ms de separación
     --------------------------------------------------------------- */
  const processSteps = document.querySelectorAll('.process-step');

  if (processSteps.length && !prefersReducedMotion) {
    // Un solo observer para toda la sección — dispara cuando
    // el grid entra en pantalla y anima todos los pasos en cascada
    let gridFired = false;

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !gridFired) {
            gridFired = true;
            processSteps.forEach((step, idx) => {
              setTimeout(() => {
                step.classList.add('visible');
              }, idx * 90);
            });
            stepObserver.disconnect();
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    // Observar el primer paso como trigger del grid completo
    if (processSteps[0]) stepObserver.observe(processSteps[0]);
  } else {
    // Sin animación: mostrar todo inmediatamente
    processSteps.forEach((step) => step.classList.add('visible'));
  }


  /* ---------------------------------------------------------------
     Parallax del hero — movimiento vertical suave al hacer scroll
     --------------------------------------------------------------- */
  const heroImage = document.querySelector('.hero-image');
  const heroSection = document.querySelector('.hero');

  if (heroImage && heroSection && !prefersReducedMotion) {
    let ticking = false;

    const applyParallax = () => {
      const scrollY = window.scrollY;
      const heroBottom = heroSection.offsetHeight;

      // Solo aplicar mientras el hero esté en pantalla
      if (scrollY <= heroBottom * 1.4) {
        // Factor 0.32 — movimiento lento y sutil
        heroImage.style.transform = `translateY(${scrollY * 0.32}px)`;
      }

      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }


  /* ---------------------------------------------------------------
     Scroll indicator — desvanece al bajar
     --------------------------------------------------------------- */
  const scrollIndicator = document.querySelector('.hero-scroll');

  if (scrollIndicator) {
    window.addEventListener(
      'scroll',
      () => {
        const opacity = window.scrollY > 80 ? '0' : '1';
        scrollIndicator.style.opacity = opacity;
      },
      { passive: true }
    );
  }


  /* ---------------------------------------------------------------
     FAQ Acordeón
     Usa el grid-template-rows trick para animar height: auto
     --------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar todos los demás
      faqItems.forEach((other) => {
        if (other === item) return;
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('faq-open');
        }
      });

      // Alternar el actual
      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('faq-open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('faq-open');
      }
    });

    // Soporte de teclado — Enter y Espacio ya se manejan por defecto en <button>
    // pero aseguramos que el acordeón también responda a teclado
  });


  /* ---------------------------------------------------------------
     Smooth scroll para cualquier ancla interna (por si se necesita)
     --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();
