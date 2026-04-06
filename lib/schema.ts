import { z } from "zod";

export const VALID_CATEGORIES = [
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
] as const;

export const SubmissionSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "Please select a category.")
    .max(100, "Category must be under 100 characters.")
    .refine(
      (v) => (VALID_CATEGORIES as readonly string[]).includes(v),
      { message: "Invalid category selected." }
    ),

  reason: z
    .string()
    .trim()
    .min(30, "Reason must be at least 30 characters.")
    .max(1000, "Reason must be under 1000 characters."),

  source: z
    .string()
    .trim()
    .min(1, "Source URL is required.")
    .max(2048, "Source URL is too long.")
    .refine(
      (v) => {
        try {
          const u = new URL(v);
          return (
            (u.protocol === "http:" || u.protocol === "https:") &&
            u.hostname.includes(".") &&
            u.hostname.length > 3 &&
            !u.hostname.startsWith(".")
          );
        } catch {
          return false;
        }
      },
      { message: "Please provide a valid URL starting with http:// or https://" }
    ),
});

export type SubmissionInput = z.infer<typeof SubmissionSchema>;