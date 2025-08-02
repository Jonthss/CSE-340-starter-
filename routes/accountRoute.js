// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');
const validate = require('../utilities/account-validation');

// Route to build the account management view
// Added checkLogin middleware for authorization
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);


// Route to deliver the account update view
router.get(
    "/update/:accountId",
    utilities.checkLogin, // Garante que apenas usuários logados acessem
    utilities.handleErrors(accountController.buildUpdateView)
);

/* ****************************************
 * Route to deliver the account update view
 ************************************ */
router.get(
    "/update/:accountId",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateView)
);

/* ****************************************
 * Route to process account info update
 ************************************ */
router.post(
    "/update-info",
    validate.updateRules(),
    // We'll create this check in the next step
    // validate.checkUpdateInfoData, 
    utilities.handleErrors(accountController.updateAccountInfo)
);

/* ****************************************
 * Route to process password update
 ************************************ */
router.post(
    "/update-password",
    validate.passwordRules(),
    // We'll create this check in the next step
    // validate.checkUpdatePasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

/* ****************************************
 * Route to handle logout process
 ************************************ */
router.get("/logout", accountController.accountLogout);

module.exports = router;
