// ============================================================
// CONFIGURAÇÃO PRINCIPAL
// ============================================================

// Carta:
// 27 novembro 2026

const RESIGNATION_DATE =
  new Date("2026-11-27T23:59:59");


// Último dia:
// 26 janeiro 2027

const LAST_DAY_DATE =
  new Date("2027-01-26T23:59:59");


// Data inicial do Project Freedom.
// Mantemos 30 agosto 2026 para preservar
// o progresso desde o início original do projeto.

const START_DATE =
  new Date("2026-08-30T00:00:00");


// ============================================================
// FOLGAS
// ============================================================

// JavaScript:
// Domingo = 0
// Segunda = 1
// Terça   = 2
// Quarta  = 3
// Quinta  = 4
// Sexta   = 5
// Sábado  = 6

const WEEKLY_DAYS_OFF = [
  1,
  2
];


// ============================================================
// FÉRIAS REAIS
// ============================================================
//
// 25 de dezembro NÃO entra nesta lista porque é feriado,
// embora visualmente apareça integrado no período de férias
// no calendário.
//
// ============================================================

const VACATION_DAYS = [

  "2026-12-23",

  "2026-12-24",

  "2026-12-26",

  "2026-12-27"

];


// ============================================================
// FERIADOS CONFIRMADOS SEM TRABALHO
// ============================================================
//
// Não estamos a excluir automaticamente todos os feriados
// portugueses porque, no teu trabalho, um feriado pode ser
// um dia normal de trabalho.
//
// 25 de dezembro é o dia que sabemos que não trabalhas.
//
// ============================================================

const NON_WORKING_HOLIDAYS = [

  "2026-12-25"

];


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function pad(
  value,
  size = 2
) {

  return String(value)
    .padStart(
      size,
      "0"
    );

}


// ------------------------------------------------------------

function startOfDay(date) {

  return new Date(

    date.getFullYear(),

    date.getMonth(),

    date.getDate()

  );

}


// ------------------------------------------------------------

function formatLocalDateKey(date) {

  const year =
    date.getFullYear();


  const month =
    pad(
      date.getMonth() + 1
    );


  const day =
    pad(
      date.getDate()
    );


  return (
    `${year}-${month}-${day}`
  );

}


// ============================================================
// CONTAGEM DECRESCENTE
// ============================================================

function getTimeRemaining(
  targetDate
) {

  const now =
    new Date();


  const difference =
    targetDate - now;


  if (
    difference <= 0
  ) {

    return {

      total: 0,

      days: 0,

      hours: 0,

      minutes: 0,

      seconds: 0,

      finished: true

    };

  }


  const days =
    Math.floor(
      difference /
      86400000
    );


  const hours =
    Math.floor(

      (
        difference %
        86400000
      ) /

      3600000

    );


  const minutes =
    Math.floor(

      (
        difference %
        3600000
      ) /

      60000

    );


  const seconds =
    Math.floor(

      (
        difference %
        60000
      ) /

      1000

    );


  return {

    total:
      difference,

    days:
      days,

    hours:
      hours,

    minutes:
      minutes,

    seconds:
      seconds,

    finished:
      false

  };

}


// ============================================================
// ATUALIZAR COUNTDOWN
// ============================================================

function updateCountdown(

  elementId,

  targetDate,

  finishedMessage

) {

  const root =
    document.getElementById(
      elementId
    );


  const remaining =
    getTimeRemaining(
      targetDate
    );


  root
    .querySelector(
      '[data-unit="days"]'
    )
    .textContent =
      pad(
        remaining.days,
        3
      );


  root
    .querySelector(
      '[data-unit="hours"]'
    )
    .textContent =
      pad(
        remaining.hours
      );


  root
    .querySelector(
      '[data-unit="minutes"]'
    )
    .textContent =
      pad(
        remaining.minutes
      );


  root
    .querySelector(
      '[data-unit="seconds"]'
    )
    .textContent =
      pad(
        remaining.seconds
      );


  const card =
    root.closest(
      ".countdown-card"
    );


  card.classList.toggle(

    "finished",

    remaining.finished

  );


  if (
    remaining.finished
  ) {

    card
      .querySelector(
        ".milestone-message"
      )
      .textContent =
        finishedMessage;

  }

}


// ============================================================
// PROGRESSO
// ============================================================

function getProgress(
  targetDate
) {

  const now =
    new Date();


  const total =
    targetDate -
    START_DATE;


  const elapsed =
    now -
    START_DATE;


  if (
    elapsed <= 0
  ) {

    return 0;

  }


  if (
    elapsed >= total
  ) {

    return 100;

  }


  return (

    elapsed /
    total

  ) * 100;

}


// ------------------------------------------------------------

function updateProgress(

  barId,

  textId,

  targetDate

) {

  const progress =
    getProgress(
      targetDate
    );


  document
    .getElementById(
      barId
    )
    .style
    .width =
      `${progress}%`;


  document
    .getElementById(
      textId
    )
    .textContent =
      `${progress.toFixed(1)}%`;

}


// ============================================================
// DIAS CORRIDOS
// ============================================================
//
// Usa UTC para evitar problemas quando Portugal muda
// da hora de verão para a hora de inverno.
//
// ============================================================

function calendarDaysRemaining(
  targetDate
) {

  const now =
    new Date();


  const todayUTC =
    Date.UTC(

      now.getFullYear(),

      now.getMonth(),

      now.getDate()

    );


  const targetUTC =
    Date.UTC(

      targetDate.getFullYear(),

      targetDate.getMonth(),

      targetDate.getDate()

    );


  const difference =
    targetUTC -
    todayUTC;


  if (
    difference < 0
  ) {

    return 0;

  }


  return Math.floor(

    difference /
    86400000

  );

}


// ============================================================
// TURNOS RESTANTES
// ============================================================

function workDaysRemaining(
  targetDate
) {

  let cursor =
    startOfDay(
      new Date()
    );


  const end =
    startOfDay(
      targetDate
    );


  let count =
    0;


  // Começamos amanhã.
  // O dia atual pode já estar parcial ou totalmente cumprido.

  cursor.setDate(

    cursor.getDate() + 1

  );


  while (
    cursor <= end
  ) {

    const dayOfWeek =
      cursor.getDay();


    const key =
      formatLocalDateKey(
        cursor
      );


    const isWeeklyDayOff =
      WEEKLY_DAYS_OFF.includes(
        dayOfWeek
      );


    const isVacation =
      VACATION_DAYS.includes(
        key
      );


    const isNonWorkingHoliday =
      NON_WORKING_HOLIDAYS.includes(
        key
      );


    if (

      !isWeeklyDayOff &&

      !isVacation &&

      !isNonWorkingHoliday

    ) {

      count++;

    }


    cursor.setDate(

      cursor.getDate() + 1

    );

  }


  return count;

}


// ============================================================
// ATUALIZAR RESUMO
// ============================================================

function updateStats() {

  document
    .getElementById(
      "calendar-days-resignation"
    )
    .textContent =
      calendarDaysRemaining(
        RESIGNATION_DATE
      );


  document
    .getElementById(
      "calendar-days-lastday"
    )
    .textContent =
      calendarDaysRemaining(
        LAST_DAY_DATE
      );


  document
    .getElementById(
      "work-days-resignation"
    )
    .textContent =
      workDaysRemaining(
        RESIGNATION_DATE
      );


  document
    .getElementById(
      "work-days-lastday"
    )
    .textContent =
      workDaysRemaining(
        LAST_DAY_DATE
      );

}


// ============================================================
// DATA ATUAL
// ============================================================

function updateTodayLabel() {

  const today =

    new Intl.DateTimeFormat(

      "pt-PT",

      {

        day:
          "2-digit",

        month:
          "long",

        year:
          "numeric"

      }

    )
    .format(
      new Date()
    );


  document
    .getElementById(
      "today-label"
    )
    .textContent =
      today;

}


// ============================================================
// ATUALIZAÇÃO GERAL
// ============================================================

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


  updateProgress(

    "resignation-progress",

    "resignation-progress-text",

    RESIGNATION_DATE

  );


  updateProgress(

    "lastday-progress",

    "lastday-progress-text",

    LAST_DAY_DATE

  );


  updateStats();


  updateTodayLabel();

}


// ============================================================
// INICIAR
// ============================================================

updateEverything();


// Atualiza countdown e resumo a cada segundo.

setInterval(

  updateEverything,

  1000

);
