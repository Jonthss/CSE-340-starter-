const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities/");

const favController = {};

/* ***************************
 * Build the favorites view
 * ************************** */
favController.buildFavoritesView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const account_id = res.locals.accountData.account_id;
  const favoritesData = await favoritesModel.getFavoritesByAccountId(account_id);
  const grid = await utilities.buildFavoritesGrid(favoritesData);
  res.render("account/favorites", {
    title: "My Favorite Vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 * Process adding a favorite
 * ************************** */
favController.addFavorite = async function (req, res) {
  const { inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  const addResult = await favoritesModel.addFavorite(account_id, inv_id);

  if (addResult) {
    req.flash("notice", "The vehicle was successfully added to your favorites.");
  } else {
    req.flash("notice", "Sorry, we couldn't add the vehicle to your favorites.");
  }
  res.redirect(`/inv/detail/${inv_id}`);
};

/* ***************************
 * Process removing a favorite
 * ************************** */
favController.removeFavorite = async function (req, res) {
  const { inv_id } = req.body;
  const account_id = res.locals.accountData.account_id;
  const removeResult = await favoritesModel.removeFavorite(account_id, inv_id);

  if (removeResult) {
    req.flash("notice", "The vehicle was successfully removed from your favorites.");
  } else {
    req.flash("notice", "Sorry, we couldn't remove the vehicle from your favorites.");
  }
  // Redirect back to the favorites page after removing an item
  res.redirect('/favorites');
};

module.exports = favController;
