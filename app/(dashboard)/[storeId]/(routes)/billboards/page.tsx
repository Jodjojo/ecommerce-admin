///this is the page of the route that will be redirected to when the billboard link is clicked on in the navigation bar

import prismadb from "@/lib/prismadb";

import { BillboardClient } from "./components/client";

///we want to use prisma to fetch all available billboards for active store
const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
	const billboards = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
		// to order by newest - descending
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<BillboardClient data={billboards} />
			</div>
		</div>
	);
};

export default BillboardsPage;
