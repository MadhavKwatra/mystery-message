"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  File as FileIcon,
  X,
  Image as ImageIcon,
  FileCode,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) return <FileCode className="text-red-500" />;
  if (fileType.includes("image"))
    return <ImageIcon className="text-blue-500" />;
  return <FileIcon className="text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void;
  resetTrigger?: boolean; // 👈 Add this prop
}

export default function FileUploader({
  onFilesChange,
  resetTrigger
}: FileUploaderProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const prevResetTrigger = useRef(resetTrigger); // Track previous resetTrigger value

  // Reset files when resetTrigger changes
  useEffect(() => {
    if (resetTrigger !== prevResetTrigger.current) {
      setFiles([]);
      onFilesChange?.([]); // Notify form about reset
      prevResetTrigger.current = resetTrigger; // Update ref to avoid infinite loop
    }
  }, [resetTrigger, onFilesChange]); // 👈 Listen for resetTrigger changes

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE;

        if (!isValidType) {
          toast({
            title: "Invalid File Type",
            description: `File ${file.name} is not a supported file type.`,
            variant: "destructive"
          });
        }

        if (!isValidSize) {
          toast({
            title: "File Too Large",
            description: `File ${file.name} exceeds 5MB limit.`,
            variant: "destructive"
          });
        }

        return isValidType && isValidSize;
      });

      if (validFiles.length > 0) {
        toast({
          title: "File Added",
          description: `${validFiles.length} file(s) successfully added.`,
          variant: "default"
        });
      }

      const newFileList = [...files, ...validFiles].slice(0, MAX_FILES);

      if (newFileList.length === MAX_FILES) {
        toast({
          title: "Maximum Files Reached",
          description: "You can upload a maximum of 5 files.",
          variant: "default"
        });
      }

      setFiles(newFileList);
      onFilesChange?.(newFileList);
    },
    [files, onFilesChange, toast]
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      fileRejections.forEach((rejection) => {
        const { file, errors } = rejection;

        errors.forEach((error) => {
          toast({
            title:
              error.code === "file-invalid-type"
                ? "Invalid File Type"
                : "File Too Large",
            description: `File ${file.name} does not meet upload requirements.`,
            variant: "destructive"
          });
        });
      });
    },
    [toast]
  );

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ALLOWED_FILE_TYPES.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {}
    ),
    multiple: true,
    maxSize: MAX_FILE_SIZE
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please select files to upload.",
        variant: "default"
      });
      return;
    }

    try {
      setIsUploading(true);

      // Simulated upload process
      await Promise.all(
        files.map(
          (file) => new Promise<void>((resolve) => setTimeout(resolve, 1000))
        )
      );

      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully.`,
        variant: "default"
      });

      // Clear files after successful upload
      setFiles([]);
      onFilesChange?.([]);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading files.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          p-6 border-2 border-dashed rounded-lg text-center cursor-pointer 
          transition-colors duration-300
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-500"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FileIcon className="w-12 h-12 text-gray-400" />
          {isDragActive ? (
            <p className="text-blue-500">Drop files here...</p>
          ) : (
            <>
              <p className="text-gray-600">
                Drag & drop files here, or click to select
              </p>
              <small className="text-gray-500">
                (Max 5 files, each up to 5MB - PDF, Images)
              </small>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-600">
            Selected Files ({files.length}/{MAX_FILES})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-500">{index + 1}.</span>
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium dark:text-black">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => removeFile(file)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODO :Think about it show or not */}
      {/* {files.length > 0 && (
        <Button
          onClick={handleUpload}
          className="w-full"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Files"
          )}
        </Button>
      )} */}
    </div>
  );
}
