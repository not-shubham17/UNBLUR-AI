import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to Base64
export const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 1. Chat with Thinking Mode
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    },
  });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "No response text found.";
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

// 2. Image Analysis
export const analyzeImage = async (file: File, prompt: string): Promise<string> => {
  try {
    const imagePart = await fileToPart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};

// 3. Image Generation (Pro Image)
export const generateImage = async (prompt: string, aspectRatio: AspectRatio, imageSize: ImageSize): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
};

// 4. Image Editing (Flash Image)
export const editImage = async (file: File, prompt: string): Promise<string> => {
  try {
    const imagePart = await fileToPart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, { text: prompt }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image returned.");
  } catch (error) {
    console.error("Edit error:", error);
    throw error;
  }
};

// 5. Unblur & Upscale (Pro Image for 4K)
export const upscaleAndUnblur = async (file: File, intensity: number = 75): Promise<string> => {
  try {
    const imagePart = await fileToPart(file);
    
    let strengthDesc = "balanced";
    if (intensity < 30) strengthDesc = "subtle and natural";
    else if (intensity > 80) strengthDesc = "extreme and ultra-sharp";
    else strengthDesc = "strong and distinct";

    const promptText = `Fix blur, remove noise, and upscale this image to high fidelity 4K resolution. 
    Enhancement Intensity: ${intensity}%. 
    Apply a ${strengthDesc} level of sharpening and detail restoration. 
    Ensure the subject remains faithful to the original but significantly clearer.`;

    // We use the Pro model to access 4K output capabilities
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          imagePart, 
          { text: promptText }
        ],
      },
      config: {
        imageConfig: {
          imageSize: ImageSize.SIZE_4K,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No upscaled image returned.");
  } catch (error) {
    console.error("Upscale error:", error);
    throw error;
  }
};