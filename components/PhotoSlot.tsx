import Image from "next/image";
import styles from "./PhotoSlot.module.css";

type Props = {
  src: string | null;
  alt: string;
  initials: string;
  priority?: boolean;
  className?: string;
};

// Shows the photo when `src` is set in content/site.ts, otherwise a quiet
// initials placeholder that keeps the layout intact.
export function PhotoSlot({ src, alt, initials, priority, className = "" }: Props) {
  return (
    <div className={`${styles.slot} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 800px) 100vw, 480px"
          className={styles.image}
        />
      ) : (
        <span className={styles.initials} aria-label={alt} role="img">
          {initials}
        </span>
      )}
    </div>
  );
}
