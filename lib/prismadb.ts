import { PrismaClient } from "@prisma/client";

/// Decalre the new prisma client as undefined and then create a new variable to store the prisma database url and add it to the GlobalThis
declare global {
	var prisma: PrismaClient | undefined;
}

/// This variable is going to decide if to use the global prisma client or create a new prisma client depending on the enviroment
const prismadb = globalThis.prisma || new PrismaClient();

///Helps set the prisma instances to the same db regardless of the number of hot reloads
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

///Export prismadb
export default prismadb;
