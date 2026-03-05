import { useEffect, useState } from "react";
import axios from "axios";
import { DateTime } from "luxon";

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
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1500px] items-center flex flex-col mb-10">

			{/* Title */}
			<h1 className="mb-3 sm:mb-4 font-semibold flex items-center justify-center gap-3 text-gray-800 mt-4 sm:mt-5">

				<div className="flex flex-col items-center">
					<span className="wrap-break-words mb-1 text-xl sm:text-xl block sm:inline font-semibold text-primary-500">News and Announcements</span>
					<span className="wrap-break-words text-[13px] sm:text-base block font-normal text-center text-neutral-300">Latest updates, announcements, and important information from Quezon City University.</span>
				</div>

			</h1>

			<div className="overflow-x-auto space-y-2 w-full max-w-[1000px] py-2">
				{posts.map((post, index) => (
					<div key={index} className="min-w-full ">
						<div className="bg-neutral-50 shadow-md hover:shadow-xs transition flex h-full">

							{/* IMAGE */}
							<div className="w-full max-w-[100px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] shrink-0 aspect-square overflow-hidden relative">
								<img src={post.bg_url} alt="News Background" className="w-full h-full object-cover"/>
							</div>

							{/* CONTENT */}
							<div className="px-3 py-2.5 sm:px-3.5 sm:py-3 md:px-4 md:py-3.5 flex flex-col">

								{/* News Title */}
								<h2 className="text-[13px] sm:text-sm md:text-base font-bold text-gray-800 mb-2 line-clamp-1">
									{post.title}
								</h2>	

								{/*News Message*/}
								<p className="text-xs sm:text-[13px] md:text-sm text-gray-800 mb-2 line-clamp-2 sm:line-clamp-3 md:line-clamp-4" >
									{post.message}
								</p>

								{/*Link*/}
								<div className="flex items-center gap-1 mt-auto">
									<span> <a href={post.url} rel="noopener noreferrer" target="_blank" className="text-xs sm:text-[13px] md:text-sm text-blue-400"> {post.post_type} </a> </span>
									<span className="text-xs sm:text-[13px]  text-neutral-300">•</span>
									<span className="text-[10px] sm:text-[11px] text-neutral-300"> {post.date_posted}</span>
								</div>

							</div>

						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default News;