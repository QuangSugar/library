const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userBookSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    book: [{
      type: Schema.Types.ObjectId,
      required: [true, "Please enter book!"],
      ref: 'Book'
    }],
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'pending',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserBook", userBookSchema);
