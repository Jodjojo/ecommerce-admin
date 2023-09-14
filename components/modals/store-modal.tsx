"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

/// Create a schema using zod to store the form
const formSchema = z.object({
	name: z.string().min(1),
});

//Running the modal is open and on Close functions from the modal component we created to handle the hook
export const StoreModal = () => {
	const StoreModal = useStoreModal();

	///Create a new usestate for the Store model
	const [loading, setLoading] = useState(false);

	/// define hook for form
	const form = useForm<z.infer<typeof formSchema>>({
		///use a zod resolver to validate the form using zod
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	///use an async onSubmit function that will be triggered

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		///Run the modal store handling using the try, catch and finally option
		try {
			setLoading(true);

			///Create a new store using axios to create the api endpoint for the store using the values from the form which is saved from the default values
			///The /api/stores routing is the equivalent of the next 13 folder routing since the stores folder is in the api folder under app main folder
			const response = await axios.post("/api/stores", values);

			///to immediately redirect to the dashboard after each store is created
			///since the response stores the data that is newly created
			///window.location.asign will do a complete refresh on our page making the new store 100% loaded in the database
			window.location.assign(`/${response.data.id}`);
		} catch (error) {
			///use the react-hot-toast to display an error that something went wrong
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};
	return (
		<Modal
			title='Create Store'
			description='Add a new store to manage products and categories'
			isOpen={StoreModal.isOpen}
			onClose={StoreModal.onClose}
		>
			<div>
				<div className='space-y-4 py-2 pb-4'>
					{/* ///use our own onSubmit function to be handled on the onSubmit form and use the various components from the ui/form to set the items of the form */}
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											{/* /// pass input and spread the entire field prop  into it that has all the on functions of the input normally */}
											<Input
												placeholder='E-commerce'
												{...field}
												disabled={loading} /// using the useState Loading we just created
											/>
										</FormControl>
										{/* ///Use of form Message for setting error messages or other types of messages we want to see on the form */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
								{/* ///run 2 buttons one for submit using the storeModal onClose function then the other with the type set to submit, */}
								<Button
									variant='outline'
									onClick={StoreModal.onClose}
									disabled={loading} ///to prevent user from canceling if its loading
								>
									Cancel
								</Button>
								<Button type='submit' disabled={loading}>
									Continue
								</Button>
								{/* To prevent user from resubmitting form when it is already loading */}
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	);
};
