///this is the page of the route that will be redirected to when the size link is clicked on in the navigation bar
import { format } from "date-fns"; ///format used to convert date to string

import prismadb from "@/lib/prismadb";

import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";

///we want to use prisma to fetch all available sizes for active store
const SizesPage = async ({ params }: { params: { storeId: string } }) => {
	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
		// to order by newest - descending
		orderBy: {
			createdAt: "desc",
		},
	});

	///so instead of passing the sizes directly into the sizes client we pass it as a mapped item using our column we just defined
	const formattedSizes: SizeColumn[] = sizes.map((item) => ({
		id: item.id,
		name: item.name,
		value: item.value,
		createdAt: format(item.createdAt, "MMM do, yyyy"), ///mmm do,yyyy is the format we want our created date farmatted in
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<SizesClient data={formattedSizes} />
			</div>
		</div>
	);
};

export default SizesPage;
