import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Initialize the model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant", // Changed from modelName to model
  temperature: 0.7,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a professional sports expert. Answer ONLY sports-related questions. If the question is not about sports, politely refuse."],
      ["user", "{input}"],
    ]);

    // Use a pipe to include the output parser for a clean string response
    const outputParser = new StringOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);
    
    const reply = await chain.invoke({
      input: message,
    });

    return res.status(200).json({
      reply: reply, // This will now be a direct string
    });
    
  } catch (err) {
    console.error("LangChain/Groq Error:", err);
    return res.status(500).json({
      error: err.message || "An error occurred",
    });
  }
}