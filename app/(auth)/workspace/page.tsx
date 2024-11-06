"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building2, Upload, X } from "lucide-react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WorkspaceFormData {
  name: string;
  logo?: File;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/gif"];

function CreateWorkspace() {
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
  });
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
      setFormData((prev) => ({ ...prev, logo: file }));
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
    setFormData((prev) => ({ ...prev, logo: undefined }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
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
          setFormData((prev) => ({ ...prev, logo: file }));
        });
    };
  };

  const handleSubmit = async () => {
    console.log("Form data:", formData);
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-8">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center gap-4">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="h-12 text-2xl">
              Create new workspace
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter workspace name"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Workspace Logo</Label>
            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative rounded-lg border-2 border-dashed p-8 transition-all ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted"
                }`}
              >
                <Input
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="absolute inset-0 h-full cursor-pointer opacity-0"
                  onChange={handleFileInput}
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your logo here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Supports PNG, JPG or GIF up to 5MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative mx-auto h-48 w-48">
                <img
                  src={imagePreview}
                  alt="Workspace logo preview"
                  className="h-full w-full rounded-lg object-cover ring-2 ring-border ring-offset-2"
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
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className="w-full"
            size="lg"
          >
            Create Workspace
          </Button>
        </CardFooter>
      </Card>

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

export default CreateWorkspace;
