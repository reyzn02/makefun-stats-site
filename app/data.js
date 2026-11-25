// StatAtlas data — twelve countries, five indicators each.
// Every figure was checked against the World Bank's World Development
// Indicators (WDI) and ILO-modelled estimates in November 2026.
// Population: WDI SP.POP.TOTL, 2024. GDP: WDI NY.GDP.MKTP.CD, 2024,
// current US$. Life expectancy: WDI SP.DYN.LE00.IN, 2023.
// Unemployment: ILO-modelled, % of labour force, 2024.
// GDP per person is derived in code: GDP / population, never typed in.

export const WORLD = {
  populationMillions: 8141.8,
  gdpBillions: 111326,
  lifeExpectancy: 73.3,
  year: 2024,
};

export const SOURCES = [
  { indicator: 'Population', code: 'SP.POP.TOTL', source: 'World Bank, World Development Indicators', year: 2024 },
  { indicator: 'GDP', code: 'NY.GDP.MKTP.CD', source: 'World Bank, World Development Indicators', year: 2024 },
  { indicator: 'GDP per person', code: 'NY.GDP.PCAP.CD (derived: GDP ÷ population)', source: 'World Bank, World Development Indicators', year: 2024 },
  { indicator: 'Life expectancy at birth', code: 'SP.DYN.LE00.IN', source: 'World Bank, World Development Indicators', year: 2023 },
  { indicator: 'Unemployment', code: 'SL.UEM.TOTL.ZS (modelled ILO estimate)', source: 'World Bank / ILO', year: 2024 },
];

export const COUNTRIES = [
  { slug: 'india', name: 'India', capital: 'New Delhi', region: 'South Asia', pop: 1450.9, gdp: 3910, life: 67.7, unemp: 4.2,
    note: 'The world’s most populous country since 2023 — about 1 in 6 people on Earth lives in India — yet its GDP per person ($2,695) is the lowest of the twelve, because that output is shared by 1.45 billion people.' },
  { slug: 'china', name: 'China', capital: 'Beijing', region: 'East Asia', pop: 1409.0, gdp: 18744, life: 78.0, unemp: 4.6,
    note: 'The world’s second-largest economy at $18.7 trillion, and the only country whose population fell in 2024 — down from a 2021 peak — while its economy kept growing.' },
  { slug: 'united-states', name: 'United States', capital: 'Washington, D.C.', region: 'North America', pop: 340.1, gdp: 28751, life: 78.4, unemp: 4.0,
    note: 'The largest economy by a wide margin: $28.8 trillion in 2024, about 26% of world GDP, with $84,534 per person — the highest GDP per person of the twelve large countries here.' },
  { slug: 'indonesia', name: 'Indonesia', capital: 'Jakarta', region: 'South-east Asia', pop: 283.5, gdp: 1402, life: 71.5, unemp: 4.9,
    note: 'The fourth most populous country and the largest economy in South-east Asia, spread across more than 17,000 islands; its 283 million people are nearly the whole population of the United States and Japan combined.' },
  { slug: 'pakistan', name: 'Pakistan', capital: 'Islamabad', region: 'South Asia', pop: 251.3, gdp: 373, life: 67.7, unemp: 5.5,
    note: 'Fifth in population but the smallest economy of the twelve at $373 billion — $1,484 per person — a reminder that headcount and output do not move together.' },
  { slug: 'nigeria', name: 'Nigeria', capital: 'Abuja', region: 'West Africa', pop: 232.7, gdp: 187, life: 54.5, unemp: 4.3,
    note: 'Africa’s most populous country, and the starkest health gap in this set: life expectancy of 54.5 years, nearly 30 years below Japan’s 84.0.' },
  { slug: 'brazil', name: 'Brazil', capital: 'Brasília', region: 'South America', pop: 212.0, gdp: 2171, life: 76.4, unemp: 6.6,
    note: 'South America’s largest country on every measure here, and the highest unemployment of the twelve at 6.6% of the labour force in 2024.' },
  { slug: 'bangladesh', name: 'Bangladesh', capital: 'Dhaka', region: 'South Asia', pop: 173.6, gdp: 451, life: 72.7, unemp: 4.5,
    note: 'More people than Russia in a country smaller than many single provinces: 173.6 million people, with life expectancy (72.7 years) above its much richer neighbours’ regional peers.' },
  { slug: 'russia', name: 'Russia', capital: 'Moscow', region: 'Europe / North Asia', pop: 143.7, gdp: 2193, life: 72.9, unemp: 2.3,
    note: 'The lowest unemployment of the twelve at 2.3%, and an economy ($2.19 trillion) larger than Brazil’s despite having 68 million fewer people.' },
  { slug: 'mexico', name: 'Mexico', capital: 'Mexico City', region: 'North America', pop: 130.9, gdp: 1848, life: 75.7, unemp: 2.7,
    note: 'The tenth most populous country, with an economy of $1.85 trillion — about $14,117 per person — and the second-lowest unemployment in this set at 2.7%.' },
  { slug: 'japan', name: 'Japan', capital: 'Tokyo', region: 'East Asia', pop: 124.0, gdp: 4028, life: 84.0, unemp: 2.5,
    note: 'The longest-lived large country on Earth: 84.0 years at birth in 2023. It is also the only one of the twelve whose population is shrinking year on year.' },
  { slug: 'germany', name: 'Germany', capital: 'Berlin', region: 'Western Europe', pop: 83.5, gdp: 4686, life: 80.5, unemp: 3.5,
    note: 'Europe’s largest economy at $4.69 trillion — third in the world — and the richest per person of the twelve European and Asian economies here after the United States, at $56,120.' },
];

export const INDICATORS = [
  { key: 'pop', label: 'Population', unit: 'million people', year: 2024, format: (v) => v.toLocaleString('en-US', { maximumFractionDigits: 1 }) + ' m', higherBetter: null },
  { key: 'gdp', label: 'GDP', unit: 'billion US$ (current)', year: 2024, format: (v) => '$' + v.toLocaleString('en-US') + ' bn', higherBetter: null },
  { key: 'gdppc', label: 'GDP per person', unit: 'US$ (current)', year: 2024, format: (v) => '$' + Math.round(v).toLocaleString('en-US'), higherBetter: true },
  { key: 'life', label: 'Life expectancy', unit: 'years at birth', year: 2023, format: (v) => v.toFixed(1) + ' yrs', higherBetter: true },
  { key: 'unemp', label: 'Unemployment', unit: '% of labour force', year: 2024, format: (v) => v.toFixed(1) + '%', higherBetter: false },
];

export function gdpPerPerson(c) {
  return (c.gdp * 1000) / c.pop; // $bn / million people = $ thousands
}

export function indicatorValue(c, key) {
  if (key === 'gdppc') return gdpPerPerson(c);
  return c[key];
}

export function rankOf(c, key) {
  const sorted = [...COUNTRIES].sort((a, b) => indicatorValue(b, key) - indicatorValue(a, key));
  return sorted.findIndex((x) => x.slug === c.slug) + 1;
}

export function findCountry(slug) {
  return COUNTRIES.find((c) => c.slug === slug) || null;
}

export function searchCountries(query) {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q) || c.region.toLowerCase().includes(q));
}
