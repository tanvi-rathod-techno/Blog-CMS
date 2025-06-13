// app/lib/schemas/postSchema.ts

import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
});

export type PostFormData = z.infer<typeof postSchema>;
