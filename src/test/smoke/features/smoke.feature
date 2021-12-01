Feature: Smoke test

  Scenario: Can see lau frontend start page
    Given user is on lau start page
    Then user should see the gov uk header
