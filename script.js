/**
 * Ryyan Safar Portfolio - v8.0
 * "Super Duper Awesome" Edition
 */

// --- Preloader Logic ---
const preloader = document.getElementById('preloader');
const counter = document.querySelector('.counter');

if (preloader) {
  let count = 0;
  const updateCounter = () => {
    count += Math.floor(Math.random() * 10) + 1;
    if (count > 100) count = 100;

    counter.textContent = count + '%';

    if (count < 100) {
      setTimeout(updateCounter, Math.random() * 200);
    } else {
      // Animation complete
      setTimeout(() => {
        counter.style.opacity = '0';
        counter.style.transition = 'opacity 0.5s ease';

        preloader.querySelector('.curtain').style.transform = 'scaleY(0)';
        preloader.querySelector('.curtain').style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';

        setTimeout(() => {
          preloader.style.display = 'none';
          // Trigger hero animations here if needed
        }, 800);
      }, 500);
    }
  };

  updateCounter();
}

// --- Core State & Config ---
const config = {
  liteMode: localStorage.getItem('perfMode') === 'lite',
  reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: window.matchMedia('(max-width: 768px)').matches
};

// Toggle Lite Mode
const toggleLiteMode = () => {
  config.liteMode = !config.liteMode;
  localStorage.setItem('perfMode', config.liteMode ? 'lite' : 'full');
  document.body.classList.toggle('lite-mode', config.liteMode);
  updatePerfButton();

  // Reload if needed to stop/start heavy canvas loops cleanly
  if (confirm('Reload page to apply performance changes?')) {
    window.location.reload();
  }
};

const updatePerfButton = () => {
  const btn = document.getElementById('theme-toggle'); // Using theme-toggle as perf toggle for now or separate
  // If we had a specific button for this:
  // btn.textContent = config.liteMode ? '⚡ Lite' : '🚀 Full';
};

// Apply initial state
if (config.liteMode) document.body.classList.add('lite-mode');

// --- Email Copy Functionality ---
const emailBtn = document.getElementById('email-copy-btn');
if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const email = 'aloshdenny@gmail.com';

    // Try using the Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showCopyFeedback();
      }).catch(err => {
        console.error('Clipboard API failed: ', err);
        fallbackCopyTextToClipboard(email);
      });
    } else {
      // Fallback for non-secure contexts or older browsers
      fallbackCopyTextToClipboard(email);
    }
  });

  function showCopyFeedback() {
    emailBtn.classList.add('copied');
    setTimeout(() => {
      emailBtn.classList.remove('copied');
    }, 2000);
  }

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showCopyFeedback();
      } else {
        console.error('Fallback copy failed.');
      }
    } catch (err) {
      console.error('Fallback copy error: ', err);
    }

    document.body.removeChild(textArea);
  }
}

// --- Navigation & Scroll ---
const nav = document.querySelector('.glass-nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Sticky Nav & Active Link
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Nav transparency toggle
  if (scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active Link Highlighting
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  });
});

// --- Hero Glitch Effect (Scramble) ---
const scrambleElements = document.querySelectorAll('.scramble-text');
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

scrambleElements.forEach(element => {
  element.dataset.value = element.innerText;

  element.onmouseover = event => {
    let iterations = 0;
    const interval = setInterval(() => {
      event.target.innerText = event.target.innerText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return event.target.dataset.value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iterations >= event.target.dataset.value.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);
  };
});

// --- Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Only animate once
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// --- Fluid Custom Cursor & Click Effect ---
if (!config.isMobile) {
  const cursor = document.getElementById('custom-cursor');

  // Cursor State
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Lerp factor (0.1 = slow/smooth, 0.5 = fast)
  const lerp = 0.15;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Click Ripple
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
  });

  // Hover States
  const interactables = document.querySelectorAll('a, button, .project-card, .timeline-item, .service-card');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });

  // Animation Loop
  const animateCursor = () => {
    // Smooth follow
    cursorX += (mouseX - cursorX) * lerp;
    cursorY += (mouseY - cursorY) * lerp;

    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  };

  animateCursor();
}

// --- Tilt Effect & Glow for Cards ---
if (!config.isMobile && !config.liteMode && !config.reduceMotion) {
  const cards = document.querySelectorAll('.project-card, .stat-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Dynamic mouse coordinates for CSS glow hover gradient
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// --- Typewriter Effect for Bio ---
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
  const phrases = [
    "AI/ML Engineer",
    "Deep Learning Researcher",
    "Agentic AI Architect"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before new phrase
    }

    setTimeout(type, typeSpeed);
  }

  // Start typing
  setTimeout(type, 1000);
}

// --- "flappy" Code & Mini Game ---
let flappyWord = "";
document.addEventListener('keydown', (e) => {
  if (e.key.length === 1) {
    flappyWord += e.key.toLowerCase();
    if (flappyWord.endsWith("flappy")) {
      openGameModal();
      flappyWord = "";
    }
    if (flappyWord.length > 20) flappyWord = flappyWord.slice(-10);
  }
});

function openGameModal() {
  const modal = document.getElementById('game-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    resetGame();
  }
}

// --- Shake to Open Game (Mobile) ---
let lastShakeTime = 0;
let shakeProgress = 0;

function initShakeDetection() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS 13+ requires permission
    // We can't request it without a user gesture, so we'll attach it to the first click
    document.addEventListener('click', function requestPermission() {
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
      document.removeEventListener('click', requestPermission);
    }, { once: true });
  } else {
    // Non-iOS or older iOS
    window.addEventListener('devicemotion', handleMotion);
  }
}

function handleMotion(event) {
  const acceleration = event.accelerationIncludingGravity;
  if (!acceleration) return;

  const x = acceleration.x;
  const y = acceleration.y;
  const z = acceleration.z;

  const totalAccel = Math.sqrt(x * x + y * y + z * z);
  const threshold = 25; // Sensitivity threshold
  const now = Date.now();

  if (totalAccel > threshold && now - lastShakeTime > 500) {
    shakeProgress++;
    lastShakeTime = now;

    if (shakeProgress >= 2) {
      openGameModal();
      shakeProgress = 0;
    }

    // Reset progress if second shake doesn't happen within 2 seconds
    setTimeout(() => {
      if (Date.now() - lastShakeTime > 1500) shakeProgress = 0;
    }, 2000);
  }
}

if (config.isMobile) {
  initShakeDetection();
}

// --- Flappy Alosh Game ---
const gameModal = document.getElementById('game-modal');
const canvas = document.getElementById('game-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scoreElement = document.getElementById('game-score');
const startBtn = document.getElementById('start-game-btn');
const closeGameBtn = gameModal ? gameModal.querySelector('.close-modal') : null;

// Assets
const faceImg = new Image();
faceImg.src = 'face.png';

const bgImg = new Image();
bgImg.src = 'flappy_bg.png';

// Audio Management
const gameAudio = {
  jumpSounds: [
    new Audio('assets/audio/eh.mp3'),
    new Audio('assets/audio/ehh.mp3'),
    new Audio('assets/audio/ehhh.mp3'),
    new Audio('assets/audio/ehhhh.mp3'),
    new Audio('assets/audio/ehhhhh.mp3'),
    new Audio('assets/audio/ehhhhhh.mp3')
  ],
  deathSounds: [
    new Audio('assets/audio/death.mp3'),
    new Audio('assets/audio/deathh.mp3')
  ],
  jumpIndex: 0,
  deathIndex: 0,
  playJump() {
    const sound = this.jumpSounds[this.jumpIndex];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play failed:', e));
      this.jumpIndex = (this.jumpIndex + 1) % this.jumpSounds.length;
    }
  },
  playDeath() {
    const sound = this.deathSounds[this.deathIndex];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio play failed:', e));
      this.deathIndex = (this.deathIndex + 1) % this.deathSounds.length;
    }
  }
};

let gameActive = false;
let score = 0;
let frames = 0;
let pipes = [];

const bird = {
  x: 50,
  y: 200,
  w: 40,
  h: 40,
  gravity: 0.15,
  velocity: 0,
  jump: -4,
  draw() {
    if (ctx) {
      ctx.drawImage(faceImg, this.x, this.y, this.w, this.h);
    }
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y + this.h > canvas.height) {
      this.y = canvas.height - this.h;
      gameOver();
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
};

const pipeConfig = {
  width: 50,
  gap: 200,
  speed: 2,
  minHeight: 50
};

function resetGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frames = 0;
  gameActive = false;
  if (scoreElement) scoreElement.innerText = score;
  startBtn.style.display = 'block';
  startBtn.innerText = 'Start Game';
  draw();
}

function startGame() {
  if (gameActive) return;
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frames = 0;
  gameActive = true;
  startBtn.style.display = 'none';
  gameLoop();
}

function gameOver() {
  if (!gameActive) return;
  gameActive = false;
  gameAudio.playDeath();
  startBtn.style.display = 'block';
  startBtn.innerText = 'Try Again';
}

function jump() {
  if (gameActive) {
    bird.velocity = bird.jump;
    gameAudio.playJump();
  } else if (gameModal.classList.contains('active')) {
    startGame();
  }
}

function closeGame() {
  if (gameModal) {
    gameModal.classList.remove('active');
    document.body.style.overflow = '';
    gameActive = false;
  }
}

if (closeGameBtn) closeGameBtn.addEventListener('click', closeGame);
if (startBtn) startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  startGame();
});

window.addEventListener('keydown', (e) => {
  if (!gameModal.classList.contains('active')) return;

  if (e.code === 'Space') {
    e.preventDefault();
    if (!gameActive) {
      startGame();
    } else {
      jump();
    }
  } else if (e.code === 'Escape') {
    closeGame();
  }
});

canvas.addEventListener('mousedown', (e) => {
  e.preventDefault();
  jump();
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  jump();
});

function gameLoop() {
  if (!gameActive) return;

  update();
  draw();
  frames++;

  if (frames % 10 === 0) {
    score++;
    if (scoreElement) scoreElement.innerText = score;
  }
  requestAnimationFrame(gameLoop);
}

function update() {
  bird.update();

  if (frames % 120 === 0) {
    const h = Math.floor(Math.random() * (canvas.height - pipeConfig.gap - 100)) + 50;
    pipes.push({ x: canvas.width, h: h });
  }

  pipes.forEach((pipe) => {
    pipe.x -= pipeConfig.speed;

    if (
      bird.x < pipe.x + pipeConfig.width &&
      bird.x + bird.w > pipe.x &&
      (bird.y < pipe.h || bird.y + bird.h > pipe.h + pipeConfig.gap)
    ) {
      gameOver();
    }
  });

  pipes = pipes.filter(p => p.x + pipeConfig.width > 0);
}

function draw() {
  if (!ctx) return;

  // Draw Background
  if (bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  bird.draw();

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#f59e42';
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeConfig.width, pipe.h);
    ctx.fillRect(pipe.x, pipe.h + pipeConfig.gap, pipeConfig.width, canvas.height);
  });

  // Draw Ground
  ctx.fillStyle = '#73bf2e';
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

function activatePartyMode() {
  alert('🎉 KONAMI CODE ACTIVATED! Party Mode ON! 🎉');
  document.body.style.animation = 'rainbow 5s infinite';

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// --- Theme/Lite Toggle Handler ---
const themeToggleBtn = document.getElementById('theme-toggle'); // Assuming this ID from HTML
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    // For now, this just toggles Lite mode as per previous design, 
    // or we could make it a light/dark toggle. 
    // Given the "Dark Premium" goal, let's make it a Lite Mode toggle for performance.
    toggleLiteMode();
  });
}

// Help modal - prevent multiple modals
let helpModalOpen = false;
let closeOnEscapeHandler = null;

function showHelp() {
  if (helpModalOpen) return;

  helpModalOpen = true;
  const help = document.createElement('div');
  help.className = 'help-modal';

  const closeModal = () => {
    help.remove();
    helpModalOpen = false;
    if (closeOnEscapeHandler) {
      document.removeEventListener('keydown', closeOnEscapeHandler);
      closeOnEscapeHandler = null;
    }
  };

  help.innerHTML = `
    <div style="background: rgba(10, 14, 39, 0.95); backdrop-filter: blur(20px); padding: 2rem; border-radius: 20px; max-width: 500px; border: 2px solid #f59e42;">
      <h2 style="color: #f59e42; margin-bottom: 1rem;">🎮 Keyboard Shortcuts</h2>
      <ul style="color: #e2e8f0; line-height: 2; list-style: none; padding: 0;">
        <li>🎯 <strong>Click anywhere</strong> - Create particle explosion</li>
        <li>⌨️ <strong>Ctrl + D</strong> - Toggle disco mode</li>
        <li>⌨️ <strong>Ctrl + P</strong> - Pause/resume particles</li>
        <li>⌨️ <strong>Ctrl + R</strong> - Toggle rainbow text</li>
        <li>⌨️ <strong>Space</strong> - Center explosion</li>
        <li>⌨️ <strong>↑↑↓↓←→←→BA</strong> - Konami code!</li>
        <li>⌨️ <strong>Shift + ?</strong> - Show this help</li>
      </ul>
      <button id="help-close-btn" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #f59e42; border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: bold;">Close</button>
    </div>
  `;

  help.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
  `;

  document.body.appendChild(help);

  // Close button
  const closeBtn = help.querySelector('#help-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on background click
  help.addEventListener('click', (e) => {
    if (e.target === help) {
      closeModal();
    }
  });

  // Close on Escape key
  closeOnEscapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', closeOnEscapeHandler);
}

// --- Global Keyboard Shortcuts ---
document.addEventListener('keydown', (e) => {
  // If game modal is active, let it handle the keys
  if (gameModal && gameModal.classList.contains('active')) return;

  // Press 'Space' to create explosion at center
  if (e.key === ' ' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    // Assuming createClickExplosion is defined elsewhere or will be added
    // createClickExplosion(window.innerWidth / 2, window.innerHeight / 2, '#f59e42');
    console.log("Spacebar pressed - Center explosion (function not defined in this snippet)");
  }

  // Press 'V' for Void Mode
  if (e.key.toLowerCase() === 'v' && !e.target.matches('input, textarea')) {
    document.body.classList.toggle('void-mode');
    // Assuming showEasterEgg is defined elsewhere or will be added
    // showEasterEgg(document.body.classList.contains('void-mode') ? '⚫ ENTERING THE VOID ⚫' : '⚪ Exiting the Void ⚪', 2000);
    console.log("V key pressed - Toggle Void Mode (function not defined in this snippet)");
  }

  // Press '?' for help
  if (e.key === '?' && e.shiftKey) {
    showHelp();
  }
});

// --- Physics Skills Cloud ---
const initSkillsPhysics = () => {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const container = document.getElementById('skills-canvas-container');

  let width, height;

  const resize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', resize);
  resize();

  // Skills List
  const skills = [
    "PyTorch", "TensorFlow", "JAX", "CUDA", "LLMs",
    "NLP", "Computer Vision", "RAG", "AI Safety",
    "Triton", "Verilog", "Python", "C++", "SystemVerilog",
    "Hugging Face", "LangChain", "Docker", "ROS 2",
    "VLSI", "Quantization", "Modal", "CUDA"
  ];

  // Physics Config
  const bodies = [];
  const friction = 0.98;
  const gravity = 0.2;
  const bounce = 0.7;

  class Body {
    constructor(text, x, y) {
      this.text = text;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;
      this.radius = 40 + Math.random() * 20; // Varied sizes
      this.color = '#1a1a1a';
      this.textColor = '#ffffff';
      this.isDragging = false;
    }

    update() {
      if (this.isDragging) return;

      this.vy += gravity;
      this.vx *= friction;
      this.vy *= friction;

      this.x += this.vx;
      this.y += this.vy;

      // Wall Collisions
      if (this.x + this.radius > width) {
        this.x = width - this.radius;
        this.vx *= -bounce;
      } else if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.vx *= -bounce;
      }

      if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.vy *= -bounce;
      } else if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.vy *= -bounce;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.fillStyle = this.textColor;
      ctx.font = '14px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.text, this.x, this.y);
    }
  }

  // Initialize Bodies
  skills.forEach(skill => {
    bodies.push(new Body(skill, Math.random() * width, Math.random() * height / 2));
  });

  // Interaction
  let draggedBody = null;

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    bodies.forEach(body => {
      const dx = mouseX - body.x;
      const dy = mouseY - body.y;
      if (Math.sqrt(dx * dx + dy * dy) < body.radius) {
        draggedBody = body;
        body.isDragging = true;

        // Custom Cursor Grabbing State
        const cursor = document.getElementById('custom-cursor');
        if (cursor) cursor.classList.add('grabbing');
      }
    });
  });

  window.addEventListener('mousemove', (e) => {
    if (draggedBody) {
      const rect = canvas.getBoundingClientRect();
      draggedBody.x = e.clientX - rect.left;
      draggedBody.y = e.clientY - rect.top;
      draggedBody.vx = (e.movementX) * 0.5; // Add throw velocity
      draggedBody.vy = (e.movementY) * 0.5;
    }
  });

  window.addEventListener('mouseup', () => {
    if (draggedBody) {
      draggedBody.isDragging = false;
      draggedBody = null;

      // Reset Cursor
      const cursor = document.getElementById('custom-cursor');
      if (cursor) cursor.classList.remove('grabbing');
    }
  });

  // Animation Loop
  const loop = () => {
    ctx.clearRect(0, 0, width, height);

    // Collision between bodies (Simple)
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const b1 = bodies[i];
        const b2 = bodies[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          const tx = b1.x + Math.cos(angle) * minDist;
          const ty = b1.y + Math.sin(angle) * minDist;

          const ax = (tx - b2.x) * 0.05; // Spring force
          const ay = (ty - b2.y) * 0.05;

          b1.vx -= ax;
          b1.vy -= ay;
          b2.vx += ax;
          b2.vy += ay;
        }
      }
    }

    bodies.forEach(body => {
      body.update();
      body.draw();
    });

    requestAnimationFrame(loop);
  };

  loop();
};

// Start Physics when DOM is ready
document.addEventListener('DOMContentLoaded', initSkillsPhysics);

// --- Particle Explosion Effect ---
function createExplosion(x, y) {
  const particleCount = 30;
  const colors = ['#ff0055', '#00eaff', '#ffffff'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('explosion-particle');
    document.body.appendChild(particle);

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';

    const destinationX = (Math.random() - 0.5) * 200;
    const destinationY = (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 520;
    const delay = Math.random() * 200;

    particle.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 1000,
      easing: 'cubic-bezier(0, .9, .57, 1)',
      delay: delay
    });

    setTimeout(() => {
      particle.remove();
    }, 2000 + delay);
  }
}

