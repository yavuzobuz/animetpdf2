
'use server';
/**
 * @fileOverview Generates question and answer pairs in Turkish based on a PDF summary.
 *
 * - generateQa - A function that generates Q&A pairs.
 * - GenerateQaInput - The input type for the generateQa function.
 * - GenerateQaOutput - The return type for the generateQa function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQaInputSchema = z.object({
  pdfSummary: z
    .string()
    .describe('A summary of the PDF content (in Turkish) to generate Q&A from.'),
});
export type GenerateQaInput = z.infer<typeof GenerateQaInputSchema>;

const QAPairSchema = z.object({
  question: z.string().describe('A question in Turkish related to the PDF summary.'),
  answer: z.string().describe('The answer to the question, in Turkish.'),
});

const GenerateQaOutputSchema = z.object({
  qaPairs: z.array(QAPairSchema).describe('An array of 3-5 question and answer pairs in Turkish.'),
});
export type GenerateQaOutput = z.infer<typeof GenerateQaOutputSchema>;

export async function generateQa(input: GenerateQaInput): Promise<GenerateQaOutput> {
  return generateQaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQaPrompt',
  input: {schema: GenerateQaInputSchema},
  output: {schema: GenerateQaOutputSchema},
  prompt: `You are an expert in creating educational content. Based on the following summary (in Turkish), generate 3 to 5 distinct question and answer pairs that would effectively test understanding of the material. 
The questions and answers MUST be in TURKISH.
The output MUST be a JSON array of objects, where each object has a "question" and an "answer" property.

Example of the required JSON output format (in Turkish):
{
  "qaPairs": [
    {
      "question": "Belgedeki ana zorluk nedir?",
      "answer": "Ana zorluk, mevcut altyapının artan talebi karşılayamamasıdır."
    },
    {
      "question": "Önerilen çözümün temel faydası nedir?",
      "answer": "Temel faydası, operasyonel verimliliği %20 artırmasıdır."
    }
  ]
}

PDF Summary (Özet):
{{{pdfSummary}}}

Question and Answer Pairs (JSON Array - in Turkish):
`,
});

const generateQaFlow = ai.defineFlow(
  {
    name: 'generateQaFlow',
    inputSchema: GenerateQaInputSchema,
    outputSchema: GenerateQaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.qaPairs) {
      throw new Error("Q&A generation did not produce valid data.");
    }
    return output;
  }
);
