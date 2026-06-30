const mongoose = require('mongoose');
const uri = "mongodb+srv://aarfa_marine:aarfa_marine@cluster0.divdfo6.mongodb.net/?appName=Cluster0";

console.log("Connecting to:", uri);
mongoose.connect(uri)
  .then(() => {
    console.log("Success!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
