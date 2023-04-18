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


test.afterAll(async () => {
  await electronApp.close();
});
