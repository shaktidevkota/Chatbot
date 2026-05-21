import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); 


app.post('/api', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
     body: JSON.stringify({
  model: 'gpt-3.5-turbo',
messages: [
  {
    role: 'system',
    content: 'You are Nepal AI Legal Assistant, an expert in Nepalese law. Provide clear, accurate, and respectful answers based on Nepal’s legal system, including acts, constitutional provisions, and common legal practices.'
  },
  ...req.body.history,
  { role: 'user', content: prompt }
]

})

    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.';
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: 'Sorry, something went wrong connecting to OpenRouter.' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
