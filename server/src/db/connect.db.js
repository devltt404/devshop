import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import serverConfig from "../configs/server.config.js";
import logger from "../logger.js";

//Singleton class to connect to MongoDB
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (!serverConfig.isPro)
      mongoose.set("debug", { shell: true, color: true });

    mongoose
      .connect(serverConfig.database.url)
      .then(() => {
        logger.info("Connected to MongoDB");
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB: ", error);
      });
  }

  static getInstance() {
    if (!this.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

export const AutoIncrement = AutoIncrementFactory(mongoose);

const dbInstance = Database.getInstance();
export default dbInstance;
