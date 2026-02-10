
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const synthesizeProfile = async (rawText: string): Promise<UserProfile> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following resume or bio and synthesize it into a structured JSON profile for a premium dashboard. 
    
    CRITICAL: Create 4-5 "trajectory" points representing the user's professional journey. 
    Each point MUST have:
    - date: The year (e.g., "2024")
    - momentum: A growth score 0-100
    - title: A bold achievement or role change (e.g., "Launched AI Platform", "Senior Product Lead")
    - subtitle: Usually the company or institution
    - description: A concise one-sentence impact statement.
    
    Also include skills, experience, connections, and analysis.
    
    TEXT:
    ${rawText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personal: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              location: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ["name", "title", "location", "summary"]
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                period: { type: Type.STRING },
                impact: { type: Type.STRING },
              },
              required: ["company", "role", "period", "impact"]
            }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.NUMBER },
                surge: { type: Type.BOOLEAN },
                category: { type: Type.STRING },
              },
              required: ["name", "level", "surge", "category"]
            }
          },
          trajectory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                momentum: { type: Type.NUMBER },
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["date", "momentum", "title", "subtitle", "description"]
            }
          },
          connections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                type: { type: Type.STRING },
                strength: { type: Type.NUMBER },
                roleHistory: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                sharedConnections: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["name", "role", "type", "strength", "roleHistory", "sharedConnections"]
            }
          },
          analysis: {
            type: Type.OBJECT,
            properties: {
              salaryEstimate: { type: Type.STRING },
              wellBeingMetric: { type: Type.NUMBER },
              educationDeepDive: { type: Type.STRING },
              marketFit: { type: Type.STRING },
            },
            required: ["salaryEstimate", "wellBeingMetric", "educationDeepDive", "marketFit"]
          }
        },
        required: ["personal", "experience", "skills", "trajectory", "connections", "analysis"]
      }
    }
  });

  const profile = JSON.parse(response.text || "{}");
  return profile as UserProfile;
};
