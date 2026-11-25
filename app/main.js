// main.js — boot the StatAtlas router: render the hash route, wire the
// search box, the rankings filter, the compare form and the CSV download.
import { COUNTRIES, gdpPerPerson } from './data.js';
import { render } from './views.js';

const app = document.getElementById('app');

function currentRoute() {
  return (location.hash || '#/').slice(1) || '/';
}

function renderRoute() {
  app.innerHTML = render(currentRoute());
  document.querySelectorAll('[data-nav]').forEach((a) => {
    const route = currentRoute().split('?')[0];
    const key = a.dataset.nav;
    const active = (key === 'home' && route === '/') || (key !== 'home' && route.startsWith('/' + key));
    a.classList.toggle('active', active);
  });
  wirePage();
  window.scrollTo(0, 0);
}

function wirePage() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const q = document.getElementById('q');
      if (q) q.focus();
    }
  }, { once: true });
  const top = document.getElementById('topsearch');
  if (top) top.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('q').value.trim();
    location.hash = q ? '#/countries?q=' + encodeURIComponent(q) : '#/countries';
  });
  const filter = document.getElementById('country-filter');
  if (filter) filter.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('filter-q').value.trim();
    const here = new URLSearchParams(currentRoute().split('?')[1] || '');
    if (q) here.set('q', q); else here.delete('q');
    location.hash = '#/countries?' + here.toString();
  });
  const csvBtn = document.getElementById('download-csv');
  if (csvBtn) csvBtn.addEventListener('click', downloadCsv);
  const compare = document.getElementById('compare-form');
  if (compare) compare.addEventListener('submit', (e) => {
    e.preventDefault();
    const a = compare.elements.a.value;
    const b = compare.elements.b.value;
    location.hash = `#/compare?a=${a}&b=${b}`;
  });
}

function downloadCsv() {
  const head = 'Country,Capital,Region,Population 2024 (millions),GDP 2024 (US$ bn),GDP per person 2024 (US$),Life expectancy 2023 (years),Unemployment 2024 (%)\n';
  const rows = COUNTRIES.map((c) => [c.name, c.capital, c.region, c.pop, c.gdp, Math.round(gdpPerPerson(c)), c.life, c.unemp].join(',')).join('\n');
  const blob = new Blob([head + rows + '\n'], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'statatlas-twelve-countries.csv';
  a.click();
  URL.revokeObjectURL(url);
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
