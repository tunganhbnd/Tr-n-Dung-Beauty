import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

function extractJson(varName) {
  const marker = 'const ' + varName;
  const startLine = appContent.indexOf(marker);
  if (startLine === -1) return null;
  
  const startBracket = appContent.indexOf('[', startLine);
  let bracketCount = 0;
  let endBracket = -1;
  for (let i = startBracket; i < appContent.length; i++) {
    if (appContent[i] === '[') bracketCount++;
    if (appContent[i] === ']') bracketCount--;
    if (bracketCount === 0) {
      endBracket = i;
      break;
    }
  }
  
  let text = appContent.substring(startBracket, endBracket + 1);
  return text;
}

const servicesText = extractJson('SERVICES');
const productsText = extractJson('PRODUCTS');
const newsText = fs.readFileSync('src/data/newsData.ts', 'utf-8');

function extractNews() {
  const marker = 'const FALLBACK_NEWS_ARTICLES';
  const startLine = newsText.indexOf(marker);
  if (startLine === -1) return null;
  const startBracket = newsText.indexOf('[', startLine);
  let bracketCount = 0;
  let endBracket = -1;
  for (let i = startBracket; i < newsText.length; i++) {
    if (newsText[i] === '[') bracketCount++;
    if (newsText[i] === ']') bracketCount--;
    if (bracketCount === 0) {
      endBracket = i;
      break;
    }
  }
  return newsText.substring(startBracket, endBracket + 1);
}

const fallbacksText = extractNews();

const jsCode = "import fs from 'fs';\n\n" +
  "const SERVICES = " + servicesText + ";\n" +
  "const PRODUCTS = " + productsText + ";\n" +
  "const FALLBACK_NEWS_ARTICLES = " + fallbacksText + ";\n" +
  "const data = {\nSERVICES,\nPRODUCTS,\nNEWS: FALLBACK_NEWS_ARTICLES\n};\n" +
  "fs.writeFileSync('thong-tin-web.json', JSON.stringify(data, null, 2));\n" +
  "console.log('Successfully generated JSON!');\n";

fs.writeFileSync('generate.mjs', jsCode);
console.log("Created generate.mjs");
