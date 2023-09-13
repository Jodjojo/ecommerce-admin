"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

// This store modal cannot be closed because it is in the root route of the dashboard and we dont want the administrator to be able to go any further without creating a store

const SetupPage = () => {
	// importing use state for Modal on open and isopen
	const onOpen = useStoreModal((state) => state.onOpen);
	const isOpen = useStoreModal((state) => state.isOpen);
	useEffect(() => {
		if (!isOpen) {
			onOpen();
		}
	}, [isOpen, onOpen]);

	return <div className='p-4'>Root Page</div>;
};

export default SetupPage;
