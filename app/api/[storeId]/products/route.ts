import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

///ROUTE TO CREATE NEW BILLBOARD
export async function POST(
	req: Request,
	///we destructure the params of the StoreId so we can use it in our product Model we want to create
	{ params }: { params: { storeId: string } }
) {
	try {
		/// use clerk to authenticate POST route
		const { userId } = auth();

		///Get body from response
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

		///Check if user ID doesnt exist else send response
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
			///unathenticated - user not logged in
			///unathorized - user is logged in but not authorized to execute a particular task
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

		///check if there is no StoreId first
		if (!params.storeId) {
			return new NextResponse("Store id is requried", { status: 400 });
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

		///create product Model instance after the id, name and Price checks have been fulfilled using prismadb
		const product = await prismadb.product.create({
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				categoryId,
				colorId,
				sizeId,
				storeId: params.storeId,
				///we cant just return the array of images as data so we have to iterate over it
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		// Return a new Next js response containing the full etails of the product created
		return NextResponse.json(product);
	} catch (error) {
		console.log("[PRODUCTS_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// using PRODUCTS-POST in the logging of the error so we can be able to trace where the error is coming from

//////////////////////////////////////////////////////////////////////
///ROUTE TO FETCH ALL EXISTING PRODUCTS

export async function GET(
	req: Request,
	///we destructure the params of the StoreId so we can use it in our product Model we want to create
	{ params }: { params: { storeId: string } }
) {
	try {
		///we want to be able to filter for specific names or sizes or price of products
		const { searchParams } = new URL(req.url);
		///so we decalre variables from that search param to have each of the id's contained in the params url and set it to undefined if it doesnot have the Id
		const categoryId = searchParams.get("categoryId") || undefined;
		const colorId = searchParams.get("colorId") || undefined;
		const sizeId = searchParams.get("sizeId") || undefined;
		const isFeatured = searchParams.get("isFeatured");

		///check if there is no StoreId first
		if (!params.storeId) {
			return new NextResponse("Store id is requried", { status: 400 });
		}

		///To get all products from the Model
		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				///we search for places also where these params we got from the search params url are defined
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			///include the relations to the product table
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
			///to alsways showcase the newest products
			orderBy: {
				createdAt: "desc",
			},
		});

		// Return a new Next js response containing the full etails of the product created
		return NextResponse.json(products);
	} catch (error) {
		console.log("[PRODUCTS_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// using PRODUCTS-POST in the logging of the error so we can be able to trace where the error is coming from
