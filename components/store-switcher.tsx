///this will be the function that will be rendered in the navbar space for the store switcher component
"use client";

import { Store } from "@prisma/client";

import { PopoverTrigger } from "@/components/ui/popover";

///we will then use the interface to write some props for the store switcher that will extend some popover trigger props from the shadcn ui component

///we are using our own popover trrigger props so we set the type to components without Ref

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
	///here we will put the actual items we want to be rendered in the store switcher which will be an array of objects which will be our stores
	items: Store[];
}

export default function StoreSwitcher({
	className,
	items = [],
}: StoreSwitcherProps) {
	return <div>Store Switcher</div>;
}
