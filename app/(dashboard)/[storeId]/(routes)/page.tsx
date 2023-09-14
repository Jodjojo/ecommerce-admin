import prismadb from "@/lib/prismadb";

///creating a modal interface that will store the store id from the new store modal that was created
interface DashboardPageProps {
	params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
	///then using that interface module to dynamically code the details of the dashboard page using fragments from the modal interface
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
		},
	});
	return <div>Active Store: {store?.name}</div>;
};

export default DashboardPage;
