# How to create a frontend page for Game collector

## Frontend

Create a page so that all games and filter them by status, so that I can see at a glance what is available or out.

Add a `Game` icon on top left corner, and add NEON effect bar on top (like a strip arcoss)

Requirement:

The table has 3 column, title, category and status.

Suggestion: 

1. Create a Datatable, that can use filter, especially can filter by status.
2. Ideally it can also search by name?


## Add button

Add a button on top right for adding a game to the collection. It should be labelled "ADD GAME". Maybe an "+" symbol alongside.

It should prompt a form for user to add information.

It should ask for 2 field, title, and category.

Given a required field is missing or the category is invalid, when I submit, then I get a clear validation message and nothing is saved.

## Change status

The datatable should allow user to change status.

It should be a button icon for each sign

There will be 4 status in total, "available, reserved, on_loan, retired"

The cycle are "available -> reserved -> on_loan -> available". "retired" is a special case that does not allow change in status, and the button icon will be disabled.

It should be a drop down list. once a status is clicked, it should send a update request to backend server. 

Do note that when a record is retired,  It can no longer change status.


