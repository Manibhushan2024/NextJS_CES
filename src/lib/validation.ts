import { z } from "zod"

export const EnquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .max(25)
    .regex(/^[+\d\s()-]+$/, "Invalid phone number")
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .refine(
      (value) => /^(?:\+91|91)?[6-9]\d{9}$/.test(value),
      "Enter a valid Indian mobile number"
    ),
  // Optional so mobile-first quick forms need only name and phone.
  email: z
    .union([z.literal(""), z.string().trim().email().max(254)])
    .optional()
    .transform((value) => value || undefined),
  serviceType: z.enum([
    "installation",
    "maintenance",
    "repair",
    "modernization",
    "consultation",
    "inspection",
    "emergency",
    "other",
  ]),
  productType: z
    .enum([
      "home-lift",
      "home-elevator",
      "passenger-elevator",
      "freight-elevator",
      "hospital-elevator",
      "hydraulic-elevator",
      "car-lift",
      "kitchen-lift",
      "escalator",
      "dumbwaiter",
      "service",
      "other",
    ])
    .optional(),
  city: z.string().trim().min(2).max(80).optional(),
  state: z.string().trim().min(2).max(80).optional(),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please consent to being contacted about this enquiry",
    }),
  }),
  isEmergency: z.boolean().default(false),
  honeypot: z.string().max(200).optional(),
  attribution: z
    .object({
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
      utm_term: z.string().max(200).optional(),
      utm_content: z.string().max(200).optional(),
      gclid: z.string().max(200).optional(),
    })
    .optional(),
})
export type EnquiryFormData = z.infer<typeof EnquirySchema>
export const MAX_VOICE_BYTES = 5 * 1024 * 1024
export const VoiceFileSchema = z.object({
  name: z
    .string()
    .max(200)
    .regex(/\.(wav|mp3|m4a|mp4|webm|ogg)$/i, "Invalid audio format"),
  size: z
    .number()
    .positive()
    .max(MAX_VOICE_BYTES, "Voice message must be at most 5MB"),
  type: z.enum([
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/x-m4a",
    "audio/webm",
    "audio/ogg",
  ]),
})
