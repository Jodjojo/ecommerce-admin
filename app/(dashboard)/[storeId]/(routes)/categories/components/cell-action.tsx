///component that will be used for direct execution of operations from the dat table
"use client";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { CategoryColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";

///create an interface to handle thew props of the CellAction
interface CellActionProps {
	data: CategoryColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
	///we will use the Router and params to reroute the category to the update page
	const router = useRouter();
	const params = useParams();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	///to handle the OnCopy function for the cellaction
	const onCopy = (id: string) => {
		///we will use the naviagtor clipboard property and write store the description text as its text that is to be copied
		navigator.clipboard.writeText(id);
		///we use Toast to send the success message
		toast.success("Category Id copied to the clipboard");
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			///we use the axios package to delete the route we establish using the store id
			await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
			///then we refresh the router
			router.refresh();
			///pass in a success message using toast
			toast.success("Category deleted.");
		} catch (error) {
			toast.error(
				"Make sure you removed all products using this Category first."
			);
		} finally {
			///we set the loading to be flase and the setOpen to be false so after we can close the Modal
			setLoading(false);
			setOpen(false);
		}
	};
	///we will use the dropdownmenu frokm shadcn ui
	return (
		///we will arap the entire dropdown menu in a fragment so we can call the alert modal
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						{/* SR only means it will only be visible with screen readers ---accessiblity feature*/}
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				{/* The content that will be displayed when the trigger is clicked and aligned-end is alignment  */}
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					{/* Copy down of category id from data */}
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className='mr-2 h-4 w-4' />
						Copy Id
					</DropdownMenuItem>

					{/* For the update we will reroute to the page of the update  using the current category id which is stored in data.id */}
					<DropdownMenuItem
						onClick={() =>
							router.push(`/${params.storeId}/categories/${data.id}`)
						}
					>
						<Edit className='mr-2 h-4 w-4' />
						Update
					</DropdownMenuItem>

					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className='mr-2 h-4 w-4' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default CellAction;
