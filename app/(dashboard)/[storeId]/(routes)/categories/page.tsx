///this is the page of the route that will be redirected to when the category link is clicked on in the navigation bar
import { format } from "date-fns"; ///format used to convert date to string

import prismadb from "@/lib/prismadb";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

///we want to use prisma to fetch all available categories for active store
const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
	const categories = await prismadb.category.findMany({
		where: {
			storeId: params.storeId,
		},
		///we use the include to populate the relationship the category has with the billboard
		include: {
			billboard: true,
		},
		// to order by newest - descending
		orderBy: {
			createdAt: "desc",
		},
	});

	///so instead of passing the categories directly into the categories client we pass it as a mapped item using our column we just defined
	const formattedCategories: CategoryColumn[] = categories.map((item) => ({
		id: item.id,
		name: item.name,
		billboardLabel: item.billboard.label,
		createdAt: format(item.createdAt, "MMM do, yyyy"), ///mmm do,yyyy is the format we want our created date farmatted in
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<CategoryClient data={formattedCategories} />
			</div>
		</div>
	);
};

export default CategoriesPage;
