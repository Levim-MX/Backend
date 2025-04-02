const express = require("express");
const { auth } = require("../utils");
const router = express.Router();
const Order = require("../models/Order");
/**car form */
router.post("/", auth, async (req, res) => {
  const user_id = req.user.id;

  if (!user_id) res.send(401).json({ msg: "can't find user id" });
  try {
    const { car_name, branch_name, service_name, selected_sub_service } =
      req.body;

    const order = new Order({
      user_id,
      car_name,
      branch_name,
      service_name,
      selected_sub_service,
      confirmed: false,
    });
    await order.save();
    res.status(201).json({ message: "✅ Order Created Successfully", order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});
/** /order for admin dashboard */
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("user_id", "name phoneNumber");

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});
module.exports = router;
