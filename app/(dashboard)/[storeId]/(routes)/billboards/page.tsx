///this is the page of the route that will be redirected to when the billboard link is clicked on in the navigation bar

import { BillboardClient } from "./components/client";

const BillboardsPage = () => {
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<BillboardClient />
			</div>
		</div>
	);
};

export default BillboardsPage;
