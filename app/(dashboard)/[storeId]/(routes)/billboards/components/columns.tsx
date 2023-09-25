"use client";
///Column Definition for our Data table FROM shadcn UI library

import { ColumnDef } from "@tanstack/react-table";

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
		header: "Date",
	},
];
