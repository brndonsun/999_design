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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
          maxOutputTokens: 2048,
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

  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('No response from Gemini');
  }

  // Parse JSON from response (handle potential markdown code blocks)
  let jsonStr = textContent;
  if (textContent.includes('```json')) {
    jsonStr = textContent.split('```json')[1].split('```')[0];
  } else if (textContent.includes('```')) {
    jsonStr = textContent.split('```')[1].split('```')[0];
  }

  try {
    return JSON.parse(jsonStr.trim());
  } catch (e) {
    console.error('Failed to parse Gemini response:', textContent);
    throw new Error('Failed to parse AI response');
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
