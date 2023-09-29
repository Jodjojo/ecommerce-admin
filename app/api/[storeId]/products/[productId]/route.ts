///This will contain the api routes to make changes to the product on the settings page
///There will be two routes: 1. to update the product(PATCH) and another to delete the product(DELETE)

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

///GET ROUTE/METHOD
export async function GET(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the productId cvomes from the productId folder route we created
	{ params }: { params: { productId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///if there are no params.productId
		if (!params.productId) {
			return new NextResponse("Product id is required", { status: 400 });
		}

		///then we find and then FETCH our product using the id
		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			///we have to include the models with the relation to the product model
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
		});

		///then we return the product as a new json body
		return NextResponse.json(product);
	} catch (error) {
		///we are using product Delete so we will be able to trace errors recieved to this file
		console.log("[PRODUCT_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///UPDATE ROUTE/METHOD
export async function PATCH(
	req: Request,
	///the params will always be available while the productId cvomes from the productId folder route we created
	{ params }: { params: { storeId: string; productId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to update the product
		const { userId } = auth();
		///we extract the body from the Request
		const body = await req.json();
		///destructure name and price from json body
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			images,
			isFeatured, ///we wont check for this because it can be false and that means it has a default value in prisma
			isArchived,
		} = body;

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}
		// Check if name is inputed and fits the db table requirement
		if (!name) {
			return new NextResponse("Name is requried", { status: 400 });
		}

		///so if there are no images or we passed an empt array of images
		if (!images || !images.length) {
			return new NextResponse("Images are required", { status: 400 });
		}

		// Check if price is inputed and fits the db table requirement
		if (!price) {
			return new NextResponse("Price is requried", { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse("Category id is requried", { status: 400 });
		}

		if (!sizeId) {
			return new NextResponse("Size id is requried", { status: 400 });
		}

		if (!colorId) {
			return new NextResponse("Color id is requried", { status: 400 });
		}

		///if there are no params.productId
		if (!params.productId) {
			return new NextResponse("Product id is required", { status: 400 });
		}

		///check that this storeId exists for this user to ensure someone cannot steal another user'S storeid and create a product in their store
		const StoreByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!StoreByUserId) {
			return new NextResponse("Unathorized", { status: 403 });
		}

		///we use a general query first to update this specific product before we then declare it to a variable
		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			///then we pass in the data we want to update which in this case is the name from the req.body
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				categoryId,
				colorId,
				sizeId,
				images: {
					deleteMany: {},
				},
			},
		});

		///then we add a constant to this product for creating new images like we used in overall product route
		const product = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		///then we return the product as a new json body
		return NextResponse.json(product);
	} catch (error) {
		///we are using product Patch so we will be able to trace errors recieved to this file
		console.log("[PRODUCT_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///DELETE ROUTE/METHOD
export async function DELETE(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the productId cvomes from the productId folder route we created
	{ params }: { params: { storeId: string; productId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to delete the product
		const { userId } = auth();

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there are no params.productId
		if (!params.productId) {
			return new NextResponse("Product id is required", { status: 400 });
		}

		///check that this storeId exists for this user to ensure someone cannot steal another user'S storeid and create a product in their store
		const StoreByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!StoreByUserId) {
			return new NextResponse("Unathorized", { status: 403 });
		}
		///then we find and then update our product isong the id
		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
			},
		});

		///then we return the product as a new json body
		return NextResponse.json(product);
	} catch (error) {
		///we are using product Delete so we will be able to trace errors recieved to this file
		console.log("[PRODUCT_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
