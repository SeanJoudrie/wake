import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const D = '/tmp/claude-0/-home-user-wake/b6bdc9d0-14cb-58d3-a937-7b8010ceab9a/scratchpad';
// mobile
let p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:8099/entry/daiser/', { waitUntil: 'networkidle' });
await p.screenshot({ path: `${D}/pl-mobile.png` });
// desktop
p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:8099/entry/jimzon-avaris/', { waitUntil: 'networkidle' });
await p.screenshot({ path: `${D}/pl-desktop.png` });
await b.close();
