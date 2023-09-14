import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function DahboardLayout({
	children,
	params, ///what the storeId will be stored in
}: {
	children: React.ReactNode;
	params: { storeId: string }; //params stores the store id for each store created in a string
}) {
	///check if youre logged in by checking using the clerk authentication
	const { userId } = auth();

	/// if not signed in then redirect the route to the sign-in route
	if (!userId) {
		redirect("/sign-in");
	}

	///fetch the available store id and see if the exist
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	});

	///check if the store does not exist and then redirect to home page
	if (!store) {
		redirect("/");
	}

	///else we return a fragment that will in the future return a nav bar
	return (
		<>
			<div>This will be a nav bar</div>
			{children}
		</>
	);
}
