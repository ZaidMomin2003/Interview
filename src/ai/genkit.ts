// src/ai/genkit.ts
import {genkit, GenkitError, type Plugin} from 'genkit';
import {googleAI, type GoogleAIPlugin} from '@genkit-ai/googleai';
import * as dotenv from 'dotenv';

dotenv.config();

// A type guard to check if an object is a GoogleAIPlugin.
function isGoogleAIPlugin(plugin: Plugin<any>): plugin is GoogleAIPlugin {
  return (plugin as GoogleAIPlugin).name === 'googleai';
}

function configureGoogleAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GenkitError({
      source: 'config',
      status: 'unavailable',
      message: 'GEMINI_API_KEY environment variable is not defined',
    });
  }
  return googleAI({apiKey});
}

// Export the initialized instance for immediate use in flows.
export const ai = genkit({
    plugins: [configureGoogleAI()],
    enableTracingAndMetrics: true,
});
