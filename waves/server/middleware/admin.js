let admin = (req, res, next) => {
  if (req.user.role === 0) {
    return res
      .status(400)
      .json({ errors: [{ detail: "You must be an admin to do that" }] });
  }
  next();
};

module.exports = { admin };
