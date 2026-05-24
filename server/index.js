import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://chatbot-sand-sigma-94.vercel.app', 'http://localhost:5173']
}));

app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error('Missing OPENROUTER_API_KEY in environment. Create server/.env with OPENROUTER_API_KEY=your_key');
}

app.post('/api', async (req, res) => {
  const prompt = req.body.prompt;
  const history = req.body.history || [];

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ reply: 'Server missing OPENROUTER_API_KEY. Please configure the .env file.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Nepal AI Legal Assistant, an expert in Nepalese law. Provide clear, accurate, and respectful answers based on Nepal\'s legal system, including acts, constitutional provisions, and common legal practices.'
          },
          ...history,
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      return res.status(response.status).json({ reply: 'AI service returned an error.' });
    }

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data));
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.';
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Sorry, something went wrong.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));