"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

///the modal that pops up when we want to delete a store

///the interface that will be process the props for the Alert Modal that we will use REACT.FC to assess the props
interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
	///we destructure the state props we passed into the interface ro be used in the Modal
	isOpen,
	onClose,
	onConfirm,
	loading,
}) => {
	///we create a useState to handle the mounting of the modal
	const [isMounted, setIsMounted] = useState(false);

	///handling to prevent hydration error
	useEffect(() => {
		setIsMounted(true);
	}, []);

	///if we are not mounted to return null
	if (!isMounted) {
		return null;
	}

	// else we return the actual modal component to execute the deleting
	return (
		///the modal props will be set based off of what we created as the props in the components file
		<Modal
			title='Are you sure?'
			description='This action cannot be undone'
			isOpen={isOpen}
			onClose={onClose}
		>
			{/* The div of the form that will show to confirm the delete */}
			<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
				<Button disabled={loading} variant='outline' onClick={onClose}>
					Cancel
				</Button>
				<Button disabled={loading} variant='destructive' onClick={onConfirm}>
					Continue
				</Button>
			</div>
		</Modal>
	);
};
