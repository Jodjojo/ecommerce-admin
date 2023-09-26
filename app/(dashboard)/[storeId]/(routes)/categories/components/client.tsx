"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

import { CategoryColumn, columns } from "./columns";
///we create an interface that will handle the data as an argument into the category client from the billboardColumn
interface CategoryClientProps {
	data: CategoryColumn[];
}

/// client component where we are going to load all our categories from

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
	/// We add a router to this client to handle the rerouting for creating new category and then the params that will store the id
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				{/* We will then use the reusable heading and button component we had created in the components folder  */}
				<Heading
					///Dynamically render category heading
					title={`Categories (${data.length})`}
					description='Manage categories for your store'
				/>
				{/* we add the click function to the button for handling the rerouting on click of that new button */}
				<Button
					onClick={() => router.push(`/${params.storeId}/categories/new`)}
				>
					{/* We will use the plus icon from Lucide React */}
					<Plus className='mr-2 h-4 w-4' />
					Add new
				</Button>
			</div>
			<Separator />
			{/* 	We will then add a data table here: pass the columns from the one we created in components folder and render the data from the interface   */}
			{/* /We set the searchkey to label so that is what the prop searches through */}
			<DataTable columns={columns} data={data} searchKey='name' />
			{/* /Below the Data table we want to render the API lists for the categories the way we did on the settings page */}
			<Heading title='API' description='API calls for Categories' />
			<Separator />
			<ApiList entityName='categories' entityIdName='categoriesId' />
		</>
	);
};
