///this is the page of the route that will be redirected to when the order link is clicked on in the navigation bar
import { format } from "date-fns"; ///format used to convert date to string

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

///we want to use prisma to fetch all available orders for active store
const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
	const orders = await prismadb.order.findMany({
		where: {
			storeId: params.storeId,
		},
		///we are going to include the orderItems model and further include the product model that was called to this as well, many to many relationshipm
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
		},
		// to order by newest - descending
		orderBy: {
			createdAt: "desc",
		},
	});

	///so instead of passing the orders directly into the orders client we pass it as a mapped item using our column we just defined
	const formattedOrders: OrderColumn[] = orders.map((item) => ({
		id: item.id,
		phone: item.phone,
		address: item.address,
		///mapping the products to get the name of the product that had been ordered
		products: item.orderItems
			.map((orderItem) => orderItem.product.name)
			.join(", "),
		///we use the formatter to combine the price of the previous item and that of the next item
		totalPrice: formatter.format(
			item.orderItems.reduce((total, item) => {
				return total + Number(item.product.price);
			}, 0)
		),
		isPaid: item.isPaid,
		createdAt: format(item.createdAt, "MMM do, yyyy"), ///mmm do,yyyy is the format we want our created date farmatted in
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				{/* This is a component we will render on the components folder */}
				<OrderClient data={formattedOrders} />
			</div>
		</div>
	);
};

export default OrdersPage;
