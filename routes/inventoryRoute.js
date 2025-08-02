// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require('../utilities/inventory-validation');

// Route to build management view - PROTECTED
router.get("/", utilities.checkAuthorization, utilities.handleErrors(invController.buildManagementView));

// Route to build add-classification view - PROTECTED
router.get("/add-classification", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassificationView));

// Route to build add-inventory view - PROTECTED
router.get("/add-inventory", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddInventoryView));

// Route to build inventory by classification view - PUBLIC
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the delete confirmation view - PROTECTED
router.get("/delete/:invId", utilities.checkAuthorization, utilities.handleErrors(invController.buildDeleteConfirmationView));

// Route to process the deletion - PROTECTED
router.post("/delete", utilities.checkAuthorization, utilities.handleErrors(invController.deleteInventoryItem));

// Route to build inventory by detail view - PUBLIC
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the edit inventory view - PROTECTED
router.get("/edit/:invId", utilities.checkAuthorization, utilities.handleErrors(invController.buildEditInventoryView));

// Route to fetch inventory data as JSON for AJAX requests - PUBLIC
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

// Process the new classification data - PROTECTED
router.post(
    "/add-classification",
    utilities.checkAuthorization,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Process the new inventory data - PROTECTED
router.post(
    "/add-inventory",
    utilities.checkAuthorization,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

/* *******************************************************
 * Route to process the inventory update
 * This will handle the form submission from the edit view
 * *******************************************************/
// PROTECTED
router.post(
    "/update",
    utilities.checkAuthorization,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
);

module.exports = router;