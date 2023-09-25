"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

///we create an interface that will handle the data as an argument into the billboard client from the billboard page
interface BillboardClientProps {
	data: Billboard[];
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
		</>
	);
};
