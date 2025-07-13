"use client";

import styles from "@/styles/base.module.scss";
import RuModal from "@/components/RuModal";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Report() {
	const [report, setReport] = useState<string>("");
	const [desc, setDesc] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [showResult, setShowResult] = useState<boolean>(false);
	const reportRef = useRef<string | null>(null);
	
	useEffect(() => {
		document.title = "ЖАЛОБА НА АГЕНТОВ ГОС. ДЕЛА";
	}, []);
	
	useEffect(() => {
		reportRef.current = report;
	}, [report]);
	
	function handleArea(e) {
		setReport(e.target.value);
	}
	function submit(e) {
		e.preventDefault();
		if (reportRef.current.length < 15) {
			setDesc("Введите жалобу от 15 символов");
			setTitle("Неточности!");
			setShowResult(true);
		} else {
			setTitle("Успешно");
			setDesc("Ваша жалоба отправлена на рассмотрение. Ориентировочная дата ответа: 2042 год");
			setShowResult(true);
		}
	}
	
	return (
		<div style={{textAlign: 'center', display: 'block'}}>
			<form onSubmit={(e) => {submit(e)}}>
			<h1 className={styles.h1}>ЖАЛОБА НА АГЕНТОВ ГОС. ДЕЛА</h1>
			<textarea placeholder="Опишите вашу жалобу..." value={report} className={styles.area} onChange={(e) => {handleArea(e)}} />
			<br />
			<button className={styles["base-button"]}>ОТПРАВИТЬ</button>
			</form>
			<br />
			<Link href="/" scroll={true} className={styles["base-button"]}>НА ГЛАВНУЮ</Link>
			
			{showResult && (
					<RuModal
					header={title}
					buttonLabel="ТАК ТОЧНО"
					buttonShow={true}
					onClose={() => setShowResult(false)}
					>{desc}</RuModal>
				)
			}
		</div>
	);
}
