interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Image component for MDX blog posts.
 * Uses native <img> to avoid Next.js Image optimizer issues with
 * dynamically-served images (e.g., /uploads/images/posts/...).
 */
export default function MdxImage({ src, alt }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="rounded-xl w-full"
      loading="lazy"
    />
  );
}
