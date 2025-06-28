import { useState, useRef } from "react";
import { useSubmitReflectionMutation } from "../api/reflectionApi";
import { GlassCard } from "./ui/GlassCard";
import { NeonGlowButton } from "./ui/NeonGlowButton";
import {
  Image as ImageIcon,
  AudioLines,
  FileText,
  Mic,
  MicOff,
  UploadCloud,
  Send,
  FileAudio,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ReflectionFormProps {
  questTitle: string;
  questType: string;
  onSubmitted?: () => void;
}

export const ReflectionForm = ({
  questTitle,
  questType,
  onSubmitted,
}: ReflectionFormProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [submitReflection, { isLoading }] = useSubmitReflectionMutation();
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudio(e.target.files[0]);
      setAudioUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Audio recording handlers
  const handleStartRecording = async () => {
    if (!navigator.mediaDevices) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudio(new File([blob], "recording.webm"));
      setAudioUrl(URL.createObjectURL(blob));
    };
    mediaRecorder.start();
    setIsRecording(true);
  };
  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("questTitle", questTitle);
    formData.append("questType", questType);
    if (text) formData.append("text", text);
    if (image) formData.append("image", image);
    if (audio) formData.append("audio", audio);
    try {
      await submitReflection(formData).unwrap();
      setToast({ type: "success", message: "Reflection submitted!" });
      setText("");
      setImage(null);
      setAudio(null);
      setAudioUrl(null);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.data?.message || "Submission failed.",
      });
    }
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <GlassCard borderColor="primary" className="max-w-xl mx-auto mt-8">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed left-1/2 top-8 z-50 -translate-x-1/2 px-6 py-3 rounded-xl flex items-center gap-2 shadow-neon-blue
            ${
              toast.type === "success"
                ? "bg-accent-500/90 text-white"
                : "bg-red-500/90 text-white"
            }
            glass-card border-2 border-white/10 backdrop-blur-md animate-float`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-white" />
          ) : (
            <XCircle className="w-5 h-5 text-white" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reflection Text */}
        <div>
          <label className="text-sm font-medium text-primary-300 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500 drop-shadow-glow" />
            Reflection
          </label>
          <div className="relative">
            <textarea
              className="w-full border rounded-xl p-3 min-h-[80px] bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-primary-500 transition-all"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </div>
        </div>
        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-accent-300 mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-accent-500 drop-shadow-glow" />
            Image (optional)
          </label>
          <div
            className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-accent-400 bg-white/20 transition-all"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => imageInputRef.current?.click()}
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mx-auto h-32 object-contain rounded-lg shadow"
              />
            ) : (
              <span className="text-gray-400 flex flex-col items-center gap-1">
                <UploadCloud className="w-8 h-8 mx-auto text-accent-400" />
                Drag & drop or click to select an image
              </span>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              id="image-upload"
              title="Upload image"
              placeholder="Choose an image file"
            />
          </div>
          <div className="mt-2">
            <NeonGlowButton
              color="accent"
              type="button"
              className="cursor-pointer flex items-center gap-2"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="w-5 h-5" />
              Choose Image
            </NeonGlowButton>
          </div>
        </div>
        {/* Audio Upload & Recording */}
        <div>
          <label className="text-sm font-medium text-secondary-300 mb-2 flex items-center gap-2">
            <AudioLines className="w-5 h-5 drop-shadow-glow" />
            Audio (optional)
          </label>
          <div className="flex items-center gap-4 flex-wrap">
            {!isRecording ? (
              <NeonGlowButton
                color="secondary"
                type="button"
                onClick={handleStartRecording}
                className="flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Record Audio
              </NeonGlowButton>
            ) : (
              <NeonGlowButton
                color="accent"
                type="button"
                onClick={handleStopRecording}
                className="flex items-center gap-2"
              >
                <MicOff className="w-5 h-5" />
                Stop Recording
              </NeonGlowButton>
            )}
            <NeonGlowButton
              color="secondary"
              type="button"
              className="flex items-center gap-2"
              onClick={() => audioInputRef.current?.click()}
            >
              <FileAudio className="w-5 h-5" />
              Choose Audio
            </NeonGlowButton>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              title="Upload audio"
              placeholder="Choose an audio file"
              className="hidden"
            />
          </div>
          {audioUrl && (
            <audio controls src={audioUrl} className="mt-2 w-full" />
          )}
        </div>
        {/* Submit Button */}
        <div>
          <NeonGlowButton
            color="primary"
            type="submit"
            className={`w-full flex items-center justify-center gap-2 transition-all duration-200 ${
              isLoading || !text.trim()
                ? "opacity-60 grayscale cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading || !text.trim()}
          >
            <Send className="w-5 h-5" />
            {isLoading ? "Submitting..." : "Submit Reflection"}
          </NeonGlowButton>
        </div>
      </form>
    </GlassCard>
  );
};
