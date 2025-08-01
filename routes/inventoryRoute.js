// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require('../utilities/inventory-validation');

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the delete confirmation view
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to process the deletion
router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the edit inventory view
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventoryView));

// Route to fetch inventory data as JSON for AJAX requests
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

// Process the new classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Process the new inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

/* *******************************************************
 * Route to process the inventory update
 * This will handle the form submission from the edit view
 * *******************************************************/
router.post(
    "/update",
    // It's a good practice to reuse validation rules
    invValidate.inventoryRules(),
    invValidate.checkUpdateData, // You will likely create this new validation check
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;