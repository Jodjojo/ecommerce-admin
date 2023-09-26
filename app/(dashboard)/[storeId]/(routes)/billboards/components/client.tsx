"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

///we create an interface that will handle the data as an argument into the billboard client from the billboardColumn
interface BillboardClientProps {
	data: BillboardColumn[];
}

/// client component where we are going to load all our billboards from

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
	/// We add a router to this client to handle the rerouting for creating new billboard and then the params that will store the id
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				{/* We will then use the reusable heading and button component we had created in the components folder  */}
				<Heading
					///Dynamically render billboard heading
					title={`Billboards (${data.length})`}
					description='Manage billboards for your store'
				/>
				{/* we add the click function to the button for handling the rerouting on click of that new button */}
				<Button
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					{/* We will use the plus icon from Lucide React */}
					<Plus className='mr-2 h-4 w-4' />
					Add new
				</Button>
			</div>
			<Separator />
			{/* 	We will then add a data table here: pass the columns from the one we created in components folder and render the data from the interface   */}
			{/* /We set the searchkey to label so that is what the prop searches through */}
			<DataTable columns={columns} data={data} searchKey='label' />
			{/* /Below the Data table we want to render the API lists for the billboards the way we did on the settings page */}
			<Heading title='API' description='API calls for Billboards' />
			<Separator />
			<ApiList entityName='billboards' entityIdName='billboardId' />
		</>
	);
};
