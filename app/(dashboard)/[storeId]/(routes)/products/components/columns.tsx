"use client";
import { Button } from "@/components/ui/button";
///Column Definition for our Data table FROM shadcn UI library

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import CellAction from "./cell-action";

export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	size: string;
	category: string;
	color: string;
	isFeatured: boolean;
	isArchived: boolean;
	createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		///the acessory key must match either the id name or createdAT variables we declared in the Column type: used to define the shape of our data
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "isArchived",
		header: "Archived",
	},
	{
		accessorKey: "isFeatured",
		header: "Featured",
	},
	{
		accessorKey: "price",
		header: "Price",
	},
	{
		accessorKey: "category",
		header: "Category",
	},
	{
		accessorKey: "size",
		header: "Size",
	},
	{
		accessorKey: "color",
		header: "Color",
		///we create a uniwue cell that handles the row action of showing the original color in the div
		///we are using row.original.color here and not value because we mapped the value property to the color variable in the page.tsx
		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.color}
				<div
					className='h-6 w-6 rounded-full border'
					style={{ backgroundColor: row.original.color }}
				/>
			</div>
		),
	},
	{
		accessorKey: "createdAt",
		///sorting for the createdAt Column
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Date
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		///for executing cell actions
		id: "actions",
		///for the cell we are going to pass the data as the row original to access the original object the cell is working with
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
