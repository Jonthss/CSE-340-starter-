'use strict'

// Find the form in the DOM
const form = document.querySelector("#updateForm")

// Add a 'change' event listener to the form
form.addEventListener("change", function () {
  // When a change occurs, find the submit button
  const updateBtn = document.querySelector("button[type='submit']")
  
  // Remove the 'disabled' attribute to make the button clickable
  updateBtn.removeAttribute("disabled")
})