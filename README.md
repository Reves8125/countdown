# The Final Countdown

Site estático para acompanhar duas datas:

- 28/01/2027 — Demissão
- 28/03/2027 — Last Day

## Publicar no GitHub Pages

1. Cria uma conta em https://github.com/ caso ainda não tenhas.
2. Clica em **New repository**.
3. Dá-lhe um nome, por exemplo: `countdown`.
4. Escolhe **Public**.
5. Cria o repositório.
6. Faz upload destes ficheiros para a raiz:
   - `index.html`
   - `style.css`
   - `script.js`
7. Abre **Settings > Pages**.
8. Em **Build and deployment**, escolhe:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
9. Guarda.

O endereço ficará normalmente parecido com:

`https://TEU-UTILIZADOR.github.io/countdown/`

## Alterar datas

No início do ficheiro `script.js`:

```js
const RESIGNATION_DATE = new Date("2027-01-28T23:59:59");
const LAST_DAY_DATE = new Date("2027-03-29T23:59:59");
```

## Adicionar férias

No `script.js` existe:

```js
const VACATION_DAYS = [];
```

Podes trocar por algo como:

```js
const VACATION_DAYS = [
  "2026-12-14",
  "2026-12-15",
  "2026-12-16"
];
```

Esses dias deixam de ser contados como turnos de trabalho.

## Folgas

Por defeito, segunda e terça:

```js
const WEEKLY_DAYS_OFF = [1, 2];
```

JavaScript usa:

- 0 = domingo
- 1 = segunda
- 2 = terça
- 3 = quarta
- 4 = quinta
- 5 = sexta
- 6 = sábado
