const express = require("express");
const { auth } = require("../utils");
const router = express.Router();
const Order = require("../models/Order");

// إنشاء طلب جديد
router.post("/", auth, async (req, res) => {
  const user_id = req.user.id;
  if (!user_id) return res.status(401).json({ msg: "can't find user id" });
  try {
    const { car_name, branch_name, service_name, selected_sub_service, confirmed } = req.body;
    const order = new Order({
      user_id,
      car_name,
      branch_name,
      service_name,
      selected_sub_service,
      confirmed: false, // هنا يمكن تعديلها إلى true إذا أردتها تلقائياً
    });
    await order.save();
    res.status(201).json({ message: "✅ Order Created Successfully", order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// حذف الطلب
router.delete("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    res.json({ msg: "Order deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// تحديث حالة الطلب إلى مكتمل (confirmed: true)
router.put("/:orderId", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    order.confirmed = true;
    await order.save();
    res.json({ msg: "Order completed successfully", order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});


// جلب الطلبات (للوحة تحكم الأدمن)
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("user_id", "name phoneNumber");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

// Endpoint للطلبات المكتملة (تصفية الطلبات التي تم تأكيدها)
router.get("/completed", async (req, res) => {
  try {
    const completedOrders = await Order.find({ confirmed: true }).populate("user_id", "name phoneNumber");
    res.json(completedOrders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

module.exports = router;
