///this component will handle the image uploading using Next-Cloudinary platform
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

/// we create an interface to store the props that will connect our cloudinary to our platform
interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	///preventing hydration errors
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	///we want to declare our own onUpload function and what it takes
	///we use the result and set it to any since the cloudinary doesnt limit it
	const onUpload = (result: any) => {
		///the result that will be executed onChnage of imageUrl
		onChange(result.info.secure_url);
	};

	if (!isMounted) {
		return null; //if in server side rendering return null to preventy hydration error
	}

	return (
		<div>
			<div className='nb-4 flex items-center gap-4'>
				{/* We iterate over the values which is an array of string containing the image url */}
				{/* In the map is where we render the divs of the create new billboards we are going to create setting the key as the url itterate per itteration  */}
				{value.map((url) => (
					<div
						key={url}
						className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
					>
						<div className='z-10 absolute top-2 right-2'>
							{/* We import the button from our reusable button component then we use the trash icon from lucide then onClick of the button we want to remove the current url iterate  */}
							<Button
								type='button'
								onClick={() => onRemove(url)}
								variant='destructive'
								size='icon'
							>
								<Trash className='h-4 w-4' />
							</Button>
						</div>
						{/* We then use the image component from Next image and then make the image source the current iterate url */}
						<Image fill className='object-cover' alt='Image' src={url} />
					</div>
				))}
			</div>
			{/* We use the upload widget from Next cloudinary to open a format where we can upload the image url ourselves also */}
			{/* We create an upload preset on the next cloudinary account under the upload sidebar */}
			<CldUploadWidget onUpload={onUpload} uploadPreset='ttq2assr'>
				{/* We get the open prop directly from the cldUploadWidget */}
				{/* We create an Onclick function in this that automatically returns the Open Prop */}
				{({ open }) => {
					const onClick = () => {
						open();
					};

					/// We return a button that will render our Upload widget and return it
					return (
						<Button
							type='button'
							disabled={disabled}
							variant='secondary'
							onClick={onClick}
						>
							<ImagePlus className='h-4 w-4 mr-2' />
							Upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
