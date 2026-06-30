const mongoose = require('mongoose');
const uri = "mongodb+srv://aurax-marine:qip9c7cNVpnHg5Sn@cluster0.haea5hl.mongodb.net/?appName=Cluster0i";

console.log("Connecting to Aurax DB:", uri);
mongoose.connect(uri)
  .then(() => {
    console.log("Success! Aurax DB Connected!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
