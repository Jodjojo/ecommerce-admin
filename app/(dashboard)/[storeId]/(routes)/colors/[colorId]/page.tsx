///This is the page that will be rendered when the click new button on the billboards page is clicked on

import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({
	///extract the params
	params,
}: {
	params: { colorId: string };
}) => {
	/// fetch an existing color using the id in our url
	const color = await prismadb.color.findUnique({
		where: {
			id: params.colorId, ///this is technically pointing to a new form for the creation of a new color
		},
	});

	///we dynamically render the form if it is for a new dashboard to be created for for the admin to update or edit existing color
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ColorForm initialData={color} />
			</div>
		</div>
	);
};

export default ColorPage;
