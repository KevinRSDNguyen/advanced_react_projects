const path = require("path");

module.exports = {
  normalizeErrors: function(error) {
    let normalizeErrors = [];
    if (error.errors) {
      const { errors } = error;
      for (let property in errors) {
        if (errors.hasOwnProperty(property)) {
          normalizeErrors.push({
            detail: errors[property].message
          });
        }
      }
    } else {
      normalizeErrors.push({
        detail: error.message
      });
    }
    return normalizeErrors;
  },
  checkFileType: function(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!"); //will be err for upload()
    }
  }
};
