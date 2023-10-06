import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Package } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { getSalesCount } from "@/actions/get-sales-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getStockCount } from "@/actions/get-stock-count";

///creating a modal interface that will store the store id from the new store modal that was created
interface DashboardPageProps {
	params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
	///we then create functions that will handle the numbers that will be displayed by each card dynamically
	const totalRevenue = await getTotalRevenue(params.storeId);
	const salesCount = await getSalesCount(params.storeId);
	const stockCount = await getStockCount(params.storeId);
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<Heading title='Dashboard' description='Overview of your store' />
				<Separator />
				<div className='grid gap-4 grid-cols-3'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Revenue
							</CardTitle>
							<DollarSign className='h-4 w-4 text-muted-foreground' />
							<CardContent>
								<div className='text-3xl font-bold'>
									{formatter.format(totalRevenue)}
								</div>
							</CardContent>
						</CardHeader>
					</Card>
					{/* 2nd card */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Sales</CardTitle>
							<CreditCard className='h-4 w-4 text-muted-foreground' />
							<CardContent>
								<div className='text-3xl font-bold'>{salesCount}</div>
							</CardContent>
						</CardHeader>
					</Card>
					{/* 3rd Card */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Products In Stock
							</CardTitle>
							<Package className='h-4 w-4 text-muted-foreground' />
							<CardContent>
								<div className='text-3xl font-bold'>{stockCount}</div>
							</CardContent>
						</CardHeader>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
