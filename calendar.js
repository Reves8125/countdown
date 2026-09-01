// ============================================================
// CONFIGURAÇÃO DO CALENDÁRIO
// ============================================================

const CALENDAR_START = new Date(2026, 7, 1);  // Agosto 2026
const CALENDAR_END = new Date(2027, 2, 31);   // Março 2027

const RESIGNATION_KEY = "2027-01-28";
const LAST_DAY_KEY = "2027-03-28";


// ============================================================
// FOLGAS FIXAS
// ============================================================

// JavaScript:
// Domingo = 0
// Segunda = 1
// Terça   = 2
// Quarta  = 3
// Quinta  = 4
// Sexta   = 5
// Sábado  = 6

const WEEKLY_DAYS_OFF = [1, 2];


// ============================================================
// FÉRIAS
// ============================================================

const VACATION_DAYS = [
  "2026-12-23",
  "2026-12-24",
  "2026-12-25",
  "2026-12-26",
  "2026-12-27"
];


// ============================================================
// FERIADOS
// ============================================================

const HOLIDAYS = {

  "2026-10-05": {
    name: "Implantação da República",
    short: "República",
    symbol: "F"
  },

  "2026-11-01": {
    name: "Dia de Todos os Santos",
    short: "Todos Santos",
    symbol: "F"
  },

  "2026-12-01": {
    name: "Restauração da Independência",
    short: "Restauração",
    symbol: "F"
  },

  "2026-12-08": {
    name: "Imaculada Conceição",
    short: "Imaculada",
    symbol: "F"
  },

  "2026-12-25": {
    name: "Natal",
    short: "Natal",
    symbol: "N"
  },

  "2027-01-01": {
    name: "Ano Novo",
    short: "Ano Novo",
    symbol: "F"
  },

  "2027-03-26": {
    name: "Sexta-Feira Santa",
    short: "Sexta Sta.",
    symbol: "F"
  },

  "2027-03-28": {
    name: "Páscoa",
    short: "Páscoa",
    symbol: "P"
  },

  "2027-05-06": {
    name: "Feriado Municipal de Loulé",
    short: "Loulé",
    symbol: "F"
  }

};


// ============================================================
// NOMES DOS MESES E DIAS
// ============================================================

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];


const weekdayNames = [
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
  "Dom"
];


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function pad(number) {
  return String(number).padStart(2, "0");
}


function dateKey(date) {

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );

}


function startOfDay(date) {

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

}


// ============================================================
// CRIAR UM MÊS
// ============================================================

function createMonth(year, month) {

  const wrapper =
    document.createElement("article");

  wrapper.className =
    "month-card";


  // ----------------------------------------------------------
  // TÍTULO DO MÊS
  // ----------------------------------------------------------

  const title =
    document.createElement("h2");

  title.textContent =
    `${monthNames[month]} ${year}`;

  wrapper.appendChild(title);


  // ----------------------------------------------------------
  // DIAS DA SEMANA
  // ----------------------------------------------------------

  const weekdays =
    document.createElement("div");

  weekdays.className =
    "weekdays";


  weekdayNames.forEach(name => {

    const cell =
      document.createElement("span");

    cell.textContent = name;

    weekdays.appendChild(cell);

  });


  wrapper.appendChild(weekdays);


  // ----------------------------------------------------------
  // GRELHA DOS DIAS
  // ----------------------------------------------------------

  const daysGrid =
    document.createElement("div");

  daysGrid.className =
    "days-grid";


  const firstDay =
    new Date(year, month, 1);


  let startIndex =
    firstDay.getDay() - 1;


  if (startIndex < 0) {
    startIndex = 6;
  }


  // ----------------------------------------------------------
  // ESPAÇOS ANTES DO DIA 1
  // ----------------------------------------------------------

  for (
    let i = 0;
    i < startIndex;
    i++
  ) {

    const blank =
      document.createElement("div");

    blank.className =
      "day-cell day-cell--blank";

    daysGrid.appendChild(blank);

  }


  const today =
    startOfDay(new Date());


  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  // ==========================================================
  // CRIAR CADA DIA
  // ==========================================================

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const current =
      new Date(
        year,
        month,
        day
      );


    const key =
      dateKey(current);


    const dayOfWeek =
      current.getDay();


    // --------------------------------------------------------
    // IDENTIFICAR O TIPO DE DIA
    // --------------------------------------------------------

    const isHoliday =
      Object.prototype.hasOwnProperty.call(
        HOLIDAYS,
        key
      );


    const isDayOff =
      WEEKLY_DAYS_OFF.includes(
        dayOfWeek
      );


    const isVacation =
      VACATION_DAYS.includes(
        key
      );


    const isResignation =
      key === RESIGNATION_KEY;


    const isLastDay =
      key === LAST_DAY_KEY;


    // --------------------------------------------------------
    // CRIAR CÉLULA
    // --------------------------------------------------------

    const cell =
      document.createElement("div");

    cell.className =
      "day-cell";


    // ========================================================
    // NOME DO FERIADO NO TOPO
    // ========================================================

    if (isHoliday) {

      const holiday =
        HOLIDAYS[key];


      const holidayName =
        document.createElement("span");


      holidayName.className =
        "holiday-name";


      holidayName.textContent =
        holiday.short;


      holidayName.title =
        holiday.name;


      cell.title =
        holiday.name;


      cell.appendChild(
        holidayName
      );

    }


    // ========================================================
    // NÚMERO DO DIA OU SÍMBOLO DO FERIADO
    // ========================================================

    const number =
      document.createElement("span");


    number.className =
      "day-number";


    if (isHoliday) {

      const holiday =
        HOLIDAYS[key];


      number.textContent =
        holiday.symbol;


      number.classList.add(
        "holiday-symbol"
      );


      number.title =
        holiday.name;

    } else {

      number.textContent =
        day;

    }


    cell.appendChild(number);


    // ========================================================
    // FOLGA
    // ========================================================

    if (
      isDayOff &&
      !isVacation
    ) {

      cell.classList.add(
        "day-cell--dayoff"
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "FOLGA";


      cell.appendChild(
        badge
      );

    }


    // ========================================================
    // FÉRIAS
    // ========================================================

    if (isVacation) {

      cell.classList.remove(
        "day-cell--dayoff"
      );


      const existingBadges =
        cell.querySelectorAll("small");


      existingBadges.forEach(
        badge => badge.remove()
      );


      cell.classList.add(
        "day-cell--vacation"
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "FÉRIAS";


      cell.appendChild(
        badge
      );

    }


    // ========================================================
    // DIA PASSADO
    // ========================================================

    if (
      current < today
    ) {

      cell.classList.add(
        "day-cell--past"
      );


      const cross =
        document.createElement("span");


      cross.className =
        "day-cross";


      cross.textContent =
        "×";


      cell.appendChild(
        cross
      );

    }


    // ========================================================
    // HOJE
    // ========================================================

    if (
      current.getTime() ===
      today.getTime()
    ) {

      cell.classList.add(
        "day-cell--today"
      );

    }


    // ========================================================
    // CARTA DE DEMISSÃO
    // ========================================================

    if (isResignation) {

      cell.classList.add(
        "day-cell--resignation"
      );


      const oldBadges =
        cell.querySelectorAll("small");


      oldBadges.forEach(
        badge => badge.remove()
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "CARTA";


      cell.appendChild(
        badge
      );

    }


    // ========================================================
    // LAST DAY
    // ========================================================

    if (isLastDay) {

      cell.classList.add(
        "day-cell--last"
      );


      const oldBadges =
        cell.querySelectorAll("small");


      oldBadges.forEach(
        badge => badge.remove()
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "LAST";


      cell.appendChild(
        badge
      );

    }


    daysGrid.appendChild(
      cell
    );

  }


  wrapper.appendChild(
    daysGrid
  );


  return wrapper;

}


// ============================================================
// DESENHAR CALENDÁRIO
// ============================================================

function renderCalendar() {

  const grid =
    document.getElementById(
      "calendar-grid"
    );


  let cursor =
    new Date(
      CALENDAR_START.getFullYear(),
      CALENDAR_START.getMonth(),
      1
    );


  while (
    cursor <= CALENDAR_END
  ) {

    grid.appendChild(

      createMonth(
        cursor.getFullYear(),
        cursor.getMonth()
      )

    );


    cursor =
      new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 1,
        1
      );

  }


  document
    .getElementById(
      "calendar-today-label"
    )
    .textContent =

      new Intl.DateTimeFormat(
        "pt-PT",
        {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }
      )
      .format(
        new Date()
      );

}


// ============================================================
// INICIAR
// ============================================================

renderCalendar();
