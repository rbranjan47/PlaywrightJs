import { test, expect } from "@playwright/test";


// Handling Calender in Playwright
// Like in selenium, we can also handle calendar in Playwright. 
// We can click on the date input field to open the calendar and then select the desired date from the calendar. 
// We can also verify that the selected date is displayed in the input field.

test('Broswe Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page1 = await context.newPage();

    await page1.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");

    // Click on the date input field to open the calendar
    await page1.locator("#datepicker").click();

    // Select the desired date (e.g., 15th of the current month)
    const dateToSelect = "15";
    const calendarDays = page1.locator(".ui-datepicker-calendar td a");
    const count = await calendarDays.count();
    for (let i = 0; i < count; i++) {
        const day = await calendarDays.nth(i).textContent();
        if (day?.trim() === dateToSelect) {
            await calendarDays.nth(i).click();
            break;
        }
    }

    // Verify that the selected date is displayed in the input field
    const selectedDate = await page1.locator("#datepicker").inputValue();
    expect(selectedDate).toContain(dateToSelect);

    // Assertion
    expect(selectedDate).toBe("15/09/2024"); // Assuming the date format is DD/MM/YYYY

    // Close the browser context
    await context.close();
});