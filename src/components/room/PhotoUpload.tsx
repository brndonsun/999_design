'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PhotoUploadProps {
  onPhotoSelect: (base64: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  currentPhoto: string | null;
  onClear: () => void;
}

export default function PhotoUpload({
  onPhotoSelect,
  onAnalyze,
  isAnalyzing,
  currentPhoto,
  onClear,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onPhotoSelect(base64);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setShowCamera(true);

      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Could not access camera. Please upload a photo instead.');
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  }, [stream]);

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);

    onPhotoSelect(base64);
    stopCamera();
  };

  if (showCamera) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <Button variant="secondary" onClick={stopCamera}>
            <X className="h-5 w-5 mr-2" />
            Cancel
          </Button>
          <Button onClick={capturePhoto}>
            <Camera className="h-5 w-5 mr-2" />
            Capture
          </Button>
        </div>
      </div>
    );
  }

  if (currentPhoto) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={currentPhoto}
            alt="Room photo"
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing Room...
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5 mr-2" />
              Analyze & Get Recommendations
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed border-slate-300 rounded-xl p-8',
          'flex flex-col items-center justify-center cursor-pointer',
          'hover:border-primary-400 hover:bg-primary-50/50 transition-colors',
          'min-h-[200px]'
        )}
      >
        <Upload className="h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-600 font-medium">Upload a room photo</p>
        <p className="text-slate-400 text-sm mt-1">or drag and drop</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-400 text-sm">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <Button variant="outline" className="w-full" onClick={startCamera}>
        <Camera className="h-5 w-5 mr-2" />
        Take a Photo
      </Button>
    </div>
  );
}
