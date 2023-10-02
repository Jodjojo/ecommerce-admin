"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { useParams, usePathname } from "next/navigation";

///This will be the interface we would use the Navigation Modal that stores the routes using frgaments to render the HTML attributes

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	///we are going to declare variables to get our pathnames and params that will store details of the route from next navigation
	const pathname = usePathname();
	const params = useParams();
	const routes = [
		///WE want to create a new route on the navigation bar that can automatically return us backl to the initial dashboard
		{
			href: `/${params.storeId}`, ///using the store id from the dashboard layout to get the route for the store using the params, so that the settings(which will be created later) when clicked on will be for the active store wkith that store Id
			label: "Overview",
			active: pathname === `/${params.storeId}`, ///the active status sets the pathname to the settings of the active store
		},
		{
			///we create a new route on the navigation bar for the billboards for the present stores
			href: `/${params.storeId}/billboards`,
			label: "Billboards",
			active: pathname === `/${params.storeId}/billboards`,
		},
		{
			///we create a new route on the navigation bar for the categories for the present stores
			href: `/${params.storeId}/categories`,
			label: "Categories",
			active: pathname === `/${params.storeId}/categories`,
		},
		{
			///we create a new route on the navigation bar for the sizes for the present stores
			href: `/${params.storeId}/sizes`,
			label: "Sizes",
			active: pathname === `/${params.storeId}/sizes`,
		},
		{
			///we create a new route on the navigation bar for the colors for the present stores
			href: `/${params.storeId}/colors`,
			label: "Colors",
			active: pathname === `/${params.storeId}/colors`,
		},
		{
			///we create a new route on the navigation bar for the products for the present stores
			href: `/${params.storeId}/products`,
			label: "Products",
			active: pathname === `/${params.storeId}/products`,
		},
		{
			///we create a new route on the navigation bar for the orders for the present user
			href: `/${params.storeId}/orders`,
			label: "Orders",
			active: pathname === `/${params.storeId}/orders`,
		},
		{
			href: `/${params.storeId}/settings`, ///using the store id from the dashboard layout to get the route for the store using the params, so that the settings(which will be created later) when clicked on will be for the active store wkith that store Id
			label: "Settings",
			active: pathname === `/${params.storeId}/settings`, ///the active status sets the pathname to the settings of the active store
		},
	];

	/// we use the cn library from shadci ui to merge multiple classnames so as to merge the classnames we set for the MainNav component from the navbar.tsx component along with these default classnames here
	return (
		<nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
			{/* we are then going to iterate over the routes that we have*/}
			{routes.map((route) => (
				///we use the link component from next to render the route label
				<Link
					key={route.href}
					href={route.href}
					///we render the classname dynmaically using cn setting it depended on if the store is active or not
					className={cn(
						"text-sm font-medium transition-colors hover:text-primary",
						route.active
							? "text-black dark:text-white"
							: "text-muted-foreground"
					)}
				>
					{route.label}
				</Link>
			))}
		</nav>
	);
}
