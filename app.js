const express = require("express");

const dotenv = require("dotenv").config();
const logger = require("./middlewares/logger.js");
const { notFound, errorHandler } = require("./middlewares/errors.js");
const connectToDb = require("./config/db.js");

//localhost:27017
// connection to database
connectToDb();
// Init app
const app = express();
// Apply middleware##########
app.use(express.json());
app.use(logger);
//Routes##############
app.use("/api/books", require("./route/books.js"));
app.use("/api/authors", require("./route/author.js"));
app.use("/api/auth", require("./route/auth.js"));
app.use("/api/users", require("./route/users.js"));
//Error handler middle ware#############
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Sever is running in ${process.env.NODE_ENV}mode 
Hello to my port ${PORT}`
  );
});
