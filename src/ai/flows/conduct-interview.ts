'use server';
/**
 * @fileOverview A conversational AI agent for conducting mock interviews.
 *
 * - conductInterview - A function that handles a single turn in the interview.
 * - InterviewTurnInput - The input type for the conductInterview function.
 * - InterviewTurnOutput - The return type for the conductInterview function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import wav from 'wav';

export const InterviewMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type InterviewMessage = z.infer<typeof InterviewMessageSchema>;

export const InterviewTurnInputSchema = z.object({
  topic: z.string().describe('The main topic for the interview (e.g., System Design, React).'),
  difficulty: z
    .string()
    .describe(
      'The difficulty level of the interview (e.g., entry-level, senior).'
    ),
  messages: z
    .array(InterviewMessageSchema)
    .describe('The history of the conversation so far.'),
});
export type InterviewTurnInput = z.infer<typeof InterviewTurnInputSchema>;

export const InterviewTurnOutputSchema = z.object({
  audioDataUri: z.string().describe('The base64 encoded data URI of the generated audio response.'),
  text: z.string().describe('The text content of the AI\'s response.'),
});
export type InterviewTurnOutput = z.infer<typeof InterviewTurnOutputSchema>;


export async function conductInterview(
  input: InterviewTurnInput
): Promise<InterviewTurnOutput> {
  return conductInterviewFlow(input);
}


// Define the main prompt for the interviewer AI
const interviewPrompt = ai.definePrompt({
  name: 'interviewPrompt',
  input: {schema: InterviewTurnInputSchema},
  // We use Gemini 1.5 Pro for its advanced reasoning and conversational capabilities.
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an expert technical interviewer conducting a mock interview.

Your goal is to assess the candidate's skills and problem-solving abilities for a {{difficulty}} role, focusing on the topic of "{{topic}}".

Follow these instructions:
1.  Start the conversation by introducing yourself and stating the purpose of the interview.
2.  Ask a total of 5 questions throughout the entire conversation.
3.  Keep the interview concise, aiming for a total duration of 5-10 minutes. This means your questions and follow-ups should be direct and to the point.
4.  To make the conversation feel natural, you can use conversational markers like (laughs), (coughs), or (clears throat) in your response. These will be converted to audio. Use them sparingly.
5.  After the user answers the final question, end the interview professionally by saying "That's all the questions I have. Thank you for your time.". Do not say anything else after this concluding phrase.

Here is the conversation history so far:
{{#each messages}}
  {{#if (eq this.role 'model')}}
    Interviewer: {{{this.content}}}
  {{else}}
    Candidate: {{{this.content}}}
  {{/if}}
{{/each}}
`,
});


async function textToSpeech(text: string) {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
           multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Interviewer',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
               {
                speaker: 'Candidate',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Achernar' },
                },
              },
            ],
          },
        },
      },
      prompt: `Interviewer: ${text}`,
    });

    if (!media?.url) {
      throw new Error('TTS service failed to generate audio.');
    }
    
    const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
    );
    const wavData = await toWav(audioBuffer);
    return 'data:audio/wav;base64,' + wavData;
}


const conductInterviewFlow = ai.defineFlow(
  {
    name: 'conductInterviewFlow',
    inputSchema: InterviewTurnInputSchema,
    outputSchema: InterviewTurnOutputSchema,
  },
  async input => {
    // Generate the interviewer's text response.
    const llmResponse = await interviewPrompt(input);
    const responseText = llmResponse.text;

    if (!responseText) {
        throw new Error("The AI failed to generate a response.");
    }
    
    // Convert the text response to audio.
    const audioUri = await textToSpeech(responseText);
    
    return {
        audioDataUri: audioUri,
        text: responseText,
    };
  }
);


// Helper function to convert raw PCM audio data from Gemini to WAV format.
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
