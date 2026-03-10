import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = 'https://korum.test';
const outDir = path.resolve('docs/manual/screenshots');
const credentials = {
  email: 'admin@korum.cl',
  password: 'password',
};

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'msedge', headless: true });
  } catch (error) {
    console.warn('No se pudo abrir msedge channel, usando chromium por defecto.');
    return chromium.launch({ headless: true });
  }
}

function toAbsoluteUrl(href) {
  return href.startsWith('http') ? href : new URL(href, baseUrl).toString();
}

async function detectFirstMeetingDetailUrl(page) {
  const detailLinks = page.locator('a[href*="/meetings/"]:not([href*="/edit"]):not([href*="/export"])');
  const totalLinks = await detailLinks.count();

  for (let i = 0; i < totalLinks; i++) {
    const href = await detailLinks.nth(i).getAttribute('href');
    if (!href) {
      continue;
    }

    const absolute = toAbsoluteUrl(href);
    if (/\/meetings\/\d+(?:\?.*)?$/.test(absolute)) {
      return absolute;
    }
  }

  return null;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  page.on('dialog', async (dialog) => dialog.accept());

  const screenshot = async (filename, fullPage = true) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, filename),
      fullPage,
    });
  };

  // 01 - Login
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await screenshot('01-login.png');

  // Login
  await page.fill('input[name="email"]', credentials.email);
  await page.fill('input[name="password"]', credentials.password);
  await Promise.all([
    page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 }),
    page.click('button:has-text("Log in")'),
  ]);

  // 02 - Dashboard
  await screenshot('02-dashboard.png');

  // 03 - Reuniones listado
  await page.goto(`${baseUrl}/meetings`, { waitUntil: 'domcontentloaded' });
  await screenshot('03-meetings-list.png');

  // Detectar una reunión visible antes de aplicar filtros
  let meetingDetailUrl = await detectFirstMeetingDetailUrl(page);

  // 04 - Reuniones solo hoy
  const todayToggle = page.locator('label:has-text("Solo Hoy") input[type="checkbox"]');
  if (await todayToggle.count()) {
    if (!(await todayToggle.first().isChecked())) {
      await todayToggle.first().click();
      await page.waitForLoadState('networkidle');
    }
  }
  await screenshot('04-meetings-only-today.png');

  // Intentar detectar de nuevo por si cambió el listado con el filtro actual
  if (!meetingDetailUrl) {
    meetingDetailUrl = await detectFirstMeetingDetailUrl(page);
  }

  if (!meetingDetailUrl) {
    meetingDetailUrl = `${baseUrl}/meetings/1`;
  }

  console.log('URL detalle detectada:', meetingDetailUrl);

  // 05 - Reunión detalle (tab Antes)
  await page.goto(meetingDetailUrl, { waitUntil: 'domcontentloaded' });
  await screenshot('05-meeting-before-tab.png');

  // 06 - Reunión detalle (tab Durante)
  const duranteTab = page.locator('button:has-text("Durante")');
  if (await duranteTab.count()) {
    await duranteTab.first().click();
    await page.waitForLoadState('networkidle');
  }
  await screenshot('06-meeting-during-tab.png');

  // Marcar asistencia como presente para habilitar tab Después
  const presentButtons = page.locator('button:has-text("PRESENTE")');
  const totalPresentButtons = await presentButtons.count();
  for (let i = 0; i < totalPresentButtons; i++) {
    await presentButtons.nth(i).click();
    await page.waitForTimeout(120);
  }
  await page.waitForLoadState('networkidle');

  // 07 - Reunión detalle (tab Después)
  const despuesTab = page.locator('button:has-text("Después")');
  if (await despuesTab.count()) {
    await despuesTab.first().click();
    await page.waitForLoadState('networkidle');
  }
  await screenshot('07-meeting-after-tab.png');

  // 08 - Preparar minuta (si hay botón visible)
  const minuteCta = page.locator('a:has-text("Preparar Minuta"), a:has-text("Continuar Minuta"), a:has-text("Ver Documento Oficial")').first();
  if (await minuteCta.count()) {
    const href = await minuteCta.getAttribute('href');
    if (href) {
      await page.goto(toAbsoluteUrl(href), { waitUntil: 'domcontentloaded' });
      await screenshot('08-minute-screen.png');
    }
  } else {
    const meetingMatch = meetingDetailUrl.match(/\/meetings\/(\d+)/);
    if (meetingMatch?.[1]) {
      await page.goto(`${baseUrl}/meetings/${meetingMatch[1]}/minute/create`, { waitUntil: 'domcontentloaded' });
      await screenshot('08-minute-screen.png');
    }
  }

  // 09 - Minuta publicada (si existe)
  await page.goto(`${baseUrl}/minutes/1`, { waitUntil: 'domcontentloaded' });
  await screenshot('09-minute-show.png');

  // 10 - Acuerdos
  await page.goto(`${baseUrl}/agreements`, { waitUntil: 'domcontentloaded' });
  await screenshot('10-agreements-list.png');

  // 11 - Acuerdo detalle
  await page.goto(`${baseUrl}/agreements/1`, { waitUntil: 'domcontentloaded' });
  await screenshot('11-agreement-detail.png');

  // 12 - Perfil
  await page.goto(`${baseUrl}/profile`, { waitUntil: 'domcontentloaded' });
  await screenshot('12-profile.png');

  await browser.close();
  console.log(`Screenshots generados en: ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
