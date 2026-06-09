Feature: Creating order in Rahul Shetty Academy eCommerce website


// Tagging in Cucumber Playwright
// Tags are used to categorize and organize test scenarios in Cucumber. 
// They allow you to group related scenarios together and selectively run specific groups of tests based on their tags. 
// This is particularly useful for managing large test suites and running only relevant tests during development or continuous integration.
@create_order_tag
  Scenario: User should be able to create order successfully
    Given I am on the Rahul Shetty Academy eCommerce website with "username" and "password"
    When I add "Laptop" to the cart
    And I proceed to checkout
    And I fill in the "shipping_details"
    And I select "Credit Card" as the payment "method"
    And I confirm the "order" in orderhistory page
    Then I should see a "confirmation_message" that my order has been placed successfully
