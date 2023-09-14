"use client";

/// We have to create a toast provider so as to handle the react-hot-toast we want to create and return the Toaster to be used in the Module without having hydration errors

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
	return <Toaster />;
};
