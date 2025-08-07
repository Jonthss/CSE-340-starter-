const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {}; // Use ONLY this object

/* ************************
 * Constructs the nav HTML unordered list
 * This function is now fully dynamic
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="[Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' at CSE Motors]"></a>';
      grid += '<div class="namePrice">';
      grid += "<hr>";
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicle was found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildDetailView = async function (data) {
  let detail = '';
  if (data) {
    const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.inv_price);
    const miles = new Intl.NumberFormat('en-US').format(data.inv_miles);
    detail = `
      <div class="detail-grid">
        <div class="detail-image">
          <img src="${data.inv_image}" alt="">
        </div>
        <div class="detail-info">
          <h2>${data.inv_make} ${data.inv_model} Details</h2>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Description:</strong> ${data.inv_description}</p>
          <p><strong>Color:</strong> ${data.inv_color}</p>
          <p><strong>Miles:</strong> ${miles}</p>
        </div>
      </div>
    `;
  } else {
    detail = '<p class="notice">Sorry, no matching vehicle was found.</p>';
  }
  return detail;
}

/* ****************************************
 * Build classification list for form
 * ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);


/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 * Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware to check authorization for specific views
 * ************************************ */
Util.checkAuthorization = (req, res, next) => {
  // Check if user is logged in first
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  // Check account type
  const accountType = res.locals.accountData.account_type;
  if (accountType === "Employee" || accountType === "Admin") {
    next(); // Authorized, proceed to the next function
  } else {
    req.flash("notice", "You are not authorized to access this page.");
    return res.redirect("/account/login");
  }
};

/* **************************************
 * Build the favorites view HTML
 * ************************************ */
Util.buildFavoritesGrid = async function(data) {
  let grid;
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' at CSE Motors"></a>';
      grid += '<div class="namePrice">';
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      // Add a form with a button to remove from favorites
      grid += `<form action="/favorites/remove" method="post">
                <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
                <button type="submit" class="favorite-btn">Remove from Favorites</button>
               </form>`;
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">You have no favorite vehicles yet.</p>';
  }
  return grid;
};

module.exports = Util;