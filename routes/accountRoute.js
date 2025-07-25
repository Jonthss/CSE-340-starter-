// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view - Nova rota adicionada
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to process the registration data - Rota POST adicionada
router.post("/register", utilities.handleErrors(accountController.registerAccount));

module.exports = router;