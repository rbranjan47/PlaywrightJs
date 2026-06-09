import { test, expect } from "@playwright/test";
// Handling Calender in Playwright
// Like in selenium, we can also handle calendar in Playwright. 
// We can click on the date input field to open the calendar and then select the desired date from the calendar. 
// We can also verify that the selected date is displayed in the input field.
test('Handling Calender- Clicking & Selecting Date', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    // Click on the date input field to open the calendar
    await page.locator(".react-date-picker__calendar-button").click();
    // Select the desired date (e.g., 15th of the current month)
    const dateToSelect = "15";
    const calendarDays = page.locator("abbr");
    const count = await calendarDays.count();
    for (let i = 0; i < count; i++) {
        const date = await calendarDays.nth(i).textContent();
        if (date?.trim() === dateToSelect) {
            await calendarDays.nth(i).click();
            break;
        }
    }
    await page.waitForTimeout(8000);
    // Verify that the selected date is displayed in the input field
    const selectedDate = await page.locator(".react-date-picker__inputGroup__input");
    selectedDate.waitFor();
    const dateCount = await selectedDate.count();
    let dateValue = "";
    // Assertion
    for (let i = 3; i < dateCount; i++) {
        dateValue += await selectedDate.nth(i).inputValue() + "/";
        console.log(dateValue);
    }
    expect(dateValue).toBe("05/15/2026"); // Assuming the date format is DD/MM/YYYY
    // Close the browser context
    await context.close();
});
