import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";

function News() {
	const limit = 5
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true)
				const response = await axios.get(`/api/posts?limit=${limit}`);
				console.log("Fetched posts:", response.data);

				const transformedPosts = response.data.posts.map(post => ({
					id: `post-${post.id}`,
					title: post.title,
					message: post.message,
					url: post.url,
					bg_url: post.bg_url,
					date_posted: post.date_posted,
					post_type: post.post_type
				}));

				setPosts(transformedPosts);
				setError(null);
			} catch (error) {
				console.error("Failed to fetch posts:", error);
				setError("Failed to load posts");
			} finally {
				setLoading(false);
			}
		};
    	fetchPosts();
  	}, [limit]);

	if (loading) {
		return (
		<div className="flex justify-center items-center h-40 text-gray-500">
			Loading news and announcements...
		</div>
		);
	}

	if (error) {
		return (
		<div className="flex justify-center items-center h-40 text-red-500">
			{error}
		</div>
		);
	}

	if (posts.length === 0) {
		return (
		<div className="flex justify-center items-center h-40 text-gray-500">
			No news and announcements available.
		</div>
		);
	}

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1000px] items-center flex flex-col mb-10">

			{/* Title */}
			<div className="mb-2 sm:mb-4 self-start">
				<h1 className="text-[18px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
					<Icon
						icon="material-symbols:login-rounded"
						width={24}
						height={24}
						className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
					/>
					<span className="wrap-break-words">Latest News and Announcements</span>
				</h1>
			</div>

			<div className="overflow-x-auto gap-2 w-full max-w-[1000px] grid grid-cols-1 sm:grid-cols-2">
				{posts.map((post, index) => (
					<a key={index} className="min-w-full" href={post.url}>
						<div className="bg-neutral-50 transition h-full">

							{/* IMAGE */}
							<div className="w-full shrink-0 aspect-video overflow-hidden relative">
								<img src={post.bg_url} alt="News Background" className="w-full h-full object-cover"/>
							</div>

							{/* CONTENT */}
							<div className="px-3 py-2.5 sm:px-3.5 sm:py-3 md:px-4 md:py-3.5 flex flex-col">

								{/* News Title */}
								<h2 className="text-[13px] sm:text-sm md:text-base font-bold text-gray-800 mb-2 line-clamp-1">
									{post.title}
								</h2>	

								{/*News Message*/}
								<p className="text-xs sm:text-[13px] md:text-sm text-gray-800 mb-2 line-clamp-4 sm:line-clamp-4 md:line-clamp-4" >
									{post.message}
								</p>

								{/*Link*/}
								<div className="flex items-center gap-1 mt-auto">
									<span className="text-xs sm:text-[13px] md:text-sm text-blue-400">  {post.post_type} </span>
									<span className="text-xs sm:text-[13px] text-neutral-300">•</span>
									<span className="text-[10px] sm:text-[11px] text-neutral-300"> {post.date_posted}</span>
								</div>

							</div>

						</div>
					</a>
				))}
			</div>
		</div>
	);
}

export default News;