// models/linksModel.js
import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      "homestories",
      "homeyoutube",
      "homeinsta",
      "mediayoutube",
      "mediayoutubelatest",
      "mediainsta"
    ]
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Link = mongoose.model("Link", linkSchema);

export default Link;
