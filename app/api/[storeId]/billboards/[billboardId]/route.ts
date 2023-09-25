///This will contain the api routes to make changes to the billboard on the settings page
///There will be two routes: 1. to update the billboard(PATCH) and another to delete the billboard(DELETE)

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

///GET ROUTE/METHOD
export async function GET(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the billboardId cvomes from the billboardId folder route we created
	{ params }: { params: { billboardId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///if there are no params.billboardId
		if (!params.billboardId) {
			return new NextResponse("Billboard id is required", { status: 400 });
		}

		///then we find and then FETCH our billboard using the id
		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: params.billboardId,
			},
		});

		///then we return the billboard as a new json body
		return NextResponse.json(billboard);
	} catch (error) {
		///we are using billboard Delete so we will be able to trace errors recieved to this file
		console.log("[BILLBOARD_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///UPDATE ROUTE/METHOD
export async function PATCH(
	req: Request,
	///the params will always be available while the billboardId cvomes from the billboardId folder route we created
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to update the billboard
		const { userId } = auth();
		///we extract the body from the Request
		const body = await req.json();
		///destructure label and imageUrl from the body
		const { label, imageUrl } = body;

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there is no label from request body
		if (!label) {
			return new NextResponse("label is Required", { status: 400 });
		}

		///if there is no imageUrl from request body
		if (!imageUrl) {
			return new NextResponse("imageUrl is Required", { status: 400 });
		}

		///if there are no params.billboardId
		if (!params.billboardId) {
			return new NextResponse("billboard id is required", { status: 400 });
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

		///then we find and then update our billboard using the id
		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: params.billboardId,
			},
			///then we pass in the data we want to update which in this case is the name from the req.body
			data: {
				label,
				imageUrl,
			},
		});

		///then we return the billboard as a new json body
		return NextResponse.json(billboard);
	} catch (error) {
		///we are using billboard Patch so we will be able to trace errors recieved to this file
		console.log("[BILLBOARD_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///DELETE ROUTE/METHOD
export async function DELETE(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the billboardId cvomes from the billboardId folder route we created
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to delete the billboard
		const { userId } = auth();

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there are no params.billboardId
		if (!params.billboardId) {
			return new NextResponse("Billboard id is required", { status: 400 });
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
		///then we find and then update our billboard isong the id
		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: params.billboardId,
			},
		});

		///then we return the billboard as a new json body
		return NextResponse.json(billboard);
	} catch (error) {
		///we are using billboard Delete so we will be able to trace errors recieved to this file
		console.log("[BILLBOARD_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
