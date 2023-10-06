///where we will handle the getting total revenue for the graph
import prismadb from "@/lib/prismadb";

///interface for the graph data
interface GraphData {
	name: string;
	total: number;
}

export const getGraphRevenue = async (storeId: string) => {
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

	///use our paid order to calculate and find our Monthly revenue
	const monthlyRevenue: { [key: number]: number } = {};

	//we will loop over the paidOrders to get the months
	for (const order of paidOrders) {
		const month = order.createdAt.getMonth();
		let revenueForOrder = 0;
		///we will then loop over the items that have been ordered to get their individual prices to get the revenue
		for (const item of order.orderItems) {
			revenueForOrder += item.product.price.toNumber();
		}

		///then we reset the value of our Monthly revenue
		monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
	}

	///create the graph data
	const graphData: GraphData[] = [
		{ name: "Jan", total: 0 },
		{ name: "Feb", total: 0 },
		{ name: "Mar", total: 0 },
		{ name: "Apr", total: 0 },
		{ name: "May", total: 0 },
		{ name: "Jun", total: 0 },
		{ name: "Jul", total: 0 },
		{ name: "Aug", total: 0 },
		{ name: "Sep", total: 0 },
		{ name: "Oct", total: 0 },
		{ name: "Nov", total: 0 },
		{ name: "Dec", total: 0 },
	];

	for (const month in monthlyRevenue) {
		graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
	}

	return graphData;
};
