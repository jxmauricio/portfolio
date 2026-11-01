import styles from "./DemoVideo.module.css";

type Props = {
  className?: string;
};

// The Bankr demo clip in a phone frame. Muted and looping so it can autoplay.
export function DemoVideo({ className = "" }: Props) {
  return (
    <div className={`${styles.frame} ${className}`}>
      <video
        className={styles.video}
        src="/bankr-demo.mp4"
        poster="/bankr-demo.jpg"
        width={588}
        height={1280}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Bankr on iPhone: home, transactions, and asking the chat how much was spent this month"
      />
    </div>
  );
}
