///this is going to give alerts on change of API routes
"use client";

import { Copy, Server } from "lucide-react";
import toast from "react-hot-toast";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

///we create an interface that will handle the props of the API alert Modal
interface ApiAlertProps {
	title: string;
	description: string;
	variant: "public" | "admin";
}

///we then use a textMap
///TextMap transcript management software creates a searchable database of your electronic transcripts
///the first prop will be the interface we created then the second prop will be the type of variable
const textMap: Record<ApiAlertProps["variant"], string> = {
	public: "Public",
	admin: "Admin",
};

///alternative output of the textmap
const VariantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
	public: "secondary",
	admin: "destructive",
};

///we then create the modal function for the API Alert

///REACT.FC stands for REACT.FUNCTIONAL COMPONENT

export const ApiAlert: React.FC<ApiAlertProps> = ({
	///we destructure the props from the interface into this
	title,
	description,
	variant = "public",
}) => {
	const onCopy = () => {
		///we will use the naviagtor clipboard property and write store the description text as its text that is to be copied
		navigator.clipboard.writeText(description);
		///we use Toast to send the success message
		toast.success("API Route copied to the clipboard");
	};
	return (
		<Alert>
			{/* Server icon from lucide react */}
			<Server className='h-4 w-4' />
			{/* We use the Alert Title component that we have already created */}
			<AlertTitle className='flex items-center gap-x-2'>
				{title}
				{/* We want to display the variant as a badge so we use the badge from shad cn and then pass in the textMap and the variant */}
				<Badge variant={VariantMap[variant]}>{textMap[variant]}</Badge>
			</AlertTitle>
			{/* We use the alert description to give descriptions of the alert */}
			<AlertDescription className='mt-4 flex items-center justify-between'>
				{/* code is a native html element that displays its contents styled in a fashion intended to indicate that the text is a short fragment of computer code*/}
				<code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
					{description}
				</code>
				<Button variant='outline' size='icon' onClick={onCopy}>
					{/* The Onclick function is going to be a copy function that copies that Api route */}
					{/* The copy icon from Lucide react */}
					<Copy className='h-4 w-4' />
				</Button>
			</AlertDescription>
		</Alert>
	);
};
