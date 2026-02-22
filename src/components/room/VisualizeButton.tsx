'use client';

import { useRoomStore } from '@/store/roomStore';
import { buildVisualizationPrompt, buildVisualizationPromptWithPhoto } from '@/lib/imagen';
import Button from '@/components/ui/Button';
import { Sparkles, Loader2 } from 'lucide-react';

interface VisualizeButtonProps {
  onComplete: () => void;
}

export default function VisualizeButton({ onComplete }: VisualizeButtonProps) {
  const {
    roomConfig,
    furniture,
    isVisualizationLoading,
    setGeneratedImageUrl,
    setIsVisualizationLoading,
    setVisualizationError,
  } = useRoomStore();

  const handleVisualize = async () => {
    if (furniture.length === 0 || isVisualizationLoading) return;

    setIsVisualizationLoading(true);
    setVisualizationError(null);

    try {
      const hasPhoto = !!roomConfig.photoUrl;
      const prompt = hasPhoto
        ? buildVisualizationPromptWithPhoto(roomConfig, furniture)
        : buildVisualizationPrompt(roomConfig, furniture);

      const body: { prompt: string; referenceImage?: string } = { prompt };
      if (hasPhoto && roomConfig.photoUrl) {
        body.referenceImage = roomConfig.photoUrl;
      }

      const response = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Visualization failed');
      }

      const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;
      setGeneratedImageUrl(dataUrl);
      onComplete();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Visualization failed';
      setVisualizationError(message);
      alert(message);
    } finally {
      setIsVisualizationLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleVisualize}
      disabled={furniture.length === 0 || isVisualizationLoading}
    >
      {isVisualizationLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Visualize Room
        </>
      )}
    </Button>
  );
}
