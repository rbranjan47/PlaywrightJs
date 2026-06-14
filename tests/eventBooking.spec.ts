import { test, expect, type Page } from "@playwright/test";

const BASE_URL = "https://eventhub.rahulshettyacademy.com";

// Test credentials - REPLACE WITH YOUR OWN
const TEST_EMAIL = "Johnsnow97@gmail.com";
const TEST_PASSWORD = "Welcome@1";
const CUSTOMER_FULL_NAME = "Test Customer";
const CUSTOMER_EMAIL = "customer@example.com";
const CUSTOMER_PHONE = "+91 98765 43210";

// Helper function: Reusable login
const login = async (page: Page) => {
    await page.goto(`${BASE_URL}/login`);
    await page.locator('[placeholder="you@email.com"]').fill(TEST_EMAIL);
    await page.locator('label:has-text("Password") + input').fill(TEST_PASSWORD);
    await page.locator("#login-btn").click();
    await expect(page.locator('a:has-text("Browse Events")')).toBeVisible();
};

// Helper function: Login and navigate to booking
const loginAndGoToBooking = async (page: Page) => {
    await login(page);
    await expect(page.locator('a:has-text("Browse Events")')).toBeVisible();
};

// Helper function: Generate future date in required format (YYYY-MM-DDTHH:mm)
const futureDateValue = (): string => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days in future
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const date = String(futureDate.getDate()).padStart(2, "0");
    const hours = "14"; // 2 PM
    const minutes = "00";
    return `${year}-${month}-${date}T${hours}:${minutes}`;
};

test("Create event from admin panel, book it, and verify seat count reduction", async ({
    page,
}) => {
    // Step 1: Login
    await login(page);

    // Step 2: Create a new event
    const eventTitle = `Test Event ${Date.now()}`;
    await page.goto(`${BASE_URL}/admin/events`);

    await page.locator("#event-title-input").fill(eventTitle);
    await page.locator("#admin-event-form textarea").fill("This is a test event description");
    await page.locator('label:has-text("City") + input').fill("New York");
    await page.locator('label:has-text("Venue") + input').fill("Grand Central Terminal");
    await page.locator('label:has-text("Event Date & Time") + input').fill(
        futureDateValue()
    );
    await page.locator('label:has-text("Price ($)") + input').fill("100");
    await page.locator('label:has-text("Total Seats") + input').fill("50");

    await page.locator("#add-event-btn").click();
    await expect(page.locator('text=Event created!')).toBeVisible();

    // Step 3: Find the event card and capture seats
    await page.goto(`${BASE_URL}/events`);

    const eventCards = page.locator('[data-testid="event-card"]');
    await expect(eventCards.first()).toBeVisible();

    const matchedCard = eventCards.filter({ hasText: eventTitle });
    await expect(matchedCard.first()).toBeVisible({ timeout: 5000 });

    // Extract seat count from the matched card
    const seatElement = matchedCard.first().locator('text=/\\d+\\s+seat/i');
    const seatText = await seatElement.textContent();
    const seatsBeforeBooking = parseInt(seatText?.match(/(\d+)/)?.[1] || "0");
    console.log(`Seats before booking: ${seatsBeforeBooking}`);

    // Step 4: Start booking
    await matchedCard.first().locator('[data-testid="book-now-btn"]').click();

    // Step 5: Fill booking form
    await expect(page.locator("#ticket-count")).toHaveText("1");

    await page.locator('label:has-text("Full Name") + input').fill(CUSTOMER_FULL_NAME);
    await page.locator("#customer-email").fill(CUSTOMER_EMAIL);
    await page.locator('[placeholder="+91 98765 43210"]').fill(CUSTOMER_PHONE);

    await page.locator(".confirm-booking-btn").click();

    // Step 6: Verify booking confirmation
    const bookingRefElement = page.locator(".booking-ref").first();
    await expect(bookingRefElement).toBeVisible();
    const bookingRef = (await bookingRefElement.textContent())?.trim() || "";
    console.log(`Booking Reference: ${bookingRef}`);

    // Step 7: Verify in My Bookings
    await page.locator("text=View My Bookings").click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);

    const bookingCards = page.locator("#booking-card");
    await expect(bookingCards.first()).toBeVisible();

    const matchedBookingCard = bookingCards.filter({
        has: page.locator(`.booking-ref:has-text("${bookingRef}")`),
    });
    await expect(matchedBookingCard.first()).toBeVisible();
    await expect(matchedBookingCard.first()).toContainText(eventTitle);

    // Step 8: Verify seat reduction
    await page.goto(`${BASE_URL}/events`);

    const eventCardsAgain = page.locator('[data-testid="event-card"]');
    await expect(eventCardsAgain.first()).toBeVisible();

    const matchedCardAgain = eventCardsAgain.filter({ hasText: eventTitle });
    await expect(matchedCardAgain.first()).toBeVisible();

    const seatElementAfter = matchedCardAgain.first().locator('text=/\\d+\\s+seat/i');
    const seatTextAfter = await seatElementAfter.textContent();
    const seatsAfterBooking = parseInt(seatTextAfter?.match(/(\d+)/)?.[1] || "0");
    console.log(`Seats after booking: ${seatsAfterBooking}`);

    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});

test("Single ticket booking is eligible for refund", async ({ page }) => {
    // Step 1: Login
    await loginAndGoToBooking(page);

    // Step 2: Book first event with 1 ticket (default)
    await page.goto(`${BASE_URL}/events`);
    const firstEventCard = page.locator('[data-testid="event-card"]').first();
    await firstEventCard.locator('[data-testid="book-now-btn"]').click();

    // Step 2.5: Fill booking form
    await page.locator('label:has-text("Full Name") + input').fill(CUSTOMER_FULL_NAME);
    await page.locator("#customer-email").fill(CUSTOMER_EMAIL);
    await page.locator('[placeholder="+91 98765 43210"]').fill(CUSTOMER_PHONE);
    await page.locator(".confirm-booking-btn").click();

    // Step 3: Navigate to booking detail
    await page.locator("text=View My Bookings").click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await page.locator('text=View Details').first().click();
    await expect(page.locator('text=Booking Information')).toBeVisible();

    // Step 4: Validate booking ref
    const bookingRef = (await page.locator(".booking-ref").first().textContent())?.trim() || "";
    const eventTitle = await page.locator("h1").textContent();
    
    const bookingRefFirstChar = bookingRef.charAt(0);
    const eventTitleFirstChar = eventTitle?.charAt(0) || "";
    expect(bookingRefFirstChar).toBe(eventTitleFirstChar);
    console.log(`Booking Ref: ${bookingRef}, Event Title: ${eventTitle}`);

    // Step 5: Check refund eligibility
    await page.locator("text=Check Refund Eligibility").click();
    
    // Assert spinner is immediately visible
    await expect(page.locator("#refund-spinner")).toBeVisible();
    
    // Assert spinner is no longer visible within 6 seconds
    await expect(page.locator("#refund-spinner")).not.toBeVisible({ timeout: 6000 });

    // Step 6: Validate result
    const resultElement = page.locator("#refund-result");
    await expect(resultElement).toBeVisible();
    await expect(resultElement).toContainText("Eligible for refund");
    await expect(resultElement).toContainText("Single-ticket bookings qualify for a full refund");
});

test("Group ticket booking is NOT eligible for refund", async ({ page }) => {
    // Step 1: Login
    await loginAndGoToBooking(page);

    // Step 2: Book first event with 3 tickets
    await page.goto(`${BASE_URL}/events`);
    const firstEventCard = page.locator('[data-testid="event-card"]').first();
    await firstEventCard.locator('[data-testid="book-now-btn"]').click();

    // Increase quantity to 3 by clicking + button twice
    const incrementButton = page.locator('button:has-text("+")');
    await incrementButton.click();
    await incrementButton.click();

    // Step 2.5: Fill booking form
    await page.locator('label:has-text("Full Name") + input').fill(CUSTOMER_FULL_NAME);
    await page.locator("#customer-email").fill(CUSTOMER_EMAIL);
    await page.locator('[placeholder="+91 98765 43210"]').fill(CUSTOMER_PHONE);
    await page.locator(".confirm-booking-btn").click();

    // Step 3: Navigate to booking detail
    await page.locator("text=View My Bookings").click();
    await expect(page).toHaveURL(`${BASE_URL}/bookings`);
    await page.locator('text=View Details').first().click();
    await expect(page.locator('text=Booking Information')).toBeVisible();

    // Step 4: Validate booking ref
    const bookingRef = (await page.locator(".booking-ref").first().textContent())?.trim() || "";
    const eventTitle = await page.locator("h1").textContent();
    
    const bookingRefFirstChar = bookingRef.charAt(0);
    const eventTitleFirstChar = eventTitle?.charAt(0) || "";
    expect(bookingRefFirstChar).toBe(eventTitleFirstChar);
    console.log(`Booking Ref: ${bookingRef}, Event Title: ${eventTitle}`);

    // Step 5: Check refund eligibility
    await page.locator("text=Check Refund Eligibility").click();
    
    // Assert spinner is immediately visible
    await expect(page.locator("#refund-spinner")).toBeVisible();
    
    // Assert spinner is no longer visible within 6 seconds
    await expect(page.locator("#refund-spinner")).not.toBeVisible({ timeout: 6000 });

    // Step 6: Validate result (different assertions)
    const resultElement = page.locator("#refund-result");
    await expect(resultElement).toBeVisible();
    await expect(resultElement).toContainText("Not eligible for refund");
    await expect(resultElement).toContainText("Group bookings (3 tickets) are non-refundable");
});
