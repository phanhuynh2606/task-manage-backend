const taskRoutes = require("../routes/task.route");

module.exports = (app) => {
   const version = "/api/v1";
   app.use(version+"/tasks",taskRoutes);
};