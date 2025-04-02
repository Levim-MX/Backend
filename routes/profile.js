const express = require("express");
const { auth, upload } = require("../utils");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Profile = require("../models/Profile");
/**
 * post update the name  // done
 * Get profile/me
 * Delete Profile
 * Post profile/upload
 *
 */
router.post(
  "/",
  auth,
  check("name", "The name is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;

    try {
      let profileobj = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { name } },
        { new: true, upsert: true }
      );

      res.json(profileobj);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);


router.get("/me", auth, async (req, res) => {
  try {
    const profile = await User.findOne({
      _id: req.user.id,
    });
    if (!profile) res.status(400).json({ msg: "There is no profile" });
    res.json(profile.name);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/upload", auth, async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) res.status(500).send(`server error ${err}`);
      else {
        res.status(200).send(req.user.id);
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
module.exports = router;
