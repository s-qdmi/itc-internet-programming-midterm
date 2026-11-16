# eLibrary Webpage

A web front-end developed for the course ITC4241

## Documentation

The tasks page operates with a full front-end architecture using localStorage to store user data in order to cover the project's scope.

### Tasks page

Each book is stored in the browser's cache as an array containing the following elements:
id (js generated):
code:
userNotes:
returnDate:
priority:
status:
createdAt:

All fields except the randomly generated id field and the createdAt field which stores the current date and time automatically are manually inputted in a modal, the values are then collected by jQuery when the user confirms their input. New books (tasks) recieve a randomly generated ID and are stored in localStorage as the 'books' item. When the edit function is clicked, the book's id which is loaded from the start is used to determine which element of 'books' should be edited in the edit modal.

### Latest activity

This uses a function which loads 'books' from localStorage and displays them with .sort, using dateB - dateA so that the ascending order of the .sort function displays the newest createdAt first.

### Settings page

Incomplete.