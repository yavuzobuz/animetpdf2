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
  question: z.string().describe('A detailed question in Turkish related to the PDF summary.'),
  options: z.array(z.string()).describe('An array of 3-4 multiple choice options in Turkish.'),
  correctAnswerIndex: z.number().describe('The 0-based index of the correct answer in the options array.'),
  explanation: z.string().describe('A comprehensive and detailed explanation for the correct answer, in Turkish. Should be at least 2-3 sentences long and provide educational value.'),
});
export type QAPair = z.infer<typeof QAPairSchema>;


const GenerateQaOutputSchema = z.object({
  qaPairs: z.array(QAPairSchema).min(5).max(20).describe('An array of 5-20 multiple-choice question and answer pairs in Turkish. Each pair includes a question, 3-4 options, the index of the correct answer, and a detailed explanation for the correct answer.'),
});
export type GenerateQaOutput = z.infer<typeof GenerateQaOutputSchema>;

export async function generateQa(input: GenerateQaInput): Promise<GenerateQaOutput> {
  return generateQaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQaPrompt',
  input: {schema: GenerateQaInputSchema},
  output: {schema: GenerateQaOutputSchema},
  prompt: `You are an expert in creating comprehensive educational content. Based on the following summary (in Turkish), generate **5 to 20** distinct multiple-choice question and answer pairs that would effectively test understanding of the material. The number of questions should be determined by the complexity and length of the content - more complex topics should have more questions (up to 20), simpler topics should have fewer (minimum 5).

Each Q&A pair MUST be in TURKISH and follow these guidelines:
- Questions should be detailed and thought-provoking
- Explanations must be comprehensive (at least 2-3 sentences) and educational
- Cover different aspects and difficulty levels of the material
- Include both factual recall and conceptual understanding questions

The output MUST be a JSON object containing a "qaPairs" array. Each object in the "qaPairs" array must have the following properties:
1.  "question": A detailed string representing the question in Turkish.
2.  "options": An array of 3 or 4 strings, representing the multiple-choice options in Turkish.
3.  "correctAnswerIndex": A number (0-based index) indicating which option in the "options" array is the correct answer.
4.  "explanation": A comprehensive string (2-3+ sentences) providing detailed explanation for why the correct answer is correct, in Turkish. This should be educational and help reinforce learning.

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
      "explanation": "Belgede, verimliliği artırmak ve ölçeklenebilirliği sağlamak amacıyla bulut tabanlı altyapı çözümlerine geçişin önemi vurgulanmaktadır. Bu teknolojik dönüşüm, şirketlerin operasyonel maliyetlerini düşürürken aynı zamanda daha esnek ve güvenilir bir IT altyapısı kurmasına olanak tanımaktadır. Bulut teknolojileri sayesinde şirketler, değişen iş gereksinimlerine daha hızlı adapte olabilir ve rekabet avantajı elde edebilirler."
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
      "explanation": "Yeni strateji, şirketin büyüme hedefleri doğrultusunda yeni pazarlara daha etkin bir şekilde ulaşmasını amaçlamaktadır. Bu stratejik yaklaşım, mevcut ürün portföyünün genişletilmesi ve farklı coğrafi bölgelerdeki müşteri segmentlerine hitap edecek özelleştirilmiş çözümler geliştirilmesini içermektedir. Böylece şirket, gelir kaynaklarını çeşitlendirerek daha sürdürülebilir bir büyüme modeli oluşturmayı hedeflemektedir."
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
