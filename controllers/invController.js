const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = utilities.handleErrors(async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data.length > 0 ? data[0].classification_name : "Veículos";
  res.render("./inventory/classification", {
    title: className,
    nav,
    grid,
    errors: null,
  });
});

/* ***************************
 * Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = utilities.handleErrors(async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryById(invId);
  if (!data) {
      const error = new Error("Veículo não encontrado");
      error.status = 404;
      return next(error);
  }
  const grid = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
    errors: null,
  });
});

/* ***************************
 * Build management view
 * ************************** */
invCont.buildManagementView = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
        title: "Gestão de Veículos",
        nav,
        errors: null,
    });
});

/* ***************************
 * Build add classification view
 * ************************** */
invCont.buildAddClassificationView = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Adicionar Nova Classificação",
        nav,
        errors: null,
    });
});

/* ***************************
 * Process new classification
 * ************************** */
invCont.addClassification = utilities.handleErrors(async function (req, res) {
    const { classification_name } = req.body;
    const addResult = await invModel.addClassification(classification_name);

    if (addResult) {
        let nav = await utilities.getNav(); // Rebuild nav to show the new classification
        req.flash("notice", `A classificação ${classification_name} foi adicionada com sucesso.`);
        res.status(201).render("inventory/management", {
            title: "Gestão de Veículos",
            nav,
            errors: null,
        });
    } else {
        let nav = await utilities.getNav();
        req.flash("notice", "Desculpe, a adição da classificação falhou.");
        res.status(501).render("inventory/add-classification", {
            title: "Adicionar Nova Classificação",
            nav,
            errors: {msg: "Falha ao adicionar a classificação."}, // Provide a generic error object
            classification_name,
        });
    }
});


/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Adicionar Novo Inventário",
        nav,
        classificationList,
        errors: null,
    });
});

/* ***************************
 * Process new inventory item
 * ************************** */
invCont.addInventory = utilities.handleErrors(async function (req, res) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

    const addResult = await invModel.addInventory(
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    );

    if (addResult) {
        req.flash("notice", `O veículo ${inv_make} ${inv_model} foi adicionado com sucesso.`);
        res.redirect("/inv/");
    } else {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice", "Desculpe, a adição do item de inventário falhou.");
        res.status(501).render("inventory/add-inventory", {
            title: "Adicionar Novo Inventário",
            nav,
            classificationList,
            errors: {msg: "Falha ao adicionar o veículo."}, // Provide generic error object
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
    }
});


module.exports = invCont;
