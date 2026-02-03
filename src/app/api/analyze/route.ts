import { NextRequest, NextResponse } from 'next/server';
import { analyzeRoomWithGemini, matchFurnitureToSuggestions } from '@/lib/gemini';
import { sampleProducts } from '@/data/sampleProducts';
import { DesignStyle } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { image, preferences } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Analyze with Gemini
    const analysis = await analyzeRoomWithGemini(base64Data, preferences);

    // Match furniture suggestions to real products
    const style = preferences?.style || analysis.detectedStyle;
    const budget = preferences?.budget || 5000;

    const recommendedProducts = matchFurnitureToSuggestions(
      analysis.suggestedFurniture,
      sampleProducts,
      budget,
      style as DesignStyle
    );

    return NextResponse.json({
      success: true,
      analysis,
      recommendations: recommendedProducts,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}
