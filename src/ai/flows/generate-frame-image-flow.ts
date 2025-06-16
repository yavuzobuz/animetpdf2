
'use server';
/**
 * @fileOverview Generates an image for a single animation frame based on its description.
 *
 * - generateFrameImage - A function that generates an image for an animation frame.
 * - GenerateFrameImageInput - The input type for the generateFrameImage function.
 * - GenerateFrameImageOutput - The return type for the generateFrameImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFrameImageInputSchema = z.object({
  frameDescription: z
    .string()
    .describe('The text description of the animation frame/scene.'),
});
export type GenerateFrameImageInput = z.infer<
  typeof GenerateFrameImageInputSchema
>;

const GenerateFrameImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."
    ),
});
export type GenerateFrameImageOutput = z.infer<
  typeof GenerateFrameImageOutputSchema
>;

export async function generateFrameImage(
  input: GenerateFrameImageInput
): Promise<GenerateFrameImageOutput> {
  return generateFrameImageFlow(input);
}

const generateFrameImageFlow = ai.defineFlow(
  {
    name: 'generateFrameImageFlow',
    inputSchema: GenerateFrameImageInputSchema,
    outputSchema: GenerateFrameImageOutputSchema,
  },
  async (input: GenerateFrameImageInput) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', // IMPORTANT: Use image generation model
      prompt: `Generate a visual representation for the following animation scene: ${input.frameDescription}. The image should be clear and illustrative of the key elements. Style: Clean, vibrant, suitable for an explanatory animation.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE
        safetySettings: [
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
           {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
           {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
           {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_CIVIC_INTEGRITY', // Added this category
            threshold: 'BLOCK_NONE',
          },
        ]
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }
    return { imageDataUri: media.url };
  }
);

