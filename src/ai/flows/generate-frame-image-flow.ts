
'use server';
/**
 * @fileOverview Generates an image for a single animation frame based on its description and an optional style.
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
    .describe('The text description of the animation frame/scene, potentially including metaphor suggestions.'),
  animationStyle: z
    .string()
    .describe('The desired visual style for the image (e.g., "Cartoon", "Minimalist", "Photorealistic", "Sketch", "Watercolor").')
    .optional(),
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
    let promptText = `Generate a PURELY VISUAL representation for the following animation scene description. The image should ONLY contain visual elements and NO TEXT, NO NUMBERS, and NO SCENE LABELS. If the description suggests metaphors or icons (e.g., 'a handshake icon for partnership', 'a growing plant for development'), try to incorporate these visual ideas. It must be clear and illustrative of the key elements in the description.`;

    if (input.animationStyle && input.animationStyle.trim() !== "") {
      promptText += ` Visual Style: ${input.animationStyle}.`;
    } else {
      // Default style if not provided or empty
      promptText += ` Visual Style: Clean, vibrant, suitable for an explanatory animation.`;
    }
    promptText += ` Scene description: ${input.frameDescription}`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-exp', 
      prompt: promptText,
      config: {
        responseModalities: ['TEXT', 'IMAGE'], 
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
        ]
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed or returned no media URL.');
    }
    return { imageDataUri: media.url };
  }
);

