"use client";

import React from "react";
import styles from "@/styles/base.module.scss";

interface RuModalPacket {
	header: string;
	buttonLabel: string;
	children: string | React.ReactNode;
	onClose: () => void;
	buttonShow?: boolean;
}

export default function RuModal({ header, buttonLabel, children, onClose, buttonShow = true }: RuModalPacket) {
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h1 className={styles.h1}>{header}</h1>
				<p className={styles.modalText}>{children}</p>
				{buttonShow && (
					<button className={styles["base-button"]} onClick={() => onClose()}>
						{buttonLabel}
					</button>
				)}
			</div>
		</div>
	);
}
