
'use server';
/**
 * @fileOverview Generates speech audio from text using Google Cloud Text-to-Speech.
 *
 * - generateSpeech - A function that converts text to speech audio.
 * - GenerateSpeechInput - The input type for the generateSpeech function.
 * - GenerateSpeechOutput - The return type for the generateSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {TextToSpeechClient, protos} from '@google-cloud/text-to-speech';

const GenerateSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  languageCode: z
    .string()
    .default('tr-TR')
    .describe('The language code for the speech (e.g., "tr-TR", "en-US").'),
  voiceName: z
    .string()
    .optional()
    .describe(
      'Optional. The specific voice name (e.g., "tr-TR-Wavenet-A"). If not provided, a default will be selected.'
    ),
});
export type GenerateSpeechInput = z.infer<typeof GenerateSpeechInputSchema>;

const GenerateSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The generated speech audio as a data URI. Expected format: 'data:audio/mp3;base64,<encoded_data>'."
    ),
});
export type GenerateSpeechOutput = z.infer<typeof GenerateSpeechOutputSchema>;

let client: TextToSpeechClient | null = null;

function getClient() {
  if (!client) {
    client = new TextToSpeechClient();
  }
  return client;
}

export async function generateSpeech(
  input: GenerateSpeechInput
): Promise<GenerateSpeechOutput> {
  return generateSpeechFlow(input);
}

const generateSpeechFlow = ai.defineFlow(
  {
    name: 'generateSpeechFlow',
    inputSchema: GenerateSpeechInputSchema,
    outputSchema: GenerateSpeechOutputSchema,
  },
  async (input: GenerateSpeechInput) => {
    const ttsClient = getClient();
    
    let defaultVoiceName = 'en-US-Wavenet-D';
    let ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender = 'NEUTRAL';

    if (input.languageCode === 'tr-TR') {
      defaultVoiceName = 'tr-TR-Wavenet-A'; // Female A, or D for different female voice
      ssmlGender = 'FEMALE';
    }

    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: {text: input.text},
      voice: {
        languageCode: input.languageCode,
        name: input.voiceName || defaultVoiceName,
        ssmlGender: ssmlGender,
      },
      audioConfig: {audioEncoding: 'MP3'},
    };

    try {
      const [response] = await ttsClient.synthesizeSpeech(request);
      if (!response.audioContent) {
        throw new Error('No audio content received from Text-to-Speech API.');
      }
      const audioBase64 = Buffer.from(
        response.audioContent as Uint8Array
      ).toString('base64');
      return {
        audioDataUri: `data:audio/mp3;base64,${audioBase64}`,
      };
    } catch (error) {
      console.error('Error calling Text-to-Speech API:', error);
      let detailedErrorMessage = 'Failed to generate speech. This often indicates a Google Cloud authentication or Text-to-Speech API configuration issue. Please check your Application Default Credentials, ensure the Text-to-Speech API is enabled in your GCP project, that billing is active, and the necessary IAM permissions are granted.';
      if (error instanceof Error && error.message) {
        detailedErrorMessage += ` Original error: ${error.message}`;
      } else if (typeof error === 'string') {
        detailedErrorMessage += ` Original error: ${error}`;
      }
      throw new Error(detailedErrorMessage);
    }
  }
);

