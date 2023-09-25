///this is the page of the route that will be redirected to when the billboard link is clicked on in the navigation bar
import { format } from "date-fns"; ///format used to convert date to string

import prismadb from "@/lib/prismadb";

import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";

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

	///so instead of passing the billboards directly into the billboards client we pass it as a mapped item using our column we just defined
	const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
		id: item.id,
		label: item.label,
		createdAt: format(item.createdAt, "MMM do, yyyy"), ///mmm do,yyyy is the format we want our created date farmatted in
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<BillboardClient data={formattedBillboards} />
			</div>
		</div>
	);
};

export default BillboardsPage;
