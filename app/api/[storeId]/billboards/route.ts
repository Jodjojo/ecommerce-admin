import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

///ROUTE TO CREATE NEW BILLBOARD
export async function POST(
	req: Request,
	///we destructure the params of the StoreId so we can use it in our billboard Model we want to create
	{ params }: { params: { storeId: string } }
) {
	try {
		/// use clerk to authenticate POST route
		const { userId } = auth();

		///Get body from response
		const body = await req.json();

		///destructure label and imageUrl from json body
		const { label, imageUrl } = body;

		///Check if user ID doesnt exist else send response
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
			///unathenticated - user not logged in
			///unathorized - user is logged in but not authorized to execute a particular task
		}

		// Check if label is inputed and fits the db table requirement
		if (!label) {
			return new NextResponse("Label is requried", { status: 400 });
		}

		// Check if imageUrl is inputed and fits the db table requirement
		if (!imageUrl) {
			return new NextResponse("ImageUrl is requried", { status: 400 });
		}

		///check if there is no StoreId first
		if (!params.storeId) {
			return new NextResponse("Store id is requried", { status: 400 });
		}

		///check that this storeId exists for this user to ensure someone cannot steal another user'S storeid and create a billboard in their store
		const StoreByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!StoreByUserId) {
			return new NextResponse("Unathorized", { status: 403 });
		}

		///create billboard Model instance after the id, label and ImageUrl checks have been fulfilled using prismadb
		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		// Return a new Next js response containing the full etails of the billboard created
		return NextResponse.json(billboard);
	} catch (error) {
		console.log("[BILLBOARDS_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// using BILLBOARDS-POST in the logging of the error so we can be able to trace where the error is coming from

//////////////////////////////////////////////////////////////////////
///ROUTE TO FETCH ALL EXISTING BILLBOARDS

export async function GET(
	req: Request,
	///we destructure the params of the StoreId so we can use it in our billboard Model we want to create
	{ params }: { params: { storeId: string } }
) {
	try {
		///check if there is no StoreId first
		if (!params.storeId) {
			return new NextResponse("Store id is requried", { status: 400 });
		}

		///To get all billboards from the Model
		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		// Return a new Next js response containing the full etails of the billboard created
		return NextResponse.json(billboards);
	} catch (error) {
		console.log("[BILLBOARDS_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// using BILLBOARDS-POST in the logging of the error so we can be able to trace where the error is coming from
