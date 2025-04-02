const mongoose = require("mongoose");
const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sub_services: [
    {
      name: { type: String, required: true },
      price: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Service", ServiceSchema);
