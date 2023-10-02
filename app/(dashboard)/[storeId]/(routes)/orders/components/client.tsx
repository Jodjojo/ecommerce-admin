"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

///we create an interface that will handle the data as an argument into the billboard client from the billboardColumn
interface OrderClientProps {
	data: OrderColumn[];
}

/// client component where we are going to load all our orders from

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
	return (
		<>
			<Heading
				///Dynamically render billboard heading
				title={`Orders (${data.length})`}
				description='Manage orders for your store'
			/>

			<Separator />
			{/* 	We will then add a data table here: pass the columns from the one we created in components folder and render the data from the interface   */}
			{/* /We set the searchkey to label so that is what the prop searches through */}
			<DataTable columns={columns} data={data} searchKey='products' />
			{/* /Below the Data table we want to render the API lists for the orders the way we did on the settings page */}
		</>
	);
};
