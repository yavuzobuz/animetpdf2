'use server';
/**
 * @fileOverview Generates multiple-choice question and answer pairs in Turkish based on a PDF summary.
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
  options: z.array(z.string()).describe('An array of 3-4 multiple choice options in Turkish.'),
  correctAnswerIndex: z.number().describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().describe('A brief explanation for the correct answer, in Turkish.'),
});
export type QAPair = z.infer<typeof QAPairSchema>;


const GenerateQaOutputSchema = z.object({
  qaPairs: z.array(QAPairSchema).describe('An array of 6-8 multiple-choice question and answer pairs in Turkish. Each pair includes a question, 3-4 options, the index of the correct answer, and an explanation for the correct answer.'),
});
export type GenerateQaOutput = z.infer<typeof GenerateQaOutputSchema>;

export async function generateQa(input: GenerateQaInput): Promise<GenerateQaOutput> {
  return generateQaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQaPrompt',
  input: {schema: GenerateQaInputSchema},
  output: {schema: GenerateQaOutputSchema},
  prompt: `You are an expert in creating educational content. Based on the following summary (in Turkish), generate **at least 6** (tercihen 6-8) distinct multiple-choice question and answer pairs that would effectively test understanding of the material.
Each Q&A pair MUST be in TURKISH.
The output MUST be a JSON object containing a "qaPairs" array. Each object in the "qaPairs" array must have the following properties:
1.  "question": A string representing the question in Turkish.
2.  "options": An array of 3 or 4 strings, representing the multiple-choice options in Turkish.
3.  "correctAnswerIndex": A number (0-based index) indicating which option in the "options" array is the correct answer.
4.  "explanation": A string providing a brief explanation for why the correct answer is correct, in Turkish.

Example of the required JSON output format (in Turkish):
{
  "qaPairs": [
    {
      "question": "Belgedeki ana teknolojik yenilik hangi alanda odaklanmaktadır?",
      "options": [
        "Veri analizi ve raporlama",
        "Müşteri ilişkileri yönetimi",
        "Bulut tabanlı altyapı çözümleri",
        "Mobil uygulama geliştirme"
      ],
      "correctAnswerIndex": 2,
      "explanation": "Belgede, verimliliği artırmak ve ölçeklenebilirliği sağlamak amacıyla bulut tabanlı altyapı çözümlerine geçişin önemi vurgulanmaktadır."
    },
    {
      "question": "Önerilen yeni stratejinin beklenen temel sonuçlarından biri nedir?",
      "options": [
        "Personel sayısını %15 azaltmak",
        "Yeni pazarlara açılmak",
        "Ürün geliştirme süresini kısaltmak",
        "Marka bilinirliğini artırmak"
      ],
      "correctAnswerIndex": 1,
      "explanation": "Yeni strateji, şirketin büyüme hedefleri doğrultusunda yeni pazarlara daha etkin bir şekilde ulaşmasını amaçlamaktadır."
    }
  ]
}

PDF Summary (Özet):
{{{pdfSummary}}}

Question and Answer Pairs (JSON Object with "qaPairs" array - in Turkish, strictly follow the format):
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
