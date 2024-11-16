import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import logger from "../configs/logger.config.js";
import serverConfig from "../configs/server.config.js";

//Singleton class to connect to MongoDB
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose.set("debug", { shell: true, color: true });
    mongoose.set("debug", function (coll, method, query, doc, options) {
      logger.debug(
        `Mongoose: ${coll}.${method}(${JSON.stringify(query)}, ${JSON.stringify(
          doc
        )}, ${JSON.stringify(options)})`
      );
    });

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
