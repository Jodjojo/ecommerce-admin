import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
	///to ensure public routes can be accessed without being authenticatted
	publicRoutes: ["/api/:path*"],
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
