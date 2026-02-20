/* ============================================================
   MINHAS FÉRIAS — script.js
   Interações: scroll reveal, hover parallax na imagem, progresso
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ─────────────────────────────────── */
  function initScrollReveal() {
    const cards = document.querySelectorAll('body > div');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // Delay escalonado por card
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ── 2. BARRA DE PROGRESSO DE LEITURA ────────────────── */
  function initReadingProgress() {
    var bar = document.createElement('div');
    bar.id = 'reading-bar';
    Object.assign(bar.style, {
      position:   'fixed',
      top:        '0',
      left:       '0',
      height:     '3px',
      width:      '0%',
      background: 'linear-gradient(90deg, #B8750A, #C4611A)',
      zIndex:     '9999',
      transition: 'width 0.1s linear',
      borderRadius: '0 2px 2px 0',
    });
    document.body.appendChild(bar);

    window.addEventListener('scroll', function () {
      var scrollTop    = window.scrollY || document.documentElement.scrollTop;
      var docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      var progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width  = Math.min(progress, 100) + '%';
    }, { passive: true });
  }

  /* ── 3. BOTÃO VOLTAR AO TOPO ──────────────────────────── */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id          = 'back-to-top';
    btn.textContent = '↑';
    btn.setAttribute('aria-label', 'Voltar ao topo');

    Object.assign(btn.style, {
      position:     'fixed',
      bottom:       '1.5rem',
      right:        '1.5rem',
      width:        '44px',
      height:       '44px',
      borderRadius: '50%',
      border:       'none',
      background:   '#B8750A',
      color:        '#fff',
      fontSize:     '1.2rem',
      cursor:       'pointer',
      boxShadow:    '0 4px 16px rgba(184,117,10,0.35)',
      opacity:      '0',
      transform:    'translateY(12px)',
      transition:   'opacity 0.3s ease, transform 0.3s ease',
      zIndex:       '9998',
    });

    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      var show = window.scrollY > 400;
      btn.style.opacity   = show ? '1' : '0';
      btn.style.transform = show ? 'translateY(0)' : 'translateY(12px)';
      btn.style.pointerEvents = show ? 'auto' : 'none';
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btn.addEventListener('mouseenter', function () {
      btn.style.background = '#C4611A';
      btn.style.transform  = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.background = '#B8750A';
      btn.style.transform  = window.scrollY > 400 ? 'translateY(0)' : 'translateY(12px)';
    });
  }

  /* ── 4. LIGHTBOX NAS IMAGENS ──────────────────────────── */
  function initLightbox() {
    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    Object.assign(overlay.style, {
      display:         'none',
      position:        'fixed',
      inset:           '0',
      background:      'rgba(42, 31, 18, 0.88)',
      zIndex:          '10000',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '1.5rem',
      cursor:          'zoom-out',
      backdropFilter:  'blur(6px)',
      transition:      'opacity 0.25s ease',
      opacity:         '0',
    });

    var lightImg = document.createElement('img');
    Object.assign(lightImg.style, {
      maxWidth:      '90vw',
      maxHeight:     '88vh',
      borderRadius:  '0.75rem',
      boxShadow:     '0 24px 80px rgba(0,0,0,0.6)',
      transform:     'scale(0.95)',
      transition:    'transform 0.3s ease',
      cursor:        'default',
      objectFit:     'contain',
    });

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    Object.assign(closeBtn.style, {
      position:     'fixed',
      top:          '1rem',
      right:        '1.25rem',
      background:   'rgba(253,250,245,0.15)',
      border:       '1px solid rgba(253,250,245,0.25)',
      color:        '#FDFAF5',
      fontSize:     '1.1rem',
      width:        '38px',
      height:       '38px',
      borderRadius: '50%',
      cursor:       'pointer',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
      transition:   'background 0.2s',
    });

    overlay.appendChild(lightImg);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    function open(src, alt) {
      lightImg.src = src;
      lightImg.alt = alt || '';
      overlay.style.display = 'flex';
      requestAnimationFrame(function () {
        overlay.style.opacity = '1';
        lightImg.style.transform = 'scale(1)';
      });
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.style.opacity = '0';
      lightImg.style.transform = 'scale(0.95)';
      setTimeout(function () {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 260);
    }

  }

  /* ── 5. HOVER SUAVE NOS CARDS (tilt leve) ────────────── */
  function initCardTilt() {
    var cards = document.querySelectorAll('body > div');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect   = card.getBoundingClientRect();
        var x      = e.clientX - rect.left;
        var y      = e.clientY - rect.top;
        var cx     = rect.width  / 2;
        var cy     = rect.height / 2;
        var rotateX = ((y - cy) / cy) * -1;
        var rotateY = ((x - cx) / cx) *  1  ;
        card.style.transform = 'translateY(-5px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        card.style.transition = 'box-shadow 0.35s ease';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform  = 'translateY(0) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s ease, box-shadow 0.35s ease';
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initReadingProgress();
    initBackToTop();
    initLightbox();
    initCardTilt();
  });

})();
