/** @type {import('next').NextConfig} */
///we add the domain of the cloudinary to the nextConfig since we are using the next Image property to execute the add widget
const nextConfig = {
	images: {
		domains: ["res.cloudinary.com"],
	},
};

module.exports = nextConfig;
