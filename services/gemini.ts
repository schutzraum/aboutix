import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEventDescription = async (title: string, categories: string[], keywords: string): Promise<string> => {
  const ai = getAI();
  const categoryStr = categories.join(", ");
  const prompt = `Schreibe eine ansprechende, aufregende Event-Beschreibung für eine Veranstaltung namens "${title}". 
  Kategorie(n): ${categoryStr}. 
  Stichworte/Kontext: ${keywords}. 
  Die Beschreibung sollte einladend wirken, professionell sein und Lust auf das Event machen. 
  Halte dich an ca. 100-150 Wörter. Antworte direkt mit dem Text, ohne Markdown-Formatierung wie 'Here is the text'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating description:", error);
    throw error;
  }
};

export const generateEventImage = async (
  title: string, 
  categories: string[], 
  keywords: string = "",
  customInstruction: string = ""
): Promise<string> => {
  const ai = getAI();
  const categoryStr = categories.join(", ");
  
  // Revert to gemini-2.5-flash-image to avoid 403 Permission Denied on pro models
  const model = 'gemini-2.5-flash-image';

  // Construct a clean, positive prompt
  const visualPrompt = `
    Generate a high-quality 3D claymation style image (plasticine art).
    Subject: ${title} (${categoryStr}).
    ${keywords ? `Context: ${keywords}` : ''}
    ${customInstruction ? `Specific details: ${customInstruction}` : ''}
    
    Art Style: Detailed 3D Clay/Play-Doh style, soft cinematic lighting, depth of field, handcrafted texture look.
    Mood: Cheerful, positive, welcoming, colorful.
    Composition: Wide landscape format (16:9), scenic view.
    Constraints: No text, no letters, no words in the image. High resolution.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: visualPrompt,
      config: {
        imageConfig: {
            aspectRatio: "16:9"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Fallback: Check for text refusal/error from model and log it
    const textOutput = parts?.find(p => p.text)?.text;
    if (textOutput) {
        console.warn("Gemini returned text instead of image:", textOutput);
        throw new Error(`Model refused generation: ${textOutput.substring(0, 100)}...`);
    }

    throw new Error("No image data returned from API");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};