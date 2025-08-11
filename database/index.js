const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing AND for production on Render
 * *************** */
let pool

if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  // Added for troubleshooting queries during development
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query", { text })
        return res
      } catch (error) {
        console.error("error in query", { text })
        throw error
      }
    },
  }
} else {
  // This block runs in production on Render
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL configuration is also needed for production
    ssl: {
      rejectUnauthorized: false,
    },
  })
  module.exports = pool
}
