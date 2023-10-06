///route for the checkout page of the store using stripe

import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { id } from "date-fns/locale";

///use corsHeaders to allow these resources to be accessed on other domains
const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

///setting the Options request before the post request so the headers can work
export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders });
}

////Post res=quest that takes the request and params which is stored as a store Id as its paramaters
export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	///these productIds are what we expect as a sent response from the frontend store after checkout
	const { productIds } = await req.json();

	///if not productIds return new response
	if (!productIds || productIds.length === 0) {
		return new NextResponse("Product ids are required", { status: 400 });
	}

	///we find the products from the Product model that have this product Id
	const products = await prismadb.product.findMany({
		where: {
			id: {
				in: productIds,
			},
		},
	});

	///create a line item that will handle the stripe session
	const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

	products.forEach((product) => {
		line_items.push({
			quantity: 1,
			price_data: {
				currency: "USD",
				product_data: {
					name: product.name,
				},
				unit_amount: product.price.toNumber() * 100,
			},
		});
	});
	///create our Order
	const order = await prismadb.order.create({
		data: {
			storeId: params.storeId,
			isPaid: false,
			orderItems: {
				create: productIds.map((productId: string) => ({
					product: {
						connect: {
							id: productId,
						},
					},
				})),
			},
		},
	});

	///create a stripe session
	const session = await stripe.checkout.sessions.create({
		line_items,
		mode: "payment",
		billing_address_collection: "required",
		phone_number_collection: {
			enabled: true,
		},
		///url if checkout session is successful
		success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
		///url if session is canceled
		cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
		///we will use the meta data to find the orser that was created and change the stuatus to paid
		metadata: {
			orderId: order.id,
		},
	});

	return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
