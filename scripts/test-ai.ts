import { config } from 'dotenv';
import { resolve } from 'path';

// 1. Environment Variables Load karein (.env.local se)
config({ path: resolve(__dirname, '../.env.local') });

// Note: Agar aapka analyzeJob file 'use server' use karta hai, 
// toh hum usse seedha yahan import nahi kar sakte bina build ke.
// Isliye hum yahan Gemini ka direct test likhenge taaki API Key aur Logic check ho jaye.

import { GoogleGenerativeAI } from "@google/generative-ai";

async function testGemini() {
  console.log("🤖 Starting AI Test...");

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY nahi mili! .env.local check karein.");
    return;
  }

  try {
    // 2. Client Initialize karein
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Mock Data (Nakli JD aur Resume)
    const jobDescription = "We need a Senior React Developer with experience in Next.js, TypeScript, and Tailwind CSS.";
    const resumeText = "I am a Fresher developer. I know HTML, CSS, and basic JavaScript. I have never used React.";

    console.log("\n📄 Sending Data to Gemini...");
    
    // 4. Prompt bhejein
    const prompt = `
      Job Description: ${jobDescription}
      Resume: ${resumeText}
      
      Compare them and return a JSON response with:
      - matchScore (number 0-100)
      - missingKeywords (array of strings)
      - improvementTips (array of strings)
      
      RETURN JSON ONLY.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. Result Print karein
    console.log("\n✅ AI Response Received:");
    console.log("------------------------------------------------");
    console.log(text);
    console.log("------------------------------------------------");
    console.log("🎉 Test Passed! API Key is working.");

  } catch (error: any) {
    console.error("\n❌ Test Failed!");
    console.error("Error Message:", error.message);
  }
}

testGemini();