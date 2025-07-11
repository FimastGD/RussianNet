"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import styles from "@/styles/base.module.scss";
import Random from "@/utils/Random";
import RuModal from "@/components/RuModal";

type Error = string | false;
type Header<Extends> = Extends;
type bool = true | false;

interface FormResult {
	error: Error;
	header: Header<Error>;
	message: string;
	showResult: bool;
}

export default function RuForm({ ...props }) {
	const [fio, setFio] = useState("");
	const [fiofsb, setFiofsb] = useState("");
	const [passNum, setPassNum] = useState("");
	const [passSer, setPassSer] = useState("");
	const [formResult, setFormResult] = useState<FormResult>({ error: false, Header: "", message: "", showResult: false });

	const formData = useRef({ fio: fio, fiofsb: fiofsb, passNum: passNum, passSer: passSer });

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		formData.current = { fio: fio, fiofsb: fiofsb, passNum: passNum, passSer: passSer };
	}, [fio, fiofsb, passNum, passSer]);

	const submit = (e: FormEvent) => {
		e.preventDefault();
		// console.log(formData.current);
		// console.log(formData.current.fio);
		// console.log(`Random: ${Random.Int(50, 9000)}`);
		/// setFormResult(prev => ({ ...prev, showResult: true }));
		setFormResult(prev => ({...prev, error: "Ошибка...", message: "Ошибка!", showResult: true}))
	};

	function handleInput(e, type: string): void {
		if (type.toLowerCase() == "fio") setFio(e.target.value);
		else if (type.toLowerCase() == "fiofsb") setFiofsb(e.target.value);
		else if (type.toLowerCase() == "passnum") setPassNum(e.target.value);
		else if (type.toLowerCase() == "passser") setPassSer(e.target.value);
	}

	return (
		<>
			<form className={styles.form} {...props} onSubmit={submit}>
				<div className={styles.inputGroup}>
					<label htmlFor="fio" className={styles.label}>
						Ф. И. О
					</label>
					<input type="text" id="fio" className={styles.input} value={fio} onChange={e => handleInput(e, "fio")} />

					<label htmlFor="fiofsb" className={styles.label}>
						Ф. И. О. КУРАТОРА ФСБ
					</label>
					<input type="text" id="fiofsb" className={styles.input} value={fiofsb} onChange={e => handleInput(e, "fiofsb")} />
				</div>
				<div className={styles.passGroup}>
					<div className={styles.passText}>ПАСПОРТНЫЕ ДАННЫЕ</div>
					<div className={styles.passInput}>
						<label htmlFor="passnum" className={styles.label1}>
							№
						</label>
						<input type="number" id="passnum" className={styles.input} value={passNum} onChange={e => handleInput(e, "passNum")} />
						<label htmlFor="passser" className={styles.label2}>
							СЕРИЯ
						</label>
						<input type="number" id="passser" className={styles.input} value={passSer} onChange={e => handleInput(e, "passSer")} />
					</div>
				</div>
				<button className={styles.submit} onClick={submit}>
					ЗАПРОСИТЬ ДОСТУП
				</button>
			</form>
			{formResult.showResult && (
				<RuModal
					header={formResult.header || "Неточности"}
					buttonShow={formResult.error && true}
					buttonLabel={formResult.error ? "" : "ИСПРАВИТЬ"}
					onClose={formResult.error ? () => {} : setFormResult(prev => ({ ...prev, showResult: false }))}
				>
					{formResult.error ? formResult.message : <div></div>}
				</RuModal>
			)}
		</>
	);
}
