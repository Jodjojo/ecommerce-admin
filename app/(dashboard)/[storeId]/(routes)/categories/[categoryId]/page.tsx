///This is the page that will be rendered when the click new button on the billboards page is clicked on

import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
	///extract the params
	params,
}: {
	params: { categoryId: string; storeId: string };
}) => {
	/// fetch an existing category using the id in our url
	const category = await prismadb.category.findUnique({
		where: {
			id: params.categoryId, ///this is technically pointing to a new form for the creation of a new category
		},
	});

	///we want to fetch our billboards
	const billboards = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	///we dynamically render the form if it is for a new dashboard to be created for for the admin to update or edit existing category
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<CategoryForm billboards={billboards} initialData={category} />
			</div>
		</div>
	);
};

export default CategoryPage;
