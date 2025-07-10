"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface NavigationPacket {
	to: string;
	event: () => void;
	children: React.ReactNode;
	[key: string]: any;
}

export default function Navigation({ to, event, children, ...props }: NavigationPacket) {
	const router = useRouter();

	function redirect(path: string): void {
		event();
		router.push(path);
	}

	return (
		<button onClick={() => redirect(to)} {...props}>
			{children}
		</button>
	);
}
