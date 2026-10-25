import { z } from 'zod';

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content cannot be empty').max(2000, 'Message exceeds 2000 character limit'),
  timestamp: z.string().optional()
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, 'At least one message is required').max(50, 'Conversation history cannot exceed 50 messages'),
  language: z.enum(['en', 'te', 'hi']).default('en')
});

export const symptomFormDataSchema = z.object({
  mainSymptom: z.string().trim().min(2, 'Main symptom must be at least 2 characters').max(1000, 'Main symptom exceeds 1000 character limit'),
  duration: z.string().trim().min(1, 'Duration is required').max(200, 'Duration exceeds 200 character limit'),
  severity: z.union([z.number().min(1).max(10), z.string().regex(/^(10|[1-9])$/, 'Severity must be a number between 1 and 10')]).transform(val => Number(val)),
  ageRange: z.string().max(100).optional().default('Not provided'),
  context: z.string().max(1000).optional().default(''),
  otherDetails: z.string().max(1000).optional().default('')
});

export const symptomRequestSchema = z.object({
  formData: symptomFormDataSchema,
  language: z.enum(['en', 'te', 'hi']).default('en')
});

export const hospitalSearchSchema = z.object({
  query: z.string().max(100).optional().default(''),
  filter: z.enum(['All', 'Hospital', 'Clinic', 'Within 10 km']).optional().default('All'),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  language: z.enum(['en', 'te', 'hi']).optional().default('en')
});

export const reportUploadSchema = z.object({
  consent: z.union([z.string().regex(/^(true|1)$/i), z.boolean()]).transform(v => Boolean(v)),
  language: z.enum(['en', 'te', 'hi']).optional().default('en')
});
