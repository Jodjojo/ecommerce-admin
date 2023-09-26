///This will contain the api routes to make changes to the category on the settings page
///There will be two routes: 1. to update the category(PATCH) and another to delete the category(DELETE)

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

///GET ROUTE/METHOD
export async function GET(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the categoryId cvomes from the categoryId folder route we created
	{ params }: { params: { categoryId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///if there are no params.categoryId
		if (!params.categoryId) {
			return new NextResponse("Category id is required", { status: 400 });
		}

		///then we find and then FETCH our category using the id
		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
		});

		///then we return the category as a new json body
		return NextResponse.json(category);
	} catch (error) {
		///we are using category Delete so we will be able to trace errors recieved to this file
		console.log("[CATEGORY_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///UPDATE ROUTE/METHOD
export async function PATCH(
	req: Request,
	///the params will always be available while the categoryId cvomes from the categoryId folder route we created
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to update the category
		const { userId } = auth();
		///we extract the body from the Request
		const body = await req.json();
		///destructure name and billboardId from the body
		const { name, billboardId } = body;

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there is no name from request body
		if (!name) {
			return new NextResponse("Name is Required", { status: 400 });
		}

		///if there is no billboardId from request body
		if (!billboardId) {
			return new NextResponse("Billboard id is Required", { status: 400 });
		}

		///if there are no params.categoryId
		if (!params.categoryId) {
			return new NextResponse("Category id is required", { status: 400 });
		}

		///check that this storeId exists for this user to ensure someone cannot steal another user'S storeid and create a category in their store
		const StoreByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!StoreByUserId) {
			return new NextResponse("Unathorized", { status: 403 });
		}

		///then we find and then update our category using the id
		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			///then we pass in the data we want to update which in this case is the name from the req.body
			data: {
				name,
				billboardId,
			},
		});

		///then we return the category as a new json body
		return NextResponse.json(category);
	} catch (error) {
		///we are using category Patch so we will be able to trace errors recieved to this file
		console.log("[CATEGORY_PATCH]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

///DELETE ROUTE/METHOD
export async function DELETE(
	///we should never accidentally remove request even if it is not used because the PARAMS argument is only available in the second argument of the delete function
	req: Request,
	///the params will always be available while the categoryId cvomes from the categoryId folder route we created
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	///we use a trycatch block to handle the call
	try {
		///first we check if we are authorized to delete the category
		const { userId } = auth();

		///if there is no user Id
		if (!userId) {
			return new NextResponse("Unauthenticated", { status: 401 });
		}

		///if there are no params.categoryId
		if (!params.categoryId) {
			return new NextResponse("Category id is required", { status: 400 });
		}

		///check that this storeId exists for this user to ensure someone cannot steal another user'S storeid and create a category in their store
		const StoreByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!StoreByUserId) {
			return new NextResponse("Unathorized", { status: 403 });
		}
		///then we find and then update our category isong the id
		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
			},
		});

		///then we return the category as a new json body
		return NextResponse.json(category);
	} catch (error) {
		///we are using category Delete so we will be able to trace errors recieved to this file
		console.log("[CATEGORY_DELETE]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
