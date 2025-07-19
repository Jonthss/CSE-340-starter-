const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';

  // Create a map for easy lookup
  const classificationMap = {};
  data.rows.forEach((row) => {
    classificationMap[row.classification_name.toLowerCase()] = row;
  });

  // Add Custom
  if (classificationMap["custom"]) {
    list +=
      '<li><a href="/inv/type/' +
      classificationMap["custom"].classification_id +
      '" title="See our inventory of Custom vehicles">Custom</a></li>';
  }

  // Add sedan
  if (classificationMap["sedan"]) {
    list +=
      '<li><a href="/inv/type/' +
      classificationMap["sedan"].classification_id +
      '" title="See our inventory of Sedan vehicles">Sedan</a></li>';
  }
  // Add SUV
  if (classificationMap["suv"]) {
    list +=
      '<li><a href="/inv/type/' +
      classificationMap["suv"].classification_id +
      '" title="See our inventory of SUV vehicles">SUV</a></li>';
  }

  // Add Sport
  if (classificationMap["sport"]) {
    list +=
      '<li><a href="/inv/type/' +
      classificationMap["sport"].classification_id +
      '" title="See our inventory of Sport vehicles">Sport</a></li>';
  }

  // Add Truck
  if (classificationMap["truck"]) {
    list +=
      '<li><a href="/inv/type/' +
      classificationMap["truck"].classification_id +
      '" title="See our inventory of Truck vehicles">Truck</a></li>';
  }

  list += "</ul>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="'+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function(data){
  let detail
  if(data){
    detail = '<div class="detail-container">'
    detail += '<div class="detail-image">'
    detail += '<img src="' + data.inv_image 
    detail += '" alt="View details'+ data.inv_make + ' ' + data.inv_model 
    detail += ' on CSE Motors" />'
    detail += '</div>'
    detail += '<div class="detail-info">'
    detail += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
    detail += '<p class="detail-price"><strong>Price: $' 
    detail += new Intl.NumberFormat('en-US').format(data.inv_price) + '</strong></p>'
    detail += '<p class="detail-description"><strong>Description:</strong> ' + data.inv_description + '</p>'
    detail += '<p class="detail-color"><strong>Color:</strong> ' + data.inv_color + '</p>'
    detail += '<p class="detail-miles"><strong>Miles:</strong> ' 
    detail += new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
    detail += '<p class="detail-year"><strong>Year:</strong> ' + data.inv_year + '</p>'
    detail += '</div>'
    detail += '</div>'
  } else { 
    detail = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return detail
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;