/** @type {import('next').NextConfig} */
///we add the domain of the cloudinary to the nextConfig since we are using the next Image property to execute the add widget
const nextConfig = {
	images: {
		domains: ["res.cloudinary.com"],
	},
	compiler: {
		// The regexes defined here are processed in Rust so the syntax is different from
		// JavaScript `RegExp`s. See https://docs.rs/regex.
		reactRemoveProperties: { properties: ["^data-custom$"] },
	},
};

module.exports = nextConfig;
