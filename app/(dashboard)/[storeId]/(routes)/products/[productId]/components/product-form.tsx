"use client";
///the form that will be created or activated when a user wants to create a new product or update an existing one
///we use the settings form format as a template for this form

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Product } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";

///Add the form Schema to store the model for the form using Zod
const formSchema = z.object({
	///the name of product schema ppt then z.type.minimum character expected
	name: z.string().min(1),
	///the image URL of the product schema
	images: z.object({ url: z.string() }).array(),
	///since the price is initially in decimal we use coerce to change it automatically to number
	price: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	colorId: z.string().min(1),
	sizeId: z.string().min(1),
	///since our isFeatured value is a boolean we use z.boolean and make it optional so the form can still work
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
});

///The type for the settings form values to make the schema reusable
type ProductFormValues = z.infer<typeof formSchema>;

///We use the interface to pass the store into the  settings form
interface ProductFormProps {
	///since we want to also have access to the Image Model alongside the Products model as the initial data we can then further include the images model from prisma client
	initialData:
		| (Product & {
				images: Image[];
		  })
		| null;
}

/// Handle the interface below
export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
	///we get our params so we can dynamically return to the store id router after update
	const params = useParams();
	///we will also need a router
	const router = useRouter();

	///set usestates that will handle form loading and opening and the alert modal
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	///we create new variables that will help check if there is initial data (ie product aready exists)to dynamically edit the props  of the product form else we create a new product
	const title = initialData ? "Edit Product" : "Create Product";
	const description = initialData ? "Edit a Product" : "Add a new Product";
	const toastMessage = initialData ? "Product updated." : "Product created.";
	const action = initialData ? "Save changes" : "Create";

	///create form for settings AND use the reusable settings form values
	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema), ///passing the schema into the zod resolver to create the form

		///we change the use of the initial data in this product form becasue we have the price switch from decimal to number so we ask if theres the destructure initial data we use price as the initial data price else we use the default values we set where price has a value of 0
		defaultValues: initialData
			? {
					...initialData,
					price: parseFloat(String(initialData?.price)),
			  }
			: {
					name: "",
					images: [],
					price: 0,
					categoryId: "",
					colorId: "",
					sizeId: "",
					isFeatured: false,
					isArchived: false,
			  }, ///giving it default values of the initial data which is the prop we are passing in and setting it automatically to empty strings if the initial Data does not exist which is a product schema
	});

	///create our own on submit function for handling what is executed on submit
	const onSubmit = async (data: ProductFormValues) => {
		try {
			///setLoading to true
			setLoading(true);
			///we will wrap this whole routing to the if clause of if we have initial data
			if (initialData) {
				///if there is no initial data then we want to edit this route
				await axios.patch(
					`/api/${params.storeId}/products/${params.productId}`,
					data
				);
			} else {
				///we want to create a new billboar
				await axios.post(`/api/${params.storeId}/products`, data);
			}
			///to resync server component which fetches our store and calls it again to get our new updated data
			router.refresh();
			///After we submit our page we want to redirect back to the home products page
			router.push(`/${params.storeId}/products`);
			///we then fire toast to toast Message according to whether we have initial data or not
			toast.success(toastMessage);
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
			await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
			///then we refresh the router
			router.refresh();
			///router.push to reroute back to a particular route after event has been executed
			router.push(`/${params.storeId}/products`); ///which is the root route

			///pass in a success message using toast
			toast.success("Product deleted.");
		} catch (error) {
			///even though we have not implemented products and categories, it wont be possible when we are done to delete stores with active products and categories available
			toast.error(
				"Make sure you removed all Categories using this product first."
			);
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
				<Heading title={title} description={description} />
				{/* The button component will be added to close the store  */}
				{/* We put a conditional to determine if that delete button will show i this product form like the settings form or not*/}
				{initialData && (
					<Button
						disabled={loading}
						variant='destructive'
						size='icon'
						onClick={() => setOpen(true)} ///onClick is going to setOpen to true meaning to open the modal
					>
						{/* It is going to hold the icon that can serve as a recycling bin icon */}
						<Trash className='h-4 w-4' />
					</Button>
				)}
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
					{/* ///////////////////////////////////////// */}
					{/* Reusing the Form field here for the add new Image form  */}
					<FormField
						control={form.control}
						name='images'
						///The render prop will render the content in form items
						render={({ field }) => (
							<FormItem>
								{/* Form name is name of form input */}
								<FormLabel>Images</FormLabel>
								<FormControl>
									{/* We then add the imageUpload component we just created */}
									{/* Since the imageUpload component expects an array of field values we use the conditional in an array */}
									<ImageUpload
										///For the value we expect an array of images so we map over the image model from prisma
										value={field.value.map((image) => image.url)}
										disabled={loading}
										///we want to add the url to the already existing array of urls so we spread the field value and add the url
										onChange={(url) =>
											field.onChange([...field.value, { url }])
										}
										///for the OnDelete we want to check that the current is not equal to the full url array of field value and only selected image to delete then delete
										onRemove={(url) =>
											field.onChange([
												...field.value.filter((current) => current.url !== url),
											])
										}
									/>
								</FormControl>
								{/* We use form messager to give a proper error if there is a problem in form field */}
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* This div will store the contents and properties of control of the form in grid */}
					<div className='grid grid-cols-3 gap-8'>
						{/* FormField is going to be used to control the overall form field */}
						<FormField
							control={form.control}
							name='name'
							///The render prop will render the content in form items
							render={({ field }) => (
								<FormItem>
									{/* Form name is name of form input */}
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Product Label'
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
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};
