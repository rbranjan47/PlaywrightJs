import { test, expect } from "@playwright/test";
test('Full Booking Flow with Event Creation and Validations', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://eventhub.rahulshettyacademy.com");
    // Username- Johnsnow97@gmail.com
    // Password- Welcome@1
    // Step 1 — Login
    // Navigate to /login
    //Fill email field (locate by placeholder you@email.com)
    // Fill password field (locate by label Password)
    // Click the login button (locate by id #login-btn)
    // Assert: link with text Browse Events → is visible (confirms login success)
    await page.getByPlaceholder("you@email.com").pressSequentially("Johnsnow97@gmail.com", { delay: 100 });
    await page.locator("[type='password']").pressSequentially("Welcome@1", { delay: 100 });
    await page.locator("button:has-text('Sign In')").click();
    //Step 2 — Create a new event
    // Navigate to /admin/events
    // Generate a unique event title using Test Event ${Date.now()} — store this in a variable, you will need it throughout the test
    // Fill Title field (locate by id #event-title-input)
    // Fill Description textarea (locate using #admin-event-form textarea)
    // Fill City field (locate by label City)
    // Fill Venue field (locate by label Venue)
    // Fill Event Date & Time field (locate by label Event Date & Time) — use your futureDateValue() helper
    // Fill Price ($) field (locate by label Price ($)) — use any number e.g. 100
    // Fill Total Seats field (locate by label Total Seats) — use 50
    // Click the submit button (locate by id #add-event-btn)
    // Assert: toast message Event created! is visible
    await page.getByRole("button", { name: "Admin" }).waitFor();
    await page.getByRole("button", { name: "Admin" }).click();
    await page.locator("//div//a[text()='Manage Events']").first().waitFor();
    await page.locator("//div//a[text()='Manage Events']").first().click();
    const eventTitle = `Test Event ${new Date().toLocaleString()}`;
    // Enter the event title in the input field and description in the textarea field.
    await page.locator("#event-title-input").waitFor();
    await page.locator("#event-title-input").pressSequentially(eventTitle, { delay: 100 });
    await page.getByPlaceholder("Describe the event…").pressSequentially("This is a test event created by Playwright automation script on " + eventTitle, { delay: 100 });
    await page.locator("#category").click();
    await page.locator("#category").selectOption("Concert");
    await page.locator("#city").pressSequentially("Bangalore", { delay: 100 });
    await page.locator("#venue").pressSequentially("Test Playwright Venue", { delay: 100 });
    // await page.locator("#event-date-&-time").click();
    // await page.locator(".react-datepicker__day--015").click();
    await page.getByRole('textbox', { name: 'Event Date & Time*' }).waitFor();
    await page.getByRole('textbox', { name: 'Event Date & Time*' }).fill('2026-12-09T10:30');
    await page.locator("//input[contains(@id,'price')]").pressSequentially("1000", { delay: 100 });
    await page.locator("#total-seats").pressSequentially("100", { delay: 100 });
    await page.locator("//input[contains(@id,'image-url')]").pressSequentially("https://c.files.bbci.co.uk/33ba/live/56002b70-56bf-11f1-89a3-d1f559421220.jpg", { delay: 100 });
    await page.getByRole("button", { name: "+ Add Event" }).click();
    await page.locator("p.text-sm").first().waitFor();
    const createdEventTitle = await page.locator("p.text-sm").textContent();
    expect(createdEventTitle?.trim()).toBe("Event created!");
    // Step 3 — Find the event card and capture seats
    // Navigate to /events
    // Get all event cards (locate by data-testid="event-card")
    // Assert the first card is visible (confirms page loaded)
    // From all cards, filter for the one that contains your event title text
    // Assert the matched card is visible (timeout 5 seconds)
    // Read the seat count text from that card (locate element containing text seat, parse integer from its inner text) — store this as seatsBeforeBooking
    await page.locator("//div//a[text()='Events']").first().waitFor();
    await page.locator("//div//a[text()='Events']").first().click();
    const eventCards = page.locator("[data-testid='event-card']");
    //const eventCards = page.locator("#event-card h3");
    await expect(eventCards.first()).toBeVisible();
    const matchingCard = eventCards.filter({ hasText: eventTitle });
    await expect(matchingCard).toBeVisible({ timeout: 5000 });
    const seatCountText = await matchingCard.locator("text=Seats").textContent();
    const seatsBeforeBooking = parseInt(seatCountText?.match(/\d+/)?.[0] || "0");
    console.log("Seats before booking: " + seatsBeforeBooking);
    // Step 4 — Start booking
    // On the matched event card, click the Book Now button (locate by data-testid="book-now-btn" inside the card)
    const bookNowButton = await matchingCard.locator("[data-testid='book-now-btn']");
    for (let i = 0; i < 5; i++) {
        try {
            if (await eventCards.filter({ hasText: eventTitle })) {
                await bookNowButton.click();
                break; // Exit loop if click is successful
            }
        }
        catch (error) {
            console.log(`Attempt ${i + 1} to click Book Now failed. Retrying...`);
            await page.waitForTimeout(1000); // Wait before retrying
        }
    }
    // Step 5 — Fill booking form
    // Assert: element with id #ticket-count has text 1 (default quantity)
    // Fill Full Name (locate by label Full Name)
    // Fill Email (locate by id #customer-email)
    // Fill Phone (locate by placeholder +91 98765 43210)
    // Click the confirm button (locate by CSS class .confirm-booking-btn)
    await expect(page.locator("#ticket-count")).toHaveText("1");
    await page.locator("#customerName").pressSequentially("John Snow", { delay: 100 });
    await page.locator("#customer-email").pressSequentially("john.snow@example.com", { delay: 100 });
    await page.locator("#phone").pressSequentially("+91 98765 43210", { delay: 100 });
    await page.locator(".confirm-booking-btn").click();
    // Step 6 — Verify booking confirmation
    // Locate the booking reference element (locate by CSS class .booking-ref, take .first())
    // Assert it is visible
    // Read its inner text, trim it — store as bookingRef
    const bookingRefElement = page.locator(".booking-ref").first();
    await expect(bookingRefElement).toBeVisible();
    const bookingRef = (await bookingRefElement.textContent())?.trim();
    console.log("Booking Reference: " + bookingRef);
    // Step 7 — Verify in My Bookings
    // Click the link View My Bookings
    // Assert: URL is BASE_URL/bookings
    // Get all booking cards (locate by id #booking-card)
    // Assert the first booking card is visible
    // Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text
    // Assert that matched card is visible
    // Assert that matched card contains your eventTitle text
    await page.locator("text=View My Bookings").waitFor();
    await page.locator("text=View My Bookings").click();
    await expect(page).toHaveURL(/.*\/bookings/);
    const bookingCards = page.locator("#booking-card");
    await expect(bookingCards.first()).toBeVisible();
    const matchedBookingCard = bookingCards.filter({ has: page.locator(`.booking-ref:has-text("${bookingRef}")`) });
    await expect(matchedBookingCard).toBeVisible();
    await expect(matchedBookingCard).toContainText(eventTitle);
    // Step 8 — Verify seat reduction
    // Navigate back to /events
    // Assert the first event card is visible
    // Filter cards again using hasText: eventTitle
    // Assert the card is visible
    // Read the seat count text again (same as Step 3) — store as seatsAfterBooking
    // Assert: seatsAfterBooking === seatsBeforeBooking - 1
    await page.locator("//div//a[text()='Events']").first().waitFor();
    await page.locator("//div//a[text()='Events']").first().click();
    await expect(eventCards.first()).toBeVisible();
    const matchedCardAfterBooking = eventCards.filter({ hasText: eventTitle });
    await expect(matchedCardAfterBooking).toBeVisible();
    const seatCountTextAfter = await matchedCardAfterBooking.locator("text=Seats").textContent();
    const seatsAfterBooking = parseInt(seatCountTextAfter?.match(/\d+/)?.[0] || "0");
    console.log("Seats after booking: " + seatsAfterBooking);
    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
    //Logging out
    await page.getByRole("button", { name: 'Logout' }).waitFor();
    await page.getByRole("button", { name: 'Logout' }).click();
});
test('Refund Eligibility Check', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(" https://eventhub.rahulshettyacademy.com");
    // Step1- Setup
    // BASE_URL = https://eventhub.rahulshettyacademy.com
    // Credentials: Use your own credentials
    // Write a reusable loginAndGoToBooking(page) helper that logs in and confirms the Browse Events → link is visible
    // Single ticket booking is eligible for refund
    await page.getByPlaceholder("you@email.com").pressSequentially("Johnsnow97@gmail.com", { delay: 100 });
    await page.locator("[type='password']").pressSequentially("Welcome@1", { delay: 100 });
    await page.locator("button:has-text('Sign In')").click();
    // Step 2 — Book first event with 1 ticket (default)
    // Navigate to /events
    // Click Book Now on the very first event card (locate data-testid="event-card" → first → data-testid="book-now-btn")
    // Fill Full Name, Email (your email), Phone
    // Click confirm button (.confirm-booking-btn)
    await page.locator("[data-testid='event-card']").first().waitFor();
    await page.locator("[data-testid='event-card']").first().click();
    await page.locator("#customerName").pressSequentially("John Snow", { delay: 100 });
    await page.locator("#customer-email").pressSequentially("john.snow@example.com", { delay: 100 });
    await page.locator("#phone").pressSequentially("+91 98765 43210", { delay: 100 });
    await page.locator(".confirm-booking-btn").click();
    // Step 3 — Navigate to booking detail
    // Click View My Bookings link
    // Assert URL is /bookings
    // Click the first View Details link
    // Assert: text Booking Information is visible on the page
    await page.locator("text=View My Bookings").waitFor();
    await page.locator("text=View My Bookings").click();
    await expect(page).toHaveURL(/.*\/bookings/);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();
    // Step 4 — Validate booking ref
    // Read booking ref from page
    // Read event title from h1
    // Assert validation : "first character of booking ref equals first character of event title"
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitle = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0));
    // Step 5 — Fill booking form
    // Assert: element with id #ticket-count has text 1 (default quantity)
    // Fill Full Name (locate by label Full Name)
    // Fill Email (locate by id #customer-email)
    // Fill Phone (locate by placeholder +91 98765 43210)
    // Click the confirm button (locate by CSS class .confirm-booking-btn)
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();
    await page.getByLabel('Full Name').pressSequentially('John Snow', { delay: 100 });
    await page.locator('#customer-email').pressSequentially("Johnsnow97@gmail.com", { delay: 100 });
    await page.locator("#phone").pressSequentially("+91 98765 43210", { delay: 100 });
    await page.locator('.confirm-booking-btn').click();
    // Step 6 — Verify booking confirmation
    // Locate the booking reference element (locate by CSS class .booking-ref, take .first())
    // Assert it is visible
    // Read its inner text, trim it — store as bookingRef
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(/.*\/bookings/);
    await page.getByRole('link', { name: 'View Details' }).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();
    // Step 7 — Verify in My Bookings
    // Click the link View My Bookings
    // Assert: URL is BASE_URL/bookings
    // Get all booking cards (locate by id #booking-card)
    // Assert the first booking card is visible
    // Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text
    // Assert that matched card is visible
    // Assert that matched card contains your eventTitle text
    // Validate booking ref first letter matches event name first letter
    const bookingReference = await page.locator('span.font-mono.font-bold').innerText();
    const eventTitles = await page.locator('h1').innerText();
    expect(bookingReference.charAt(0)).toBe(eventTitles.charAt(0));
    await page.locator('#check-refund-btn').click();
    // Step 8 — Verify seat reduction
    // Navigate back to /events
    // Assert the first event card is visible
    // Filter cards again using hasText: eventTitle
    // Assert the card is visible
    // Read the seat count text again (same as Step 3) — store as seatsAfterBooking
    // Assert: seatsAfterBooking === seatsBeforeBooking - 1
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).not.toBeVisible({ timeout: 6000 });
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Not eligible for refund');
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable');
});
