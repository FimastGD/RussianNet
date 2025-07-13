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
		showResult: false
	});

	const formRef = useRef<HTMLFormElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Очистка интервала при размонтировании
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
				setPassNum(value.slice(0, 6));
				break;
			case "passser":
				setPassSer(value.slice(0, 4));
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

		if (error) {
			setFormResult({
				error: error,
				header: "Неточности!",
				message: error,
				showResult: true
			});
			return;
		}

		// Очищаем предыдущий интервал
		if (intervalRef.current) clearInterval(intervalRef.current);

		const initialQueue: int = t.int(Random.Int(50, 150));
		let count = initialQueue;

		// Начальное состояние модального окна
		setFormResult({
			error: false,
			header: "Ожидайте",
			message: (
				<>
					Наши сверхбыстрые сервера обрабатывают запросы
					<br />
					Очередь: {count}
				</>
			),
			showResult: true
		});

		intervalRef.current = setInterval(() => {
			count--;

			if (count <= 0) {
				clearInterval(intervalRef.current!);
				setFormResult({
					error: false,
					header: "Успешно",
					message: "Вы подключились к Российской Сети, в ближайшее время с вами свяжется куратор ФСБ",
					showResult: true
				});
				return;
			}

			setFormResult(prev => ({
				...prev,
				message: (
					<>
						Наши сверхбыстрые сервера обрабатывают запросы
						<br />
						Очередь: {count}
					</>
				)
			}));
		}, 1000);
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
					<input type="text" required id="fio" className={styles.input} value={fio} onChange={e => handleInput(e, "fio")} minLength={5} />

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
					buttonShow={!!formResult.error}
					buttonLabel={formResult.error ? "ИСПРАВИТЬ" : ""}
					onClose={onCloseModal}
				>
					{formResult.message}
				</RuModal>
			)}
		</>
	);
}
