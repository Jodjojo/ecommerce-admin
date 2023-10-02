"use client";
import { Button } from "@/components/ui/button";
///Column Definition for our Data table FROM shadcn UI library

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type OrderColumn = {
	id: string;
	phone: string;
	address: string;
	isPaid: boolean;
	totalPrice: string;
	products: string;
	createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{
		///the acessory key must match either the id label or createdAT variables we declared in the Column type: used to define the shape of our data
		accessorKey: "products",
		header: "Products",
	},
	{
		accessorKey: "phone",
		header: "Phone",
	},
	{
		accessorKey: "address",
		header: "Address",
	},
	{
		accessorKey: "totalPrice",
		header: "Total Price",
	},
	{
		accessorKey: "isPaid",
		header: "Paid",
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
