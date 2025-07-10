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

    const promptText = `Create an educational diagram that DIRECTLY represents the subject matter while maintaining its original context and terminology. CRUCIAL INSTRUCTIONS: 
    1. The image MUST be purely visual - NO text, letters, words, numbers, or writing.
    2. Use CONTEXTUAL EDUCATIONAL style with:
       - Subject-appropriate visual elements
       - Real symbols and representations from the field
       - Clear, professional diagrams that match the topic
       - Authentic visual language of the subject matter
    3. CONTEXTUAL APPROACH: Represent concepts using their REAL visual context:
       - Legal topics → Actual legal symbols, court layouts, legal document structures
       - Technical subjects → Real technical diagrams, authentic process flows
       - Business content → Genuine business structures, real organizational elements
       - Educational material → Direct subject matter visualization
    4. Avoid generic metaphors that disconnect from the topic's real context.
    5. Create AUTHENTIC EDUCATIONAL VISUALS that professionals in the field would recognize.
    ${styleInstruction} Scene description: ${input.frameDescription}. 
    REMEMBER: Focus on authentic, contextual educational visuals that preserve the subject's real terminology and concepts.`;

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

