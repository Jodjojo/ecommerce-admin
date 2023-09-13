"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

// Modal component added to layout.tsx but since we cant just just add a client component to a server component we use the Modal provider to ensure there wont be any hydration errors

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null; //if in server side rendering return null to preventy hydration error
	}

	return (
		<>
			<StoreModal />
		</>
	);
};
