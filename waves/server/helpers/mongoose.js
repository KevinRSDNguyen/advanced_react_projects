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
  }
};
