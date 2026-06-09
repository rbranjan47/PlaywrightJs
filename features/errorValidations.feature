Feature: ECommerce Error Validations

  Scenario: User should see error message when trying to login with invalid credentials
    Given I am on the Rahul Shetty Academy eCommerce website
    When I enter "johnsmith009@test.com" and "Welcome2"
    And I click on the "login" button
    Then I should see an "error_message" indicating invalid login credentials

  Scenario: User should see error message when trying to add out of stock item to cart
    Given I am on the Rahul Shetty Academy eCommerce website with "johnsmith009@test.com" and "Welcome1"
    When I search for "out_of_stock_item"
    And I try to add it to the cart
    Then I should see an "error_message" indicating the item is out of stock