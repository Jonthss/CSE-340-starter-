/* ****************************************
 * All validation logic for inventory and classification
 ****************************************/

const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must be a string with no special characters or spaces
        body("classification_name")
            .trim()
            .isAlpha()
            .withMessage("Classification name can only contain alphabetic characters.")
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name);
                if (classificationExists){
                    throw new Error("Classification already exists. Please use a different name.");
                }
            }),
    ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
        const { classification_name } = req.body;
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
                let nav = await utilities.getNav();
                res.render("inventory/add-classification", {
                        errors,
                        title: "Add Classification",
                        nav,
                        classification_name,
                });
                return;
        }
        next();
};

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
        return [
                body("inv_make").trim().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
                body("inv_model").trim().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
                body("inv_year").trim().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage("Year must be a 4-digit number."),
                body("inv_description").trim().notEmpty().withMessage("Description is required."),
                body("inv_image").trim().notEmpty().withMessage("Image path is required."),
                body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
                body("inv_price").trim().isFloat({ min: 0 }).withMessage("Price must be a valid number."),
                body("inv_miles").trim().isInt({ min: 0 }).withMessage("Miles must be a valid integer."),
                body("inv_color").trim().notEmpty().withMessage("Color is required."),
                body("classification_id").trim().isInt().withMessage("Classification is required."),
        ];
};

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
        const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                let nav = await utilities.getNav();
                let classificationList = await utilities.buildClassificationList(classification_id);
                res.render("inventory/add-inventory", {
                        errors,
                        title: "Add Inventory",
                        nav,
                        classificationList,
                        inv_make,
                        inv_model,
                        inv_year,
                        inv_description,
                        inv_image,
                        inv_thumbnail,
                        inv_price,
                        inv_miles,
                        inv_color,
                });
                return;
        }
        next();
};

module.exports = validate;
