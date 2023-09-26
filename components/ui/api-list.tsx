"use client";

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

///create an interface to store Props
interface ApiListProps {
	entityName: string;
	entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entityName, entityIdName }) => {
	///we will use the params and the Origin to create our base url
	const params = useParams();
	const origin = useOrigin();

	const baseUrl = `${origin}/api/${params.storeId}`;

	return (
		<>
			{/* we will use a fragment to permit the alert Modal */}
			<ApiAlert
				title='GET'
				variant='public'
				description={`${baseUrl}/${entityName}`}
			/>
			{/* To get individual billboard */}
			<ApiAlert
				title='GET'
				variant='public'
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
			/>
			{/*Admins To post new routes through API */}
			<ApiAlert
				title='POST'
				variant='admin'
				description={`${baseUrl}/${entityName}`}
			/>
			{/* Admins to be able to edit routes */}
			<ApiAlert
				title='PATCH'
				variant='admin'
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
			/>
			{/* Admins to be able to delte API routes */}
			<ApiAlert
				title='DELETE'
				variant='admin'
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
			/>
		</>
	);
};

export default ApiList;
