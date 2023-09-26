///This will contain the api routes to make changes to the size on the settings page
///There will be two routes: 1. to update the size(PATCH) and another to delete the size(DELETE)

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

///GET ROUTE/METHOD
export async function GET(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the sizeId cvomes from the sizeId folder route we created
	{ params }: { params: { sizeId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///if there are no params.sizeId
		if (!params.sizeId) {
			return new NextResponse("Size id is required", { status: 400 });
		}

		///then we find and then FETCH our size using the id
		const size = await prismadb.size.findUnique({
			where: {
				id: params.sizeId,
			},
		});

		///then we return the size as a new json body
		return NextResponse.json(size);
	} catch (error) {
		///we are using size Delete so we will be able to trace errors recieved to this file
		console.log("[SIZE_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///UPDATE ROUTE/METHOD
export async function PATCH(
	req: Request,
	///the params will always be available while the sizeId cvomes from the sizeId folder route we created
	{ params }: { params: { storeId: string; sizeId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to update the size
		const { userId } = auth();
		///we extract the body from the Request
		const body = await req.json();
		///destructure name and value from the body
		const { name, value } = body;

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there is no name from request body
		if (!name) {
			return new NextResponse("Name is Required", { status: 400 });
		}

		///if there is no value from request body
		if (!value) {
			return new NextResponse("Value is Required", { status: 400 });
		}

		///if there are no params.sizeId
		if (!params.sizeId) {
			return new NextResponse("Size id is required", { status: 400 });
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

		///then we find and then update our size using the id
		const size = await prismadb.size.updateMany({
			where: {
				id: params.sizeId,
			},
			///then we pass in the data we want to update which in this case is the name from the req.body
			data: {
				name,
				value,
			},
		});

		///then we return the size as a new json body
		return NextResponse.json(size);
	} catch (error) {
		///we are using size Patch so we will be able to trace errors recieved to this file
		console.log("[SIZE_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///DELETE ROUTE/METHOD
export async function DELETE(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the sizeId cvomes from the sizeId folder route we created
	{ params }: { params: { storeId: string; sizeId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to delete the size
		const { userId } = auth();

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there are no params.sizeId
		if (!params.sizeId) {
			return new NextResponse("Size id is required", { status: 400 });
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
		///then we find and then update our size isong the id
		const size = await prismadb.size.deleteMany({
			where: {
				id: params.sizeId,
			},
		});

		///then we return the size as a new json body
		return NextResponse.json(size);
	} catch (error) {
		///we are using size Delete so we will be able to trace errors recieved to this file
		console.log("[SIZE_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
