///This will contain the api routes to make changes to the store on the settings page
///There will be two routes: 1. to update the store(PATCH) and another to delete the store(DELETE)

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

///UPDATE ROUTE/METHOD
export async function PATCH(
	req: Request,
	///the params will always be available while the storeId cvomes from the storeId folder route we created
	{ params }: { params: { storeId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to update the store
		const { userId } = auth();
		///we extract the body from the Request
		const body = await req.json();
		///destructure name from the body
		const { name } = body;

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there is no name from request body
		if (!name) {
			return new NextResponse("Name is Required", { status: 400 });
		}

		///if there are no params.storeId
		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		///then we find and then update our store isong the id
		const store = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
				userId,
			},
			///then we pass in the data we want to update which in this case is the name from the req.body
			data: {
				name,
			},
		});

		///then we return the store as a new json body
		return NextResponse.json(store);
	} catch (error) {
		///we are using Store Patch so we will be able to trace errors recieved to this file
		console.log("[STORE_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///DELETE ROUTE/METHOD
export async function DELETE(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the storeId cvomes from the storeId folder route we created
	{ params }: { params: { storeId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to delete the store
		const { userId } = auth();

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there are no params.storeId
		if (!params.storeId) {
			return new NextResponse("Store id is required", { status: 400 });
		}

		///then we find and then update our store isong the id
		const store = await prismadb.store.deleteMany({
			where: {
				id: params.storeId,
				userId,
			},
		});

		///then we return the store as a new json body
		return NextResponse.json(store);
	} catch (error) {
		///we are using Store Delete so we will be able to trace errors recieved to this file
		console.log("[STORE_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
