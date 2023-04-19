const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');

let window, electronApp;

test.beforeAll(async () => {
  electronApp = await electron.launch({ args: ['.'] });

  const appPath = await electronApp.evaluate(async ({ app }) => {
    return app.getAppPath();
  });

  window = await electronApp.firstWindow();
});

test('window has correct title', async () => {
  await window.goto('http://localhost:3000');
  await window.waitForLoadState('domcontentloaded');
  const title = await window.title();
  expect(title).toBe('Electron JS vaja Spletne tehnologije');
});
test('window has correct background', async () => {
  await window.goto('http://localhost:3000');
  await window.waitForLoadState('domcontentloaded');
  const bgColor = await window.evaluate(() => {
    const body = document.body;
    return getComputedStyle(body).backgroundColor;
  });
  expect(bgColor).toBe('rgba(0, 0, 0, 0)')
});
test('button works', async () => {
  await window.goto('http://localhost:3000');
  await window.waitForLoadState('domcontentloaded');
  await window.click("id=test")
  const url = await window.url();
  expect(url).toBe('http://localhost:3000/prikaz');
});

test.afterAll(async () => {
  await electronApp.close();
});
