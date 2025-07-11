export default class Random {
	/** Generates a random int
	 * @param min - minimum value in range
	 * @param max - maximum value in range
	 * @returns number - random int in range
	*/
	public static Int(min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	/** Generates a random float
	 * @param min - minimum value in range
	 * @param max - maximum value in range
	 * @returns number - random float in range
	*/
	public static Float(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}
	/** Generates a random string
	 * @param charSets - symbol ranges (a-z, A-Z, 0-9, CuSt0M_Symbols)
	 * @param length - string length
	 * @returns string - random string
	*/
	public static String(charSets: string[], length: number): string {
		let charPool = '';
		for (const set of charSets) {
			if (set === 'a-z') {
				for (let i = 97; i <= 122; i++) {
					charPool += String.fromCharCode(i);
				}
			} else if (set === 'A-Z') {
				for (let i = 65; i <= 90; i++) {
					charPool += String.fromCharCode(i);
				}
			} else if (set === '0-9') {
				for (let i = 48; i <= 57; i++) {
					charPool += String.fromCharCode(i);
				}
			} else {
				charPool += set;
			}
		}
		let result = '';
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charPool.length);
			result += charPool[randomIndex];
		}
		return result;
	}
}