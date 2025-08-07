// Needed Resources
const express = require("express");
const router = new express.Router();
const favController = require("../controllers/favoritesController");
const utilities = require("../utilities");

// Route to display the user's favorite vehicles
router.get("/", utilities.checkLogin, utilities.handleErrors(favController.buildFavoritesView));

// Route to add a vehicle to favorites
router.post("/add", utilities.checkLogin, utilities.handleErrors(favController.addFavorite));

// Route to remove a vehicle from favorites
router.post("/remove", utilities.checkLogin, utilities.handleErrors(favController.removeFavorite));

module.exports = router;
