"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { type Crop } from "react-image-crop";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/gif"];

interface WorkspaceLogoUploadProps {
  onLogoChange: (file: File | undefined) => void;
  label?: string;
}

export function WorkspaceLogoUpload({
  onLogoChange,
  label = "Logo",
}: WorkspaceLogoUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("Please upload a PNG, JPG or GIF file");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    if (validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setOriginalImage("");
    onLogoChange(undefined);
  };

  const handleCropComplete = (crop: Crop, percentageCrop: Crop) => {
    if (!originalImage) return;

    const image = new Image();
    image.src = originalImage;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scaleX = image.naturalWidth / 100;
      const scaleY = image.naturalHeight / 100;

      const pixelCrop = {
        x: percentageCrop.x * scaleX,
        y: percentageCrop.y * scaleY,
        width: percentageCrop.width * scaleX,
        height: percentageCrop.height * scaleY,
      };

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      const croppedImage = canvas.toDataURL("image/jpeg");
      setImagePreview(croppedImage);
      setCropDialogOpen(false);

      fetch(croppedImage)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "cropped-logo.jpg", {
            type: "image/jpeg",
          });
          onLogoChange(file);
        });
    };
  };

  return (
    <div className="space-y-2">
      <Label className="text-lg">{label}</Label>
      {!imagePreview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-12 transition-all ${
            dragActive ? "border-primary bg-primary/5" : "border-muted"
          }`}
        >
          <Input
            type="file"
            accept="image/png,image/jpeg,image/gif"
            className="absolute inset-0 h-full cursor-pointer opacity-0"
            onChange={handleFileInput}
          />
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Drag and drop your logo here, or click to select
            </p>
            <p className="text-sm text-muted-foreground/60">
              Supports PNG, JPG or GIF up to 5MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative h-64 w-64">
          <img
            src={imagePreview}
            alt="Logo preview"
            className="h-full w-full rounded-lg object-cover ring-2 ring-border ring-offset-4"
          />
          <Button
            size="icon"
            variant="secondary"
            onClick={removeImage}
            className="absolute -right-2 -top-2 h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Logo</DialogTitle>
          </DialogHeader>
          {originalImage && (
            <div className="mt-4">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={handleCropComplete}
                aspect={1}
                circularCrop
              >
                <img src={originalImage} alt="Crop" className="max-h-[60vh]" />
              </ReactCrop>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCropDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => handleCropComplete(crop, crop)}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
