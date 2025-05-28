require('dotenv').config();

const hyperbrowser = require('hyperbrowser');
const fs = require('fs');
const path = require('path');

const browser = hyperbrowser.init({
  apiKey: process.env.HYPERBROWSER_API_KEY,
  headless: true,
  timeout: 30000
});

const main = async () => {
  const location = process.argv[2];
  if (!location) {
    console.error("Please provide a location as a command line argument");
    process.exit(1);
  }

  console.log("Starting session");
  const session = await browser.sessions.create();
  console.log("Session created:", session.id);

  try {
    const browser = await connect({ browserWSEndpoint: session.wsEndpoint });
    console.log("Connected to browser");

    const [page] = await browser.pages();
    console.log("Got page");

    console.log("Navigating to OpenWeatherMap...");
    await page.goto("https://openweathermap.org/", {
      waitUntil: "networkidle0",
      timeout: 30000,
    });
    console.log("Page loaded");

    // Wait for and click the search icon in the top navigation
    console.log("Looking for search icon...");
    await page.waitForSelector("#desktop-menu input[type='text']", {
      visible: true,
      timeout: 20000,
    });
    
    // Take a screenshot to see what the page looks like
    await page.screenshot({ path: "before-search.png" });
    console.log("Saved screenshot as before-search.png");

    // Type the location
    await page.type("#desktop-menu input[type='text']", location);
    console.log("Typed location:", location);

    // Get the page HTML for debugging
    const html = await page.content();
    console.log("Current page HTML:", html.substring(0, 500) + "..."); // Log first 500 chars

    // Click search button
    await page.click("#desktop-menu form button[type='submit']");
    console.log("Clicked search");

    // Take another screenshot
    await page.screenshot({ path: "after-search.png" });
    console.log("Saved screenshot as after-search.png");

    // Wait for navigation to the search results page
    await page.waitForNavigation({ timeout: 20000 });
    console.log("Navigation complete");

    // Wait for the weather data to load
    await page.waitForSelector(".current-temp", {
      visible: true,
      timeout: 20000,
    });
    console.log("Weather data loaded");

    const locationName = await page.$eval(
      "h2",
      (el) => el.textContent
    );
    const currentTemp = await page.$eval(
      ".current-temp",
      (el) => el.textContent
    );
    const description = await page.$eval(
      ".bold",
      (el) => el.textContent
    );

    const weatherItems = await page.$$eval(".weather-items li", (items) => 
      items.map(item => item.textContent.trim())
    );

    console.log("\nWeather Information:");
    console.log("------------------");
    console.log(`Location: ${locationName}`);
    console.log(`Temperature: ${currentTemp}`);
    console.log(`Conditions: ${description}`);
    console.log("Weather Items:", weatherItems);
    console.log("------------------\n");

    await page.screenshot({ path: "final-result.png" });
    console.log("Saved final screenshot as final-result.png");
  } catch (error) {
    console.error(`Encountered an error: ${error}`);
    if (error.message.includes("timeout")) {
      console.log("Timeout error - this could mean the page is taking too long to load or the selectors have changed");
    }
  } finally {
    await browser.sessions.stop(session.id);
    console.log("Session stopped:", session.id);
  }
};

main().catch((error) => {
  console.error(`Encountered an error: ${error}`);
});