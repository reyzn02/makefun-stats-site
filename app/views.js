// views.js — every page of StatAtlas: overview, rankings, country profile,
// compare, and methodology. Hash routes, no framework, all rendering from data.js.

import { COUNTRIES, INDICATORS, SOURCES, WORLD, findCountry, gdpPerPerson, indicatorValue, rankOf, searchCountries } from './data.js';
import { barChart, escapeHtml, shareMeter } from './charts.js';

function statCard(label, value, sub) {
  return `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><span class="stat-sub">${sub}</span></div>`;
}

function countryLink(c) {
  return `<a href="#/country/${c.slug}">${escapeHtml(c.name)}</a>`;
}

function indicatorButtons(current) {
  return `<div class="pill-row" role="group" aria-label="Choose indicator">
    ${INDICATORS.map((ind) => `<a class="pill${ind.key === current ? ' active' : ''}" href="#/?ind=${ind.key}">${ind.label} · ${ind.year}</a>`).join('')}
  </div>`;
}

function topList(key, n = 5) {
  const ind = INDICATORS.find((i) => i.key === key);
  const sorted = [...COUNTRIES].sort((a, b) => indicatorValue(b, key) - indicatorValue(a, key));
  return `<ol class="toplist">${sorted.slice(0, n).map((c, i) =>
    `<li><span class="rank-num">${i + 1}</span> ${countryLink(c)} <strong>${ind.format(indicatorValue(c, key))}</strong></li>`).join('')}</ol>`;
}

export function viewHome(params) {
  const indKey = INDICATORS.some((i) => i.key === params.get('ind')) ? params.get('ind') : 'pop';
  const ind = INDICATORS.find((i) => i.key === indKey);
  const sorted = [...COUNTRIES].sort((a, b) => indicatorValue(b, indKey) - indicatorValue(a, indKey));
  const japan = findCountry('japan');
  const india = findCountry('india');
  const rows = sorted.map((c) => ({
    label: c.name, value: indicatorValue(c, indKey), display: ind.format(indicatorValue(c, indKey)),
    href: `#/country/${c.slug}`, highlight: c.slug === sorted[0].slug,
  }));
  return `
  <section class="hero">
    <p class="eyebrow">Twelve countries · Five indicators · Every figure sourced</p>
    <h1>National statistics, plainly explained.</h1>
    <p class="lede">How many people live in each country, how big its economy is, how long its people live, and how many are out of work — with the source and year on every number, so you can trust it and use it.</p>
    <div class="hero-cta"><a class="btn" href="#/countries">Browse the rankings →</a><a class="btn ghost" href="#/compare">Compare two countries</a></div>
  </section>
  <section class="stat-grid" aria-label="World totals">
    ${statCard('World population', '8.14 billion', 'World Bank, 2024')}
    ${statCard('World GDP', '$111.3 trillion', 'World Bank, 2024')}
    ${statCard('World life expectancy', '73.3 years', 'World Bank, 2023')}
    ${statCard('Countries covered', '12 countries', '5 indicators each')}
  </section>
  <section class="card">
    <h2>Rank the twelve countries</h2>
    <p class="muted">Pick an indicator. Bars are drawn from the same figures as the tables — click any bar to open that country.</p>
    ${indicatorButtons(indKey)}
    ${barChart(rows)}
    <p class="fine">${ind.label}, ${ind.unit}, ${ind.year}. Source: World Bank WDI${indKey === 'unemp' ? ' / ILO' : ''}.</p>
  </section>
  <section class="two-col">
    <div class="card">
      <h2>Spotlight: Japan lives longest</h2>
      <p>Japan’s life expectancy is <strong>${japan.life.toFixed(1)} years</strong> — the highest of the twelve, and 29.5 years above Nigeria’s 54.5. Japan is also the only country here whose population is shrinking every year, even as its $4.03 trillion economy stays the world’s fourth largest.</p>
      <p><a href="#/country/japan">Open Japan’s full profile →</a></p>
    </div>
    <div class="card">
      <h2>Spotlight: India’s scale</h2>
      <p>India passed China as the world’s most populous country in 2023. Its <strong>${india.pop.toLocaleString()} million people</strong> are 17.8% of humanity — yet its GDP per person is $2,695, the lowest here. Scale and prosperity are different questions, and this site keeps them apart.</p>
      <p><a href="#/country/india">Open India’s full profile →</a></p>
    </div>
  </section>
  <section class="three-col">
    <div class="card"><h2>Most people</h2>${topList('pop')}</div>
    <div class="card"><h2>Biggest economies</h2>${topList('gdp')}</div>
    <div class="card"><h2>Longest lives</h2>${topList('life')}</div>
  </section>
  <section class="card">
    <h2>How to read a statistic</h2>
    <p>Three questions to ask of any number on this site — and anywhere else. <strong>What is it, exactly?</strong> “GDP” is a year’s production; “GDP per person” is that production divided by headcount — a country can rank 1st on one and 10th on the other. <strong>Which year?</strong> Population and GDP here are 2024; life expectancy is 2023, the latest year the World Bank has published for it. <strong>Compared with what?</strong> Every profile shows the world average beside the country, so a bare figure becomes a comparison. The <a href="#/methodology">Sources &amp; method</a> page defines each indicator in full.</p>
  </section>
  <section class="card">
    <h2>Three things the numbers say</h2>
    <ol class="findings">
      <li><strong>Two countries hold a third of humanity.</strong> India (1,450.9 m) and China (1,409.0 m) together are 35.1% of the world’s 8.14 billion people.</li>
      <li><strong>One economy is bigger than the next two combined.</strong> The United States ($28.8 tn) outproduces China ($18.7 tn) and Germany ($4.7 tn) together — and still only employs 4.0% unemployment.</li>
      <li><strong>Where you are born still decides how long you live.</strong> Life expectancy spans 54.5 years (Nigeria) to 84.0 years (Japan) — a 29.5-year gap inside this one set of countries.</li>
    </ol>
  </section>`;
}

export function viewCountries(params) {
  const q = params.get('q') || '';
  const sortKey = INDICATORS.some((i) => i.key === params.get('sort')) ? params.get('sort') : 'pop';
  const dir = params.get('dir') === 'asc' ? 'asc' : 'desc';
  let list = searchCountries(q);
  list = [...list].sort((a, b) => {
    const d = indicatorValue(b, sortKey) - indicatorValue(a, sortKey);
    return dir === 'asc' ? -d : d;
  });
  const sortLinks = INDICATORS.map((ind) => {
    const active = ind.key === sortKey;
    const nextDir = active && dir === 'desc' ? 'asc' : 'desc';
    return `<a class="pill${active ? ' active' : ''}" href="#/countries?sort=${ind.key}&dir=${nextDir}${q ? '&q=' + encodeURIComponent(q) : ''}">${ind.label}${active ? (dir === 'desc' ? ' ↓' : ' ↑') : ''}</a>`;
  }).join('');
  return `
  <section class="card">
    <h1>Rankings — all twelve countries</h1>
    <p class="lede">Every figure with its year. Click a column button to sort; click a country for its full profile. Use the search box to filter by name, capital or region.</p>
    <form class="filter-row" id="country-filter">
      <label class="visually-hidden" for="filter-q">Filter countries</label>
      <input id="filter-q" type="search" value="${escapeHtml(q)}" placeholder="Filter by name, capital or region…">
      <button type="submit">Filter</button>
      <button type="button" id="download-csv">Download CSV ↓</button>
    </form>
    <div class="pill-row">${sortLinks}</div>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Rank</th><th>Country</th><th>Region</th><th>Population 2024</th><th>GDP 2024</th><th>GDP / person 2024</th><th>Life exp. 2023</th><th>Unemployment 2024</th></tr></thead>
      <tbody>
      ${list.map((c, i) => `<tr>
        <td>${i + 1}</td>
        <td><strong>${countryLink(c)}</strong><br><span class="muted small">Capital: ${escapeHtml(c.capital)}</span></td>
        <td>${escapeHtml(c.region)}</td>
        <td>${c.pop.toLocaleString()} m</td>
        <td>$${c.gdp.toLocaleString()} bn</td>
        <td>$${Math.round(gdpPerPerson(c)).toLocaleString()}</td>
        <td>${c.life.toFixed(1)} yrs</td>
        <td>${c.unemp.toFixed(1)}%</td>
      </tr>`).join('') || '<tr><td colspan="8">No country matches that search. Try another name.</td></tr>'}
      </tbody>
    </table></div>
    <p class="fine">Sources: World Bank WDI (population, GDP, life expectancy) and ILO-modelled unemployment. GDP per person = GDP ÷ population. Ranks are within these twelve countries.</p>
  </section>`;
}

export function viewCountry(slug) {
  const c = findCountry(slug);
  if (!c) return `<section class="card"><h1>Country not found</h1><p>That country is not in this set of twelve. <a href="#/countries">See all countries →</a></p></section>`;
  const popShare = (c.pop / WORLD.populationMillions) * 100;
  const gdpShare = (c.gdp / WORLD.gdpBillions) * 100;
  const lifeGap = (c.life - WORLD.lifeExpectancy).toFixed(1);
  return `
  <section class="card profile-head">
    <p class="eyebrow">${escapeHtml(c.region)} · Capital ${escapeHtml(c.capital)}</p>
    <h1>${escapeHtml(c.name)}</h1>
    <p class="lede">${escapeHtml(c.note)}</p>
    <div class="stat-grid">
      ${statCard('Population (2024)', c.pop.toLocaleString() + ' m', 'Rank #' + rankOf(c, 'pop') + ' of 12 · ' + popShare.toFixed(1) + '% of world')}
      ${statCard('GDP (2024)', '$' + c.gdp.toLocaleString() + ' bn', 'Rank #' + rankOf(c, 'gdp') + ' of 12 · ' + gdpShare.toFixed(1) + '% of world GDP')}
      ${statCard('GDP per person (2024)', '$' + Math.round(gdpPerPerson(c)).toLocaleString(), 'Rank #' + rankOf(c, 'gdppc') + ' of 12 · GDP ÷ population')}
      ${statCard('Life expectancy (2023)', c.life.toFixed(1) + ' years', (lifeGap >= 0 ? '+' : '') + lifeGap + ' yrs vs world 73.3')}
      ${statCard('Unemployment (2024)', c.unemp.toFixed(1) + '%', 'Lowest is best: #' + (13 - rankOf(c, 'unemp')) + ' of 12 · % of labour force')}
    </div>
  </section>
  <section class="card">
    <h2>All five ranks at a glance</h2>
    <p class="muted">Where ${escapeHtml(c.name)} sits among the twelve, on every indicator. Rank 1 is the largest for population, GDP and GDP per person, the longest for life expectancy — and the <em>lowest</em> for unemployment, where less is better.</p>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Indicator</th><th>Value</th><th>Rank of 12</th><th>Best in set</th></tr></thead>
      <tbody>
        ${INDICATORS.map((ind) => {
          const best = [...COUNTRIES].sort((a, b) => ind.key === 'unemp' ? indicatorValue(a, ind.key) - indicatorValue(b, ind.key) : indicatorValue(b, ind.key) - indicatorValue(a, ind.key))[0];
          const rank = ind.key === 'unemp' ? 13 - rankOf(c, 'unemp') : rankOf(c, ind.key);
          return `<tr><td>${ind.label} (${ind.year})</td><td><strong>${ind.format(indicatorValue(c, ind.key))}</strong></td><td>#${rank}</td><td>${escapeHtml(best.name)} — ${ind.format(indicatorValue(best, ind.key))}</td></tr>`;
        }).join('')}
      </tbody>
    </table></div>
  </section>
  <section class="two-col">
    <div class="card">
      <h2>Share of the world</h2>
      ${shareMeter(popShare, 'People')}
      ${shareMeter(gdpShare, 'Economic output (GDP)')}
      <p class="muted">Read together, the two bars show whether a country’s economic weight matches its headcount. For ${escapeHtml(c.name)}, ${popShare.toFixed(1)}% of the world’s people produce ${gdpShare.toFixed(1)}% of its GDP.</p>
    </div>
    <div class="card">
      <h2>How ${escapeHtml(c.name)} compares</h2>
      ${barChart([
        { label: c.name + ' life exp.', value: c.life, display: c.life.toFixed(1) + ' yrs', highlight: true },
        { label: 'World average', value: WORLD.lifeExpectancy, display: '73.3 yrs' },
        { label: 'Best in set (Japan)', value: 84.0, display: '84.0 yrs' },
        { label: 'Lowest in set (Nigeria)', value: 54.5, display: '54.5 yrs' },
      ], { maxValue: 90 })}
      <p class="muted">Life expectancy at birth, years, 2023. Source: World Bank WDI.</p>
      <p><a class="btn" href="#/compare?a=${c.slug}&b=${c.slug === 'india' ? 'china' : 'india'}">Compare ${escapeHtml(c.name)} with ${c.slug === 'india' ? 'China' : 'India'} →</a></p>
    </div>
  </section>
  <section class="card">
    <h2>What to do with these numbers</h2>
    <ul class="actions">
      <li><strong>Planning a move or a market entry?</strong> GDP per person ($${Math.round(gdpPerPerson(c)).toLocaleString()}) is the better guide to purchasing power than total GDP — it divides the economy by the people sharing it.</li>
      <li><strong>Reading the health picture?</strong> Life expectancy of ${c.life.toFixed(1)} years is a summary of mortality at every age in 2023, not a prediction for any one person.</li>
      <li><strong>Checking the jobs market?</strong> Unemployment of ${c.unemp.toFixed(1)}% counts people without work who are available for and seeking it; informal work is not counted as employment in the same way everywhere, so compare with care.</li>
    </ul>
    <p><a href="#/countries">← Back to all rankings</a> · <a href="#/methodology">How these figures are defined</a></p>
  </section>`;
}

export function viewCompare(params) {
  const a = findCountry(params.get('a')) || findCountry('india');
  const b = findCountry(params.get('b')) || findCountry('china');
  const options = (sel) => COUNTRIES.map((c) => `<option value="${c.slug}"${c.slug === sel.slug ? ' selected' : ''}>${escapeHtml(c.name)}</option>`).join('');
  const row = (label, fmt, va, vb) => {
    const winner = va === vb ? '—' : (va > vb ? a.name : b.name);
    return `<tr><th>${label}</th><td>${fmt(va)}</td><td>${fmt(vb)}</td><td>${winner === '—' ? 'Equal' : 'Higher: ' + winner}</td></tr>`;
  };
  const ratio = (a.gdp / b.gdp).toFixed(1);
  return `
  <section class="card">
    <h1>Compare two countries</h1>
    <p class="lede">Pick any two of the twelve. The table and the chart update together — every number comes from the same dataset as the rankings.</p>
    <form class="compare-form" id="compare-form">
      <label>A <select name="a">${options(a)}</select></label>
      <label>B <select name="b">${options(b)}</select></label>
      <button type="submit">Compare</button>
    </form>
    <p class="verdict"><strong>${escapeHtml(a.name)} vs ${escapeHtml(b.name)}:</strong> ${escapeHtml(a.name)}’s economy ($${a.gdp.toLocaleString()} bn) is ${ratio}× ${escapeHtml(b.name)}’s ($${b.gdp.toLocaleString()} bn), but ${escapeHtml(b.name)}’s people live ${Math.abs(a.life - b.life).toFixed(1)} years ${a.life >= b.life ? 'shorter' : 'longer'} on average (${a.life.toFixed(1)} vs ${b.life.toFixed(1)} years).</p>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Indicator</th><th>${escapeHtml(a.name)}</th><th>${escapeHtml(b.name)}</th><th>Higher</th></tr></thead>
      <tbody>
        ${row('Population, 2024 (million)', (v) => v.toLocaleString() + ' m', a.pop, b.pop)}
        ${row('GDP, 2024 (US$ bn)', (v) => '$' + v.toLocaleString() + ' bn', a.gdp, b.gdp)}
        ${row('GDP per person, 2024 (US$)', (v) => '$' + Math.round(v).toLocaleString(), gdpPerPerson(a), gdpPerPerson(b))}
        ${row('Life expectancy, 2023 (years)', (v) => v.toFixed(1) + ' yrs', a.life, b.life)}
        ${row('Unemployment, 2024 (%)', (v) => v.toFixed(1) + '%', a.unemp, b.unemp)}
      </tbody>
    </table></div>
    <h2>Population, side by side</h2>
    ${barChart([
      { label: a.name, value: a.pop, display: a.pop.toLocaleString() + ' m', highlight: true },
      { label: b.name, value: b.pop, display: b.pop.toLocaleString() + ' m' },
    ])}
    <p class="fine">Population, million people, 2024. Source: World Bank WDI.</p>
  </section>`;
}

export function viewMethodology() {
  return `
  <section class="card">
    <h1>Sources &amp; method</h1>
    <p class="lede">StatAtlas is an original site built from public statistics. Nothing here is fetched from the internet at run time — the figures below are the dataset, and this page is the record of where each one came from.</p>
    <h2>Sources</h2>
    <div class="table-scroll"><table class="data-table">
      <thead><tr><th>Indicator</th><th>Series</th><th>Source</th><th>Year</th></tr></thead>
      <tbody>${SOURCES.map((s) => `<tr><td>${s.indicator}</td><td>${escapeHtml(s.code)}</td><td>${escapeHtml(s.source)}</td><td>${s.year}</td></tr>`).join('')}</tbody>
    </table></div>
    <h2>Definitions</h2>
    <ul class="actions">
      <li><strong>Population</strong> — all residents at mid-year, regardless of citizenship (World Bank definition).</li>
      <li><strong>GDP</strong> — the value of all goods and services produced in a year, in current US dollars at official exchange rates. Currency swings move it even when nothing real changes.</li>
      <li><strong>GDP per person</strong> — GDP divided by mid-year population. An average, not a typical income: it says nothing about inequality.</li>
      <li><strong>Life expectancy at birth</strong> — how long a newborn would live if the death rates of that year stayed the same throughout its life. A period measure, not a forecast.</li>
      <li><strong>Unemployment</strong> — the share of the labour force without work but available for and seeking employment (ILO-modelled estimate, so definitions match across countries).</li>
    </ul>
    <h2>Rounding and limits</h2>
    <p>Population is shown to one decimal place in millions; GDP to the nearest billion dollars; life expectancy to one decimal. World totals are the World Bank’s 2024 world aggregates (population 8,141.8 million; GDP $111,326 billion) and 2023 world life expectancy (73.3 years). National statistical offices may publish slightly different values because of revisions, and the World Bank revises its own series — so a figure here may differ from a newer release by a small amount. Twelve countries were chosen to span every inhabited continent and the full range of size, income and longevity, not to be a complete world ranking.</p>
    <h2>How to cite this site</h2>
    <p>“StatAtlas (2026). Population, GDP, GDP per person, life expectancy and unemployment for twelve countries. Sources: World Bank World Development Indicators (2024; life expectancy 2023) and ILO-modelled unemployment (2024).”</p>
  </section>`;
}

export function render(route) {
  const [path, query] = route.split('?');
  const params = new URLSearchParams(query || '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return viewHome(params);
  if (parts[0] === 'countries') return viewCountries(params);
  if (parts[0] === 'country' && parts[1]) return viewCountry(parts[1]);
  if (parts[0] === 'compare') return viewCompare(params);
  if (parts[0] === 'methodology') return viewMethodology();
  return `<section class="card"><h1>Page not found</h1><p><a href="#/">Back to the overview →</a></p></section>`;
}
