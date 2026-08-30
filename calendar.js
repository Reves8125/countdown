const CALENDAR_START = new Date(2026, 7, 1); // Agosto 2026
const CALENDAR_END = new Date(2027, 2, 31);  // Março 2027

const RESIGNATION_KEY = "2027-01-28";
const LAST_DAY_KEY = "2027-03-29";

/*
  JavaScript:
  0 = domingo
  1 = segunda
  2 = terça
  3 = quarta
  4 = quinta
  5 = sexta
  6 = sábado
*/

// Folgas fixas: segunda e terça-feira
const WEEKLY_DAYS_OFF = [1, 2];


// ============================================================
// FÉRIAS
// ============================================================

const VACATION_DAYS = [
  "2026-12-23",
  "2026-12-24",
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

  /*
    Feriado Municipal de Loulé.
    Não aparece no calendário atual porque é posterior a 29/03/2027,
    mas fica aqui preparado caso aumentes o calendário.
  */
  "2027-05-06": "Feriado Municipal de Loulé"
};


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
// CRIAR MÊS
// ============================================================

function createMonth(year, month) {

  const wrapper = document.createElement("article");

  wrapper.className = "month-card";


  // Título do mês

  const title = document.createElement("h2");

  title.textContent =
    `${monthNames[month]} ${year}`;

  wrapper.appendChild(title);


  // Dias da semana

  const weekdays = document.createElement("div");

  weekdays.className = "weekdays";


  weekdayNames.forEach(name => {

    const cell = document.createElement("span");

    cell.textContent = name;

    weekdays.appendChild(cell);

  });


  wrapper.appendChild(weekdays);


  // Grelha dos dias

  const daysGrid = document.createElement("div");

  daysGrid.className = "days-grid";


  const firstDay =
    new Date(year, month, 1);


  /*
    Converter a semana JS
    domingo = 0

    para:

    segunda = primeira coluna
  */

  let startIndex =
    firstDay.getDay() - 1;


  if (startIndex < 0) {

    startIndex = 6;

  }


  // Espaços antes do dia 1

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


  // ============================================================
  // DIAS
  // ============================================================

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


    const cell =
      document.createElement("div");


    cell.className =
      "day-cell";


    // Número do dia

    const number =
      document.createElement("span");


    number.className =
      "day-number";


    number.textContent =
      day;


    cell.appendChild(number);


    // ============================================================
    // IDENTIFICAR TIPO DE DIA
    // ============================================================

    const isDayOff =
      WEEKLY_DAYS_OFF.includes(
        dayOfWeek
      );


    const isVacation =
      VACATION_DAYS.includes(
        key
      );


    const isHoliday =
      Object.prototype.hasOwnProperty.call(
        HOLIDAYS,
        key
      );


    // ============================================================
    // FOLGA
    // ============================================================

    if (
      isDayOff &&
      !isHoliday &&
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


    // ============================================================
    // FÉRIAS
    // ============================================================

    if (
      isVacation &&
      !isHoliday
    ) {

      cell.classList.add(
        "day-cell--vacation"
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "FÉRIAS";


      cell.appendChild(badge);

    }


    // ============================================================
    // FERIADO
    // ============================================================

    if (isHoliday) {

      cell.classList.add(
        "day-cell--holiday"
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "FERIADO";


      badge.title =
        HOLIDAYS[key];


      cell.title =
        HOLIDAYS[key];


      cell.appendChild(badge);

    }


    // ============================================================
    // DIAS QUE JÁ PASSARAM
    // ============================================================

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


    // ============================================================
    // HOJE
    // ============================================================

    if (
      current.getTime() ===
      today.getTime()
    ) {

      cell.classList.add(
        "day-cell--today"
      );

    }


    // ============================================================
    // DEMISSÃO
    // ============================================================

    if (
      key ===
      RESIGNATION_KEY
    ) {

      cell.classList.add(
        "day-cell--resignation"
      );


      const badge =
        document.createElement("small");


      badge.textContent =
        "CARTA";


      cell.appendChild(badge);

    }


    // ============================================================
    // ÚLTIMO DIA
    // ============================================================

    if (
      key ===
      LAST_DAY_KEY
    ) {

      cell.classList.add(
        "day-cell--last"
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


renderCalendar();
