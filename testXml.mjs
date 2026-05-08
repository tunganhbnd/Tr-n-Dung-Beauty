import { DOMParser } from '@xmldom/xmldom';
import fs from 'fs';

const xml = fs.readFileSync('blogger-theme.xml', 'utf-8');
const parser = new DOMParser({
    onError: e => console.log('PARSER:', e)
});

const doc = parser.parseFromString(xml, 'text/xml');
if(doc.documentElement.nodeName === 'html') {
    console.log("Valid XML!");
} else {
    console.log("Failed to parse", doc.documentElement.nodeName);
}
