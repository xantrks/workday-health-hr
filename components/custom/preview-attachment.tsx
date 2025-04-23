import { Attachment } from "ai";

import { LoaderIcon } from "./icons";

/**
 * PreviewAttachment component for displaying attachments in chat
 * Enhanced for mobile responsiveness
 */
export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div className="flex flex-col gap-1 sm:gap-2 min-w-14 sm:min-w-16 max-w-14 sm:max-w-16">
      <div className="h-16 sm:h-20 w-14 sm:w-16 bg-muted rounded-md relative flex flex-col items-center justify-center overflow-hidden">
        {contentType ? (
          contentType.startsWith("image") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? "An image attachment"}
              className="rounded-md size-full object-cover"
            />
          ) : contentType.startsWith("application/pdf") ? (
            <div className="text-xs text-center text-zinc-600 px-1">
              PDF
            </div>
          ) : contentType.startsWith("text") ? (
            <div className="text-xs text-center text-zinc-600 px-1">
              Text
            </div>
          ) : (
            <div className="text-xs text-center text-zinc-600 px-1">
              File
            </div>
          )
        ) : (
          <div className="text-xs text-center text-zinc-600 px-1">
            File
          </div>
        )}

        {isUploading && (
          <div className="animate-spin absolute text-zinc-500">
            <LoaderIcon size={14} />
          </div>
        )}
      </div>

      <div className="text-xs text-zinc-500 max-w-14 sm:max-w-16 truncate text-center">{name}</div>
    </div>
  );
};
