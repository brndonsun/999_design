import { RoomConfig, FurnitureItem } from '@/types';

const HEX_TO_COLOR: Record<string, string> = {
  '#f5f5f5': 'white',
  '#ffffff': 'white',
  '#d4a373': 'warm wood-tone brown',
  '#8b7355': 'medium brown wood',
  '#2c2c2c': 'dark charcoal',
  '#4a4a4a': 'dark gray',
  '#1a1a2e': 'dark navy',
  '#c9b99a': 'natural beige',
  '#e8d5b7': 'light natural wood',
  '#3a3a3a': 'matte black',
  '#f0f0f0': 'off-white',
  '#d4d4d4': 'light gray',
  '#8b4513': 'rich walnut brown',
  '#556b2f': 'olive green',
  '#708090': 'slate gray',
  '#deb887': 'warm tan',
};

function hexToColorName(hex: string): string {
  if (HEX_TO_COLOR[hex.toLowerCase()]) return HEX_TO_COLOR[hex.toLowerCase()];
  return hex;
}

function describeFurniture(item: FurnitureItem): string {
  const p = item.product;
  const color = p.color ? hexToColorName(p.color) : '';
  const dims = `${p.width}"W x ${p.depth}"D` + (p.height ? ` x ${p.height}"H` : '');
  const retailer = p.retailer.charAt(0).toUpperCase() + p.retailer.slice(1);

  let desc = `- ${p.name} (${retailer}): a ${p.category}`;
  if (color) desc += ` in ${color}`;
  desc += `, approximately ${dims}`;
  return desc;
}

const STYLE_DESCRIPTIONS: Record<string, string> = {
  contemporary: 'clean lines, neutral tones, subtle textures, and current design trends',
  traditional: 'classic elegance, ornate details, rich fabrics, and warm wood tones',
  minimalist: 'sparse, clutter-free, monochromatic palette, and only essential pieces',
  modern: 'bold geometric shapes, innovative materials, high contrast, and sleek finishes',
};

export function buildVisualizationPrompt(
  roomConfig: RoomConfig,
  furniture: FurnitureItem[]
): string {
  const style = roomConfig.style || 'modern';
  const roomType = (roomConfig.type || 'living_room').replace('_', ' ');
  const dims = roomConfig.dimensions;
  const styleDesc = STYLE_DESCRIPTIONS[style] || style;

  const furnitureDetails = furniture.map(describeFurniture).join('\n');

  const dimStr = dims
    ? `The room measures approximately ${dims.width}" wide by ${dims.length}" long${dims.height ? ` with ${dims.height}" ceilings` : ''}.`
    : '';

  return `Generate a photorealistic interior design photo of a fully-furnished ${style} ${roomType}. ${dimStr}

The room must contain ALL of these furniture pieces — every single item listed below should appear in the scene:
${furnitureDetails}

Do not omit any items. The room should feel fully furnished and lived-in, with each piece placed naturally. Match the described colors and proportions as closely as possible. Fill the space with appropriate accessories and decor (throw pillows, plants, artwork, curtains, decorative objects) to make the room feel complete and styled. Show the room from a natural eye-level corner perspective with warm, inviting natural light from windows. The result should look like a professional interior design magazine photograph — no text, no labels, no watermarks.`;
}

export function buildVisualizationPromptWithPhoto(
  roomConfig: RoomConfig,
  furniture: FurnitureItem[]
): string {
  const style = roomConfig.style || 'modern';
  const roomType = (roomConfig.type || 'living_room').replace('_', ' ');
  const styleDesc = STYLE_DESCRIPTIONS[style] || style;

  const furnitureDetails = furniture.map(describeFurniture).join('\n');

  return `Using the attached room photo as reference for the room's shape, layout, windows, and doors, generate a redesigned photorealistic version styled as a ${style} ${roomType}.

The target design style is ${style}: ${styleDesc}.

Replace the existing furniture with ALL of these pieces — every item listed must appear in the scene:
${furnitureDetails}

Do not omit any items. The room should feel fully furnished and complete. Add coordinating accessories and decor (throw pillows, plants, artwork, curtains, decorative objects) that complement the ${style} aesthetic. Keep the room's architecture (walls, windows, doors, floor plan) the same as the reference photo but completely update the furniture, decor, wall colors, and styling. Each piece must be clearly visible and match the described colors/proportions. Natural lighting, professional interior design magazine quality — no text, no labels, no watermarks.`;
}

export async function generateRoomImage(
  prompt: string,
  referenceImageBase64?: string
): Promise<{ imageBase64: string; mimeType: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const parts: Record<string, unknown>[] = [];

  if (referenceImageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: referenceImageBase64,
      },
    });
  }

  parts.push({ text: prompt });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini image generation error:', response.status, error);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(`Image generation failed: ${response.status}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];

    if (!candidate?.content?.parts) {
      throw new Error('No response from image generation');
    }

    // Find the image part in the response
    const imagePart = candidate.content.parts.find(
      (part: { inlineData?: { mimeType: string; data: string } }) => part.inlineData
    );

    if (!imagePart?.inlineData) {
      // Check if content was blocked
      const finishReason = candidate.finishReason;
      if (finishReason === 'SAFETY') {
        throw new Error('Image generation was blocked by content policy. Try adjusting your room design.');
      }
      throw new Error('No image was generated. The model returned text only.');
    }

    return {
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    };
  } finally {
    clearTimeout(timeout);
  }
}
