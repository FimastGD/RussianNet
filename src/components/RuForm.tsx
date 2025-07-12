"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import styles from "@/styles/base.module.scss";
import Random from "@/utils/Random";
import RuModal from "@/components/RuModal";

type Error = string | false;
type Header<Extends> = Extends;
type bool = true | false;
type char = string;
type int = number;

interface FormResult {
	error: Error;
	header: Header<Error>;
	message: string | React.ReactNode;
	showResult: bool;
}

interface SuccessModal {
	header: string;
	description: string | React.ReactNode;
}

const t: {int: (number) => number} = {
	int: (num) => {
		if (String(num).includes(".")) {
			console.error("Type 'int' is not assignable to type 'number'");
			return 0;
		} else {
			return num;
		}
	}
}

export default function RuForm({ ...props }) {
	const [fio, setFio] = useState("");
	const [fiofsb, setFiofsb] = useState("");
	const [passNum, setPassNum] = useState("");
	const [passSer, setPassSer] = useState("");
	const [queue, setQueue] = useState<int>(0);
	const [formResult, setFormResult] = useState<FormResult>({ 
		error: false, 
		header: "", 
		message: "", 
		showResult: false 
	});
	const [successModal, setSuccessModal] = useState<SuccessModal>({
		header: "Ожидайте",
		description: ""
	});
	
	let queueIn: int = t.int(0);
	const formRef = useRef<HTMLFormElement>(null);
	const formData = useRef({ fio, fiofsb, passNum, passSer });

	useEffect(() => {
		formData.current = { fio, fiofsb, passNum, passSer };
	}, [fio, fiofsb, passNum, passSer]);
	useEffect(() => {
		queueIn = queue;
	}, [queue]);

	const submit = (e: FormEvent) => {
		e.preventDefault();
		
		// проверяем нативную валидацию
		if (!formRef.current?.checkValidity()) {
			formRef.current?.reportValidity();
			return;
		}
		let error: string = "";
		
		if (formData.current.fio.split(" ").length !== 3 || 
				formData.current.fiofsb.split(" ").length !== 3) {
			error = "Введите фамилию, имя и отчество через пробел";
		}

		if (String(formData.current.fio).length < 5 || 
				String(formData.current.fiofsb).length < 5) {
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
		
		const Queue: int = t.int(Random.Int(50, 150))
		let $i_interval_Xt6k: int = t.int(Queue); 
	
		if (Queue >= 50 && Queue <= 150) {
			const queueInterval = setInterval(() => {
				if ($i_interval_Xt6k <= 0) {
					clearInterval(queueInterval);
					setSuccessModal(prev => ({header: "Успешно", description: "Вы подключились к Российской Сети, в ближайшее время с вами свяжется куратор ФСБ"}));
				}
				setQueue($i_interval_Xt6k);
				setSuccessModal(prev => ({...prev, description: <>Наши сверхбыстрые сервера обрабатывают запросы<br/>Очередь: {queue}</>}))
				$i_interval_Xt6k--;
			}, 1000)
		}

		// если все проверки пройдены
		
		setFormResult({
			error: false,
			header: <>{successModal.header}</>,
			message: <>{successModal.description}</>,
			showResult: true
		});
	};

	function handleInput(e: React.ChangeEvent<HTMLInputElement>, type: string): void {
		const value = e.target.value;
		if (type.toLowerCase() === "fio") setFio(value);
		else if (type.toLowerCase() === "fiofsb") setFiofsb(value);
		else if (type.toLowerCase() === "passnum") setPassNum(value.slice(0, 6)); // Ограничение длины
		else if (type.toLowerCase() === "passser") setPassSer(value.slice(0, 4)); // Ограничение длины
	}

	return (
		<>
			<form 
				ref={formRef}
				className={styles.form} 
				{...props} 
				onSubmit={submit}
				id="Y6mUx"
				noValidate // Отключаем стандартное поведение, чтобы контролировать момент проверки
			>
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
					onClose={() => setFormResult(prev => ({ ...prev, showResult: false }))}
				>
					{formResult.message}
				</RuModal>
			)}
		</>
	);
}