import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

///ROUTE TO CREATE NEW BILLBOARD
export async function POST(
	req: Request,
	///we destructure the params of the StoreId so we can use it in our size Model we want to create
	{ params }: { params: { storeId: string } }
) {
	try {
		/// use clerk to authenticate POST route
		const { userId } = auth();

		///Get body from response
		const body = await req.json();

		///destructure name and value from json body
		const { name, value } = body;

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

		// Check if value is inputed and fits the db table requirement
		if (!value) {
			return new NextResponse("Value is requried", { status: 400 });
		}

		///check if there is no StoreId first
		if (!params.storeId) {
			return new NextResponse("Store id is requried", { status: 400 });
		}

		///check that this storeId exists for this user to ensure someone cannot steal another user'S storeid and create a size in their store
		const StoreByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!StoreByUserId) {
			return new NextResponse("Unathorized", { status: 403 });
		}

		///create size Model instance after the id, name and ImageUrl checks have been fulfilled using prismadb
		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		// Return a new Next js response containing the full etails of the size created
		return NextResponse.json(size);
	} catch (error) {
		console.log("[SIZES_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

//////////////////////////////////////////////////////////////////////
///ROUTE TO FETCH ALL EXISTING SIZES

export async function GET(
	req: Request,
	///we destructure the params of the StoreId so we can use it in our size Model we want to create
	{ params }: { params: { storeId: string } }
) {
	try {
		///check if there is no StoreId first
		if (!params.storeId) {
			return new NextResponse("Store id is requried", { status: 400 });
		}

		///To get all sizes from the Model
		const sizes = await prismadb.size.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		// Return a new Next js response containing the full etails of the size created
		return NextResponse.json(sizes);
	} catch (error) {
		console.log("[SIZES_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
