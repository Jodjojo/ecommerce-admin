///where we will handle the getting total revenue
import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
	const paidOrders = await prismadb.order.findMany({
		where: {
			storeId,
			isPaid: true,
		},
		include: {
			orderItems: {
				include: {
					product: true,
				},
			},
		},
	});

	///we iterate over all orders then all order items and combine the prices of all of those

	const totalRevenue = paidOrders.reduce((total, order) => {
		const orderTotal = order.orderItems.reduce((orderSum, item) => {
			return orderSum + item.product.price.toNumber();
		}, 0);
		return total + orderTotal;
	}, 0);

	///return the total revenue
	return totalRevenue;
};
