import fs from 'fs';

const data = JSON.parse(fs.readFileSync('thong-tin-web.json', 'utf-8'));
const { SERVICES, PRODUCTS, NEWS } = data;

const bloggerXmlHeader = `<?xml version='1.0' encoding='UTF-8'?>
<feed xmlns='http://www.w3.org/2005/Atom' xmlns:openSearch='http://a9.com/-/spec/opensearchrss/1.0/' xmlns:blogger='http://schemas.google.com/blogger/2008' xmlns:georss='http://www.georss.org/georss' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>
  <id>tag:blogger.com,1999:blog-123456</id>
  <updated>${new Date().toISOString()}</updated>
  <title type='text'>Aleynn Spa Import</title>
  <generator version='7.00' uri='http://www.blogger.com'>Blogger</generator>
`;

const bloggerXmlFooter = `
</feed>
`;

let xmlEntries = '';

function generateEntry(title, htmlContent, labels, published) {
  return `  <entry>
    <category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#post'/>
    ${labels.map(label => `<category scheme='http://www.blogger.com/atom/ns#' term='${label}'/>`).join('\n    ')}
    <title type='text'>${title}</title>
    <content type='html'><![CDATA[${htmlContent}]]></content>
    <published>${published}</published>
    <updated>${published}</updated>
  </entry>
`;
}

// Generate posts for Services
SERVICES.forEach(service => {
    const htmlContent = `
      <div class="service-details">
        <img src="${service.image}" alt="${service.title}" />
        <p><strong>Danh mục:</strong> ${service.category}</p>
        <p><strong>Mô tả:</strong> ${service.description}</p>
        <p><strong>Giá:</strong> ${service.price}</p>
        <h3>Vấn đề da:</h3>
        <ul>${(service.targetProblems||[]).map(p => `<li>${p}</li>`).join('')}</ul>
        <h3>Lợi ích:</h3>
        <ul>${(service.benefits||[]).map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    `;
    xmlEntries += generateEntry(service.title, htmlContent, ['Dịch Vụ', service.category], new Date().toISOString());
});

// Generate posts for Products
PRODUCTS.forEach(product => {
    const htmlContent = `
      <div class="product-details">
        <img src="${product.image}" alt="${product.name}" />
        <p><strong>Danh mục:</strong> ${product.category}</p>
        <p><strong>Giá:</strong> ${product.price} ${product.oldPrice ? `(Giá cũ: ${product.oldPrice})` : ''}</p>
        <p><strong>Mô tả:</strong> ${product.description}</p>
        <h3>Chi tiết:</h3>
        <ul>${(product.details||[]).map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    `;
    xmlEntries += generateEntry(product.name, htmlContent, ['Sản Phẩm', product.category], new Date().toISOString());
});

// Generate posts for News
NEWS.forEach(article => {
    const htmlContent = `
      <div class="news-details">
        <img src="${article.image}" alt="${article.title}" />
        <p><em>${article.excerpt}</em></p>
        <div>
            ${article.content.split('\n').map(p => p ? `<p>${p}</p>` : '').join('')}
        </div>
      </div>
    `;
    xmlEntries += generateEntry(article.title, htmlContent, ['Tin Tức', article.category], new Date().toISOString());
});

fs.writeFileSync('blogger-import.xml', bloggerXmlHeader + xmlEntries + bloggerXmlFooter);
console.log("Successfully generated blogger-import.xml!");
