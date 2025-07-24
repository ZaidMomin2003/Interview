'use server';
/**
 * @fileOverview A flow for conducting an AI-powered mock interview.
 */
import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
  InterviewTurnInput,
  InterviewTurnInputSchema,
  InterviewTurnOutput,
  InterviewTurnOutputSchema,
} from '@/ai/types/interview-types';
import wav from 'wav';

const systemPrompt = `You are "Alex", a friendly and professional AI interviewer for a top tech company called Talxify. Your goal is to conduct a realistic, conversational interview for the specified topic and difficulty.

- Start with a brief greeting.
- Ask one question at a time.
- Keep your questions concise and relevant to the interview topic ({{topic}}) and difficulty ({{difficulty}}).
- If the user's answer is very short or vague, ask a follow-up question to encourage them to elaborate.
- Maintain a conversational and encouraging tone.
- Do not greet the user again if there are previous messages in the history.
- After a few questions, you can wrap up the interview with a concluding statement.
`;

// This flow is designed to be non-streaming for simplicity in this implementation.
// A streaming implementation would provide better UX.
const interviewFlow = ai.defineFlow(
  {
    name: 'interviewFlow',
    inputSchema: InterviewTurnInputSchema,
    outputSchema: InterviewTurnOutputSchema,
  },
  async (input) => {
    // 1. Generate the text response from the conversational LLM.
    const llmResponse = await ai.generate({
      prompt: input.messages,
      system: systemPrompt,
      config: {
        temperature: 0.5,
      },
    });
    const responseText = llmResponse.text;

    // 2. Generate the audio from the text using a TTS model.
    const ttsResponse = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      prompt: responseText,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Alloy' },
          },
        },
      },
    });

    const audio = ttsResponse.media;
    if (!audio) {
      throw new Error('TTS service did not return audio.');
    }
    
    const audioBuffer = Buffer.from(audio.url.substring(audio.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);


    // 3. Return both the text and the audio data URI.
    return {
      text: responseText,
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

export async function conductInterview(
  input: InterviewTurnInput
): Promise<InterviewTurnOutput> {
  return interviewFlow(input);
}
