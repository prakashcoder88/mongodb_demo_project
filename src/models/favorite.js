const {mongoose} = require("mongoose");


const favoriteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    isLike: {
      type: Boolean,
      require: false,
    },
  },
  {
    versionKey: false,
    timestemps: true,
  }
);

const Favorite = new mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
