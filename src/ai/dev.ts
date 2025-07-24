import { config } from 'dotenv';
config();

// This file is used for local development with `genkit start`.
// It imports all the flows so they are available in the developer UI.
import './flows/calculate-salary';
import './flows/conduct-interview';
import './flows/enhance-resume-section';
import './flows/generate-coding-question';
import './flows/generate-notes';
import './flows/generate-resume';
import './flows/get-code-feedback';
import './flows/optimize-resume';
import './flows/summarize-interview';
