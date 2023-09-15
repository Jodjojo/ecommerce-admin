///This page will handle the rerouting to the settings page when the settings icon on the dashboard is clicked

import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";
//We will use an interface Setting to get the params so we can authenticate user
interface SettingPageProps {
	params: {
		storeId: string;
	};
}

///This is how user Interfaces are infused into our component pages to get children and params from contents
const SettingsPage: React.FC<SettingPageProps> = async ({ params }) => {
	///check user from Clerk Authtication
	const { userId } = auth();

	///Redirect to userId if it doesnt exist
	if (!userId) {
		redirect("/sign-in");
	}

	///Find the store from the parameters
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	});

	///Redirect to home if no store
	if (!store) {
		redirect("/");
	}

	return (
		<div className='flex-col '>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* We create a new component that will be rendered here called the settings form. Since this component will only be used in this interface we can create it in the settings folder*/}
				{/* We also pass ion the store to serve as initial data for settings form to prefill input of settings*/}
				<SettingsForm initialData={store} />
			</div>
		</div>
	);
};

export default SettingsPage;
