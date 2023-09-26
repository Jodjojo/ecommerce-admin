///This is the page that will be rendered when the click new button on the billboards page is clicked on

import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
	///extract the params
	params,
}: {
	params: { sizeId: string };
}) => {
	/// fetch an existing size using the id in our url
	const size = await prismadb.size.findUnique({
		where: {
			id: params.sizeId, ///this is technically pointing to a new form for the creation of a new size
		},
	});

	///we dynamically render the form if it is for a new dashboard to be created for for the admin to update or edit existing size
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<SizeForm initialData={size} />
			</div>
		</div>
	);
};

export default SizePage;
