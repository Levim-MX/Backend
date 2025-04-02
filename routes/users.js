const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { auth } = require("../utils");
/*
post api/users/register
desc: register a new user
public
*/
router.post(
  "/register",
  check("name", "Name is required").notEmpty(),
  check("phoneNumber", "phoneNumber is required").notEmpty(),
  check(
    "password",
    "please choose a passwoed with at least 6 charactors"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, phoneNumber, password } = req.body;
    if (phoneNumber.length != 11) {
      return res
        .status(400)
        .json({ msg: "phoneNumber should be 11 digites start from 0" });
    }
    try {
      let user = await User.findOne({ phoneNumber });

      if (user) {
        return res.status(400).json({ erros: { msg: "user already exists" } });
      }
      user = new User({
        name: name,
        phoneNumber,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);
/*
post api/users/login
desc : login a user and get token and check if it's exists
public
*/
router.post(
  "/login",
  check("phoneNumber", "phoneNumber is required").notEmpty(),
  check(
    "password",
    "please choose a passwoed with at least 6 charactors"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { phoneNumber, password } = req.body;

    if (phoneNumber.length != 11) {
      return res
        .status(400)
        .json({ msg: "phoneNumber should be 11 digites start from 0" });
    }
    try {
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        return res.status(400).json({ erros: { msg: "Ivalid Credentials" } });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ erros: { msg: "Ivalid Credentials" } });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

/*
  rout api/users
  desc: taken a token and get the user data
  private
 */

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
module.exports = router;
