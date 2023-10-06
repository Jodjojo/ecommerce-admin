///this is the navabr component that will be rendered in the navigation bar section of the page

import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";

const Navbar = async () => {
	///We use the navbar component to fetch all the availble stores for active user for the store Switcher
	const { userId } = auth();

	///Then we autheticate to ensure there is a userId else we rediirect to the sign-in route
	if (!userId) {
		redirect("/sign-in");
	}

	///We then use Prismadb to find all the store availble to userId
	const stores = await prismadb.store.findMany({
		where: {
			userId,
		},
	});

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4 overflow-scroll'>
				{/* This is where the button for switching stores will stay */}
				{/*  */}
				{/* We then pass the stores we found as the items prop into the Store Switcher component */}
				<StoreSwitcher items={stores} />
				{/* This will be the routes ie the Main Nav */}
				<MainNav className='mx-6' />
				<div className='ml-auto flex items-center space-x-4'>
					{/* ///theme toggle for dark mode from shadcn ui */}
					<ThemeToggle />
					{/* User button from the Clerk js authentication for the currently logged in user */}
					{/* We are setting the after signoutUrl to redirect to the root page after sign out */}
					<UserButton afterSignOutUrl='/' />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
