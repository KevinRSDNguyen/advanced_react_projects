const express = require("express");
const router = express.Router();
const { User } = require("./../models/user");
const { normalizeErrors } = require("./../helpers/mongoose");

// ROUTE /api/users/register
router.post("/register", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(userdata => {
      return res.status(200).json({
        success: true,
        userdata
      });
    })
    .catch(err => res.status(422).json({ errors: normalizeErrors(err) }));
});

module.exports = router;
