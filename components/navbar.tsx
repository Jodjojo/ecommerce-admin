///this is the navabr component that will be rendered in the navigation bar section of the page

import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";

const Navbar = () => {
	return (
		<div className='border-b '>
			<div className='flex h-16 items-center px-4'>
				{/* This is where the button for switching stores will stay */}
				<StoreSwitcher />
				{/* This will be the routes ie the Main Nav */}
				<MainNav className='mx-6' />
				<div className='ml-auto flex items-center space-x-4'>
					{/* User button from the Clerk js authentication for the currently logged in user */}
					{/* We are setting the after signoutUrl to redirect to the root page after sign out */}
					<UserButton afterSignOutUrl='/' />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
