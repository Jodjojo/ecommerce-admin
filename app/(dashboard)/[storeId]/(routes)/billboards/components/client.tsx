"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

/// client component where we are going to load all our billboards from

export const BillboardClient = () => {
	/// We add a router to this client to handle the rerouting for creating new billboard and then the params that will store the id
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className='flex items-center justify-between'>
				{/* We will then use the reusable heading and button component we had created in the components folder  */}
				<Heading
					title='Billboards {0}'
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
		</>
	);
};
