const https = require('https');
https.get('https://www.youtube.com/playlist?list=PLZ9PlCqw0n_0Yh35js8vLprsexrdiLTVs', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let match;
    const regex = /\"title\":\{\"runs\":\[\{\"text\":\"(.*?)\"\}\].*?\"videoId\":\"(.*?)\"/g;
    const items = [];
    const seen = new Set();
    while ((match = regex.exec(body)) !== null) {
      if(!seen.has(match[2])) {
          items.push({ id: match[2], title: match[1] });
          seen.add(match[2]);
      }
    }
    console.log(JSON.stringify(items, null, 2));
  });
});
