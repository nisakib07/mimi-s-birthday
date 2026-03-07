/* ============================================================
   ANIMATIONS MODULE — Full Upgrade
   Particles, confetti, sparkles, bubbles, cake, typewriter
   ============================================================ */

// ── Starfield Particle System (Hero Canvas) ──
class StarfieldParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.animId = null;
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.offsetWidth;
    this.height = this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    const isMobile = this.width < 768;
    const count = Math.min(Math.floor((this.width * this.height) / (isMobile ? 18000 : 8000)), isMobile ? 60 : 150);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width, y: Math.random() * this.height,
        size: Math.random() * 2.5 + 0.5, speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3, opacity: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005, twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? 320 : 260
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); this.createParticles(); });
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - r.left; this.mouse.y = e.clientY - r.top;
    });
    this.canvas.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = Date.now() * 0.001;
    this.particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = this.width; if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height; if (p.y > this.height) p.y = 0;
      if (this.mouse.x !== null) {
        const dx = p.x - this.mouse.x, dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { const f = (120 - dist) / 120 * 0.5; p.x += (dx / dist) * f; p.y += (dy / dist) * f; }
      }
      const twinkle = Math.sin(time * p.twinkleSpeed * 60 + p.twinkleOffset);
      const alpha = p.opacity * (0.6 + 0.4 * twinkle);
      this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 60%, 80%, ${alpha})`; this.ctx.fill();
      if (p.size > 1.5) {
        this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        this.ctx.fillStyle = `hsla(${p.hue}, 60%, 80%, ${alpha * 0.12})`; this.ctx.fill();
      }
    });
    // Connection lines (skip on mobile)
    if (this.width >= 768) {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i], b = this.particles[j];
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < 100) {
            this.ctx.beginPath(); this.ctx.moveTo(a.x, a.y); this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(232,160,191,${(1 - dist / 100) * 0.08})`;
            this.ctx.lineWidth = 0.5; this.ctx.stroke();
          }
        }
      }
    }
    this.animId = requestAnimationFrame(() => this.animate());
  }
}


// ── Touch Sparkle Trail ──
class TouchSparkles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.sparkles = [];
    this.running = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Touch events
    document.addEventListener('touchmove', (e) => this.onTouch(e), { passive: true });
    document.addEventListener('touchstart', (e) => this.onTouch(e), { passive: true });
    // Also mouse for desktop
    document.addEventListener('mousemove', (e) => this.onMouse(e));
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onTouch(e) {
    const touch = e.touches[0];
    if (touch) this.addSparkles(touch.clientX, touch.clientY, 3);
  }

  onMouse(e) { this.addSparkles(e.clientX, e.clientY, 1); }

  addSparkles(x, y, count) {
    const colors = ['#e8a0bf', '#b8a9e8', '#f0d48a', '#f2b5d4', '#fff'];
    for (let i = 0; i < count; i++) {
      this.sparkles.push({
        x: x + (Math.random() - 0.5) * 20, y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 4 + 2, life: 1,
        vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: 0.02 + Math.random() * 0.02
      });
    }
    if (!this.running) { this.running = true; this.animate(); }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sparkles.forEach(s => {
      s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.life -= s.decay;
      this.ctx.beginPath(); this.ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color; this.ctx.globalAlpha = s.life; this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
    this.sparkles = this.sparkles.filter(s => s.life > 0);
    if (this.sparkles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else { this.running = false; }
  }
}


// ── Confetti Explosion ──
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = []; this.running = false;
    this.resize(); window.addEventListener('resize', () => this.resize());
  }
  resize() { this.canvas.width = this.canvas.offsetWidth; this.canvas.height = this.canvas.offsetHeight; }
  fire(count = 200) {
    const colors = ['#e8a0bf', '#b8a9e8', '#f0d48a', '#f2b5d4', '#7eb8da', '#f4978e', '#fff', '#ffd700'];
    const cx = this.canvas.width / 2, cy = this.canvas.height / 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2, vel = Math.random() * 8 + 4;
      this.particles.push({
        x: cx, y: cy, vx: Math.cos(angle) * vel * (Math.random() + 0.5),
        vy: Math.sin(angle) * vel * (Math.random() + 0.5) - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3, rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12, gravity: 0.12 + Math.random() * 0.08,
        decay: 0.96 + Math.random() * 0.03, life: 1,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }
    if (!this.running) { this.running = true; this.animateConfetti(); }
  }
  animateConfetti() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= p.decay;
      p.rotation += p.rotSpeed; p.life *= 0.995;
      this.ctx.save(); this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation * Math.PI / 180);
      this.ctx.globalAlpha = p.life; this.ctx.fillStyle = p.color;
      if (p.shape === 'rect') this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else { this.ctx.beginPath(); this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); this.ctx.fill(); }
      this.ctx.restore();
    });
    this.particles = this.particles.filter(p => p.life > 0.01 && p.y < this.canvas.height + 50);
    if (this.particles.length > 0) requestAnimationFrame(() => this.animateConfetti());
    else this.running = false;
  }
}


// ── Continuous Celebration Confetti ──
class CelebrationConfetti {
  constructor(canvasId, isMobile = false) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = []; this.running = false; this.isMobile = isMobile;
    this.resize(); window.addEventListener('resize', () => this.resize());
  }
  resize() { this.canvas.width = this.canvas.offsetWidth; this.canvas.height = this.canvas.offsetHeight; }
  start() {
    if (this.running) return; this.running = true;
    this.spawnInterval = setInterval(() => this.spawnBatch(), this.isMobile ? 600 : 400);
    this.animate();
  }
  stop() { this.running = false; clearInterval(this.spawnInterval); }
  spawnBatch() {
    const colors = ['#e8a0bf', '#b8a9e8', '#f0d48a', '#f2b5d4', '#7eb8da', '#f4978e'];
    const count = this.isMobile ? 3 : 5;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width, y: -10,
        vx: (Math.random() - 0.5) * 2, vy: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3, rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6, wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02
      });
    }
  }
  animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.wobble += p.wobbleSpeed; p.x += p.vx + Math.sin(p.wobble) * 0.5;
      p.y += p.vy; p.rotation += p.rotSpeed;
      this.ctx.save(); this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation * Math.PI / 180);
      this.ctx.fillStyle = p.color; this.ctx.globalAlpha = 0.7;
      this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      this.ctx.restore();
    });
    this.particles = this.particles.filter(p => p.y < this.canvas.height + 20);
    requestAnimationFrame(() => this.animate());
  }
}


// ── Floating Hearts ──
function createFloatingHearts(containerId, count = 15) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emojis = ['💛', '✨', '🌟', '💫', '🎉', '🎂', '🎈', '❤️', '💜', '🩷'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.setProperty('--float-duration', (Math.random() * 6 + 6) + 's');
    heart.style.setProperty('--float-delay', (Math.random() * 8) + 's');
    heart.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
    container.appendChild(heart);
  }
}


// ── Typewriter Effect (mobile-aware) ──
class TypewriterEffect {
  constructor(containerEl) {
    this.container = containerEl;
    this.lines = containerEl.querySelectorAll('.typewriter-line');
    this.started = false;
    this.isMobile = window.innerWidth <= 768;
  }
  start() {
    if (this.started) return; this.started = true;
    if (this.isMobile) {
      let delay = 0;
      this.lines.forEach(line => { setTimeout(() => line.classList.add('done'), delay); delay += 400; });
    } else {
      let delay = 0;
      this.lines.forEach(line => {
        const text = line.getAttribute('data-text') || line.textContent;
        const charCount = text.length;
        const duration = Math.max(1.5, charCount * 0.04);
        line.style.setProperty('--char-count', charCount);
        line.style.setProperty('--type-duration', duration + 's');
        setTimeout(() => {
          line.classList.add('typing');
          setTimeout(() => { line.classList.remove('typing'); line.classList.add('done'); }, duration * 1000 + 500);
        }, delay);
        delay += duration * 1000 + 600;
      });
    }
  }
}


// ── Birthday Countdown ──
class BirthdayCountdown {
  constructor(month, day) {
    this.targetMonth = month; // 0-indexed: March = 2
    this.targetDay = day;
    this.daysEl = document.getElementById('cd-days');
    this.hoursEl = document.getElementById('cd-hours');
    this.minsEl = document.getElementById('cd-mins');
    this.secsEl = document.getElementById('cd-secs');
    this.countdownEl = document.getElementById('countdown');
    this.todayEl = document.getElementById('countdownToday');
    if (this.daysEl) this.start();
  }

  start() { this.update(); this.interval = setInterval(() => this.update(), 1000); }

  update() {
    const now = new Date();
    let target = new Date(now.getFullYear(), this.targetMonth, this.targetDay);

    // If birthday already passed this year, show next year
    if (now > target) {
      // Check if it's today
      if (now.getMonth() === this.targetMonth && now.getDate() === this.targetDay) {
        this.showToday(); return;
      }
      target = new Date(now.getFullYear() + 1, this.targetMonth, this.targetDay);
    }

    // Check if today is the birthday
    if (now.getMonth() === this.targetMonth && now.getDate() === this.targetDay) {
      this.showToday(); return;
    }

    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    this.daysEl.textContent = String(days).padStart(2, '0');
    this.hoursEl.textContent = String(hours).padStart(2, '0');
    this.minsEl.textContent = String(mins).padStart(2, '0');
    this.secsEl.textContent = String(secs).padStart(2, '0');
  }

  showToday() {
    if (this.countdownEl) this.countdownEl.style.display = 'none';
    if (this.todayEl) this.todayEl.style.display = 'block';
    clearInterval(this.interval);
  }
}


// ── Swipeable Carousel ──
class SwipeCarousel {
  constructor(carouselId, dotsId) {
    this.carousel = document.getElementById(carouselId);
    this.dotsContainer = document.getElementById(dotsId);
    if (!this.carousel) return;
    this.slides = this.carousel.querySelectorAll('.carousel-slide');
    this.current = 0;
    this.startX = 0; this.isDragging = false; this.currentTranslate = 0;
    this.createDots();
    this.bindEvents();
    this.goTo(0);
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  bindEvents() {
    this.carousel.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX; this.isDragging = true;
    }, { passive: true });

    this.carousel.addEventListener('touchmove', (e) => {
      if (!this.isDragging) return;
      const diff = e.touches[0].clientX - this.startX;
      const offset = -this.current * 100 + (diff / this.carousel.offsetWidth) * 100;
      this.carousel.style.transition = 'none';
      this.carousel.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      if (!this.isDragging) return; this.isDragging = false;
      const diff = e.changedTouches[0].clientX - this.startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0 && this.current < this.slides.length - 1) this.goTo(this.current + 1);
        else if (diff > 0 && this.current > 0) this.goTo(this.current - 1);
        else this.goTo(this.current);
      } else { this.goTo(this.current); }
    });

    // Mouse drag support
    this.carousel.addEventListener('mousedown', (e) => {
      this.startX = e.clientX; this.isDragging = true;
      this.carousel.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const diff = e.clientX - this.startX;
      const offset = -this.current * 100 + (diff / this.carousel.offsetWidth) * 100;
      this.carousel.style.transition = 'none';
      this.carousel.style.transform = `translateX(${offset}%)`;
    });
    document.addEventListener('mouseup', (e) => {
      if (!this.isDragging) return; this.isDragging = false;
      this.carousel.style.cursor = 'grab';
      const diff = e.clientX - this.startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0 && this.current < this.slides.length - 1) this.goTo(this.current + 1);
        else if (diff > 0 && this.current > 0) this.goTo(this.current - 1);
        else this.goTo(this.current);
      } else { this.goTo(this.current); }
    });
  }

  goTo(index) {
    this.current = index;
    this.carousel.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    this.carousel.style.transform = `translateX(-${index * 100}%)`;
    // Update dots
    if (this.dotsContainer) {
      this.dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }
}


// ── Quiz System ──
class BirthdayQuiz {
  constructor() {
    this.questions = [
      { q: "Who made this website just for you?", options: ["A robot 🤖", "Someone who loves you 💖", "A stranger 👤", "The internet 🌐"], correct: 1, feedback: "That's right! 💖" },
      { q: "What's the best thing about you?", options: ["Your smile 😊", "Your laugh 😂", "Your kindness 💛", "ALL of the above! ✨"], correct: 3, feedback: "Obviously! You're the whole package! ✨" },
      { q: "How special are you?", options: ["Kinda special", "Pretty special", "Very special", "The most special person ever 💎"], correct: 3, feedback: "Don't you ever forget it! 💎" }
    ];
    this.currentQ = 0;
    this.cardEl = document.getElementById('quizCard');
    this.completeEl = document.getElementById('quizComplete');
    this.questionEl = document.getElementById('quizQuestion');
    this.optionsEl = document.getElementById('quizOptions');
    this.feedbackEl = document.getElementById('quizFeedback');
    this.progressEl = document.getElementById('quizProgress');
    if (this.cardEl) this.loadQuestion();
  }

  loadQuestion() {
    const q = this.questions[this.currentQ];
    this.progressEl.textContent = `Question ${this.currentQ + 1} of ${this.questions.length}`;
    this.questionEl.textContent = q.q;
    this.feedbackEl.textContent = '';
    this.optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.answer(i, btn));
      this.optionsEl.appendChild(btn);
    });
  }

  answer(index, btn) {
    const q = this.questions[this.currentQ];
    const allBtns = this.optionsEl.querySelectorAll('.quiz-option');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (index === q.correct) {
      btn.classList.add('correct');
      this.feedbackEl.textContent = q.feedback;
      this.vibrate(50);
    } else {
      btn.classList.add('wrong');
      allBtns[q.correct].classList.add('correct');
      this.feedbackEl.textContent = "Close! But the answer was the best one 😄";
    }

    setTimeout(() => {
      this.currentQ++;
      if (this.currentQ < this.questions.length) {
        this.loadQuestion();
      } else {
        this.cardEl.style.display = 'none';
        this.completeEl.style.display = 'block';
        this.vibrate(100);
      }
    }, 1500);
  }

  vibrate(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }
}


// ── Bubble Pop ──
class BubblePop {
  constructor() {
    const bubbles = document.querySelectorAll('.bubble');
    this.msgEl = document.getElementById('bubbleRevealMsg');
    bubbles.forEach(b => {
      b.addEventListener('click', () => this.pop(b));
    });
  }

  pop(bubble) {
    if (bubble.classList.contains('popped')) return;
    bubble.classList.add('popped');
    const msg = bubble.getAttribute('data-msg');
    if (this.msgEl && msg) {
      this.msgEl.textContent = msg;
      this.msgEl.classList.remove('show');
      void this.msgEl.offsetWidth; // reflow
      this.msgEl.classList.add('show');
    }
    // Vibration
    if (navigator.vibrate) navigator.vibrate(30);
  }
}


// ── Birthday Cake (blow out candles) ──
class BirthdayCake {
  constructor(onAllBlown) {
    this.flames = [
      document.getElementById('flame1'),
      document.getElementById('flame2'),
      document.getElementById('flame3')
    ].filter(f => f);
    this.blownCount = 0;
    this.onAllBlown = onAllBlown;
    this.instructionEl = document.getElementById('cakeInstruction');

    this.flames.forEach(flame => {
      flame.addEventListener('click', () => this.blowCandle(flame));
    });
  }

  blowCandle(flame) {
    if (flame.classList.contains('blown')) return;
    flame.classList.add('blown');
    this.blownCount++;
    if (navigator.vibrate) navigator.vibrate(40);

    if (this.blownCount >= this.flames.length) {
      if (this.instructionEl) this.instructionEl.style.opacity = '0';
      setTimeout(() => {
        if (this.onAllBlown) this.onAllBlown();
      }, 600);
    }
  }
}


// ── Exports ──
window.StarfieldParticles = StarfieldParticles;
window.TouchSparkles = TouchSparkles;
window.ConfettiCannon = ConfettiCannon;
window.CelebrationConfetti = CelebrationConfetti;
window.createFloatingHearts = createFloatingHearts;
window.TypewriterEffect = TypewriterEffect;
window.BirthdayCountdown = BirthdayCountdown;
window.SwipeCarousel = SwipeCarousel;
window.BirthdayQuiz = BirthdayQuiz;
window.BubblePop = BubblePop;
window.BirthdayCake = BirthdayCake;
