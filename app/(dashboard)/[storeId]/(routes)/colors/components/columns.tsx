"use client";
import { Button } from "@/components/ui/button";
///Column Definition for our Data table FROM shadcn UI library

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import CellAction from "./cell-action";

export type ColorColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
	{
		///the acessory key must match either the id name, value or createdAT variables we declared in the Column type: used to define the shape of our data
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "value",
		header: "Value",
		///we are going to have a special row that will display the color and the original value of the color and fine style
		cell: ({ row }) => (
			<div className='flex items-center gap-x-2'>
				{row.original.value}
				<div
					className='h-6 w-6 rounded-full border'
					style={{ backgroundColor: row.original.value }} ///setting the styling of the row to accomodate tailwing compiling
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
