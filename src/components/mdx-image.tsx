import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Optimized image component for MDX blog posts.
 * Usage in .mdx: <Image src="/images/posts/photo.png" alt="描述" width={800} height={600} />
 * Or standard markdown: ![描述](/images/posts/photo.png)
 */
export default function MdxImage({ src, alt, width = 800, height = 450 }: Props) {
  const isExternal = src.startsWith("http://") || src.startsWith("https://");

  if (isExternal) {
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

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded-xl"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
