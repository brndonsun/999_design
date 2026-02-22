'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useRoomStore } from '@/store/roomStore';
import { buildVisualizationPrompt, buildVisualizationPromptWithPhoto } from '@/lib/imagen';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

interface VisualizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisualizationModal({
  isOpen,
  onClose,
}: VisualizationModalProps) {
  const {
    roomConfig,
    furniture,
    generatedImageUrl,
    isVisualizationLoading,
    setGeneratedImageUrl,
    setIsVisualizationLoading,
    setVisualizationError,
  } = useRoomStore();

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `room-visualization-${Date.now()}.png`;
    link.click();
  };

  const handleRegenerate = async () => {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Visualization failed';
      setVisualizationError(message);
    } finally {
      setIsVisualizationLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Room Visualization" size="xl">
      <div className="space-y-4">
        {isVisualizationLoading ? (
          <div className="w-full h-64 bg-slate-100 rounded-lg flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            <p className="text-slate-500 text-sm">Generating visualization...</p>
          </div>
        ) : generatedImageUrl ? (
          <img
            src={generatedImageUrl}
            alt="AI-generated room visualization"
            className="w-full rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-slate-100 rounded-lg flex items-center justify-center">
            <p className="text-slate-400">No image generated yet</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={handleRegenerate}
            disabled={isVisualizationLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={handleDownload} disabled={!generatedImageUrl || isVisualizationLoading}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
}
