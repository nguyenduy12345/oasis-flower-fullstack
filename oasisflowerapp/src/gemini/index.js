import { GoogleGenerativeAI } from "@google/generative-ai"
  
  const apiKey = 'AIzaSyAUKOp2rpKaazPKaPcyt6K3eFVKT0--IN0';
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
const run = async(text) => {
    const chatSession = model.startChat({
      generationConfig,
    });
  
    const result = await chatSession.sendMessage(text);
    return result.response.text();
  }

export default run