const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    fullName: {
      type: String,
      require: true
    }
    // slackID: String,
    // googleID: String
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;