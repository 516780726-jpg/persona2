
import { GoogleGenAI } from "@google/genai";

const PIXAR_PROMPT = `Transform the person in this photo into a high-quality 3D animated character avatar in the signature Pixar style. 
Key elements: 
- Large, expressive eyes with realistic reflections.
- Smooth, clean skin textures with subtle subsurface scattering.
- Distinctive, slightly exaggerated facial features that maintain the subject's likeness.
- Soft, cinematic lighting (Disney/Pixar style).
- Vibrant and rich color palette.
- Rendered in high-resolution 3D, similar to 'The Incredibles' or 'Toy Story 4'.
Ensure the character looks friendly and full of personality.`;

export const generatePixarAvatar = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: PIXAR_PROMPT,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error('未能从模型中提取到生成的图像。');
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(error.message || '生成头像时遇到了一些魔法故障，请重试！');
  }
};
