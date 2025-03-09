'use client';

import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '../utils';
import FileIcon from './FileIcon';

interface FileUploadAreaProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export default function FileUploadArea({ file, onFileChange, onRemoveFile }: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="border border-dashed rounded-lg p-8 bg-muted/20">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="bg-primary/10 p-5 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <p className="font-medium text-lg">Drag & drop your file here</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2"
        >
          Browse Files
        </Button>
      </div>

      {file && (
        <div className="mt-5 p-4 border rounded-md bg-background flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileIcon file={file} />
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
} 