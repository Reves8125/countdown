// ============================================================
// CONFIGURAÇÃO
// ============================================================

// O horário definido aqui é 23:59:59 em cada data.
// Se preferires uma hora específica (ex.: 17:00), altera abaixo.
const RESIGNATION_DATE = new Date("2027-01-28T23:59:59");
const LAST_DAY_DATE = new Date("2027-03-29T23:59:59");

// Data a partir da qual calculamos a percentagem de progresso.
// 30 agosto 2026 = início deste pequeno "projecto countdown".
const START_DATE = new Date("2026-08-30T00:00:00");

// Folgas fixas:
// JavaScript: domingo=0, segunda=1, terça=2, ..., sábado=6
const WEEKLY_DAYS_OFF = [1, 2];

// Adiciona aqui férias/dias em que não trabalhas, no formato YYYY-MM-DD.
// Exemplo:
// const VACATION_DAYS = ["2026-12-14", "2026-12-15", "2026-12-16"];
const VACATION_DAYS = [];

// ============================================================
// FUNÇÕES
// ============================================================

function pad(value, size = 2) {
  return String(value).padStart(size, "0");
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatLocalDateKey(date) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}`;
}

function getTimeRemaining(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return { total: diff, days, hours, minutes, seconds, finished: false };
}

function updateCountdown(elementId, targetDate, finishedMessage) {
  const root = document.getElementById(elementId);
  const remaining = getTimeRemaining(targetDate);

  root.querySelector('[data-unit="days"]').textContent = pad(remaining.days, 3);
  root.querySelector('[data-unit="hours"]').textContent = pad(remaining.hours);
  root.querySelector('[data-unit="minutes"]').textContent = pad(remaining.minutes);
  root.querySelector('[data-unit="seconds"]').textContent = pad(remaining.seconds);

  root.closest(".countdown-card").classList.toggle("finished", remaining.finished);

  if (remaining.finished) {
    root.closest(".countdown-card").querySelector(".milestone-message").textContent = finishedMessage;
  }
}

function getProgress(targetDate) {
  const now = new Date();
  const total = targetDate - START_DATE;
  const elapsed = now - START_DATE;

  if (elapsed <= 0) return 0;
  if (elapsed >= total) return 100;

  return (elapsed / total) * 100;
}

function updateProgress(barId, textId, targetDate) {
  const progress = getProgress(targetDate);
  document.getElementById(barId).style.width = `${progress}%`;
  document.getElementById(textId).textContent = `${progress.toFixed(1)}%`;
}

function calendarDaysRemaining(targetDate) {
  const today = startOfDay(new Date());
  const target = startOfDay(targetDate);

  if (target < today) return 0;

  return Math.ceil((target - today) / 86400000);
}

function workDaysRemaining(targetDate) {
  let cursor = startOfDay(new Date());
  const end = startOfDay(targetDate);
  let count = 0;

  // Começa amanhã, porque o dia atual pode já estar parcial/concluído.
  cursor.setDate(cursor.getDate() + 1);

  while (cursor <= end) {
    const dayOfWeek = cursor.getDay();
    const key = formatLocalDateKey(cursor);

    const isWeeklyDayOff = WEEKLY_DAYS_OFF.includes(dayOfWeek);
    const isVacation = VACATION_DAYS.includes(key);

    if (!isWeeklyDayOff && !isVacation) {
      count++;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return count;
}

function updateStats() {
  document.getElementById("calendar-days-resignation").textContent =
    calendarDaysRemaining(RESIGNATION_DATE);

  document.getElementById("calendar-days-lastday").textContent =
    calendarDaysRemaining(LAST_DAY_DATE);

  document.getElementById("work-days-resignation").textContent =
    workDaysRemaining(RESIGNATION_DATE);

  document.getElementById("work-days-lastday").textContent =
    workDaysRemaining(LAST_DAY_DATE);
}

function updateTodayLabel() {
  const today = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());

  document.getElementById("today-label").textContent = today;
}

function updateEverything() {
  updateCountdown(
    "resignation-countdown",
    RESIGNATION_DATE,
    "✓ Carta entregue. Agora é contagem decrescente para o último dia."
  );

  updateCountdown(
    "lastday-countdown",
    LAST_DAY_DATE,
    "✓ Acabou. Missão cumprida."
  );

  updateProgress("resignation-progress", "resignation-progress-text", RESIGNATION_DATE);
  updateProgress("lastday-progress", "lastday-progress-text", LAST_DAY_DATE);

  updateStats();
  updateTodayLabel();
}

updateEverything();
setInterval(updateEverything, 1000);
