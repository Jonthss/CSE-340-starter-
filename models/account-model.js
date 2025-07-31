const pool = require("../database/");
const bcrypt = require("bcryptjs");

/* *****************************
 * Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  // Hash the password before storing
  let hashedPassword;
  try {
    // A salt round of 10 is a common standard
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    console.error("Error hashing password:", error);
    // It's better to throw an error here to stop the process
    throw new Error("Could not process registration due to a server error.");
  }

  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    // Use the hashedPassword in the query
    return await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* **********************
 * Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}


module.exports = { registerAccount, getAccountByEmail, checkExistingEmail };