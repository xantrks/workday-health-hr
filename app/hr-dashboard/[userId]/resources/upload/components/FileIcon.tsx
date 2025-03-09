'use client';

import { File, FileText, Image, Video } from 'lucide-react';

interface FileIconProps {
  file: File | null;
  className?: string;
}

export default function FileIcon({ file, className = 'h-5 w-5' }: FileIconProps) {
  if (!file) return <File className={className} />;

  const fileType = file.type;
  
  if (fileType.includes('image')) {
    return <Image className={className} />;
  }
  
  if (fileType.includes('video')) {
    return <Video className={className} />;
  }
  
  if (fileType.includes('pdf')) {
    return <FileText className={className} />;
  }
  
  return <File className={className} />;
} 