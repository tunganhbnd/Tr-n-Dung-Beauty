import fs from 'fs';

let html = fs.readFileSync('dist/index.html', 'utf-8');

// Fix boolean attributes for XML
html = html.replace(/\scrossorigin>/gi, ' crossorigin="anonymous">');
html = html.replace(/\scrossorigin(\s+)/gi, ' crossorigin="anonymous"$1');
html = html.replace(/\snomodule>/gi, ' nomodule="nomodule">');
html = html.replace(/\snomodule(\s+)/gi, ' nomodule="nomodule"$1');
html = html.replace(/\sdefer>/gi, ' defer="defer">');
html = html.replace(/\sdefer(\s+)/gi, ' defer="defer"$1');
html = html.replace(/\sasync>/gi, ' async="async">');
html = html.replace(/\sasync(\s+)/gi, ' async="async"$1');

// The singlefile plugin creates something like:
// <!DOCTYPE html><html lang="en"><head><script>...</script><style>...</style></head><body><div id="root"></div></body></html>

// We need to transform this into a valid Blogger XML Template.
// Blogger requires some specific tags.

const bloggerHeader = `<?xml version="1.0" encoding="UTF-8" ?>
<html b:css='false' b:defaultwidgetversion='2' b:js='true' b:responsive='true' expr:dir='data:blog.languageDirection' expr:lang='data:blog.locale' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
<b:include data='blog' name='all-head-content'/>
<title><data:blog.pageTitle/></title>
<b:skin><![CDATA[
/* You can put custom CSS here */
]]></b:skin>
`;

const bloggerBodyStart = `
</head>
<body>
<!-- Required by Blogger to save the template -->
<b:section id='main-hidden' showaddelement='no' style='display:none;'>
  <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='2' visible='false'></b:widget>
</b:section>
`;

const bloggerFooter = `
</body>
</html>
`;

// Extract scripts and styles from index.html to wrap them in CDATA safely
let headMatches = html.match(/<head>(.*?)<\/head>/is);
let headContent = headMatches ? headMatches[1] : '';

// Function to safely wrap inner content of tags with CDATA
function wrapCdata(tagData, tagName) {
    const rx = new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'gis');
    return tagData.replace(rx, (match, inner) => {
        // Find attributes of the tag
        const tagProps = match.match(new RegExp(`<${tagName}([^>]*)>`, 'i'))[1];
        return `<${tagName}${tagProps}>\n//<![CDATA[\n${inner}\n//]]>\n</${tagName}>`;
    });
}

headContent = wrapCdata(headContent, 'style');
headContent = wrapCdata(headContent, 'script');

// Make sure other standalone empty tags are self-closing (like <meta ...>)
headContent = headContent.replace(/<meta([^>]*[^\/])>/g, "<meta$1 />");
headContent = headContent.replace(/<link([^>]*[^\/])>/g, "<link$1 />");

// Now extract the body content
let bodyMatches = html.match(/<body[^>]*>(.*?)<\/body>/is);
let bodyContent = bodyMatches ? bodyMatches[1] : '<div id="root"></div>';
bodyContent = wrapCdata(bodyContent, 'script');
bodyContent = wrapCdata(bodyContent, 'style');

let finalXml = bloggerHeader + headContent + bloggerBodyStart + bodyContent + bloggerFooter;

fs.writeFileSync('blogger-theme.xml', finalXml);
console.log("Successfully generated blogger-theme.xml!");
