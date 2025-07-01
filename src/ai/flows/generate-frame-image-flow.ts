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

    const promptText = `Create an educational diagram-style animation frame with STRONG EMPHASIS on metaphors and concrete visualizations. CRUCIAL INSTRUCTIONS: 
    1. The image MUST be purely visual - NO text, letters, words, numbers, or writing.
    2. Use EDUCATIONAL DIAGRAM style with:
       - Simple geometric shapes (circles, rectangles, triangles)
       - Clear connecting lines and arrows showing relationships
       - Bright, contrasting colors on dark background for clarity
       - Clean, minimalist design like technical diagrams
    3. MANDATORY: Transform abstract concepts into concrete visual metaphors:
       - Property/Ownership → house symbols, building icons
       - Legal processes → connected flowcharts, step-by-step diagrams
       - Parties/People → colored circles or simple human figures
       - Relationships → connecting lines, arrows, bridges
       - Division/Sharing → splitting objects, branching paths
       - Agreements → handshake symbols, puzzle pieces fitting
       - Time/Process → sequential steps, numbered stages
       - Rights/Obligations → balanced scales, equal divisions
    4. Use symbolic icons and everyday objects that people immediately recognize.
    5. Create CLEAN TECHNICAL DIAGRAMS similar to educational presentations.
    ${styleInstruction} Scene description: ${input.frameDescription}. 
    REMEMBER: Focus on diagram-style educational visuals with concrete metaphors that make legal/technical concepts instantly understandable without words.`;

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
      console.error("Image generation failed. Using placeholder. Full AI response:", JSON.stringify(response, null, 2));
      // Return a placeholder image URL so UI can still render.
      return { imageDataUri: 'https://placehold.co/600x338/png' };
    }
    
    return { imageDataUri: mediaPart.url };
  }
);

