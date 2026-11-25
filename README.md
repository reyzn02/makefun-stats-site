# StatAtlas — National Statistics, Plainly Explained

<sub>Entered on [make.fun](https://make.fun/?ref=jqzhkth7&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>

An original, fully offline national statistics site: twelve countries, five
indicators each (population 2024, GDP 2024, GDP per person 2024, life
expectancy 2023, unemployment 2024), every figure sourced and dated.

## What it does

- **Overview** (`#/`): world totals, an indicator switcher driving a bar chart
  of all twelve countries, country spotlights, and three findings the numbers
  support — plus a short guide to reading any statistic.
- **Rankings** (`#/countries`): a searchable, sortable table of all twelve
  countries on all five indicators, with a working CSV download.
- **Country profile** (`#/country/<slug>`): five stat cards with ranks, a
  share-of-world meter, a life-expectancy comparison chart, an
  all-five-ranks table, and plain-language guidance on using each number.
- **Compare** (`#/compare?a=…&b=…`): any two countries side by side, with a
  computed verdict sentence, a full indicator table and a population chart.
- **Sources & method** (`#/methodology`): every series code, source and year,
  definitions, rounding and limits, and how to cite the site.

## Data

World Bank World Development Indicators (population SP.POP.TOTL 2024, GDP
NY.GDP.MKTP.CD 2024, life expectancy SP.DYN.LE00.IN 2023) and ILO-modelled
unemployment (2024). GDP per person is derived in code as GDP ÷ population.
Figures were checked against published WDI values in November 2026; see
`app/data.js` and the methodology page for the full record.

## Run it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

No build step, no network requests, no framework — plain HTML, CSS and ES
modules, with hand-drawn SVG charts (`app/charts.js`). Files are split by
job: `app/data.js` (dataset), `app/charts.js` (SVG charts), `app/views.js`
(pages), `app/main.js` (router + wiring), `app/style.css` (design).

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and
writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.

## License

MIT — see `LICENSE`.
