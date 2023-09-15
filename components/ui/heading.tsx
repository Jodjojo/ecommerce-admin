///Creating a reusable Headings interface that takes props of title and the description of what we are putting

interface HeadingProps {
	title: string;
	description: string;
}

///Resusable Headinsg component that takes in props
export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
	return (
		<div>
			{/* Heading Props wioll be dynmaically rendered below */}
			<h2 className='text-3xl font-bold tracking-right'>{title}</h2>
			<p className='text-sm text-muted-foreground'>{description}</p>
		</div>
	);
};
