'use server';

/**
 * @fileOverview Analyzes a PDF document to extract key themes and points in Turkish.
 *
 * - analyzePdf - A function that takes PDF content and returns a summary in Turkish.
 * - AnalyzePdfInput - The input type for the analyzePdf function, a data URI representing the PDF.
 * - AnalyzePdfOutput - The return type for the analyzePdf function, containing the summary in Turkish.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF document content as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AnalyzePdfInput = z.infer<typeof AnalyzePdfInputSchema>;

const AnalyzePdfOutputSchema = z.object({
  summary: z.string().describe('A summary of the key themes and points in the PDF document, in Turkish.'),
});
export type AnalyzePdfOutput = z.infer<typeof AnalyzePdfOutputSchema>;

export async function analyzePdf(input: AnalyzePdfInput): Promise<AnalyzePdfOutput> {
  return analyzePdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePdfPrompt',
  input: {schema: AnalyzePdfInputSchema},
  output: {schema: AnalyzePdfOutputSchema},
  prompt: `You are an expert document summarizer. Please analyze the PDF document provided and generate a concise summary of the key themes and points IN TURKISH. The PDF content is provided as a data URI.

PDF Content: {{media url=pdfDataUri}}

Summary (in Turkish):`,
});

const analyzePdfFlow = ai.defineFlow(
  {
    name: 'analyzePdfFlow',
    inputSchema: AnalyzePdfInputSchema,
    outputSchema: AnalyzePdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
