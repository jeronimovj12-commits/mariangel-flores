/*
  PERSONALIZA ESTAS DOS LÍNEAS.
  No necesitas cambiar nada más para poner sus nombres.
*/
const PERSONALIZACION = {
  nombreDeElla: "Mariangel",
  firma: "Con todo mi amor"
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const openingScreen = document.querySelector("#opening-screen");
const openButton = document.querySelector("#open-experience");
const topbar = document.querySelector(".topbar");
const progressBar = document.querySelector(".reading-progress span");
const heroImage = document.querySelector(".hero__image");
const pointerLight = document.querySelector(".pointer-light");
const letterToggle = document.querySelector("#letter-toggle");
const letterWrap = document.querySelector(".letter-wrap");
const letterContent = document.querySelector("#letter-content");
const bloomButton = document.querySelector("#bloom-button");
const bloomCounter = document.querySelector("#bloom-counter");
const finalButton = document.querySelector("#final-touch");
const finalMessage = document.querySelector("#final-message");

document.querySelectorAll("[data-her-name]").forEach((element) => {
  element.textContent = PERSONALIZACION.nombreDeElla;
});

document.querySelectorAll("[data-my-signature]").forEach((element) => {
  element.textContent = PERSONALIZACION.firma;
});

document.body.classList.add("experience-locked");

openButton.addEventListener("click", () => {
  openingScreen.classList.add("is-open");
  document.body.classList.remove("experience-locked");
  createBurst(window.innerWidth / 2, window.innerHeight * 0.58, 22);
  window.setTimeout(() => document.querySelector("#inicio").focus?.(), 800);
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -35px" });

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

function updateScrollEffects() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  topbar.classList.toggle("is-scrolled", scrollTop > 32);

  if (!reduceMotion && scrollTop < window.innerHeight * 1.15) {
    heroImage.style.transform = `scale(1.03) translateY(${scrollTop * 0.055}px)`;
  }
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
updateScrollEffects();

window.addEventListener("pointermove", (event) => {
  pointerLight.style.left = `${event.clientX}px`;
  pointerLight.style.top = `${event.clientY}px`;
}, { passive: true });

letterToggle.addEventListener("click", () => {
  const isOpen = letterWrap.classList.toggle("is-open");
  letterToggle.setAttribute("aria-expanded", String(isOpen));
  letterContent.setAttribute("aria-hidden", String(!isOpen));

  if (isOpen) {
    const rect = letterWrap.getBoundingClientRect();
    createBurst(rect.left + rect.width / 2, Math.max(120, rect.top + 130), 18);
    window.setTimeout(() => {
      letterContent.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }, 500);
  }
});

let bloomCount = 0;

bloomButton.addEventListener("click", () => {
  bloomCount += 1;
  const rect = bloomButton.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 24);

  const messages = [
    "Una flor más para ti.",
    "Este jardín crece cada vez que lo tocas.",
    "Ya floreció otra razón para sonreír.",
    "Las flores siguen llegando para ti."
  ];

  bloomCounter.textContent = messages[Math.min(bloomCount - 1, messages.length - 1)];
});

finalButton.addEventListener("click", () => {
  const rect = finalButton.getBoundingClientRect();
  createBurst(rect.left + rect.width / 2, rect.top, 38);
  finalMessage.textContent = "Momento guardado: siempre habrá flores amarillas para ti. ✦";
  finalButton.disabled = true;
  finalButton.textContent = "Este momento ya es tuyo";
});

// Pétalos livianos para que la animación funcione bien en celular.
const canvas = document.querySelector("#petal-canvas");
const context = canvas.getContext("2d");
const petals = [];
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let lastFrame = performance.now();

function resizeCanvas() {
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function newPetal(x = Math.random() * window.innerWidth, y = -20, burst = false) {
  const angle = burst ? Math.random() * Math.PI * 2 : Math.PI / 2;
  const speed = burst ? 1.5 + Math.random() * 4.2 : 0.35 + Math.random() * 0.75;

  return {
    x,
    y,
    vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.45,
    vy: burst ? Math.sin(angle) * speed - 1.5 : speed,
    size: 4 + Math.random() * 7,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.045,
    sway: Math.random() * Math.PI * 2,
    life: burst ? 150 + Math.random() * 90 : Infinity,
    alpha: 0.55 + Math.random() * 0.35,
    color: Math.random() > 0.45 ? "#f7c84b" : "#ffe58f"
  };
}

function createBurst(x, y, amount = 20) {
  if (reduceMotion) return;
  const safeAmount = Math.min(amount, 40);
  for (let index = 0; index < safeAmount; index += 1) {
    petals.push(newPetal(x, y, true));
  }
}

function drawPetal(petal) {
  context.save();
  context.translate(petal.x, petal.y);
  context.rotate(petal.rotation);
  context.globalAlpha = petal.alpha;
  context.fillStyle = petal.color;
  context.beginPath();
  context.moveTo(0, -petal.size);
  context.bezierCurveTo(petal.size * 0.8, -petal.size * 0.5, petal.size * 0.75, petal.size * 0.65, 0, petal.size);
  context.bezierCurveTo(-petal.size * 0.75, petal.size * 0.65, -petal.size * 0.8, -petal.size * 0.5, 0, -petal.size);
  context.fill();
  context.restore();
}

function animatePetals(now) {
  const delta = Math.min((now - lastFrame) / 16.67, 2);
  lastFrame = now;
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (petals.length < 17 && Math.random() < 0.055) {
    petals.push(newPetal());
  }

  for (let index = petals.length - 1; index >= 0; index -= 1) {
    const petal = petals[index];
    petal.sway += 0.018 * delta;
    petal.x += (petal.vx + Math.sin(petal.sway) * 0.28) * delta;
    petal.y += petal.vy * delta;
    petal.vy += petal.life === Infinity ? 0 : 0.025 * delta;
    petal.rotation += petal.spin * delta;

    if (petal.life !== Infinity) {
      petal.life -= delta;
      if (petal.life < 35) petal.alpha *= 0.95;
    }

    drawPetal(petal);

    if (petal.y > window.innerHeight + 30 || petal.x < -40 || petal.x > window.innerWidth + 40 || petal.life <= 0) {
      petals.splice(index, 1);
    }
  }

  window.requestAnimationFrame(animatePetals);
}

window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();

if (!reduceMotion) {
  for (let index = 0; index < 11; index += 1) {
    petals.push(newPetal(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
  }
  window.requestAnimationFrame(animatePetals);
}
