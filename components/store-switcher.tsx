///this will be the function that will be rendered in the navbar space for the store switcher component
"use client";

import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
	Check,
	ChevronsUpDown,
	PlusCircle,
	Store as StoreIcon,
} from "lucide-react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";

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
	/// Add the store Modal
	const storeModal = useStoreModal();
	///import the params that stores details from the store modal
	const params = useParams();
	///import router to navigate within stores using the href
	const router = useRouter();

	///Then we format our items contained in each store since we are going to iterate over them
	const formattedItems = items.map((item) => ({
		label: item.name, ///the label of each item
		value: item.id, ///the value of each item
	}));

	///find the currently active store using id in the dashboard to know the selected one in store switcher using the formatted items to trace the value of the currently iterated active item
	///check if current item value is equal to id ofparams of the current store
	const curentStore = formattedItems.find(
		(item) => item.value === params.storeId
	);

	///state to handle the selecting and opening of store from store switcher to control the popover
	const [open, setOpen] = useState(false);

	///to handle what happens when a store is selected
	const onStoreSelect = (store: { value: string; label: string }) => {
		setOpen(false);
		router.push(`/${store.value}`); ///once we click on a store in store switcher we are going to click the store switcher and redirect to the store with that particular id
	};

	///POPOVER for showing store switching
	return (
		<Popover open={open} onOpenChange={setOpen}>
			{/* we set the props of the popover to open and on change to set open using the useState snippet we identified */}
			{/* We set the popoverTrigger which is what we are going to use to physically be able to execute these tasks on the webpage */}
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					role='combobox'
					aria-expanded={open}
					aria-label='Select a Store'
					className={cn("w-[200px] justify-between", className)}
				>
					{/* This Button will have 2 icons, one the storeIcon gotten from Shadcn imported from Lucide React and the other the chevronsupdown which gives us a dropdown menu to be able to select from*/}
					<StoreIcon className='mr-2 h-4 w-4' />
					{/* to dynamically render the names of the stores which is the label to the store switcher */}
					{curentStore?.label}
					<ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				{/* This is going to contain the content of the popover that we would change between  */}
				<Command>
					{/* The command components and commandlist components are from Shad cn and allows us give a list to the popovercontent */}
					<CommandList>
						{/* The command input allows us search things from the command list */}
						<CommandInput placeholder='Search Store...' />
						<CommandEmpty>No Store found</CommandEmpty>
						{/* CommandEmpty component is what is rendered if no store is found  */}
						{/* CommandGroup gives details of the available stores from the Formatted items variable we created above  */}
						<CommandGroup heading='Stores'>
							{formattedItems.map((store) => (
								///We use the commandItem to dunamically render the stores and their names
								<CommandItem
									key={store.value}
									onSelect={() => onStoreSelect(store)}
									className='text-sm'
								>
									<StoreIcon className='mr-2 h-4 w-4' />
									{store.label}
									{/* The Check is a feature from lucide that we are going to use to identify the active store dynamically using cn */}
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											curentStore?.value === store.value
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
					{/* The Command Separator is as simple as a separator between 2 command lists */}
					<CommandSeparator />
					{/* This second command list is to redirect us to the create new store modal once clicked */}
					<CommandList>
						<CommandGroup>
							{/* This CommandItem will then use the useState we declared up to close the popover and open the store Modal for new Store creation */}
							<CommandItem
								onSelect={() => {
									setOpen(false);
									storeModal.onOpen();
								}}
							>
								<PlusCircle className='mr-2 h-5 w-5' />
								Create Store
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
