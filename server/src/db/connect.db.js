import mongoose from "mongoose";
import serverConfig from "../configs/server.config.js";

//Singleton class to connect to MongoDB
class Database {
  constructor() {
    this.connect();
  }

  connect() {
    if (serverConfig.env !== "pro")
      mongoose.set("debug", { shell: true, color: true });

    mongoose
      .connect(serverConfig.database.url)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB: ", error);
      });
  }

  static getInstance() {
    if (!this.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const dbInstance = Database.getInstance();
export default dbInstance;
