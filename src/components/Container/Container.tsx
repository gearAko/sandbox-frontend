import styles from "./Container.module.scss";
import type { TContainerProps } from "./Container.types";

export function Container({
  children,
  id,
  className,
}: TContainerProps) {
  return (
    <div id={id} className={styles.container}>
      <div className={`${styles.block} ${className ?? ""}`}>{children}</div>
    </div>
  );
}
