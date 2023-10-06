import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

///this is where we are going to create the webhook that will hadnle the stripe session
///we will use req.text and not req.json because this is a web hook

export async function POST(req: Request) {
	const body = await req.text();
	///to get the stripe signature
	const signature = headers().get("Stripe-signature") as string;

	//set the event as stripe event
	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (error: any) {
		return new NextResponse(`Webhook Error: ${error.message} `, {
			status: 400,
		});
	}

	///we create a sessison and address using the webhook
	const session = event.data.object as Stripe.Checkout.Session;
	const address = session?.customer_details?.address;

	///function to sum up the parts of the address on checkout page (city1, city2 etc) into one single string
	const addressComponents = [
		address?.line1,
		address?.line2,
		address?.city,
		address?.state,
		address?.postal_code,
		address?.country,
	];

	const addressString = addressComponents.filter((c) => c !== null).join(", ");

	// check event we want to listen to and then make changes to the order model per event
	if (event.type === "checkout.session.completed") {
		const order = await prismadb.order.update({
			where: {
				id: session?.metadata?.orderId,
			},
			data: {
				isPaid: true,
				address: addressString,
				phone: session?.customer_details?.phone || "",
			},
			include: {
				orderItems: true,
			},
		});

		///getting productIds to archive all products that have just been bought
		const productIds = order.orderItems.map((orderItem) => orderItem.productId);

		///to update all of the products that have that Id and change the isArchived to triue
		await prismadb.product.updateMany({
			where: {
				id: {
					in: [...productIds],
				},
			},
			data: {
				isArchived: true,
			},
		});
	}

	return new NextResponse(null, { status: 200 });
}
