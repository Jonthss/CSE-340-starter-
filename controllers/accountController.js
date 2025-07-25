// Needed Resources
const utilities = require("../utilities");
// const accountModel = require("../models/account-model")

/* ****************************************
 * Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Deliver registration view - Nova função adicionada
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

// Atualize o module.exports
module.exports = { buildLogin, buildRegister };