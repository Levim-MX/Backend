const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); // استيراد CORS

const app = express();
app.use(express.json());

// تمكين CORS لجميع الطلبات
app.use(cors());

// تعريف الـ routes بعد تمكين CORS
app.use("/api/users", require("./routes/users")); /** https://localhost:3000/api/users/login */
app.use("/api/profile", require("./routes/profile"));
app.use("/api/order", require("./routes/posts")); /** https://localhost:3000/api/order */

connectDB();

app.get("/", (req, res) => {
  res.send("its working");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
