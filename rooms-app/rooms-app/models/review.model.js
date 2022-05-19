const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: "User" },
    comment: { 
        type: String, 
        maxlength: 200 }
  });

const Review = model("User", reviewSchema);

module.exports = Review;