///this component will handle the image uploading using Next-Cloudinary platform
"use client";

import { useEffect, useState } from "react";

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

	return <div>ImageUpload</div>;
};

export default ImageUpload;
