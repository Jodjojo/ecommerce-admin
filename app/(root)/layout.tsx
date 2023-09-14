import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

///Creating a new layout in the root page of the app route

export default async function SetupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	///extract user Id and check if userId exists
	const { userId } = auth();

	///if user id does not exist redirect to sign-in route
	if (!userId) {
		redirect("/sign-in");
	}

	///else find the first active store our user has else show the modal to create a first store if the user does not already have one
	const store = await prismadb.store.findFirst({
		where: {
			userId,
		},
	});

	///if store exists then we redirect to the store Id using template literals that would send this to the dashboard layout to check for store then render navigation bar
	if (store) {
		redirect(`/${store.id}`);
	}

	///otherwise we return a fragment with children
	return <>{children}</>;
}
