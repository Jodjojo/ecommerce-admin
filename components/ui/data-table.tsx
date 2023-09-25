"use client";

///the data table component we will use for the billboards page gotten from the shadcn Ui library

///sorting
import * as React from "react";
import {
	ColumnDef,
	SortingState, ///sorting model from Shadcn
	ColumnFiltersState, ///filtering table from shadcn
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel, ///we use the model from Shadcn for pagination
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

///we import the button component here
import { Button } from "@/components/ui/button";
//we import input component here
import { Input } from "@/components/ui/input";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	///we want to make searching and filtering dynamic so we create a searchkey prop
	searchKey: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
}: DataTableProps<TData, TValue>) {
	////sorting
	const [sorting, setSorting] = React.useState<SortingState>([]);
	///filtering
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(), ///we execute the pagination model from shadcn here
		////sorting
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		///filtering
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting, ///sorting
			columnFilters, ///filtering
		},
	});

	return (
		<div>
			{/* ///filtering using the shadcn component and filtering the label column*/}
			<div className='flex items-center py-4'>
				<Input
					placeholder='Search'
					value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
			</div>
			{/* ////////////// */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
