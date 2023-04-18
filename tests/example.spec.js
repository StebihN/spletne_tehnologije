//const { chromium, electron } = require('playwright');
// const { test, expect } = require('@playwright/test');

// let app;
// let page;

// test.beforeAll(async () => {
//   // Launch the Electron app
//   app = await electron.launch({
//     path: '../node_modules/electron/dist/electron', // Path to Electron binary
//   });

//   // Create a Playwright page
//   page = await app.newBrowserWindow();
// });

// test.afterAll(async () => {
//   // Close the Electron app
//   await app.close();
// });

// test('should load the Electron app and interact with UI elements', async () => {
//   // Write your test code here
//   // For example:
//   await page.goto('https://example.com');
//   await page.fill('input[name="username"]', 'myusername');
//   await page.fill('input[name="password"]', 'mypassword');
//   await page.click('button[type="submit"]');
  
//   await page.waitForSelector('h1');
//   const pageTitle = await page.innerText('h1');
//   expect(pageTitle).toBe('Welcome to Example.com');
// });

import { _electron as electron } from "playwright";
import { test, expect } from "@playwright/test";

test("Launch electron app", async () => {
  const electronApp = await electron.launch({ args: ["."] });

  const windowState = await electronApp.evaluate(async ({ BrowserWindow }) => {
    const mainWindow = BrowserWindow.getAllWindows()[0];

    const getState = () => ({
      isVisible: mainWindow.isVisible(),
      isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
      isCrashed: mainWindow.webContents.isCrashed(),
    });

    return new Promise((resolve) => {
      if (mainWindow.isVisible()) {
        resolve(getState());
      } else {
        mainWindow.once("ready-to-show", () =>
          setTimeout(() => resolve(getState()), 0)
        );
      }
    });
  });

  expect(windowState.isVisible).toBeTruthy();
  expect(windowState.isDevToolsOpened).toBeFalsy();
  expect(windowState.isCrashed).toBeFalsy();

  await electronApp.close();
});