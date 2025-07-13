"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import styles from "@/styles/base.module.scss";
import Random from "@/utils/Random";
import RuModal from "@/components/RuModal";

type Error = string | false;
type Header<Extends> = Extends | React.ReactNode;
type bool = true | false;
type char = string;
type int = number;

interface FormResult {
	error: Error;
	header: Header<Error>;
	message: string | React.ReactNode;
	showResult: bool;
	buttonLabel?: string;
}

const t: { int: (number) => number } = {
	int: num => {
		if (String(num).includes(".")) {
			console.error("Type 'int' is not assignable to type 'number'");
			return 0;
		} else {
			return num;
		}
	}
};

export default function RuForm({ ...props }) {
	const [fio, setFio] = useState("");
	const [fiofsb, setFiofsb] = useState("");
	const [passNum, setPassNum] = useState("");
	const [passSer, setPassSer] = useState("");
	const [formResult, setFormResult] = useState<FormResult>({
		error: false,
		header: "",
		message: "",
		showResult: false,
		buttonLabel: ""
	});

	const formRef = useRef<HTMLFormElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// очистка интервала при размонтировании
	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string): void => {
		const value = e.target.value;
		switch (type.toLowerCase()) {
			case "fio":
				setFio(value);
				break;
			case "fiofsb":
				setFiofsb(value);
				break;
			case "passnum":
				setPassNum(value.replace(/\D/g, "").slice(0, 6));
				break;
			case "passser":
				setPassSer(value.replace(/\D/g, "").slice(0, 4));
				break;
		}
	};

	const submit = (e: FormEvent) => {
		e.preventDefault();

		if (!formRef.current?.checkValidity()) {
			formRef.current?.reportValidity();
			return;
		}

		let error: string = "";
		if (fio.split(" ").length !== 3 || fiofsb.split(" ").length !== 3) {
			error = "Введите фамилию, имя и отчество через пробел";
		}

		if (fio.length < 5 || fiofsb.length < 5) {
			error = "Введите корректно Ф.И.О / Ф.И.О. куратора ФСБ";
		}

		if (passNum.length !== 6) {
			error = "Номер паспорта должен содержать 6 цифр";
		}

		if (passSer.length !== 4) {
			error = "Серия паспорта должна содержать 4 цифры";
		}

		if (error) {
			setFormResult({
				error: error,
				header: "Неточности!",
				message: error,
				showResult: true,
				buttonLabel: "ИСПРАВИТЬ"
			});
			return;
		}

		// очищаем предыдущий интервал
		if (intervalRef.current) clearInterval(intervalRef.current);

		const initialQueue: int = t.int(Random.Int(50, 9999));
		let count = initialQueue;

		// определяем скорость интервала в зависимости от размера очереди
		let intervalSpeed: number;
		if (initialQueue <= 125) {
			intervalSpeed = 1000; // 1 сек
		} else if (initialQueue <= 799) {
			intervalSpeed = 280; // 0.28 сек
		} else if (initialQueue <= 2999) {
			intervalSpeed = 80; // 0.08 сек
		} else {
			intervalSpeed = 40; // 0.04 сек
		}

		// начальное состояние модального окна
		setFormResult({
			error: false,
			header: "Ожидайте",
			message: (
				<>
					Наши сверхбыстрые сервера обрабатывают запросы
					<br />
					Очередь: {count.toLocaleString("ru-RU")}
				</>
			),
			showResult: true,
			buttonLabel: ""
		});

		intervalRef.current = setInterval(() => {
			count--;

			if (count <= 0) {
				clearInterval(intervalRef.current!);
				setFormResult({
					error: false,
					header: "Успешно",
					message: "Вы подключились к Российской Сети, в ближайшее время с вами свяжется куратор ФСБ",
					showResult: true,
					buttonLabel: "ЗАКРЫТЬ"
				});
				return;
			}

			setFormResult(prev => ({
				...prev,
				message: (
					<>
						Наши сверхбыстрые сервера обрабатывают запросы
						<br />
						Очередь: {count.toLocaleString("ru-RU")}
					</>
				)
			}));
		}, intervalSpeed);
	};

	const onCloseModal = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setFormResult(prev => ({ ...prev, showResult: false }));
	};

	return (
		<>
			<form ref={formRef} className={styles.form} {...props} onSubmit={submit} id="Y6mUx" noValidate>
				<div className={styles.inputGroup}>
					<label htmlFor="fio" className={styles.label}>
						Ф. И. О
					</label>
					<input
						type="text"
						required
						id="fio"
						className={styles.input}
						value={fio}
						onChange={e => handleInput(e, "fio")}
						minLength={5}
					/>

					<label htmlFor="fiofsb" className={styles.label}>
						Ф. И. О. КУРАТОРА ФСБ
					</label>
					<input
						type="text"
						required
						id="fiofsb"
						className={styles.input}
						value={fiofsb}
						onChange={e => handleInput(e, "fiofsb")}
						minLength={5}
					/>
				</div>
				<div className={styles.passGroup}>
					<div className={styles.passText}>ПАСПОРТНЫЕ ДАННЫЕ</div>
					<div className={styles.passInput}>
						<label htmlFor="passnum" className={styles.label1}>
							№
						</label>
						<input
							type="text"
							id="passnum"
							className={styles.input}
							value={passNum}
							onChange={e => handleInput(e, "passNum")}
							required
							pattern="\d{6}"
							title="Введите ровно 6 цифр"
							inputMode="numeric"
						/>
						<label htmlFor="passser" className={styles.label2}>
							СЕРИЯ
						</label>
						<input
							type="text"
							id="passser"
							className={styles.input}
							value={passSer}
							onChange={e => handleInput(e, "passSer")}
							required
							pattern="\d{4}"
							title="Введите ровно 4 цифры"
							inputMode="numeric"
						/>
					</div>
				</div>
				<button type="submit" className={styles.submit}>
					ЗАПРОСИТЬ ДОСТУП
				</button>
			</form>

			{formResult.showResult && (
				<RuModal
					header={formResult.header}
					buttonShow={!!formResult.buttonLabel}
					buttonLabel={formResult.buttonLabel || ""}
					onClose={onCloseModal}
				>
					{formResult.message}
				</RuModal>
			)}
		</>
	);
}
