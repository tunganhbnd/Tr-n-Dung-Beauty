import fs from 'fs';
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
if (fs.existsSync('blogger-theme.xml')) {
  fs.copyFileSync('blogger-theme.xml', 'public/blogger-theme.xml');
}
if (fs.existsSync('blogger-import.xml')) {
  fs.copyFileSync('blogger-import.xml', 'public/blogger-import.xml');
}
console.log('Files copied to public/');
