'use client';

import { File, FileText, Image, Video } from 'lucide-react';

interface FileIconProps {
  fileType: string;
  className?: string;
}

export default function FileIcon({ fileType, className = 'h-5 w-5' }: FileIconProps) {
  switch (fileType) {
    case 'image':
      return <Image className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'pdf':
      return <FileText className={className} />;
    default:
      return <File className={className} />;
  }
} 