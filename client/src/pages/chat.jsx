import { useState } from "react"
import axios from "axios"

export default function Chat() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:5000/api/chat", {
      message,
    })

    setResponse(res.data.response)
  }

  return (
    <div className="p-10">
      <input
        className="border p-2 w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask legal question..."
      />

      <button
        onClick={sendMessage}
        className="bg-black text-white px-4 py-2 mt-3"
      >
        Send
      </button>

      <p className="mt-5">{response}</p>
    </div>
  )
}