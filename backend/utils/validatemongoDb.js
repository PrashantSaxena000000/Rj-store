const mongoose = require("mongoose");

const validatemongoDbId = (id) => {
  const ValidID = mongoose.Types.ObjectId.isValid(id);
  if (!ValidID) throw new Error("This id not valid or not found");
};

module.exports = validatemongoDbId;
