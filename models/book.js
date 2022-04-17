const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    idBook: {
      type: String,
      required: [true, "Please enter id book!"],
      trim: true,
      unique: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Please enter category!"],
      ref: "Category",
    },
    author: {
      type: Schema.Types.ObjectId,
      required: [true, "Please enter author!"],
      ref: "Author",
    },
    company: {
      type: Schema.Types.ObjectId,
      required: [true, "Please enter company!"],
      ref: "Company",
    },
    dateImport: {
      type: String,
      required: true,
    },
    publicYear: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
