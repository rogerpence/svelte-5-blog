import { z } from 'zod';

const dateFormatString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {message: "Date must be in the format YYYY-MM-DD"})

export const RPBlogSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    date_added: z.union([dateFormatString,  z.date(), z.null()]),
    date_updated: z.union([dateFormatString, z.date(), z.null()]),
    date_published: z.union([dateFormatString, z.date(), z.null()]),
    pinned: z.boolean()
}).strict();
 
export type RPBlogPost = z.infer<typeof RPBlogSchema>;