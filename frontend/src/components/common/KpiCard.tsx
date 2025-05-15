// src/components/common/KpiCard.tsx
import React from "react";
import styles from "./KpiCard.module.css";

interface KpiCardProps {
  title: string;
  value: number | string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  backgroundColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  iconLeft,
  iconRight,
  backgroundColor = "#2B517A",
}) => {
  return (
    <div className={styles.card} style={{ backgroundColor }}>
      <div className={styles.topRightIcon}>{iconRight}</div>
      <div className={styles.value}>{value}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.bottomLeftIcon}>{iconLeft}</div>
    </div>
  );
};
