# Offers Page Test Plan

## Application Overview

Test plan for the Offers page at https://rahulshettyacademy.com/seleniumPractise/#/offers. The plan covers core UI flows, search and sorting functionality, edge cases, and accessibility checks. Tests assume a fresh browser session and working network connection.

## Test Scenarios

### 1. Offers Page

**Seed:** `tests/seed.spec.ts`

#### 1.1. Load Offers Page - UI sanity

**File:** `specs/offers/load-offers.spec.md`

**Steps:**
  1. Navigate to https://rahulshettyacademy.com/seleniumPractise/#/offers
    - expect: Page navigates to /offers and responds (network/manual check)
    - expect: Search input is visible and enabled (locator: input[type="search"] or placeholder)
    - expect: Products table or grid is visible (locator: table or .products)
    - expect: At least one product row is visible

#### 1.2. Search filters results (happy path)

**File:** `specs/offers/search-filter.spec.md`

**Steps:**
  1. Navigate to /offers, focus the search input, type a known product name (e.g., 'Tomato')
    - expect: Only rows containing the search term are visible
    - expect: Each visible row contains the search term in its name column
    - expect: Visible rows count is > 0

#### 1.3. Empty / non-matching search (negative)

**File:** `specs/offers/search-no-results.spec.md`

**Steps:**
  1. Navigate to /offers, type a random string unlikely to match any product (e.g., 'zzzxxyy') into search box
    - expect: No product rows are visible or the table shows zero results
    - expect: UI does not crash and search input remains usable
    - expect: Clearing search restores results

#### 1.4. Sorting by product name (ascending/descending)

**File:** `specs/offers/sort.spec.md`

**Steps:**
  1. Navigate to /offers, capture product names in the visible list in their initial order
    - expect: Initial product list captured
  2. Click the product name column header (or the header control that triggers sort) to sort ascending
    - expect: List is resorted and product names are in ascending alphabetical order
  3. Click the header again (if applicable) to sort descending
    - expect: List is resorted and product names are in descending alphabetical order

#### 1.5. Search + Sort combination

**File:** `specs/offers/search-sort-combo.spec.md`

**Steps:**
  1. Navigate to /offers, type a partial search term that returns multiple rows (e.g., 'To')
    - expect: Filtered rows count is > 1
  2. While results are filtered, click the name column header to sort
    - expect: Filtered results are sorted correctly
    - expect: Sorting does not bring back rows that do not match the search

#### 1.6. Accessibility & Keyboard navigation

**File:** `specs/offers/accessibility.spec.md`

**Steps:**
  1. Navigate to /offers, focus the search input using keyboard (Tab) and type search term
    - expect: Search input receives keyboard focus
    - expect: Typing filters results as with mouse input
  2. Use keyboard to move to first product (Tab/Arrow) and activate any available action using Enter/Space
    - expect: Keyboard users can reach product rows and trigger actions if actions exist
    - expect: No interactive element is unreachable by keyboard

#### 1.7. Resilience under slow network / spinner behavior

**File:** `specs/offers/spinner.spec.md`

**Steps:**
  1. Throttle network to slow, navigate to /offers
    - expect: A visible loading indicator or spinner appears (if implemented)
    - expect: Spinner disappears once data is rendered
    - expect: UI remains responsive and no errors are shown
