import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
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
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    required: true,
  },
  year: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
  },
  pdfFileName: {
    type: String,
    required: true,
  },
  pdfSize: {
    type: Number,
    default: 0,
  },
  pdfUrl: {
    type: String,
    required: true,
    description: "Public B2 URL for the PDF file",
  },
  thumbnailUrl: {
    type: String,
    description: "Public B2 URL for the PDF first page thumbnail",
  },
  b2FileId: {
    type: String,
    description: "B2 file ID for future deletion",
  },
  b2ThumbnailId: {
    type: String,
    description: "B2 thumbnail file ID for future deletion",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminUser",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
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

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
