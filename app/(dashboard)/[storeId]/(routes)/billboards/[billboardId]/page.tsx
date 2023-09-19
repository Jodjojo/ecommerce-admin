///This is the page that will be rendered when the click new button on the billboards page is clicked on

import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
	///extract the params
	params,
}: {
	params: { billboardId: string };
}) => {
	/// fetch an existing billboard using the id in our url
	const billboard = await prismadb.billboard.findUnique({
		where: {
			id: params.billboardId, ///this is technically pointing to a new form for the creation of a new billboard
		},
	});

	///we dynamically render the form if it is for a new dashboard to be created for for the admin to update or edit existing billboard
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<BillboardForm initialData={billboard} />
			</div>
		</div>
	);
};

export default BillboardPage;
