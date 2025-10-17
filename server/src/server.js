require("dotenv").config();
const { testConnection } = require("./db");
const app = require("./app");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
    process.exit(1);
  }
};
startServer();
 
