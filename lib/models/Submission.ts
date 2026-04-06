import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  id: number; // sequential numeric ID (1, 2, 3…)
  category: string;
  reason: string;
  source: string;
  status: "pending" | "approved" | "rejected";
  ip: string;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    id: {
      type: Number,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      enum: [
        "Economic Leadership",
        "Fiscal Discipline",
        "Education",
        "Healthcare",
        "Infrastructure",
        "Anti-Corruption",
        "Post-Governor Period",
        "Security",
        "Agriculture",
        "International",
        "Character",
        "Transparency",
        "Other",
      ],
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      minlength: 30,
      maxlength: 1000,
    },
    source: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    ip: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Disable mongoose's default _id in favour of our numeric id
    // (we keep _id for mongo internals, but expose only id)
    toJSON: {
      transform(_, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.ip; // never expose IP publicly
      },
    },
  }
);

// ── Auto-increment numeric ID ──────────────────────────────────────────────
// Uses a separate "counters" collection to safely generate sequential IDs
// even under concurrent inserts.
SubmissionSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const Counter = mongoose.models.Counter ??
    mongoose.model("Counter", new Schema({ _id: String, seq: Number }));

  const counter = await Counter.findByIdAndUpdate(
    "submission_id",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  this.id = counter.seq;
  next();
});

const Submission: Model<ISubmission> =
  mongoose.models.Submission ??
  mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;