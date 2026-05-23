import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log('KEY:', process.env.OPENROUTER_API_KEY);

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api', async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));