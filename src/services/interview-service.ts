// src/services/interview-service.ts
import WebSocket from 'ws';
import { createClient } from '@deepgram/sdk';
import { interviewStream } from '../ai/flows/interview-stream-flow';
import type { InterviewMessage } from '../ai/flows/interview-stream-flow';

const wss = new WebSocket.Server({ port: 3001 });
console.log('WebSocket server started on port 3001');

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || '');

wss.on('connection', (ws) => {
    console.log('Client connected');

    const deepgramConnection = deepgram.listen.live({
        model: 'nova-2',
        smart_format: true,
        language: 'en-US',
        puncutate: true,
    });

    let history: InterviewMessage[] = [];

    deepgramConnection.on('open', () => {
        console.log('Deepgram connection opened');

        deepgramConnection.on('transcript', (data) => {
            const transcript = data.channel.alternatives[0].transcript;
            if (transcript) {
                console.log('User transcript:', transcript);
                ws.send(JSON.stringify({ type: 'transcript', text: transcript }));
            }
        });

        deepgramConnection.on('close', () => {
            console.log('Deepgram connection closed');
        });
        
        deepgramConnection.on('error', (error) => {
            console.error('Deepgram error:', error);
        });

        ws.on('message', async (message: WebSocket.Data) => {
             if (typeof message === 'string') {
                // Handle text messages (e.g., initial setup)
                try {
                    const parsed = JSON.parse(message);
                    if (parsed.type === 'start_interview') {
                        history = []; // Reset history
                        
                        ws.send(JSON.stringify({ type: 'ai_response_start' }));
                        
                        const fullResponse = await interviewStream({
                            role: parsed.role || "Software Engineer",
                            level: parsed.level || "Mid-Level",
                            history: [],
                        }, (chunk) => {
                             if (chunk.type === 'text') {
                                ws.send(JSON.stringify({ type: 'ai_text_chunk', chunk: chunk.chunk }));
                            } else if (chunk.type === 'audio') {
                                ws.send(JSON.stringify({ type: 'ai_audio_chunk', chunk: chunk.chunk }));
                            }
                        });

                        history.push({ role: 'model', content: fullResponse });
                        ws.send(JSON.stringify({ type: 'ai_response_end', fullText: fullResponse }));
                    }
                } catch(e) { /* Not a JSON message, likely audio */ }

            } else if (message instanceof Buffer) {
                // Forward audio buffer to Deepgram
                deepgramConnection.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        deepgramConnection.finish();
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        deepgramConnection.finish();
    });
});
