///component that will be used for direct execution of operations from the dat table
"use client";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { BillboardColumn } from "./columns";

///create an interface to handle thew props of the CellAction
interface CellActionProps {
	data: BillboardColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
	///to handle the OnCopy function for the cellaction
	const onCopy = (id: string) => {
		///we will use the naviagtor clipboard property and write store the description text as its text that is to be copied
		navigator.clipboard.writeText(id);
		///we use Toast to send the success message
		toast.success("Billboard Id copied to the clipboard");
	};
	///we will use the dropdownmenu frokm shadcn ui
	return (
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

				{/* Copy down of billboard id from data */}
				<DropdownMenuItem onClick={() => onCopy(data.id)}>
					<Copy className='mr-2 h-4 w-4' />
					Copy Id
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Edit className='mr-2 h-4 w-4' />
					Update
				</DropdownMenuItem>

				<DropdownMenuItem>
					<Trash className='mr-2 h-4 w-4' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default CellAction;
