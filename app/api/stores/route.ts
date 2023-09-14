import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
	try {
		/// use clerk to authenticate POST route
		const { userId } = auth();

		///Get body from response
		const body = await req.json();

		///destructure naem from json body
		const { name } = body;

		///Check if user ID doesnt exist else send response
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Check if name is inputed and fits the db table requirement
		if (!name) {
			return new NextResponse("Name is requried", { status: 500 });
		}

		///create store Model instance after the id and name checks have been fulfilled using prismadb
		const store = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		});

		// Return a new Next js response containing the full etails of the store created
		return NextResponse.json(store);
	} catch (error) {
		console.log("[STORES_POST]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}

// using STORES-POST in the logging of the error so we can be able to trace where the error is coming from
