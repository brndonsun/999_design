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

  const prompt = `You are an expert interior designer. Analyze this room photo and provide COMPREHENSIVE furniture recommendations to fully furnish the room.

${userPreferences?.style ? `User's preferred style: ${userPreferences.style}` : ''}
${userPreferences?.budget ? `User's budget: $${userPreferences.budget} - AIM TO USE MOST OF THIS BUDGET with quality furniture pieces.` : ''}

IMPORTANT: Suggest 8-12 furniture pieces to create a complete, well-furnished room. Include:
- Primary furniture (bed/sofa/desk depending on room type)
- Secondary furniture (nightstands, side tables, coffee tables)
- Storage (dressers, bookshelves, storage units)
- Seating (chairs, accent chairs)
- Lighting (floor lamps, table lamps)
- Rugs and decor items

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
}

Remember: Suggest 8-12 items to fully furnish the space!`;

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
  const usedIds = new Set<string>();
  let totalSpent = 0;
  const remainingBudget = () => budget === 0 ? Infinity : budget - totalSpent;

  // Sort suggestions by priority (high first)
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  for (const suggestion of sortedSuggestions) {
    // Find products matching the suggested category
    const categoryMatches = products.filter(
      (p) =>
        p.category === suggestion.category &&
        !usedIds.has(p.id) &&
        (budget === 0 || p.price <= remainingBudget()) &&
        p.styles.includes(style)
    );

    if (categoryMatches.length > 0) {
      // Sort by style match first, then prefer mid-to-higher price range to use budget
      const sorted = categoryMatches.sort((a, b) => {
        // Prefer products that match the style
        const aStyleMatch = a.styles.includes(style) ? 1 : 0;
        const bStyleMatch = b.styles.includes(style) ? 1 : 0;
        if (aStyleMatch !== bStyleMatch) return bStyleMatch - aStyleMatch;

        // Then prefer higher priced items (better quality) while staying in budget
        return b.price - a.price;
      });

      const selected = sorted[0];
      matched.push(selected);
      usedIds.add(selected.id);
      totalSpent += selected.price;
    }
  }

  // If we haven't used much of the budget, add more items
  // Target: use at least 60% of budget
  const targetSpend = budget === 0 ? Infinity : budget * 0.6;

  if (totalSpent < targetSpend) {
    // Get categories we might want to add more of
    const additionalCategories = ['lighting', 'chair', 'storage', 'rug', 'nightstand', 'bookshelf'];

    for (const category of additionalCategories) {
      if (totalSpent >= targetSpend) break;

      const availableInCategory = products.filter(
        (p) =>
          p.category === category &&
          !usedIds.has(p.id) &&
          (budget === 0 || p.price <= remainingBudget()) &&
          p.styles.includes(style)
      );

      if (availableInCategory.length > 0) {
        // Pick the best priced item that fits
        const sorted = availableInCategory.sort((a, b) => b.price - a.price);
        const toAdd = sorted[0];
        matched.push(toAdd);
        usedIds.add(toAdd.id);
        totalSpent += toAdd.price;
      }
    }
  }

  return matched;
}
