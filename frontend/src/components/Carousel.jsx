import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Carousel() {
	const limit = 5
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [current, setCurrent] = useState(1);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [translate, setTranslate] = useState(0);

	const intervalRef = useRef(null);
	const containerRef = useRef(null);

	const slideWidth = containerRef.current?.offsetWidth || 1;
	const extendedSlides = [posts[posts.length - 1], ...posts, posts[0]];
	const activeIndex = current === 0 ? posts.length - 1 : current === posts.length + 1 ? 0 : current - 1;

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

	/* AUTO PLAY */
	useEffect(() => {
		startAutoPlay();
		return stopAutoPlay;
	}, [current]);

	const startAutoPlay = () => {
		stopAutoPlay();
		intervalRef.current = setInterval(() => {
		nextSlide();
		}, 4000);
	};

	const stopAutoPlay = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
	};

	const nextSlide = () => {
		setCurrent((prev) => prev + 1)
	};

	const prevSlide = () => {
		setCurrent((prev) => prev - 1)
	};

	/* INFINITE LOOP FIX */
	useEffect(() => {
		if (current === 0) {
		setTimeout(() => {
			setIsTransitioning(false);
			setCurrent(posts.length);
		}, 500);
		}

		if (current === posts.length + 1) {
		setTimeout(() => {
			setIsTransitioning(false);
			setCurrent(1);
		}, 500);
		}

		setTimeout(() => setIsTransitioning(true), 510);
	}, [current]);

	/* DRAG */
	const handleStart = (e) => {
		setIsDragging(true);
		setStartX(e.type === "touchstart" ? e.touches[0].clientX : e.clientX);
		stopAutoPlay();
	};

	const handleMove = (e) => {
		if (!isDragging) return;
		const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
		setTranslate(currentX - startX);
	};

	const handleEnd = () => {
		setIsDragging(false);

		if (translate > 100) prevSlide();
		else if (translate < -100) nextSlide();

		setTranslate(0);
		startAutoPlay();
	};

	// Loading state
	if (loading) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
				<div className="flex justify-center items-center h-64">
					<div className="text-gray-500">Loading post...</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
				<div className="flex justify-center items-center h-64">
					<div className="text-red-500">{error}</div>
				</div>
			</div>
		);
	}

	if (posts.length === 0) return null

	return (
		<>

		{/*POST*/}
		<div className="relative w-full max-w-[1500px] mx-auto overflow-hidden shadow-lg select-none bg-neutral-50" onMouseEnter={stopAutoPlay} onMouseLeave={startAutoPlay}>

			<div
				ref={containerRef}
				className="flex"
				style={{
				transform: `translateX(${-current * 100 + (translate / slideWidth) * 100}%)`,
				transition: isDragging || !isTransitioning ? "none" : "transform 0.5s ease-in-out",
				}}
				onMouseDown={handleStart}
				onMouseMove={handleMove}
				onMouseUp={handleEnd}
				onMouseLeave={handleEnd}
				onTouchStart={handleStart}
				onTouchMove={handleMove}
				onTouchEnd={handleEnd}
			>
				{extendedSlides.map((post, index) => (
					<div key={index} className="min-w-full p-2">
						<div className="bg-white shadow hover:shadow-md transition flex h-full">

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

			{/* CONTROLS */}
			<button onClick={prevSlide} className="absolute top-1/2 left-3 -translate-y-1/2 text-primary-500 bg-neutral-50 hover:bg-white p-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.20)]">
				❮
			</button>

			<button onClick={nextSlide} className="absolute top-1/2 right-3 -translate-y-1/2 text-primary-500 bg-neutral-50 hover:bg-white p-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.20)]">
				❯
			</button>

		</div>

		{/* DOT INDICATORS */}
		<div className="flex justify-center items-center mt-2 sm:mt-3 gap-2">
			{posts.map((_, index) => (
				<button
				key={index}
				onClick={() => setCurrent(index + 1)}
				className={`
					rounded-full transition-all duration-300
					${
					activeIndex === index
						? "bg-blue-500 w-4 sm:w-5 md:w-5 h-1.5 sm:h-2 md:h-2.5"
						: "bg-gray-300 hover:bg-gray-400 w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5"
					}
				`}
				/>
			))}
		</div>

		</>
	);
}