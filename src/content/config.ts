import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        image: z.string().optional(),
        score: z.number().optional(),
        link: z.string().url().optional(),
        featured: z.boolean().default(false),
        order: z.number().default(100),
    }),
});

export const collections = {
    projects,
};
