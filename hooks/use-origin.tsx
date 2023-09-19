///creating a hook here where we can safely access the window object in Next 13 for more detailed description

import { useState, useEffect } from "react";

export const useOrigin = () => {
	const [mounted, setMounted] = useState(false);

	///to get our Origin from the browser since the object is not store on the Next 13 interface normally

	////if type of window is not undefined and the window location origin exists we will use that as our ORIGIn otherwise we use an empty string
	const origin =
		typeof window !== "undefined" && window.location.origin
			? window.location.origin
			: "";

	///we then use the UseEffect to prevent the Hydration error
	useEffect(() => {
		setMounted(true);
	}, []);

	///if we are not Mounted return empty string, otherwise return the origin
	if (!mounted) {
		return "";
	}

	return origin;
};
