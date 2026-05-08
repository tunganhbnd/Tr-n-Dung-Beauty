import fs from 'fs';

// This is a regex approach to extract array strings
const appContent = fs.readFileSync('./src/App.tsx', 'utf-8');

function extractArray(name) {
  const startIndex = appContent.indexOf(`const ${name}:`);
  if (startIndex === -1) return [];
  const startBracketIndex = appContent.indexOf('[', startIndex);
  
  let bracketCount = 0;
  let endBracketIndex = -1;
  for (let i = startBracketIndex; i < appContent.length; i++) {
    if (appContent[i] === '[') bracketCount++;
    if (appContent[i] === ']') bracketCount--;
    if (bracketCount === 0) {
      endBracketIndex = i;
      break;
    }
  }
  
  let arrayString = appContent.substring(startBracketIndex, endBracketIndex + 1);
  // Add React/component placeholders if any was used
  const ChevronDown = () => {};
  const Star = () => {};
  const Calendar = () => {};
  const Play = () => {};

  return eval(\`(\${arrayString})\`);
}

const services = extractArray('SERVICES');
const products = extractArray('PRODUCTS');

const newsContent = fs.readFileSync('./src/data/newsData.ts', 'utf-8');
const newsStart = newsContent.indexOf('const FALLBACK_NEWS_ARTICLES');
const newsBracket = newsContent.indexOf('[', newsStart);
let bracketCount = 0;
let newsEnd = -1;
for (let i = newsBracket; i < newsContent.length; i++) {
if (newsContent[i] === '[') bracketCount++;
if (newsContent[i] === ']') bracketCount--;
if (bracketCount === 0) {
    newsEnd = i;
    break;
}
}
const newsArticles = eval(\`(\${newsContent.substring(newsBracket, newsEnd + 1)})\`);

const data = {
  services,
  products,
  newsArticles
};

fs.writeFileSync('thong-tin-web.json', JSON.stringify(data, null, 2));

const bloggerXmlHeader = \`<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:blogger='http://schemas.google.com/blogger/2008' xmlns:georss='http://www.georss.org/georss' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-123456</id>
  <updated>\${new Date().toISOString()}</updated>
  <title type='text'>Aleynn Spa Import</title>
  <generator version='7.00' uri='http://www.blogger.com'>Blogger</generator>
\`;

const bloggerXmlFooter = \`
</feed>
\`;

let xmlEntries = '';

function generateEntry(title, htmlContent, labels, published) {
  return \`
  <entry>
    <category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#post'/>
    \${labels.map(label => \`<category scheme='http://www.blogger.com/atom/ns#' term='\${label}'/>\`).join('\\n    ')}
    <title type='text'>\${title}</title>
    <content type='html'><![CDATA[\${htmlContent}]]></content>
    <published>\${published}</published>
    <updated>\${published}</updated>
  </entry>
\`;
}

// Generate posts for Services
services.forEach(service => {
    const htmlContent = \`
      <div class="service-details">
        <img src="\${service.image}" alt="\${service.title}" />
        <p><strong>Danh mục:</strong> \${service.category}</p>
        <p><strong>Mô tả:</strong> \${service.description}</p>
        <p><strong>Giá:</strong> \${service.price}</p>
        <h3>Vấn đề da:</h3>
        <ul>\${service.targetProblems.map(p => \`<li>\${p}</li>\`).join('')}</ul>
        <h3>Lợi ích:</h3>
        <ul>\${service.benefits.map(b => \`<li>\${b}</li>\`).join('')}</ul>
      </div>
    \`;
    xmlEntries += generateEntry(service.title, htmlContent, ['Dịch Vụ', service.category], new Date().toISOString());
});

// Generate posts for Products
products.forEach(product => {
    const htmlContent = \`
      <div class="product-details">
        <img src="\${product.image}" alt="\${product.title}" />
        <p><strong>Danh mục:</strong> \${product.category}</p>
        <p><strong>Giá:</strong> \${product.price} (Giá cũ: \${product.oldPrice})</p>
        <p><strong>Dung tích:</strong> \${product.size}</p>
        <p><strong>Mô tả:</strong> \${product.description}</p>
        <p><strong>Vấn đề da:</strong> \${product.target}</p>
        <h3>Công dụng chính:</h3>
        <ul>\${product.benefits.map(b => \`<li>\${b}</li>\`).join('')}</ul>
      </div>
    \`;
    xmlEntries += generateEntry(product.title, htmlContent, ['Sản Phẩm', product.category], new Date().toISOString());
});

// Generate posts for News
newsArticles.forEach(article => {
    const htmlContent = \`
      <div class="news-details">
        <img src="\${article.image}" alt="\${article.title}" />
        <p><em>\${article.excerpt}</em></p>
        <div>
            \${article.content.split('\\n').map(p => p ? \`<p>\${p}</p>\` : '').join('')}
        </div>
      </div>
    \`;
    xmlEntries += generateEntry(article.title, htmlContent, ['Tin Tức', article.category], new Date(article.published || article.date).toISOString());
});

fs.writeFileSync('blogger-import.xml', bloggerXmlHeader + xmlEntries + bloggerXmlFooter);
console.log("Successfully created thong-tin-web.json and blogger-import.xml");
