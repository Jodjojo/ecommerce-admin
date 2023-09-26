"use client";
import { Button } from "@/components/ui/button";
///Column Definition for our Data table FROM shadcn UI library

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import CellAction from "./cell-action";

export type SizeColumn = {
	id: string;
	name: string;
	value: String;
	createdAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
	{
		///the acessory key must match either the id name, value or createdAT variables we declared in the Column type: used to define the shape of our data
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "value",
		header: "Value",
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
