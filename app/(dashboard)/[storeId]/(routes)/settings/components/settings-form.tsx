"use client";

import * as z from "zod";
import { useState } from "react";
import { Store } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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
import { AlertModal } from "@/components/modals/alert-modal";

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
	///we get our params so we can dynamically return to the store id router after update
	const params = useParams();
	///we will also need a router
	const router = useRouter();
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
		try {
			///setLoading to true
			setLoading(true);

			///to reroute to the api of the store id after update
			await axios.patch(`/api/stores/${params.storeId}`, data);
			///to resync server component which fetches our store and calls it again to get our new updated data
			router.refresh();

			///we then fire toast to show sucess message
			toast.success("Store Updated");
		} catch (error) {
			///we use the toast error to display the error message
			toast.error("Something went wrong");
		} finally {
			///reset the loading to false
			setLoading(false);
		}
	};

	///we create our On delete function on what will be executed when we click that Confirm button
	const onDelete = async () => {
		try {
			setLoading(true);
			///we use the axios package to delete the route we establish using the store id
			await axios.delete(`/api/stores/${params.storeId}`);
			///then we refresh the router
			router.refresh();
			///router.push to reroute back to a particular route after event has been executed
			router.push("/"); ///which is the root route

			///pass in a success message using toast
			toast.success("Store deleted.");
		} catch (error) {
			///even though we have not implemented products and categories, it wont be possible when we are done to delete stores with active products and categories available
			toast.error("Make sure you removed all Products and Categories first ");
		} finally {
			///we set the loading to be flase and the setOpen to be false so after we can close the Modal
			setLoading(false);
			setOpen(false);
		}
	};
	return (
		///We will encapsulate everything in a frag   ment so we can add spacing between it and the other parts of the form we will add later
		<>
			{/* We add the Alert Modal we created for the delete process to the Settings form */}
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete} ///we use the onDelete function to be executed when we confirm we want to delete
				loading={loading}
			/>

			{/*  */}
			<div className='flex items-center justify-between'>
				<Heading title='Settings' description='Manage store Preferences' />
				{/* The button component will be added to close the store  */}
				<Button
					disabled={loading}
					variant='destructive'
					size='icon'
					onClick={() => setOpen(true)} ///onClick is going to setOpen to true meaning to open the modal
				>
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
