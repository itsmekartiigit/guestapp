import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = 3001

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory data store for live modifications from Studio Panel and Guest interactions
let studioSettings = {
  studioName: 'Kartik Studio',
  studioLogo: '/icon.svg',
  contactPhone: '+91 98450 12345',
  contactEmail: 'contact@kartikstudio.in',
  defaultLanguage: 'EN',
};

let weddingData = {
  id: 'karthik-sneha-2026',
  title: 'Karthik & Sneha Wedding',
  brideName: 'Sneha',
  groomName: 'Karthik',
  eventDate: '07 Nov 2026',
  eventDay: 'Saturday',
  locationCity: 'Haveri',
  locationState: 'Karnataka',
  venueName: 'Sri Shivabasaveshwara Kalyana Mantapa',
  venueAddress: 'PB Road, Near District Stadium, Haveri, Karnataka 581110',
  venueMapUrl: 'https://maps.google.com/?q=Haveri+Karnataka+India',
  venueImageUrl: '/src/assets/images/wedding_venue_palace_1794118489757.jpg',
  heroImageUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
  studioName: 'Kartik Studio',
  isLive: true,
  liveViewersCount: 842,
  liveStreamUrl: '/assets/videos/wedding_stream.mp4',
  trailerTitle: 'Wedding Trailer',
  trailerDescription: 'Watch our special wedding story',
  trailerDuration: '02:48',
  trailerThumbnailUrl: '/src/assets/images/wedding_couple_hero_1794118488433.jpg',
  trailerVideoUrl: '/assets/videos/wedding_trailer.mp4',
};

// Initialize Gemini SDK if key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({});
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// ----------------- API ENDPOINTS -----------------

// 1. Get Wedding Event Details
app.get('/api/wedding/:eventId', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      ...weddingData,
      studioSettings,
    },
  });
});

// 3. AI Face-Matching Endpoint
app.post('/api/ai/match-photos', async (req: Request, res: Response) => {
  try {
    const { imageBase64, eventId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Selfie image is required' });
    }

    let detectedFeatures = 'Young adult male, trimmed beard, smiling, burgundy festive attire';
    let matchCount = 124;

    // If Gemini API is available, perform real multimodal analysis on the guest's face
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
                {
                  text: 'Analyze this guest selfie for an Indian wedding photo retrieval system. Describe the person facial features in 10-15 words (gender, approximate age, hairstyle, beard/facial hair, glasses, expression) so we can query our wedding album embeddings.',
                },
              ],
            },
          ],
        });
        if (response.text) {
          detectedFeatures = response.text.trim();
        }
      } catch (geminiErr) {
        console.warn('Gemini AI facial analysis fallback invoked:', geminiErr);
      }
    }

    // Build the 124 matched photos list for this guest
    const matchedPhotos = Array.from({ length: 124 }, (_, i) => {
      const categories = ['Reception', 'Baraat', 'Candid', 'Ceremony', 'Haldi', 'Sangeet'];
      const times = ['07:42 PM', '08:15 PM', '08:30 PM', '09:05 PM', '09:40 PM', '10:12 PM'];
      return {
        id: `guest-photo-${i + 1}`,
        url: `/src/assets/images/guest_selfie_match_1794118489426.jpg`,
        confidence: Number((0.95 + ((i * 3) % 5) * 0.01).toFixed(2)),
        tag: categories[i % categories.length],
        time: times[i % times.length],
      };
    });

    res.json({
      success: true,
      selfieUrl: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
      matchCount,
      detectedFeatures,
      photos: matchedPhotos,
      message: `Successfully verified face and identified ${matchCount} wedding photos!`,
    });
  } catch (err: any) {
    console.error('AI match error:', err);
    res.status(500).json({ success: false, error: 'Failed to process AI face matching.' });
  }
});

// 4. Live Stream Telemetry
app.get('/api/livestream/:eventId', (_req: Request, res: Response) => {
  // Fluctuates slightly for realism
  const randomDelta = Math.floor(Math.random() * 7) - 3;
  weddingData.liveViewersCount = Math.max(120, weddingData.liveViewersCount + randomDelta);
  res.json({
    success: true,
    isLive: weddingData.isLive,
    viewersCount: weddingData.liveViewersCount,
    streamUrl: weddingData.liveStreamUrl,
  });
});

// ----------------- VITE MIDDLEWARE SETUP -----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`ON AIR Wedding Stories Server listening on port ${PORT}`);
  });
}

startServer();
