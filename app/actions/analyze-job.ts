"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

export interface AnalyzeJobResponse {
  matchScore: number
  missingKeywords: string[]
  improvementTips: string[]
}

export async function analyzeJobDescription(
  jobDescription: string,
  resumeText: string
): Promise<AnalyzeJobResponse> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables")
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `Here is a Job Description: ${jobDescription}

Here is a Candidate Resume: ${resumeText}

Compare them. Return JSON with:

matchScore (0-100)
missingKeywords (list of technical skills missing in resume)
improvementTips (how to tailor the resume for this specific job).

Return only valid JSON in this exact format:
{
  "matchScore": 75,
  "missingKeywords": ["keyword1", "keyword2"],
  "improvementTips": ["tip1", "tip2"]
}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    
    // Extract JSON from the response (handle cases where it might be wrapped in markdown code blocks)
    let jsonText = text.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\n?/, "").replace(/\n?```$/, "")
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\n?/, "").replace(/\n?```$/, "")
    }
    
    // Parse the JSON response
    const parsed = JSON.parse(jsonText.trim())
    
    // Validate and return the response
    return {
      matchScore: typeof parsed.matchScore === "number" ? Math.max(0, Math.min(100, parsed.matchScore)) : 0,
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      improvementTips: Array.isArray(parsed.improvementTips) ? parsed.improvementTips : []
    }
  } catch (error) {
    console.error("Error analyzing job description:", error)
    throw new Error("Failed to analyze job description. Please try again.")
  }
}

