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

  // 2026
  "2026-10-05": "Implantação da República",
  "2026-11-01": "Dia de Todos os Santos",
  "2026-12-01": "Restauração da Independência",
  "2026-12-08": "Imaculada Conceição",
  "2026-12-25": "Natal",

  // 2027
  "2027-01-01": "Ano Novo",
  "2027-03-26": "Sexta-Feira Santa",
  "2027-03-28": "Páscoa",

  // Feriado Municipal de Loulé
  "2027-05-06": "Feriado Municipal de Loulé"
};


// ============================================================
// NOMES
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
  // TÍTULO
  // ----------------------------------------------------------

  const title =
    document.createElement("h2");

  title.textContent =
    `${monthNames[month]} ${year}`;

  wrapper.appendChild(title);


  // ----------------------------------------------------------
  // CABEÇALHO DOS DIAS DA SEMANA
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
  // GRELHA
  // ----------------------------------------------------------

  const daysGrid =
    document.createElement("div");

  daysGrid.className =
    "days-grid";


  const firstDay =
    new Date(year, month, 1);


  // Converter domingo=0 para calendário iniciado à segunda

  let startIndex =
    firstDay.getDay() - 1;


  if (startIndex < 0) {

    startIndex = 6;

  }


  // Espaços vazios antes do dia 1

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
    // CÉLULA
    // --------------------------------------------------------

    const cell =
      document.createElement("div");

    cell.className =
      "day-cell";


    // --------------------------------------------------------
    // NÚMERO DO DIA OU F
    // --------------------------------------------------------

    const number =
      document.createElement("span");

    number.className =
      "day-number";


    if (isHoliday) {

      number.textContent = "F";

      number.title =
        HOLIDAYS[key];

      cell.title =
        HOLIDAYS[key];

    } else {

      number.textContent =
        day;

    }


    cell.appendChild(number);


    // ========================================================
    // FOLGA
    // ========================================================
    //
    // Um feriado pode continuar a ser uma folga.
    //
    // Ex:
    // 05/10 -> F + FOLGA
    // 01/12 -> F + FOLGA
    // 08/12 -> F + FOLGA
    //
    // Se estiver de férias, FÉRIAS tem prioridade.
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

      cell.appendChild(badge);

    }


    // ========================================================
    // FÉRIAS
    // ========================================================
    //
    // Férias têm prioridade visual sobre folga.
    //
    // Ex:
    // 25/12 -> F + FÉRIAS
    // ========================================================

    if (isVacation) {

      cell.classList.remove(
        "day-cell--dayoff"
      );


      // Remover eventualmente FOLGA

      const oldBadge =
        cell.querySelector("small");

      if (
        oldBadge &&
        oldBadge.textContent === "FOLGA"
      ) {

        oldBadge.remove();

      }


      cell.classList.add(
        "day-cell--vacation"
      );


      const badge =
        document.createElement("small");

      badge.textContent =
        "FÉRIAS";

      cell.appendChild(badge);

    }


    // ========================================================
    // DIAS QUE JÁ PASSARAM
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

      cell.appendChild(cross);

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
    // DEMISSÃO
    // ========================================================

    if (isResignation) {

      cell.classList.add(
        "day-cell--resignation"
      );


      const badge =
        document.createElement("small");

      badge.textContent =
        "CARTA";

      cell.appendChild(badge);

    }


    // ========================================================
    // LAST DAY
    // ========================================================
    //
    // Tem prioridade sobre qualquer outra etiqueta.
    //
    // 28/03/2027:
    //
    // número = F
    // destaque = LAST
    // ========================================================

    if (isLastDay) {

      cell.classList.add(
        "day-cell--last"
      );


      // Remover outras etiquetas pequenas,
      // mas manter o F como número do dia.

      const badges =
        cell.querySelectorAll("small");

      badges.forEach(
        badge => badge.remove()
      );


      const badge =
        document.createElement("small");

      badge.textContent =
        "LAST";

      cell.appendChild(badge);

    }


    daysGrid.appendChild(cell);

  }


  wrapper.appendChild(daysGrid);


  return wrapper;

}


// ============================================================
// DESENHAR O CALENDÁRIO
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


  // ----------------------------------------------------------
  // DATA ATUAL NO RODAPÉ
  // ----------------------------------------------------------

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
