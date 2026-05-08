import fs from 'fs';

const SERVICES = [];
const PRODUCTS = [];
const FALLBACK_NEWS_ARTICLES = [];
const data = {
SERVICES,
PRODUCTS,
NEWS: FALLBACK_NEWS_ARTICLES
};
fs.writeFileSync('thong-tin-web.json', JSON.stringify(data, null, 2));
console.log('Successfully generated JSON!');
