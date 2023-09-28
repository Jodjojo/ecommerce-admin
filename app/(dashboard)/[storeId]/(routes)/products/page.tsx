///this is the page of the route that will be redirected to when the product link is clicked on in the navigation bar
import { format } from "date-fns"; ///format used to convert date to string

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

///we want to use prisma to fetch all available products for active store
const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			///we are including these relations we attached to the products model so we can access these individual models from the product model
			category: true,
			size: true,
			color: true,
		},
		// to order by newest - descending
		orderBy: {
			createdAt: "desc",
		},
	});

	///so instead of passing the products directly into the products client we pass it as a mapped item using our column we just defined
	const formattedProducts: ProductColumn[] = products.map((item) => ({
		id: item.id,
		name: item.name,
		isFeatured: item.isFeatured,
		isArchived: item.isArchived,
		price: formatter.format(item.price.toNumber()), ///we use the formatter we created to turn it to USD and the toNumber to turn it to Number since we established it as a decimal initially in the model
		category: item.category.name,
		size: item.size.name,
		color: item.color.value,
		createdAt: format(item.createdAt, "MMM do, yyyy"), ///mmm do,yyyy is the format we want our created date farmatted in
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<ProductClient data={formattedProducts} />
			</div>
		</div>
	);
};

export default ProductsPage;
