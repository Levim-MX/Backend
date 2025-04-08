const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  car_name: { type: String, ref: "Car", required: true },
  branch_name: { type: String, ref: "Branch", required: true },
  service_name: { type: String, ref: "Service", required: true },
  selected_sub_service: { type: String },
  confirmed: { type: Boolean, default: false }, // حالة تأكيد الطلب
}, {
  timestamps: true // يضيف createdAt و updatedAt تلقائيًا
});

module.exports = mongoose.model("Order", OrderSchema);