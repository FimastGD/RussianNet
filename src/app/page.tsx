"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import RuForm from "@/components/RuForm";
import RuModal from "@/components/RuModal";
import Navigation from "@/components/Navigation";
import Swal from "sweetalert2";
import styles from "@/styles/base.module.scss";

// Импорт изображений
import logoImg from "../../public/rn1.jpg";
import applyFormImg from "../../public/rn2.jpg";
import listenGimnImg from "../../public/rn3.jpg";
import gerbImg from "../../public/rn4.jpg";
import reportImg from "../../public/rn7.jpg";
import runetImg from "../../public/rn6.jpg";
import dieImg from "../../public/rn5.jpg";

export default function Home() {
	const { toggleSound, isPlaying, stopMusic } = useSound();
	const [showCookieModal, setShowCookieModal] = useState(false);

	useEffect(() => {
		const checkFirstLoad = async () => {
			try {
				const response = await fetch("/api/firstLoad");
				const data = await response.json();

				if (data.firstLoad) {
					Swal.fire({
						icon: "warning",
						title: "Предупреждение",
						text: "Данная страница сделана исключительно в развлекательных целях. Мы не имеем никакого отношения к государственным органам РФ. Свои реальные данные в формы вводить не нужно.",
						confirmButtonText: "Продолжить",
						allowOutsideClick: false,
						allowEscapeKey: false
					}).then(() => {
						setShowCookieModal(true);
					});
				}
			} catch (error) {
				console.error("Ошибка при проверке firstLoad:", error);
			}
		};

		checkFirstLoad();
	}, []);

	return (
		<div className={`${styles.fontArial} bg-[#df0003] w-full min-h-screen flex justify-center pt-2 relative`}>
			<Image src={logoImg} alt="logo" className={styles.logoImg} />
			<Image src={applyFormImg} alt="Apply Form" className={styles.applyFormImg} />
			<button onClick={toggleSound}>
				<Image src={listenGimnImg} alt="Listen Gimn" className={styles.listenGimnImg} />
			</button>
			<Image src={gerbImg} alt="Gerb" className={styles.gerbImg} />
			<Navigation to="/report" event={stopMusic}>
				<Image src={reportImg} alt="Report" className={styles.reportImg} />
			</Navigation>
			<Image src={runetImg} alt="RuNet" className={styles.runetImg} />
			<Image src={dieImg} alt="Die" className={styles.dieImg} />
			<div className={styles.fPadding}></div>
			<RuForm />

			{showCookieModal && (
				<RuModal header="Внимание!" buttonLabel="ТАК ТОЧНО" onClose={() => setShowCookieModal(false)}>
					Мы используем печенье для повышения эффективности гос сервиса. Продолжая использовать сетевую инфраструктуру государства, вы
					соглашаетесь с использованием печенья.
				</RuModal>
			)}
		</div>
	);
}
