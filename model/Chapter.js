import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema({
  chapterNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", ChapterSchema);

export default Chapter;
