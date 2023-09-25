"use client";
import { Button } from "@/components/ui/button";
///Column Definition for our Data table FROM shadcn UI library

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type BillboardColumn = {
	id: string;
	label: string;
	createdAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
	{
		///the acessory key must match either the id label or createdAT variables we declared in the Column type: used to define the shape of our data
		accessorKey: "label",
		header: "Label",
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
];
