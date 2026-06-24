// Grava um screencast da demo OpenChoreo: terminal -> app -> portal Backstage.
// Uso: node record-demo.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP = 'http://http-react-starter-development-default-cde5190f.openchoreoapis.localhost:19080/';
const PORTAL = 'http://openchoreo.localhost:8080/';
const VIEW = { width: 1280, height: 720 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: VIEW,
  recordVideo: { dir: path.join(__dirname, 'raw'), size: VIEW },
});
const page = await ctx.newPage();

// --- Segmento 1: terminal (comandos + saídas reais) ---
await page.goto('file://' + path.join(__dirname, 'terminal.html'));
await sleep(9000);

// --- Segmento 2: a aplicação de exemplo no ar ---
await page.goto(APP, { waitUntil: 'networkidle' }).catch(() => {});
await sleep(6000);

// --- Segmento 3: portal Backstage (login -> catálogo -> projeto/componente) ---
await page.goto(PORTAL, { waitUntil: 'networkidle' }).catch(() => {});
await sleep(2500);
await page.getByRole('button', { name: 'Sign In' }).click().catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(1500);
await page.getByRole('textbox', { name: 'Username' }).fill('admin@openchoreo.dev').catch(() => {});
await page.getByRole('textbox', { name: 'Password' }).fill('Admin@123').catch(() => {});
await sleep(800);
await page.getByRole('button', { name: 'Sign In' }).click().catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(4000); // home com "Cluster Data Planes (1) · Connected"

await page.goto(PORTAL + 'catalog?filters%5Bkind%5D=system', { waitUntil: 'networkidle' }).catch(() => {});
await sleep(3500); // catálogo: Default Project
await page.getByText('Default Project').first().click().catch(() => {});
await page.waitForLoadState('networkidle').catch(() => {});
await sleep(6000); // projeto: Component react-starter + Deployment Pipeline

await ctx.close(); // grava o vídeo
await browser.close();
console.log('OK: vídeo bruto gerado em evidencias/video/raw/');
