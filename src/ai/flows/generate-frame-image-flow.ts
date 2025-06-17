
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
    let styleInstruction = "";
    if (input.animationStyle && input.animationStyle.trim() !== "") {
      styleInstruction = `Visual Style: ${input.animationStyle}.`;
    } else {
      styleInstruction = `Visual Style: Clean, vibrant, suitable for an explanatory animation.`;
    }

    const promptText = `Your primary goal is to generate an image for an animation frame. CRUCIAL INSTRUCTION: The image MUST be purely visual. It MUST NOT contain any text, letters, words, numbers, or any form of writing. Generate ONLY visual elements. Depict the scene based on the following description, using metaphors and icons if suggested. ${styleInstruction} Scene description: ${input.frameDescription}. IMPORTANT REMINDER: Absolutely NO TEXT or writing in the image.`;

    const response = await ai.generate({
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

    const mediaPart = response.media;

    if (!mediaPart || !mediaPart.url) {
      console.error("Image generation failed. Full AI response:", JSON.stringify(response, null, 2));
      throw new Error('Image generation failed or returned no media URL. Check server console for details.');
    }
    
    return { imageDataUri: mediaPart.url };
  }
);

