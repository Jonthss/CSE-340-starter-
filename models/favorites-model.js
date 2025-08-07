const pool = require("../database/");

/* ***************************
 * Add a vehicle to favorites
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = "INSERT INTO public.favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *";
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
    return null;
  }
}

/* ***************************
 * Remove a vehicle from favorites
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = "DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_id, inv_id]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
    return null;
  }
}

/* ***************************
 * Get all favorites for a user
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT i.* FROM public.inventory AS i
      JOIN public.favorites AS f ON i.inv_id = f.inv_id
      WHERE f.account_id = $1`;
    const data = await pool.query(sql, [account_id]);
    return data.rows;
  } catch (error) {
    console.error("getFavoritesByAccountId error " + error);
    return [];
  }
}

/* ***************************
 * Check if a vehicle is a favorite for a user
 * ************************** */
async function isFavorite(account_id, inv_id) {
    try {
        const sql = "SELECT * FROM public.favorites WHERE account_id = $1 AND inv_id = $2";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("isFavorite error " + error);
        return false;
    }
}


module.exports = { addFavorite, removeFavorite, getFavoritesByAccountId, isFavorite };
