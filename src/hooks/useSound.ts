import { useState, useRef, useEffect } from "react";
import { Howl } from "howler";

export const useSound = () => {
	const [sound, setSound] = useState<Howl | null>(null);
	const [needToPlay, setNeedToPlay] = useState(true);
	const needToPlayRef = useRef(needToPlay);

	useEffect(() => {
		needToPlayRef.current = needToPlay;
	}, [needToPlay]);

	const playMusic = (): void => {
		const newSound = new Howl({
			src: ["/gimn.mp3"],
			autoplay: false,
			volume: 1
		});
		newSound.play();
		setSound(newSound);
	};

	const stopMusic = (): void => {
		if (sound) {
			sound.stop();
		}
	};

	const toggleSound = (): void => {
		if (needToPlayRef.current) {
			playMusic();
			setNeedToPlay(false);
		} else {
			stopMusic();
			setNeedToPlay(true);
		}
	};

	return {
		toggleSound,
		isPlaying: !needToPlay,
		stopMusic
	};
};
