const fetch = globalThis.fetch || require('node-fetch');
async function test() {
  const url = "https://www.googleapis.com/blogger/v3/blogs/7482012393651623959/posts?key=AIzaSyCReegXlB9dkX5LpRR_l7bjVQYej6fruTg&fetchImages=true";
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
