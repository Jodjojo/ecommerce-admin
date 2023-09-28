///This is the page that will be rendered when the click new button on the billboards page is clicked on

import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
	///extract the params
	params,
}: {
	params: { productId: string };
}) => {
	/// fetch an existing product using the id in our url
	const product = await prismadb.product.findUnique({
		where: {
			id: params.productId, ///this is technically pointing to a new form for the creation of a new product
		},
		///we include the images Model since we want to load several images from there
		include: {
			images: true,
		},
	});

	///we dynamically render the form if it is for a new dashboard to be created for for the admin to update or edit existing product
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ProductForm initialData={product} />
			</div>
		</div>
	);
};

export default ProductPage;
