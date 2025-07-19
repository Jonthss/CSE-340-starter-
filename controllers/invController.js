const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = utilities.handleErrors(async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  // Check if data exists and has items
  if (!data || data.length === 0) {
    // If no vehicles found, get classification name separately
    const classificationData = await invModel.getClassifications()
    const classification = classificationData.rows.find(c => c.classification_id == classification_id)
    const className = classification ? classification.classification_name : "Unknown"
    
    const grid = await utilities.buildClassificationGrid([])
    let nav = await utilities.getNav()
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
    return
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
})

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = utilities.handleErrors(async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getInventoryById(invId)
  
  // Check if vehicle exists
  if (!data) {
    const error = new Error("Vehicle not found")
    error.status = 404
    throw error
  }
  
  const grid = await utilities.buildDetailView(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
  })
})

module.exports = invCont