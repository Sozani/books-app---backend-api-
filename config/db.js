const mongoose = require("mongoose");
async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongoDB...");
  } catch (error) {
    console.log("Error in catch mongoDB...", error);
  }
}
module.exports = connectToDb;
// the old way to connect to monogoose  the newest way with try and catch
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("Connected to mongoDB..."))
//   .catch((error) => console.log("Error in catch mongoDB...", error));
