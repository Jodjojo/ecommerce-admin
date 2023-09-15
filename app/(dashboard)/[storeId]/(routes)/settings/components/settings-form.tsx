"use client";

import { Store } from "@prisma/client";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

///We use the interface to pass the store into the  settings form
interface SettingsFormProps {
	initialData: Store;
}

/// Handle the interface below

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
	return (
		///We will encapsulate everything in a fragment so we can add spacing between it and the other parts of the form we will add later
		<>
			<div className='flex items-center justify-between'>
				<Heading title='Settings' description='Manage store Preferences' />
				{/* The button component will be added to close the store  */}
				<Button variant='destructive' size='icon' onClick={() => {}}>
					{/* It is going to hold the icon that can serve as a recycling bin icon */}
					<Trash className='h-4 w-4' />
				</Button>
			</div>
		</>
	);
};
