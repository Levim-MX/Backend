const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");
const auth = (req, res, next) => {
  // Get the token from the requiest header
  const token = req.header("x-auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ msg: "token is not avaliable , authorization denies" });
  }
  try {
    jwt.verify(token, config.get("jwtSecret"), (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ msg: "token is not valid , authorization denies" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: (req, res, cb) => {
    cb(null, `${req.user.id}`);
  },
});
const upload = multer({ Storage: storage }).single("");
module.exports = { auth, upload };
