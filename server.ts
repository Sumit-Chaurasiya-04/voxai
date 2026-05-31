import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environmental variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing parser middleware
  app.use(express.json());

  // 1. Backend AI Endpoint: Refine script using Gemini 3.5 Flash
  app.post('/api/refine', async (req, res) => {
    const { prompt, originalText } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Instruction prompt is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Return a 404/fallback so the frontend falls back gracefully to local browser mock simulations
      return res.status(404).json({ error: 'Gemini API credential key is unconfigured.' });
    }

    try {
      // Initialize GoogleGenAI SDK securely
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemMessage = "You are a world-class professional script refurbisher. Make revisions precisely as requested. Return ONLY the finalized speech script text in natural reading quality. Do not surround it with markdown, quotes, prefixes, or dialogue.";
      const userPrompt = `Base Instruction: "${prompt}"\n\nOriginal Text:\n"${originalText || ''}"\n\nPlease output ONLY the refined plain text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemMessage,
          temperature: 0.7
        }
      });

      const refinedText = response.text?.trim() || originalText;
      return res.json({ refinedText });

    } catch (err: any) {
      console.error('Gemini API call failure:', err.message || err);
      return res.status(500).json({ error: 'Failed to access Gemini server streams.' });
    }
  });

  // 2. Integration / Client static asset router
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware so index.html works with hot modules & modules mapping
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite developer server middlewares mounted successfully.');
  } else {
    // Serve static client build files from local /dist directory
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static client build routing active.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express custom voice system booted on port: ${PORT}`);
  });
}

startServer();
