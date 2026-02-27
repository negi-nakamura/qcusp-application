import { useEffect, useRef, useState } from "react";
import axios from "axios";

// const slides = [
//   {
//     id: 1,
//     title: "Quezon City University",
// 	message: `A Monumental Celebration for Future Educators! Today, a powerful chapter unfolded at the QCU San Bartolome Campus Auditorium as we honored the First 18 Units Professional Teaching Certificate Course Completers, guided by the theme: Shaping Future Educators: Commitment, Competence, and Service.' With pride and hope, we celebrate 67 aspiring educators who have risen to the challenge—showing dedication, resilience, and a heart ready to serve. Their achievement is more than academic; it is a calling embraced, a purpose ignited, and a promise made to future generations. The ceremony flowed with inspiration at every turn—from the solemn opening rites, to the heartfelt welcome of Dr. Randel D. Estacio, to the uplifting message of University President Dr. Theresita V. Atienza. The keynote address of Atty. Marco Cicero F. Domingo, CESE, CHED NCR, reminded every completer that teaching is not just a profession—it is a lifelong mission to inspire, empower, and transform. 
// 				As certificates were conferred by University and College officials, each moment reflected triumph, perseverance, and the deep joy of dreams taking shape. The message of the Completers’ Representative echoed the collective journey of this first batch—proof that when passion meets purpose, greatness begins. The program closed with words of wisdom from Dr. Isagani M. Tano and a meaningful recessional, sealing a milestone that will forever stay in the hearts of everyone present. 
// 				To our 67 completers: You step forward today not just as graduates, but as future pillars of education—ready to uplift communities, nurture minds, and shape generations yet to come. May your commitment light the path. May your competence open doors. May your service move lives. Your journey as educators begins now. And the world is better because of you. 
// 				Congratulations, Future Educators!`,
//     url: "https://www.facebook.com/qcu1994/posts/1334851925344738",
//     bg_url: "https://scontent.fmnl17-5.fna.fbcdn.net/v/t39.30808-6/637022705_1334849158678348_5086963336500226736_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHkqqg4kOQ1HReMgyTDZE-gNtcDdWCRl6g21wN1YJGXqN_71StlqQvTr5pzkAKlxp_IdWqvt8BZV02VgjkeA3ju&_nc_ohc=O3hzPJ_ACFkQ7kNvwGPDAfT&_nc_oc=AdmwxI0eg987O4ilnS9LBb0mt66rCvbfzz9aZg4maGCvXKalONbGmOLs2KseExZF2D0&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&_nc_gid=zlWEUWS5_IfV24dOuxP2aQ&oh=00_AfsyNp05cwvZriv5jeomvrK0A9l0RrY7m7mBpZPj-lMBZQ&oe=69A1DEDD",
//     date_posted: "April 20, 2026"
//   },
//   {
//     id: 2,
//     title: "Quezon City University",
// 	message: `A Monumental Celebration for Future Educators! Today, a powerful chapter unfolded at the QCU San Bartolome Campus Auditorium as we honored the First 18 Units Professional Teaching Certificate Course Completers, guided by the theme: Shaping Future Educators: Commitment, Competence, and Service.' With pride and hope, we celebrate 67 aspiring educators who have risen to the challenge—showing dedication, resilience, and a heart ready to serve. Their achievement is more than academic; it is a calling embraced, a purpose ignited, and a promise made to future generations. The ceremony flowed with inspiration at every turn—from the solemn opening rites, to the heartfelt welcome of Dr. Randel D. Estacio, to the uplifting message of University President Dr. Theresita V. Atienza. The keynote address of Atty. Marco Cicero F. Domingo, CESE, CHED NCR, reminded every completer that teaching is not just a profession—it is a lifelong mission to inspire, empower, and transform. 
// 				As certificates were conferred by University and College officials, each moment reflected triumph, perseverance, and the deep joy of dreams taking shape. The message of the Completers’ Representative echoed the collective journey of this first batch—proof that when passion meets purpose, greatness begins. The program closed with words of wisdom from Dr. Isagani M. Tano and a meaningful recessional, sealing a milestone that will forever stay in the hearts of everyone present. 
// 				To our 67 completers: You step forward today not just as graduates, but as future pillars of education—ready to uplift communities, nurture minds, and shape generations yet to come. May your commitment light the path. May your competence open doors. May your service move lives. Your journey as educators begins now. And the world is better because of you. 
// 				Congratulations, Future Educators!`,
//     url: "https://www.facebook.com/qcu1994/posts/1334851925344738",
//     bg_url: "https://scontent.fmnl17-5.fna.fbcdn.net/v/t39.30808-6/637022705_1334849158678348_5086963336500226736_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHkqqg4kOQ1HReMgyTDZE-gNtcDdWCRl6g21wN1YJGXqN_71StlqQvTr5pzkAKlxp_IdWqvt8BZV02VgjkeA3ju&_nc_ohc=O3hzPJ_ACFkQ7kNvwGPDAfT&_nc_oc=AdmwxI0eg987O4ilnS9LBb0mt66rCvbfzz9aZg4maGCvXKalONbGmOLs2KseExZF2D0&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&_nc_gid=zlWEUWS5_IfV24dOuxP2aQ&oh=00_AfsyNp05cwvZriv5jeomvrK0A9l0RrY7m7mBpZPj-lMBZQ&oe=69A1DEDD",
//     date_posted: "April 20, 2026"
//   },
//   {
//     id: 1,
//     title: "Quezon City University",
// 	message: `A Monumental Celebration for Future Educators! Today, a powerful chapter unfolded at the QCU San Bartolome Campus Auditorium as we honored the First 18 Units Professional Teaching Certificate Course Completers, guided by the theme: Shaping Future Educators: Commitment, Competence, and Service.' With pride and hope, we celebrate 67 aspiring educators who have risen to the challenge—showing dedication, resilience, and a heart ready to serve. Their achievement is more than academic; it is a calling embraced, a purpose ignited, and a promise made to future generations. The ceremony flowed with inspiration at every turn—from the solemn opening rites, to the heartfelt welcome of Dr. Randel D. Estacio, to the uplifting message of University President Dr. Theresita V. Atienza. The keynote address of Atty. Marco Cicero F. Domingo, CESE, CHED NCR, reminded every completer that teaching is not just a profession—it is a lifelong mission to inspire, empower, and transform. 
// 				As certificates were conferred by University and College officials, each moment reflected triumph, perseverance, and the deep joy of dreams taking shape. The message of the Completers’ Representative echoed the collective journey of this first batch—proof that when passion meets purpose, greatness begins. The program closed with words of wisdom from Dr. Isagani M. Tano and a meaningful recessional, sealing a milestone that will forever stay in the hearts of everyone present. 
// 				To our 67 completers: You step forward today not just as graduates, but as future pillars of education—ready to uplift communities, nurture minds, and shape generations yet to come. May your commitment light the path. May your competence open doors. May your service move lives. Your journey as educators begins now. And the world is better because of you. 
// 				Congratulations, Future Educators!`,
//     url: "https://www.facebook.com/qcu1994/posts/1334851925344738",
//     bg_url: "https://scontent.fmnl17-5.fna.fbcdn.net/v/t39.30808-6/637022705_1334849158678348_5086963336500226736_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHkqqg4kOQ1HReMgyTDZE-gNtcDdWCRl6g21wN1YJGXqN_71StlqQvTr5pzkAKlxp_IdWqvt8BZV02VgjkeA3ju&_nc_ohc=O3hzPJ_ACFkQ7kNvwGPDAfT&_nc_oc=AdmwxI0eg987O4ilnS9LBb0mt66rCvbfzz9aZg4maGCvXKalONbGmOLs2KseExZF2D0&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&_nc_gid=zlWEUWS5_IfV24dOuxP2aQ&oh=00_AfsyNp05cwvZriv5jeomvrK0A9l0RrY7m7mBpZPj-lMBZQ&oe=69A1DEDD",
//     date_posted: "April 20, 2026"
//   },
//   {
//     id: 2,
//     title: "Quezon City University",
// 	message: `A Monumental Celebration for Future Educators! Today, a powerful chapter unfolded at the QCU San Bartolome Campus Auditorium as we honored the First 18 Units Professional Teaching Certificate Course Completers, guided by the theme: Shaping Future Educators: Commitment, Competence, and Service.' With pride and hope, we celebrate 67 aspiring educators who have risen to the challenge—showing dedication, resilience, and a heart ready to serve. Their achievement is more than academic; it is a calling embraced, a purpose ignited, and a promise made to future generations. The ceremony flowed with inspiration at every turn—from the solemn opening rites, to the heartfelt welcome of Dr. Randel D. Estacio, to the uplifting message of University President Dr. Theresita V. Atienza. The keynote address of Atty. Marco Cicero F. Domingo, CESE, CHED NCR, reminded every completer that teaching is not just a profession—it is a lifelong mission to inspire, empower, and transform. 
// 				As certificates were conferred by University and College officials, each moment reflected triumph, perseverance, and the deep joy of dreams taking shape. The message of the Completers’ Representative echoed the collective journey of this first batch—proof that when passion meets purpose, greatness begins. The program closed with words of wisdom from Dr. Isagani M. Tano and a meaningful recessional, sealing a milestone that will forever stay in the hearts of everyone present. 
// 				To our 67 completers: You step forward today not just as graduates, but as future pillars of education—ready to uplift communities, nurture minds, and shape generations yet to come. May your commitment light the path. May your competence open doors. May your service move lives. Your journey as educators begins now. And the world is better because of you. 
// 				Congratulations, Future Educators!`,
//     url: "https://www.facebook.com/qcu1994/posts/1334851925344738",
//     bg_url: "https://scontent.fmnl17-5.fna.fbcdn.net/v/t39.30808-6/637022705_1334849158678348_5086963336500226736_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=13d280&_nc_eui2=AeHkqqg4kOQ1HReMgyTDZE-gNtcDdWCRl6g21wN1YJGXqN_71StlqQvTr5pzkAKlxp_IdWqvt8BZV02VgjkeA3ju&_nc_ohc=O3hzPJ_ACFkQ7kNvwGPDAfT&_nc_oc=AdmwxI0eg987O4ilnS9LBb0mt66rCvbfzz9aZg4maGCvXKalONbGmOLs2KseExZF2D0&_nc_zt=23&_nc_ht=scontent.fmnl17-5.fna&_nc_gid=zlWEUWS5_IfV24dOuxP2aQ&oh=00_AfsyNp05cwvZriv5jeomvrK0A9l0RrY7m7mBpZPj-lMBZQ&oe=69A1DEDD",
//     date_posted: "April 20, 2026"
//   },
// ];

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