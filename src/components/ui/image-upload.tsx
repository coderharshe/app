"use client";

import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Product Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error?.message || "Upload failed");
      }

      onChange(json.data.imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-xs font-medium text-[var(--on-surface-variant)]">
        <ImageIcon className="h-3.5 w-3.5" /> {label}
      </label>

      {value ? (
        <div className="relative group aspect-video w-full overflow-hidden rounded-xl ghost-border bg-[var(--surface-container-lowest)]">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative aspect-video w-full flex flex-col items-center justify-center gap-3 
            rounded-xl border-2 border-dashed border-[var(--outline)] 
            bg-[var(--surface-container-lowest)] cursor-pointer
            hover:border-[var(--primary)] hover:bg-[var(--primary-container)]/5 transition-all
            ${isUploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
              <p className="text-xs font-medium text-[var(--on-surface-variant)]">Uploading to Google Drive...</p>
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-container)] text-[var(--primary)]">
                <Upload className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--on-surface)]">Click to upload image</p>
                <p className="text-[10px] text-[var(--on-surface-variant)]">PNG, JPG up to 10MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onSelectFile}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 px-1 text-[10px] text-[var(--error)]">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
}
