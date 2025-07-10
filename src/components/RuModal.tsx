"use client";

import styles from "@/styles/base.module.scss";

interface RuModalPacket {
	header: string,
	buttonLabel: string,
	children: string,
	onClose: () => void;
}

export default function RuModal({header, buttonLabel, children, onClose}: RuModalPacket) {
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h1 className={styles.h1}>{header}</h1>
				<p className={styles.modalText}>
					{children}
				</p>
				<button className={styles["base-button"]} onClick={() => onClose()}>
					{buttonLabel}
				</button>
			</div>
		</div>
	);
}
