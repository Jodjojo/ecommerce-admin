"use client";

import * as z from "zod";
import { useState } from "react";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

///We use the interface to pass the store into the  settings form
interface SettingsFormProps {
	initialData: Store;
}

///Add the form Schema to store the model for the form using Zod
const formSchema = z.object({
	///the name of schema ppt then z.type.minimum character expected
	name: z.string().min(1),
});

///The type for the settings form values to make the schema reusable
type SettingsFormValues = z.infer<typeof formSchema>;

/// Handle the interface below
export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
	///set usestates that will handle form loading and opening and the alert modal
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	///create form for settings AND use the reusable settings form values
	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema), ///passing the schema into the zod resolver to create the form
		defaultValues: initialData, ///giving it default values of the initial data which is the prop we are passing in
	});

	///create our own on submit function for handling what is executed on submit
	const onSubmit = async (data: SettingsFormValues) => {
		console.log(data);
	};

	return (
		///We will encapsulate everything in a frag   ment so we can add spacing between it and the other parts of the form we will add later
		<>
			<div className='flex items-center justify-between'>
				<Heading title='Settings' description='Manage store Preferences' />
				{/* The button component will be added to close the store  */}
				<Button variant='destructive' size='icon' onClick={() => {}}>
					{/* It is going to hold the icon that can serve as a recycling bin icon */}
					<Trash className='h-4 w-4' />
				</Button>
			</div>
			{/* We add a separator from shad cn ui */}
			<Separator />
			{/* Where the form component will be created using the form component from shadcn then we spread the form resolved we created above as a prop */}
			<Form {...form}>
				{/* we then pass in the normal html form and handle the onSubmit function */}
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full'
				>
					{/* This div will store the contents and properties of control of the form in grid */}
					<div className='grid grid-cols-3 gap-8'>
						{/* FormField is going to be used to control the overall form field */}
						<FormField
							control={form.control}
							name='name'
							///The render prop will render the content in form items
							render={({ field }) => (
								<FormItem>
									{/* Form label is label of form input */}
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Store name'
											{...field} ///we spread the field so the input automatticaly gets all the onChange, onBlur and values from the formfield
										/>
									</FormControl>
									{/* We use form messager to give a proper error if there is a problem in form field */}
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					{/* Setting the button prop to disabled on Loading makes it inactive when button is loading */}
					<Button disabled={loading} className='ml-auto' type='submit'>
						Save Changes
					</Button>
				</form>
			</Form>
		</>
	);
};
