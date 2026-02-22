import { NextRequest, NextResponse } from 'next/server';
import { generateRoomImage } from '@/lib/imagen';

export async function POST(request: NextRequest) {
  try {
    const { prompt, referenceImage } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' },
        { status: 400 }
      );
    }

    // Strip data URL prefix if present
    const cleanRef = referenceImage
      ? referenceImage.replace(/^data:image\/\w+;base64,/, '')
      : undefined;

    const result = await generateRoomImage(prompt, cleanRef);

    return NextResponse.json({
      success: true,
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
    });
  } catch (error) {
    console.error('Visualization error:', error);

    const message = error instanceof Error ? error.message : 'Visualization failed';
    const status = message.includes('Rate limit') ? 429 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
