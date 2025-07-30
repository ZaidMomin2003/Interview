// src/ai/flows/interview-stream-flow.ts
'use server';
/**
 * @fileOverview A flow for handling a real-time, streaming mock interview session.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

// Define the schema for a single message in the conversation history
const InterviewMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type InterviewMessage = z.infer<typeof InterviewMessageSchema>;

// Define the input for the streaming flow
const InterviewStreamInputSchema = z.object({
  history: z.array(InterviewMessageSchema),
  role: z.string().describe("The job role the user is interviewing for."),
  level: z.string().describe("The seniority level of the role."),
});
export type InterviewStreamInput = z.infer<typeof InterviewStreamInputSchema>;

const interviewPrompt = ai.definePrompt({
  name: 'interviewContinuationPrompt',
  input: { schema: InterviewStreamInputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  messages: [
    {
      role: 'system',
      content: `You are an expert AI interviewer conducting a realistic, challenging, and conversational mock interview.
      Role: {{role}}
      Level: {{level}}
      
      Instructions:
      1.  **Be Conversational**: Do not just list questions. Engage with the user's answers. Ask follow-up questions. Provide brief, encouraging feedback like "That's a great example." or "Interesting, could you elaborate on that?".
      2.  **Mix Question Types**: Ask a blend of technical and behavioral questions relevant to the specified role and level.
      3.  **Keep it Moving**: Ask one question at a time. Wait for the user's response before proceeding.
      4.  **Stay in Character**: You are an interviewer. Do not break character. Do not say "As an AI...".
      5.  **Start the Interview**: Begin by introducing yourself briefly and stating the purpose of the interview. Then, ask the first question.
      
      {{#if history}}
      Conversation History:
      {{#each history}}
      {{#if (eq this.role "user")}}User{{else}}You{{/if}}: {{this.content}}
      {{/each}}
      {{/if}}
      `,
    },
  ],
});

async function toWav(pcmData: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({
            channels: 1,
            sampleRate: 24000,
            bitDepth: 16,
        });

        const buffers: Buffer[] = [];
        writer.on('data', (chunk) => buffers.push(chunk));
        writer.on('end', () => resolve(Buffer.concat(buffers)));
        writer.on('error', reject);

        writer.end(pcmData);
    });
}

const interviewStreamFlow = ai.defineFlow(
  {
    name: 'interviewStreamFlow',
    inputSchema: InterviewStreamInputSchema,
    outputSchema: z.string(),
    stream: z.object({
      chunk: z.string(),
      type: z.enum(['text', 'audio']),
    }),
  },
  async (input, streamingCallback) => {
    // 1. Get the text response stream from the LLM
    const { stream: llmStream } = await ai.generateStream({
        prompt: await interviewPrompt(input),
        streamingCallback: (chunk) => {
             // Immediately send text chunks back to the client
            streamingCallback({ chunk: chunk.text, type: 'text' });
        }
    });

    // 2. Convert the full text response to audio and stream it
    const ttsResponse = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: await llmStream.text(),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
    });

    if (ttsResponse.media) {
        const audioBuffer = Buffer.from(
            ttsResponse.media.url.substring(ttsResponse.media.url.indexOf(',') + 1),
            'base64'
        );
        const wavBuffer = await toWav(audioBuffer);
        
        // Stream audio in chunks
        const chunkSize = 4096;
        for (let i = 0; i < wavBuffer.length; i += chunkSize) {
            const chunk = wavBuffer.slice(i, i + chunkSize);
            streamingCallback({ chunk: chunk.toString('base64'), type: 'audio' });
        }
    }
    
    return llmStream.text();
  }
);


export async function interviewStream(
  input: InterviewStreamInput,
  streamingCallback: (chunk: { chunk: string; type: 'text' | 'audio' }) => void
): Promise<string> {
  return interviewStreamFlow(input, streamingCallback);
}
