const sequelize = require("./src/config/database");
const app = require("./src/app");
const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("💾 DB OK");
    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  } catch (err) {
    console.error("⛔ DB error:", err);
  }
})();
