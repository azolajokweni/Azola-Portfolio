// ---------- typing effect for role line ----------

const roles = ["Junior Developer", "Python", "C#", ".Net", "JavaScript", "MVC"];
const typedEl = document.getElementById("typedRole");

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(typeLoop, deleting ? 45 : 85);
}

typeLoop();

// ---------- status bar: active section + clock ----------

const statusPath = document.getElementById("statusPath");
const sections = document.querySelectorAll("main section[data-status]");

if ("IntersectionObserver" in window && statusPath) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statusPath.textContent = entry.target.dataset.status;
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

function updateClock() {
  const clockEl = document.getElementById("statusClock");
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

updateClock();
setInterval(updateClock, 1000 * 30);

// ---------- weather widget ----------

async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const resultEl = document.getElementById("weatherResult");
  const city = cityInput.value.trim();

  if (!city) {
    resultEl.textContent = "Please enter a city name.";
    return;
  }

  resultEl.textContent = "Loading…";

  const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const area = data.nearest_area?.[0]?.areaName?.[0]?.value || city;
    const tempC = data.current_condition?.[0]?.temp_C;
    const weatherDesc = data.current_condition?.[0]?.weatherDesc?.[0]?.value;

    resultEl.innerHTML = `<strong>${area}</strong><br>${weatherDesc}, ${tempC}°C`;
  } catch (error) {
    resultEl.textContent = "Error retrieving weather data.";
    console.error(error);
  }
}

const cityInputEl = document.getElementById("cityInput");
if (cityInputEl) {
  cityInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getWeather();
  });
}
