module.exports = function (app) {
  app.use("/api/auth", require("./auth"));
  app.use("/api/admin",require("./admin"));
  app.use("/api/user",require("./user"));
  app.use("/api/igse",require("./restApi"));

};
