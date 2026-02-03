import { Product, RoomType, DesignStyle } from '@/types';

interface GeminiAnalysisResult {
  roomType: RoomType;
  detectedStyle: DesignStyle;
  dimensions: {
    estimatedWidth: number;
    estimatedLength: number;
  };
  existingFurniture: string[];
  suggestedFurniture: {
    category: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  colorPalette: string[];
  overallAssessment: string;
}

export async function analyzeRoomWithGemini(
  imageBase64: string,
  userPreferences?: {
    style?: DesignStyle;
    budget?: number;
  }
): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const prompt = `You are an expert interior designer. Analyze this room photo and provide recommendations.

${userPreferences?.style ? `User's preferred style: ${userPreferences.style}` : ''}
${userPreferences?.budget ? `User's budget: $${userPreferences.budget}` : ''}

Analyze the image and respond with ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "roomType": "bedroom" | "living_room" | "office" | "den" | "dining_room" | "kitchen",
  "detectedStyle": "contemporary" | "traditional" | "minimalist" | "modern",
  "dimensions": {
    "estimatedWidth": <number in feet>,
    "estimatedLength": <number in feet>
  },
  "existingFurniture": ["list of furniture already in the room"],
  "suggestedFurniture": [
    {
      "category": "sofa" | "bed" | "desk" | "chair" | "table" | "storage" | "lighting" | "rug" | "nightstand" | "dresser" | "bookshelf",
      "reason": "why this furniture would improve the room",
      "priority": "high" | "medium" | "low"
    }
  ],
  "colorPalette": ["hex colors that would complement the room"],
  "overallAssessment": "Brief 2-3 sentence assessment of the room and design direction"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();

  const candidate = data.candidates?.[0];
  const textContent = candidate?.content?.parts?.[0]?.text;
  const finishReason = candidate?.finishReason;

  if (!textContent) {
    throw new Error('No response from Gemini');
  }

  // Check if response was truncated
  if (finishReason === 'MAX_TOKENS') {
    console.warn('Gemini response was truncated due to max tokens');
  }

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = textContent;
  if (textContent.includes('```json')) {
    jsonStr = textContent.split('```json')[1].split('```')[0];
  } else if (textContent.includes('```')) {
    jsonStr = textContent.split('```')[1].split('```')[0];
  }

  // Try to extract JSON object if there's extra text
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  try {
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    // If JSON is truncated, try to repair it by closing unclosed strings and brackets
    console.error('Failed to parse Gemini response, attempting repair:', textContent);

    let repairedJson = jsonStr.trim();

    // Check if we're in the middle of a string (odd number of unescaped quotes)
    const quoteCount = (repairedJson.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      repairedJson += '"';
    }

    // Count and close unclosed brackets
    const openBraces = (repairedJson.match(/\{/g) || []).length;
    const closeBraces = (repairedJson.match(/\}/g) || []).length;
    const openBrackets = (repairedJson.match(/\[/g) || []).length;
    const closeBrackets = (repairedJson.match(/\]/g) || []).length;

    // Close arrays first, then objects
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      repairedJson += ']';
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      repairedJson += '}';
    }

    try {
      return JSON.parse(repairedJson);
    } catch (e2) {
      console.error('JSON repair failed:', repairedJson);
      throw new Error('Failed to parse AI response');
    }
  }
}

export function matchFurnitureToSuggestions(
  suggestions: GeminiAnalysisResult['suggestedFurniture'],
  products: Product[],
  budget: number,
  style: DesignStyle
): Product[] {
  const matched: Product[] = [];

  for (const suggestion of suggestions) {
    // Find products matching the suggested category
    const categoryMatches = products.filter(
      (p) =>
        p.category === suggestion.category &&
        (budget === 0 || p.price <= budget / suggestions.length) &&
        p.styles.includes(style)
    );

    if (categoryMatches.length > 0) {
      // Sort by price and pick the best match
      const sorted = categoryMatches.sort((a, b) => {
        // Prefer products that match more styles
        const aStyleMatch = a.styles.filter((s) => s === style).length;
        const bStyleMatch = b.styles.filter((s) => s === style).length;
        if (aStyleMatch !== bStyleMatch) return bStyleMatch - aStyleMatch;

        // Then by price (mid-range preferred)
        return a.price - b.price;
      });

      matched.push(sorted[0]);
    }
  }

  return matched;
}
