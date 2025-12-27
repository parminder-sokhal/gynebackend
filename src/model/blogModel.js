import mongoose from "mongoose";
import BaseModelSchema from "./BaseModel.js";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: { type: String, required: true }, // Main heading
  subTitle: { type: String }, // Subheading or intro line

  image: {
    public_id: { type: String, default: null },
    url: { type: String, default: null },
  },

  contentHtml: {
  type: String,
  required: [true, "Content (HTML) is required"],
},

  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },

  ...BaseModelSchema.obj, // includes createdAt, updatedAt, isdeleted, etc.
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
