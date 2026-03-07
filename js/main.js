/* ============================================================
   MAIN CONTROLLER — Lock Screen + Full Site
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.innerWidth <= 768;
  const lockScreen = document.getElementById('lockScreen');
  const mainSite = document.getElementById('mainSite');

  // ── Initialize lock screen particles ──
  const lockParticles = new StarfieldParticles('lock-canvas');

  // ── Birthday Countdown on Lock Screen ──
  // TESTING: Set to March 7, 2:36 PM (change back to March 12 for production)
  const countdown = new BirthdayCountdown(2, 7, () => {
    unlockSite();
  }, 14, 36);

  // Check immediately: if it's already March 12+, skip the lock
  if (countdown.isBirthday()) {
    unlockSite();
  }

  function unlockSite() {
    // Show the main site
    if (mainSite) {
      mainSite.classList.remove('main-site-hidden');
      mainSite.classList.add('main-site-visible');
    }

    // Animate lock screen away
    if (lockScreen) {
      lockScreen.classList.add('unlocked');
      setTimeout(() => {
        lockScreen.remove();
        lockParticles.destroy?.();
      }, 1500);
    }

    // Initialize the full site after a brief delay
    setTimeout(() => initSite(), 300);
  }

  function initSite() {
    // ── Init Animation Systems ──
    const starfield = new StarfieldParticles('hero-canvas');
    const sparkles = new TouchSparkles('sparkle-canvas');
    const confetti = new ConfettiCannon('confetti-canvas');
    const celebration = new CelebrationConfetti('confetti-canvas', isMobile);
    const audioController = new AudioController('musicToggle');

    // Floating hearts in final section
    createFloatingHearts('floatingHearts', isMobile ? 10 : 18);

    // Typewriter for message section
    const letterBody = document.getElementById('letterBody');
    const typewriter = letterBody ? new TypewriterEffect(letterBody) : null;

    // Swipeable Carousel
    new SwipeCarousel('carousel', 'carouselDots');

    // Quiz
    new BirthdayQuiz();

    // Bubble Pop
    new BubblePop();

    // Birthday Cake — after all candles blown, show the gift button
    const openGiftBtn = document.getElementById('openGift');
    new BirthdayCake(() => {
      if (openGiftBtn) {
        openGiftBtn.style.display = 'inline-flex';
        openGiftBtn.style.animation = 'fadeInUp 0.6s var(--ease-out) both, pulseBtn 2s ease-in-out infinite';
      }
      if (navigator.vibrate) navigator.vibrate([50, 50, 100]);
    });


    // ── Scroll Reveal Observer ──
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));


    // ── Section Transition Observer ──
    const sections = document.querySelectorAll('.section-transition');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('section-visible');
      });
    }, { threshold: 0.1 });
    sections.forEach(s => sectionObserver.observe(s));


    // ── SVG Handwriting Animation ──
    const handwritingText = document.querySelector('.handwriting-text');
    if (handwritingText) {
      const hwObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            handwritingText.classList.add('animate');
            hwObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      hwObserver.observe(handwritingText);
    }


    // ── Typewriter Trigger ──
    if (letterBody && typewriter) {
      const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typewriter.start();
            typewriterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      typewriterObserver.observe(letterBody);
    }


    // ── Final Section — Celebration ──
    const finalSection = document.getElementById('final-wish');
    if (finalSection) {
      const celebrationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) celebration.start();
          else celebration.stop();
        });
      }, { threshold: 0.2 });
      celebrationObserver.observe(finalSection);
    }


    // ── Hero CTA ──
    const startBtn = document.getElementById('startStory');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // Auto-start music on first interaction
        if (!audioController.isPlaying) {
          audioController.toggle();
        }
        document.getElementById('beginning')?.scrollIntoView({ behavior: 'smooth' });
      });
    }


    // ── Replay Button ──
    const replayBtn = document.getElementById('replayBtn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        revealElements.forEach(el => el.classList.remove('visible'));
        sections.forEach(s => s.classList.remove('section-visible'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          revealElements.forEach(el => revealObserver.observe(el));
          sections.forEach(s => sectionObserver.observe(s));
        }, 1000);
      });
    }


    // ── Fun Fact Cards — Click to Flip ──
    document.querySelectorAll('.funfact-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.funfact-card').forEach(c => { if (c !== card) c.classList.remove('flipped'); });
        card.classList.toggle('flipped');
      });
    });


    // ── Lightbox (for carousel) ──
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.polaroid').forEach(polaroid => {
      polaroid.addEventListener('click', () => {
        const visual = polaroid.querySelector('div, img');
        if (!visual || !lightbox) return;
        const clone = visual.cloneNode(true);
        clone.style.width = '80vmin'; clone.style.height = '80vmin';
        clone.style.maxWidth = '500px'; clone.style.maxHeight = '500px';
        clone.style.borderRadius = '12px';
        lightboxContent.innerHTML = '';
        lightboxContent.appendChild(clone);
        lightboxCaption.textContent = polaroid.getAttribute('data-caption') || '';
        lightbox.classList.add('active');
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox?.classList.contains('active')) lightbox.classList.remove('active'); });


    // ── Gift Surprise Reveal ──
    const surpriseMessage = document.getElementById('surpriseMessage');

    function openGift() {
      if (openGiftBtn) openGiftBtn.style.display = 'none';
      confetti.fire(isMobile ? 150 : 250);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
      setTimeout(() => {
        if (surpriseMessage) surpriseMessage.classList.add('visible');
      }, 800);
    }

    if (openGiftBtn) openGiftBtn.addEventListener('click', openGift);


    // ── Divider animations ──
    const dividers = document.querySelectorAll('.section-divider');
    const dividerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.style.opacity = entry.isIntersecting ? '1' : '0';
        entry.target.style.transition = 'opacity 0.8s ease';
      });
    }, { threshold: 0.5 });
    dividers.forEach(d => { d.style.opacity = '0'; dividerObserver.observe(d); });
  }

});
