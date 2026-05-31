import Image from "next/image";

const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

/** Resolve stored media URL (Supabase absolute or legacy /uploads paths). */
export const resolveImageSrc = (image: unknown): string | null => {
  if (!image) return null;

  if (typeof image === "string") {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    if (image.startsWith("/")) {
      return `${backendBase}${image}`;
    }
    return `${backendBase}/${image}`;
  }

  if (typeof image === "object" && image !== null && "url" in image) {
    const url = (image as { url?: string }).url;
    if (url) return resolveImageSrc(url);
  }

  return null;
};

export const resolveMediaSrc = resolveImageSrc;

export const renderImage = (image: unknown, forCart: boolean) => {
  if (!image) return "🖼️ ";

  const baseProps = {
    alt: "Product image",
    className: `object-contain  ${forCart ? "h-12" : ""}`,
  };

  const resolvedSrc = resolveImageSrc(image);
  if (resolvedSrc) {
    return (
      <Image
        src={resolvedSrc}
        width={forCart ? 48 : 400}
        height={forCart ? 48 : 400}
        {...baseProps}
      />
    );
  }

  // Local file preview before upload
  if (image instanceof Blob) {
    return (
      <Image
        width={40}
        height={40}
        src={URL.createObjectURL(image)}
        {...baseProps}
      />
    );
  }

  return "🖼️ ";
};
