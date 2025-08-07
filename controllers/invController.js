const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const favoritesModel = require("../models/favorites-model");

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

  // Check if the vehicle is in the user's favorites
  let isFavorite = false;
  if (res.locals.loggedin) {
      const account_id = res.locals.accountData.account_id;
      isFavorite = await favoritesModel.isFavorite(account_id, invId);
  }

  const grid = await utilities.buildDetailView(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
    errors: null,
    isFavorite, // Pass the favorite status to the view
    inv_id: invId // Pass the inventory ID to the view
  });
});

/* ***************************
 * Build management view
 * ************************** */
invCont.buildManagementView = utilities.handleErrors(async function (req, res, next) {
    let nav = await utilities.getNav();
    // Create the classification select list
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Gestão de Veículos",
        nav,
        errors: null,
        // Pass the classification select list to the view
        classificationSelect,
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
        // Re-render the management view with the updated nav and a success message
        const classificationSelect = await utilities.buildClassificationList();
        res.status(201).render("inventory/management", {
            title: "Gestão de Veículos",
            nav,
            errors: null,
            classificationSelect,
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

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0] && invData[0].inv_id) {
    return res.json(invData);
  } else {
    // Return empty array if no data found, client-side will handle it
    return res.json([]);
  }
};

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = utilities.handleErrors(async function (req, res, next) {
  // Parse the inventory ID from the request parameters
  const inv_id = parseInt(req.params.invId);

  // Fetch navigation bar and specific item data from the model
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);

  // Build the classification dropdown, pre-selecting the item's current classification
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);

  // Create a name for the page title
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  // Render the edit-inventory view with the item's data
  res.render("./inventory/edit-inventory", {
    title: "Editar " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
});

/* ***************************
 * Update Inventory Data
 * ************************** */
invCont.updateInventory = utilities.handleErrors(async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  // Call the model function to update the inventory data
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  // Check if the update was successful
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `O veículo ${itemName} foi atualizado com sucesso.`);
    res.redirect("/inv/");
  } else {
    // If the update fails, re-render the edit view with an error message
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Desculpe, a atualização falhou.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Editar " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
});



/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmationView = utilities.handleErrors(async function (req, res, next) {
  const inv_id = parseInt(req.params.invId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Deletar " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
});

/* ***************************
 * Process the deletion
 * ************************** */
invCont.deleteInventoryItem = utilities.handleErrors(async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  
  const deleteResult = await invModel.deleteInventoryItem(inv_id);

  if (deleteResult) { // if (1) é verdadeiro
    req.flash("notice", 'O veículo foi deletado com sucesso.');
    res.redirect("/inv/");
  } else { // if (0) é falso
    req.flash("notice", "Desculpe, a exclusão falhou.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
});

module.exports = invCont;