const express = require("express")
const router = express.Router()
const axios = require("axios")

router.post("/", async (req, res) => {
  try {
    const { message } = req.body

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "system",
            content:
              "You are a helpful Nepal legal assistant. Give simple legal explanations.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    res.json({
      response: response.data.choices[0].message.content,
    })
  } catch (error) {
    console.log(error.response?.data || error.message)

    res.status(500).json({
      error: "Something went wrong",
    })
  }
})

module.exports = router