import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths, isSameMonth, isSameDay, parseISO, isWithinInterval, isBefore, isAfter, getMonth, getDate, isEqual } from "date-fns";
import { Icon } from "@iconify/react";
import axios from "axios";
import PdfViewer from "./PdfViewer";

const academicYear = "2025-2026";
const semesterLabel = "2nd Semester";
const semesterStart = new Date(2026, 0, 12);
const semesterEnd = new Date(2026, 4, 26);

function UniversityCalendar() {

	const today = new Date();
	const initialMonth = isWithinInterval(today, {start: semesterStart, end: semesterEnd}) ? today : semesterStart;

	const [universityEvents, setUniversityEvents] = useState([]);
	const [holidays, setHolidays] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(initialMonth);
	const [selectedDayEvents, setSelectedDayEvents] = useState([]);
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [isDayModalOpen, setIsDayModalOpen] = useState(false);

	const eventTypeColors = {
		holiday: "bg-blue-400",
		admission: "bg-purple-400",
		enrollment: "bg-emerald-400",
		academic: "bg-amber-400",
		examination: "bg-rose-400",
		break: "bg-sky-400",
		event: "bg-pink-400",
	};

	// Fetch university events
	useEffect(() => {
		const fetchUniversityEvents = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`/api/calendar/university?school_year=${encodeURIComponent(academicYear)}`);
				console.log("Fetched university events:", response.data);
				
				const transformedEvents = response.data.events.map(event => ({
					id: `uni-${event.id}`,
					title: event.title,
					startDate: event.start_date,
					endDate: event.end_date,
					semester: event.semester,
					event_type: event.event_type, 
					source: 'University',
					isHoliday: false
				}));
				
				setUniversityEvents(transformedEvents);
				setError(null);
			} catch (error) {
				console.error("Failed to fetch university events:", error);
				setError("Failed to load calendar events");
			} finally {
				setLoading(false);
			}
		};

		fetchUniversityEvents();
	}, []);

	// Fetch holidays
	useEffect(() => {
		const fetchHolidays = async () => {
			try {
				const response = await axios.get(`/api/calendar/holidays`);
				console.log("Fetched holidays:", response.data);
				
				const transformedHolidays = response.data.holidays.map(holiday => ({
					id: `hol-${holiday.id}`,
					title: holiday.title,
					month: holiday.month,
					day: holiday.day,
					month_day: holiday.month_day,
					formatted_date: holiday.formatted_date,
					source: 'Holiday',
					event_type: 'holiday',
					isHoliday: true
				}));
				
				setHolidays(transformedHolidays);
			} catch (error) {
				console.error("Failed to fetch holidays:", error);
			}
		};

		fetchHolidays();
	}, []);

	useEffect(() => {
		if (isPreviewOpen || isDayModalOpen) {
			const scrollY = window.scrollY;

			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = '100%';
			document.body.style.overflow = 'hidden';
			
			return () => {
				document.body.style.position = '';
				document.body.style.top = '';
				document.body.style.width = '';
				document.body.style.overflow = '';
				window.scrollTo(0, scrollY);
			};
		}
	}, [isPreviewOpen, isDayModalOpen]);

	// Combine all events for calendar display
	const allEvents = useMemo(() => {
		return [...universityEvents];
	}, [universityEvents]);

	// Create a map of holidays by month-day for quick lookup
	const holidayMap = useMemo(() => {
		const map = new Map();
		holidays.forEach(holiday => {
			map.set(holiday.month_day, holiday);
		});
		return map;
	}, [holidays]);

	// Get holidays for current month view
	const holidaysThisMonth = useMemo(() => {
		const currentMonthNum = getMonth(currentMonth) + 1; // getMonth is 0-indexed
		return holidays.filter(holiday => holiday.month === currentMonthNum);
	}, [holidays, currentMonth]);

	// Check if a specific date has a holiday
	const getHolidayForDate = (date) => {
		const month = getMonth(date) + 1;
		const day = getDate(date);
		const monthDay = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		return holidayMap.get(monthDay);
	};

	const eventDays = useMemo(() => {
		const days = new Set();

		// Add university event days
		universityEvents.forEach((event) => {
			let dt = parseISO(event.startDate);
			const endDt = parseISO(event.endDate);

			while (dt <= endDt) {
				days.add(format(dt, "yyyy-MM-dd"));
				dt = addDays(dt, 1);
			}
		});

		return days;
	}, [universityEvents]);

	const eventsThisMonth = useMemo(() => {
		return universityEvents.filter((event) => {
			const start = parseISO(event.startDate);
			const end = parseISO(event.endDate);
			const monthStart = startOfMonth(currentMonth);
			const monthEnd = endOfMonth(currentMonth);

			return (
				isWithinInterval(start, { start: monthStart, end: monthEnd }) ||
				isWithinInterval(end, { start: monthStart, end: monthEnd }) ||
				(isBefore(start, monthStart) && isAfter(end, monthEnd))
			);
		});
	}, [universityEvents, currentMonth]);

	// Check if we can navigate to previous month
	const canGoToPrevMonth = useMemo(() => {
		const prevMonth = subMonths(currentMonth, 1);
		const prevMonthEnd = endOfMonth(prevMonth);
		
		// Check if the previous month's end date is within or after semester start
		// Also check if current month is not already at or before semester start
		return isAfter(prevMonthEnd, semesterStart) || isEqual(prevMonthEnd, semesterStart);
	}, [currentMonth]);

	// Check if we can navigate to next month
	const canGoToNextMonth = useMemo(() => {
		const nextMonth = addMonths(currentMonth, 1);
		const nextMonthStart = startOfMonth(nextMonth);
		
		// Check if the next month's start date is within or before semester end
		// Also check if current month is not already at or after semester end
		return isBefore(nextMonthStart, semesterEnd) || isEqual(nextMonthStart, semesterEnd);
	}, [currentMonth]);

	const handlePrevMonth = () => {
		if (canGoToPrevMonth) {
			setCurrentMonth(subMonths(currentMonth, 1));
		}
	};

	const handleNextMonth = () => {
		if (canGoToNextMonth) {
			setCurrentMonth(addMonths(currentMonth, 1));
		}
	};

	const formatEventDateRange = (start, end) => {
		const startDate = parseISO(start);
		const endDate = parseISO(end);
		if (start === end) return format(startDate, "MMMM dd");
		return `${format(startDate, "MMMM dd")} - ${format(endDate, "dd")}`;
	};

	const handleDayClick = (date) => {
		// Get university events for the day
		const eventsForDay = universityEvents.filter((event) => {
			const start = parseISO(event.startDate);
			const end = parseISO(event.endDate);

			return (
				isSameDay(date, start) ||
				isSameDay(date, end) ||
				(date >= start && date <= end)
			);
		});

		// Check if the day has a holiday
		const holidayForDay = getHolidayForDate(date);
		
		// Combine events and holiday
		const allDayEvents = [
			...eventsForDay,
			...(holidayForDay ? [{
				...holidayForDay,
				// Add the actual date for display
				displayDate: date
			}] : [])
		];

		if (allDayEvents.length > 0) {
			setSelectedDayEvents(allDayEvents);
			setIsDayModalOpen(true);
		}
	};

	const downloadPDF = () => {
	const pdfUrl = "/ACADEMIC-CALENDAR-2025-2026.pdf"; 

	fetch(pdfUrl)
		.then((res) => res.blob())
		.then((blob) => {
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `qcu_academic_calendar.pdf`; 
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		})
		.catch((err) => console.error("Failed to download PDF:", err));
	};

	const renderHeader = () => (
		<>
			<div className="flex justify-between items-center mb-4 pt-3 px-2 sm:px-5 gap-2 sm:gap-15">
				<button
					onClick={handlePrevMonth}
					disabled={!canGoToPrevMonth}
					aria-label="Previous Month"
					className={`text-gray-600 hover:text-gray-900 cursor-pointer transition ${
						!canGoToPrevMonth ? 'opacity-30 cursor-not-allowed' : ''
					}`}
				>
					<Icon icon="iconamoon:arrow-left-2-duotone" width={32} height={32} className="sm:w-10 sm:h-10 text-neutral-900"/>
				</button>

				<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 select-none text-center">
					{format(currentMonth, "MMMM yyyy")}
				</h2>

				<button
					onClick={handleNextMonth}
					disabled={!canGoToNextMonth}
					aria-label="Next Month"
					className={`text-gray-600 hover:text-gray-900 cursor-pointer transition ${
						!canGoToNextMonth ? 'opacity-30 cursor-not-allowed' : ''
					}`}
				>
					<Icon icon="iconamoon:arrow-right-2-duotone" width={32} height={32} className="sm:w-10 sm:h-10 text-neutral-900"/>
				</button>
			</div>
			<hr className="text-neutral-800" />
		</>
	);

	const renderDays = () => {
		const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
		return (
			<div className="grid grid-cols-7 text-sm sm:text-base md:text-lg font-bold text-gray-700 h-12 sm:h-16 select-none items-center justify-center">
				{[...Array(7)].map((_, i) => (
					<div key={i} className="text-center">
						{format(addDays(startDate, i), "EEE").toUpperCase()}
					</div>
				))}
			</div>
		);
	};

	const renderCells = () => {
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(currentMonth);
		const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
		const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

		let rows = [];
		let days = [];
		let day = startDate;

		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const cloneDay = day;
				const formattedDate = format(day, "d");
				const isCurrentMonth = isSameMonth(day, monthStart);
				const isToday = isSameDay(day, new Date());
				
				// Get events for this day
				const dayEvents = isCurrentMonth ? universityEvents.filter((event) => {
					const start = parseISO(event.startDate);
					const end = parseISO(event.endDate);
					return day >= start && day <= end;
				}) : [];
				
				// Check for holiday
				const holiday = isCurrentMonth ? getHolidayForDate(day) : null;
				
				// Get event types for this day (if any)
				const eventTypes = dayEvents.map(event => event.event_type).filter(Boolean);
				
				// Determine the primary event type for coloring (if any)
				let primaryEventType = null;
				if (eventTypes.length > 0) {
					// You can customize this logic to prioritize certain event types
					primaryEventType = eventTypes[0]; // Just take the first event's type
				}

				// Determine styling based on priority: holiday > event > today > default
				let bgColor = "bg-white";
				let textColor = "text-gray-900";
				let borderColor = "";
				let fontWeight = "font-normal";
				let dotColor = "";
				
				if (holiday) {
					textColor = "text-primary-500";
					dotColor = "bg-primary-500";
				} else if (dayEvents.length > 0) {
					// Use event type color if available, otherwise use default accent
					if (primaryEventType && eventTypeColors[primaryEventType]) {
						dotColor = eventTypeColors[primaryEventType];
						textColor = `text-${primaryEventType === 'admission' ? 'purple' : 
									primaryEventType === 'enrollment' ? 'emerald' :
									primaryEventType === 'academic' ? 'amber' :
									primaryEventType === 'examination' ? 'rose' :
									primaryEventType === 'break' ? 'sky' :
									primaryEventType === 'event' ? 'pink' : 'accent'}-500`;
					} else {
						dotColor = "bg-accent-500";
						textColor = "text-accent-500";
					}
				} else if (isToday) {
					bgColor = "bg-primary-500";
					textColor = "text-white";
					fontWeight = "font-semibold";
				} else if (!isCurrentMonth) {
					textColor = "text-gray-400";
				}

				days.push(
					<div
						key={day}
						aria-label={`Day ${formattedDate} ${dayEvents.length > 0 ? "with events" : ""} ${holiday ? "holiday" : ""}`}
						tabIndex={isCurrentMonth ? 0 : -1}
						onClick={() => isCurrentMonth && handleDayClick(cloneDay)}
						className={`cursor-pointer select-none text-center m-px grow h-12 sm:h-16 flex flex-col items-center justify-center text-base sm:text-xl relative
							${fontWeight}
							${textColor}
							${dayEvents.length > 0 ? "font-semibold text-[17px]" : ""}
							${holiday ? "font-semibold text-[17px]" : ""}
							${bgColor}
							${borderColor}
							${!isToday && !holiday && dayEvents.length === 0 ? "hover:bg-gray-100" : ""}
							transition`}    
					>
						<span>{formattedDate}</span>
						{/* Event indicator dots */}
						{(dayEvents.length > 0 || holiday) && (
							<div className="flex gap-0.5 mt-0.5">
								{holiday && (
									<div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${dotColor || 'bg-primary-500'}`} />
								)}
								{dayEvents.slice(0, 3).map((event, index) => {
									const eventColor = event.event_type && eventTypeColors[event.event_type] 
										? eventTypeColors[event.event_type] 
										: 'bg-accent-500';
									return (
										<div 
											key={index} 
											className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${eventColor}`} 
										/>
									);
								})}
								{dayEvents.length > 3 && (
									<span className="text-[8px] sm:text-[10px] text-gray-500">+{dayEvents.length - 3}</span>
								)}
							</div>
						)}
					</div>
				);
				day = addDays(day, 1);
			}
			rows.push(
				<div key={day} className="grid grid-cols-7">
					{days}
				</div>,
			);
			days = [];
		}
		return <div>{rows}</div>;
	};

	// Loading state
	if (loading && !universityEvents.length) {
		return (
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
				<div className="flex justify-center items-center h-64">
					<div className="text-gray-500">Loading calendar...</div>
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

	return (
		<>
			{isDayModalOpen && (
				<>
					<div
						className="fixed inset-0 backdrop-blur-sm z-100"
						style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
						onClick={() => setIsDayModalOpen(false)}
					></div>

					<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
									bg-white rounded-xl shadow-lg 
									w-[90%] sm:max-w-md
									max-h-[80vh] overflow-y-auto
									z-100 px-4 pt-4 pb-2 sm:p-6">
						
						<h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 pr-8">
							Events on{" "}
							{selectedDayEvents[0] && (
								selectedDayEvents[0].event_type === 'holiday'
									? format(selectedDayEvents[0].displayDate || new Date(), "MMMM d, yyyy")
									: format(parseISO(selectedDayEvents[0].startDate), "MMMM d, yyyy")
							)}
						</h3>

						<button 
							onClick={() => setIsDayModalOpen(false)}
							className="absolute top-3 right-4 sm:hidden p-1 text-gray-500 hover:text-gray-700"
							aria-label="Close"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
								<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
							</svg>
						</button>

						<ul className="space-y-3 mb-3">
							{selectedDayEvents.map((event) => {
								// Determine styling based on event type
								let eventTypeColor = "text-gray-600";
								let eventTypeLabel = "Event";
								let borderColor = "border-neutral-100";
								let bgColor = "";
								
								switch(event.event_type) {
									case 'holiday':
										eventTypeColor = "text-blue-600";
										eventTypeLabel = "Holiday";
										borderColor = "border-blue-200";
										bgColor = "bg-blue-50";
										break;
									case 'admission':
										eventTypeColor = "text-purple-600";
										eventTypeLabel = "Admission";
										borderColor = "border-purple-200";
										bgColor = "bg-purple-50";
										break;
									case 'enrollment':
										eventTypeColor = "text-emerald-600";
										eventTypeLabel = "Enrollment";
										borderColor = "border-emerald-200";
										bgColor = "bg-emerald-50";
										break;
									case 'academic':
										eventTypeColor = "text-amber-600";
										eventTypeLabel = "Academic";
										borderColor = "border-amber-200";
										bgColor = "bg-amber-50";
										break;
									case 'examination':
										eventTypeColor = "text-rose-600";
										eventTypeLabel = "Examination";
										borderColor = "border-rose-200";
										bgColor = "bg-rose-50";
										break;
									case 'break':
										eventTypeColor = "text-sky-600";
										eventTypeLabel = "Break";
										borderColor = "border-sky-200";
										bgColor = "bg-sky-50";
										break;
									case 'event':
										eventTypeColor = "text-pink-600";
										eventTypeLabel = "Event";
										borderColor = "border-pink-200";
										bgColor = "bg-pink-50";
										break;
									default:
										eventTypeColor = "text-orange-600";
										eventTypeLabel = event.event_type ? 
											event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1) : 
											"University Event";
										borderColor = "border-orange-200";
										bgColor = "bg-orange-50";
								}
								
								return (
									<li key={event.id} className={`border rounded p-3 ${borderColor} ${bgColor}`}>
										<span className="font-semibold text-sm sm:text-base">{event.title}</span>
										<span className={`block text-xs mt-1 ${eventTypeColor} capitalize`}>
											{eventTypeLabel}
										</span>
									</li>
								);
							})}
						</ul>

						<div className="flex justify-end hidden sm:flex">
							<button
								onClick={() => setIsDayModalOpen(false)}
								className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition text-sm sm:text-base"
							>
								Close
							</button>
						</div>
					</div>
				</>
			)}

			{isPreviewOpen && (
			<>
				{/* BACKDROP */}
				<div
				className="fixed inset-0 backdrop-blur-sm z-50"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
				onClick={() => setIsPreviewOpen(false)}
				></div>

				{/* MODAL CONTAINER */}
				<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
								bg-neutral-50 z-50 w-[95%] max-w-3xl max-h-[90vh] overflow-auto
								 shadow-lg p-6 sm:p-6">
				
					{/* Close X */}
					<button
						onClick={() => setIsPreviewOpen(false)}
						className="absolute top-4 right-3 p-2 text-gray-500 hover:text-gray-700"
						aria-label="Close preview modal"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.9 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.88 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.88a1 1 0 0 0 0-1.41z" />
						</svg>
					</button>

					<h3 className="font-semibold text-lg mb-2">
						Academic Calendar Preview
					</h3>

					{/* PDF Viewer */}
					<div className="w-full flex justify-center">
						<PdfViewer pdfFile="/ACADEMIC-CALENDAR-2025-2026.pdf" />
					</div>
				</div>
			</>
			)}

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
				{/* Title */}
				<div className="mb-4 sm:mb-6">
					<h1 className="text-[15px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
						<Icon
							icon="solar:calendar-bold"
							width={24}
							height={24}
							className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
						/>
						<span className="break-words">University Calendar - Academic Year {academicYear}</span>
					</h1>
					<p className="text-sm sm:text-base md:text-lg font-regular text-gray-600 mb-3 pl-0 sm:pl-10">
						{semesterLabel} | {format(semesterStart, "MMMM d, yyyy")} -{" "}
						{format(semesterEnd, "MMMM d, yyyy")}
					</p>
				</div>

				<div className="w-full max-w-[900px] mx-auto mt-2 mb-10 rounded-xl select-none bg-neutral-50 px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 pt-4 sm:pt-8 shadow-[0_13px_34px_rgba(0,0,0,0.1)]">
					{/* Calendar */}
					<div className=" overflow-hidden">
						{renderHeader()}
						{renderDays()}
						{renderCells()}
					</div>

					{/* Events Sections */}
					<section className="mt-4 sm:mt-6">
						<h2 className="flex items-center gap-2 text-gray-900 font-semibold mb-3 select-none">
							<Icon
								icon="solar:calendar-bold"
								width={20}
								height={20}
								className="sm:w-6 sm:h-6 text-neutral-800"
							/>
							<p className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
								All Events This Month
							</p>
						</h2>

						{(holidaysThisMonth.length > 0 || eventsThisMonth.length > 0) ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">

								{/* Holidays First */}
								{holidaysThisMonth.map((holiday) => (
									<div
										key={holiday.id}
										className="bg-white rounded-md py-3 px-4 sm:px-5 border border-gray-200 flex flex-col"
									>
										<span className="font-semibold text-base sm:text-[18px] truncate">
											{holiday.title}
										</span>

										<span className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1">
											<Icon
												icon="solar:calendar-bold"
												width={14}
												height={14}
												className="text-gray-500 flex-shrink-0"
											/>
											{holiday.formatted_date}
										</span>
									</div>
								))}

								{/* University Events */}
								{eventsThisMonth.map((event) => (
									<div
										key={event.id}
										className="bg-white rounded-md py-3 px-4 sm:px-5 border border-gray-200 flex flex-col"
									>
										<span className="font-semibold text-base sm:text-[18px] truncate">
											{event.title}
										</span>

										<span className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-1">
											<Icon
												icon="solar:calendar-bold"
												width={14}
												height={14}
												className="text-gray-500 flex-shrink-0"
											/>
											{formatEventDateRange(event.startDate, event.endDate)}
										</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-500 text-center py-4">
								No events this month
							</p>
						)}
					</section>

					<hr className="text-neutral-200 mt-4" />

					{/* Action Buttons */}
					<div className="mt-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
						<button
							onClick={() => setIsPreviewOpen(true)}
							className="flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-3 sm:px-4 py-3 text-gray-900 hover:bg-gray-100 transition cursor-pointer select-none w-full sm:w-auto"
							aria-label="Preview calendar events"
							type="button"
						>
							<Icon
								icon="charm:eye"
								width={18}
								height={18}
								className="sm:w-5 sm:h-5 text-neutral-500"
							/>
							<span className="text-sm sm:text-base text-neutral-500">Preview</span>
						</button>

						<button
							onClick={downloadPDF}
							className="flex items-center justify-center gap-2 bg-primary-500 text-white rounded-lg px-3 sm:px-4 py-3 hover:bg-blue-800 transition cursor-pointer select-none w-full sm:w-auto"
							type="button"
						>
							<Icon
								icon="material-symbols:download"
								width={18}
								height={18}
								className="sm:w-5 sm:h-5 text-white"
							/>
							<span className="text-sm sm:text-base">Download Calendar</span>
						</button>
					</div>

				</div>
			</div>
		</>
	);
}

export default UniversityCalendar;

// import { useState, useEffect, useMemo } from "react";
// import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths, isSameMonth, isSameDay, parseISO, isWithinInterval, isBefore, isAfter, getMonth, getDate } from "date-fns";
// import { Icon } from "@iconify/react";
// import axios from "axios";

// const academicYear = "2025-2026";
// const semesterLabel = "2nd Semester";
// const semesterStart = new Date(2026, 0, 12);
// const semesterEnd = new Date(2026, 4, 26);

// function UniversityCalendar() {

// 	const today = new Date();
// 	const initialMonth = isWithinInterval(today, {start: semesterStart, end: semesterEnd}) ? today : semesterStart;

// 	const [universityEvents, setUniversityEvents] = useState([]);
// 	const [holidays, setHolidays] = useState([]);
// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState(null);
// 	const [currentMonth, setCurrentMonth] = useState(initialMonth);
// 	const [selectedDayEvents, setSelectedDayEvents] = useState([]);
// 	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
// 	const [isDayModalOpen, setIsDayModalOpen] = useState(false);

// 	// Fetch university events
// 	useEffect(() => {
// 		const fetchUniversityEvents = async () => {
// 			try {
// 				setLoading(true);
// 				const response = await axios.get(`/api/calendar/university?school_year=${encodeURIComponent(academicYear)}`);
// 				console.log("Fetched university events:", response.data);
				
// 				const transformedEvents = response.data.events.map(event => ({
// 					id: `uni-${event.id}`,
// 					title: event.title,
// 					startDate: event.start_date,
// 					endDate: event.end_date,
// 					semester: event.semester,
// 					event_type: event.event_type, 
// 					source: 'University',
// 					isHoliday: false
// 				}));
				
// 				setUniversityEvents(transformedEvents);
// 				setError(null);
// 			} catch (error) {
// 				console.error("Failed to fetch university events:", error);
// 				setError("Failed to load calendar events");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchUniversityEvents();
// 	}, []);

// 	// Fetch holidays
// 	useEffect(() => {
// 		const fetchHolidays = async () => {
// 			try {
// 				const response = await axios.get(`/api/calendar/holidays`);
// 				console.log("Fetched holidays:", response.data);
				
// 				const transformedHolidays = response.data.holidays.map(holiday => ({
// 					id: `hol-${holiday.id}`,
// 					title: holiday.title,
// 					month: holiday.month,
// 					day: holiday.day,
// 					month_day: holiday.month_day,
// 					formatted_date: holiday.formatted_date,
// 					source: 'Holiday',
// 					event_type: 'holiday',
// 					isHoliday: true
// 				}));
				
// 				setHolidays(transformedHolidays);
// 			} catch (error) {
// 				console.error("Failed to fetch holidays:", error);
// 			}
// 		};

// 		fetchHolidays();
// 	}, []);

// 	useEffect(() => {
// 		if (isPreviewOpen || isDayModalOpen) {
// 			const scrollY = window.scrollY;

// 			document.body.style.position = 'fixed';
// 			document.body.style.top = `-${scrollY}px`;
// 			document.body.style.width = '100%';
// 			document.body.style.overflow = 'hidden';
			
// 			return () => {
// 				document.body.style.position = '';
// 				document.body.style.top = '';
// 				document.body.style.width = '';
// 				document.body.style.overflow = '';
// 				window.scrollTo(0, scrollY);
// 			};
// 		}
// 	}, [isPreviewOpen, isDayModalOpen]);

// 	// Combine all events for calendar display
// 	const allEvents = useMemo(() => {
// 		return [...universityEvents];
// 	}, [universityEvents]);

// 	// Create a map of holidays by month-day for quick lookup
// 	const holidayMap = useMemo(() => {
// 		const map = new Map();
// 		holidays.forEach(holiday => {
// 			map.set(holiday.month_day, holiday);
// 		});
// 		return map;
// 	}, [holidays]);

// 	// Get holidays for current month view
// 	const holidaysThisMonth = useMemo(() => {
// 		const currentMonthNum = getMonth(currentMonth) + 1; // getMonth is 0-indexed
// 		return holidays.filter(holiday => holiday.month === currentMonthNum);
// 	}, [holidays, currentMonth]);

// 	// Check if a specific date has a holiday
// 	const getHolidayForDate = (date) => {
// 		const month = getMonth(date) + 1;
// 		const day = getDate(date);
// 		const monthDay = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
// 		return holidayMap.get(monthDay);
// 	};

// 	const eventDays = useMemo(() => {
// 		const days = new Set();

// 		// Add university event days
// 		universityEvents.forEach((event) => {
// 			let dt = parseISO(event.startDate);
// 			const endDt = parseISO(event.endDate);

// 			while (dt <= endDt) {
// 				days.add(format(dt, "yyyy-MM-dd"));
// 				dt = addDays(dt, 1);
// 			}
// 		});

// 		return days;
// 	}, [universityEvents]);

// 	const eventsThisMonth = useMemo(() => {
// 		return universityEvents.filter((event) => {
// 			const start = parseISO(event.startDate);
// 			const end = parseISO(event.endDate);
// 			const monthStart = startOfMonth(currentMonth);
// 			const monthEnd = endOfMonth(currentMonth);

// 			return (
// 				isWithinInterval(start, { start: monthStart, end: monthEnd }) ||
// 				isWithinInterval(end, { start: monthStart, end: monthEnd }) ||
// 				(isBefore(start, monthStart) && isAfter(end, monthEnd))
// 			);
// 		});
// 	}, [universityEvents, currentMonth]);

// 	const handlePrevMonth = () => {
// 		setCurrentMonth(subMonths(currentMonth, 1));
// 	};

// 	const handleNextMonth = () => {
// 		setCurrentMonth(addMonths(currentMonth, 1));
// 	};

// 	const formatEventDateRange = (start, end) => {
// 		const startDate = parseISO(start);
// 		const endDate = parseISO(end);
// 		if (start === end) return format(startDate, "MMMM dd");
// 		return `${format(startDate, "MMMM dd")} - ${format(endDate, "dd")}`;
// 	};

// 	const handleDayClick = (date) => {
// 		// Get university events for the day
// 		const eventsForDay = universityEvents.filter((event) => {
// 			const start = parseISO(event.startDate);
// 			const end = parseISO(event.endDate);

// 			return (
// 				isSameDay(date, start) ||
// 				isSameDay(date, end) ||
// 				(date >= start && date <= end)
// 			);
// 		});

// 		// Check if the day has a holiday
// 		const holidayForDay = getHolidayForDate(date);
		
// 		// Combine events and holiday
// 		const allDayEvents = [
// 			...eventsForDay,
// 			...(holidayForDay ? [{
// 				...holidayForDay,
// 				// Add the actual date for display
// 				displayDate: date
// 			}] : [])
// 		];

// 		if (allDayEvents.length > 0) {
// 			setSelectedDayEvents(allDayEvents);
// 			setIsDayModalOpen(true);
// 		}
// 	};

// 	const downloadICS = () => {
// 		let icsContent = `BEGIN:VCALENDAR
// 			VERSION:2.0
// 			PRODID:-//QCU Student Portal//Calendar//EN
// 			CALSCALE:GREGORIAN
// 			METHOD:PUBLISH
// 			`;

// 		eventsThisMonth.forEach((event) => {
// 			const dtStart = format(parseISO(event.startDate), "yyyyMMdd");
// 			const dtEnd = format(addDays(parseISO(event.endDate), 1), "yyyyMMdd");
// 			icsContent += `BEGIN:VEVENT
// 				SUMMARY:${event.title}
// 				DTSTART;VALUE=DATE:${dtStart}
// 				DTEND;VALUE=DATE:${dtEnd}
// 				END:VEVENT
// 				`;
// 		});

// 		icsContent += "END:VCALENDAR";

// 		const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
// 		const url = URL.createObjectURL(blob);
// 		const link = document.createElement("a");
// 		link.href = url;
// 		link.download = `qcu_calendar_${format(currentMonth, "yyyy_MM")}.ics`;
// 		document.body.appendChild(link);
// 		link.click();
// 		document.body.removeChild(link);
// 	};

// 	const renderHeader = () => (
// 		<>
// 			<div className="flex justify-between items-center mb-4 pt-3 px-2 sm:px-5 gap-2 sm:gap-15">
// 				<button
// 					onClick={handlePrevMonth}
// 					aria-label="Previous Month"
// 					className="text-gray-600 hover:text-gray-900 cursor-pointer"
// 				>
// 					<Icon icon="iconamoon:arrow-left-2-duotone" width={32} height={32} className="sm:w-10 sm:h-10 text-neutral-900"/>
// 				</button>

// 				<h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 select-none text-center">
// 					{format(currentMonth, "MMMM yyyy")}
// 				</h2>

// 				<button
// 					onClick={handleNextMonth}
// 					aria-label="Next Month"
// 					className="text-gray-600 hover:text-gray-900 cursor-pointer"
// 				>
// 					<Icon icon="iconamoon:arrow-right-2-duotone" width={32} height={32} className="sm:w-10 sm:h-10 text-neutral-900"/>
// 				</button>
// 			</div>
// 			<hr className="text-neutral-800" />
// 		</>
// 	);

// 	const renderDays = () => {
// 		const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
// 		return (
// 			<div className="grid grid-cols-7 text-sm sm:text-base md:text-lg font-bold text-gray-700 h-12 sm:h-16 select-none items-center justify-center">
// 				{[...Array(7)].map((_, i) => (
// 					<div key={i} className="text-center">
// 						{format(addDays(startDate, i), "EEE").toUpperCase()}
// 					</div>
// 				))}
// 			</div>
// 		);
// 	};

// 	const renderCells = () => {
// 		const monthStart = startOfMonth(currentMonth);
// 		const monthEnd = endOfMonth(currentMonth);
// 		const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
// 		const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

// 		let rows = [];
// 		let days = [];
// 		let day = startDate;

// 		while (day <= endDate) {
// 			for (let i = 0; i < 7; i++) {
// 				const cloneDay = day;
// 				const formattedDate = format(day, "d");
// 				const isCurrentMonth = isSameMonth(day, monthStart);
// 				const isToday = isSameDay(day, new Date());
				
// 				// Check for holiday and university event
// 				const hasEvent = eventDays.has(format(day, "yyyy-MM-dd")) && isCurrentMonth;
// 				const holiday = isCurrentMonth ? getHolidayForDate(day) : null;

// 				// Determine styling based on priority: holiday > event > today > default
// 				let bgColor = "bg-white";
// 				let textColor = "text-gray-900";
// 				let borderColor = "";
// 				let fontWeight = "font-normal";
				
// 				if (holiday) {
// 					textColor = "text-primary-500";
// 				} else if (hasEvent) {
// 					textColor = "text-accent-500";
// 				} else if (isToday) {
// 					bgColor = "bg-primary-500";
// 					textColor = "text-white";
// 					fontWeight = "font-semibold";
// 				} else if (!isCurrentMonth) {
// 					textColor = "text-gray-400";
// 				}

// 				days.push(
// 					<div
// 						key={day}
// 						aria-label={`Day ${formattedDate} ${hasEvent ? "with events" : ""} ${holiday ? "holiday" : ""}`}
// 						tabIndex={isCurrentMonth ? 0 : -1}
// 						onClick={() => isCurrentMonth && handleDayClick(cloneDay)}
// 						className={`cursor-pointer select-none text-center m-px grow h-12 sm:h-16 flex flex-col items-center justify-center text-base sm:text-xl relative
// 							${fontWeight}
// 							${textColor}
// 							${hasEvent ? "font-semibold" : ""}
// 							${holiday ? "font-semibold" : ""}
// 							${bgColor}
// 							${borderColor}
// 							${!isToday && !holiday && !hasEvent ? "hover:bg-gray-100" : ""}
// 							transition`}    
// 					>
// 						<span>{formattedDate}</span>
// 					</div>,
// 				);
// 				day = addDays(day, 1);
// 			}
// 			rows.push(
// 				<div key={day} className="grid grid-cols-7">
// 					{days}
// 				</div>,
// 			);
// 			days = [];
// 		}
// 		return <div>{rows}</div>;
// 	};

// 	// Loading state
// 	if (loading && !universityEvents.length) {
// 		return (
// 			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
// 				<div className="flex justify-center items-center h-64">
// 					<div className="text-gray-500">Loading calendar...</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	// Error state
// 	if (error) {
// 		return (
// 			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
// 				<div className="flex justify-center items-center h-64">
// 					<div className="text-red-500">{error}</div>
// 				</div>
// 			</div>
// 		);
// 	}

// 	return (
// 		<>
// 			{isDayModalOpen && (
// 				<>
// 					<div
// 						className="fixed inset-0 backdrop-blur-sm z-100"
// 						style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
// 						onClick={() => setIsDayModalOpen(false)}
// 					></div>

// 					<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
// 									bg-white rounded-xl shadow-lg 
// 									w-[90%] sm:max-w-md
// 									max-h-[80vh] overflow-y-auto
// 									z-100 px-4 pt-4 pb-2 sm:p-6">
						
// 						<h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 pr-8">
// 							Events on{" "}
// 							{selectedDayEvents[0] && (
// 								selectedDayEvents[0].isHoliday 
// 									? format(selectedDayEvents[0].displayDate || new Date(), "MMMM d, yyyy")
// 									: format(parseISO(selectedDayEvents[0].startDate), "MMMM d, yyyy")
// 							)}
// 						</h3>

// 						<button 
// 							onClick={() => setIsDayModalOpen(false)}
// 							className="absolute top-3 right-4 sm:hidden p-1 text-gray-500 hover:text-gray-700"
// 							aria-label="Close"
// 						>
// 							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
// 								<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
// 							</svg>
// 						</button>

// 						<ul className="space-y-3 mb-3">
// 							{selectedDayEvents.map((event) => (
// 								<li key={event.id} className={`border rounded p-3 ${
// 									event.isHoliday ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'
// 								}`}>
// 									<span className="font-semibold text-sm sm:text-base">{event.title}</span>
// 									<span className={`block text-xs mt-1 ${
// 										event.isHoliday ? 'text-blue-600' : 'text-orange-600'
// 									}`}>
// 										{event.isHoliday ? 'Holiday' : 'University Event'}
// 									</span>
// 								</li>
// 							))}
// 						</ul>

// 						<div className="flex justify-end hidden sm:flex">
// 							<button
// 								onClick={() => setIsDayModalOpen(false)}
// 								className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition text-sm sm:text-base"
// 							>
// 								Close
// 							</button>
// 						</div>
// 					</div>
// 				</>
// 			)}

// 			{isPreviewOpen && (
// 				<>
// 					<div
// 						className="fixed inset-0 backdrop-blur-sm z-100"
// 						style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
// 						onClick={() => setIsPreviewOpen(false)}
// 					></div>
					
// 					<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
// 									bg-white rounded-xl shadow-lg 
// 									w-[90%] sm:max-w-md
// 									max-h-[80vh] overflow-y-auto
// 									z-100 px-5 pt-5 pb-3 sm:p-6">
						
// 						<h3 className="font-semibold text-base sm:text-lg mb-4 flex items-center gap-2 text-gray-900 select-none pr-8">
// 							<Icon
// 								icon="solar:calendar-bold"
// 								width={20}
// 								height={20}
// 								className="sm:w-5 sm:h-5 text-neutral-800 flex-shrink-0"
// 							/>
// 							<span>Events Preview - {format(currentMonth, "MMMM yyyy")}</span>
// 						</h3>
						
// 						<button 
// 							onClick={() => setIsPreviewOpen(false)}
// 							className="absolute top-3 right-4 p-2 text-gray-500 hover:text-gray-700 sm:hidden"
// 							aria-label="Close"
// 						>
// 							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
// 								<path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
// 							</svg>
// 						</button>
						
// 						{/* Holidays Section */}
// 						{holidaysThisMonth.length > 0 && (
// 							<div className="mb-4">
// 								<h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
// 									<Icon icon="mdi:pine-tree" width={16} height={16} />
// 									Holidays
// 								</h4>
// 								<ul className="space-y-2">
// 									{holidaysThisMonth.map((holiday) => (
// 										<li
// 											key={holiday.id}
// 											className="border border-red-200 bg-red-50 rounded py-2 px-3 text-gray-900"
// 										>
// 											<span className="font-semibold text-sm sm:text-base">{holiday.title}</span>
// 											<span className="block text-xs sm:text-sm text-red-600">
// 												{holiday.formatted_date}
// 											</span>
// 										</li>
// 									))}
// 								</ul>
// 							</div>
// 						)}

// 						{/* University Events Section */}
// 						{eventsThisMonth.length > 0 && (
// 							<div className="mb-4">
// 								<h4 className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-1">
// 									<Icon icon="clarity:event-solid" width={16} height={16} />
// 									University Events
// 								</h4>
// 								<ul className="space-y-2">
// 									{eventsThisMonth.map((event) => (
// 										<li
// 											key={event.id}
// 											className="border border-blue-200 bg-blue-50 rounded py-2 px-3 text-gray-900"
// 										>
// 											<span className="font-semibold text-sm sm:text-base">{event.title}</span>
// 											<time
// 												className="block text-xs sm:text-sm text-blue-600"
// 												dateTime={event.startDate}
// 											>
// 												{format(parseISO(event.startDate), "MMMM d") +
// 													(event.startDate !== event.endDate
// 														? ` - ${format(parseISO(event.endDate), "d")}`
// 														: "")}
// 											</time>
// 										</li>
// 									))}
// 								</ul>
// 							</div>
// 						)}

// 						{eventsThisMonth.length === 0 && holidaysThisMonth.length === 0 && (
// 							<p className="text-gray-500 text-center py-8">No events this month.</p>
// 						)}
						
// 						<div className="flex justify-end">
// 							<button
// 								onClick={() => setIsPreviewOpen(false)}
// 								className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer select-none font-semibold text-sm sm:text-base hidden sm:block"
// 								aria-label="Close preview modal"
// 								type="button"
// 							>
// 								Close
// 							</button>
// 						</div>
// 					</div>
// 				</>
// 			)}

// 			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
// 				{/* Title */}
// 				<div className="mb-4 sm:mb-6">
// 					<h1 className="text-[15px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
// 						<Icon
// 							icon="solar:calendar-bold"
// 							width={24}
// 							height={24}
// 							className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
// 						/>
// 						<span className="break-words">University Calendar - Academic Year {academicYear}</span>
// 					</h1>
// 					<p className="text-sm sm:text-base md:text-lg font-regular text-gray-600 mb-3 pl-0 sm:pl-10">
// 						{semesterLabel} | {format(semesterStart, "MMMM d, yyyy")} -{" "}
// 						{format(semesterEnd, "MMMM d, yyyy")}
// 					</p>
// 				</div>

// 				<div className="w-full max-w-[900px] mx-auto mt-2 mb-10 rounded-xl select-none bg-neutral-50 px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 pt-4 sm:pt-8 shadow-[0_13px_34px_rgba(0,0,0,0.1)]">
// 					{/* Calendar */}
// 					<div className=" overflow-hidden">
// 						{renderHeader()}
// 						{renderDays()}
// 						{renderCells()}
// 					</div>

// 					{/* Events Sections */}
// 					<section className="mt-4 sm:mt-6">
// 						{/* Holidays Section */}
// 						{holidaysThisMonth.length > 0 && (
// 							<div className="mb-4">
// 								<h2 className="flex items-center gap-2 text-gray-900 font-semibold mb-2 text-sm select-none">
// 									<Icon icon="fluent:calendar-eye-28-filled" width={20} height={20} className="sm:w-6 sm:h-6 text-primary-500"/>
// 									<p className="text-base sm:text-lg md:text-xl font-medium text-primary-500">Holidays</p>
// 								</h2>
// 								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
// 									{holidaysThisMonth.map((holiday) => (
// 										<div key={holiday.id} className="bg-blue-50 rounded-md py-2 px-4 sm:px-5 text-gray-900 flex flex-col cursor-default min-h-[60px] sm:h-17 border border-blue-200">
// 											<span className="font-semibold text-base sm:text-[18px] truncate">{holiday.title}</span>
// 											<span className="text-xs text-blue-600 flex items-center gap-1 sm:gap-2">
// 												<Icon icon="solar:calendar-bold" width={14} height={14} className="sm:w-4 sm:h-4 text-blue-600 flex-shrink-0"/>
// 												<span className="text-xs sm:text-sm truncate"> {holiday.formatted_date} </span> 
// 											</span>
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 						)}

// 						{/* University Events Section */}
// 						{eventsThisMonth.length > 0 && (
// 							<div>
// 								<h2 className="flex items-center gap-2 text-gray-900 font-semibold mb-2 text-sm select-none">
// 									<Icon icon="clarity:event-solid" width={20} height={20} className="sm:w-6 sm:h-6 text-accent-500"/>
// 									<p className="text-base sm:text-lg md:text-xl font-medium text-accent-500">University Events</p>
// 								</h2>
// 								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
// 									{eventsThisMonth.map((event) => (
// 										<div key={event.id} className="bg-orange-50 rounded-md py-2 px-4 sm:px-5 text-gray-900 flex flex-col cursor-default min-h-[60px] sm:h-17 border border-orange-200">
// 											<span className="font-semibold text-base sm:text-[18px] truncate">{event.title}</span>
// 											<span className="text-xs text-orange-600 flex items-center gap-1 sm:gap-2">
// 												<Icon icon="solar:calendar-bold" width={14} height={14} className="sm:w-4 sm:h-4 text-orange-600 flex-shrink-0"/>
// 												<span className="text-xs sm:text-sm truncate"> {formatEventDateRange(event.startDate, event.endDate)} </span> 
// 											</span>
// 										</div>
// 									))}
// 								</div>
// 							</div>
// 						)}

// 						{eventsThisMonth.length === 0 && holidaysThisMonth.length === 0 && (
// 							<p className="text-gray-500 text-center py-4">
// 								No events this month
// 							</p>
// 						)}
// 					</section>

// 					<hr className="text-neutral-200 mt-4" />

// 					{/* Action Buttons */}
// 					<div className="mt-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
// 						<button
// 							onClick={() => setIsPreviewOpen(true)}
// 							className="flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-3 sm:px-4 py-3 text-gray-900 hover:bg-gray-100 transition cursor-pointer select-none w-full sm:w-auto"
// 							aria-label="Preview calendar events"
// 							type="button"
// 						>
// 							<Icon
// 								icon="charm:eye"
// 								width={18}
// 								height={18}
// 								className="sm:w-5 sm:h-5 text-neutral-500"
// 							/>
// 							<span className="text-sm sm:text-base text-neutral-500">Preview</span>
// 						</button>

// 						<button
// 							onClick={downloadICS}
// 							className="flex items-center justify-center gap-2 bg-primary-500 text-white rounded-lg px-3 sm:px-4 py-3 hover:bg-blue-800 transition cursor-pointer select-none w-full sm:w-auto"
// 							aria-label="Download calendar as ICS file"
// 							type="button"
// 						>
// 							<Icon
// 								icon="material-symbols:download"
// 								width={18}
// 								height={18}
// 								className="sm:w-5 sm:h-5 text-white"
// 							/>
// 							<span className="text-sm sm:text-base">Download Calendar</span>
// 						</button>
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// }

// export default UniversityCalendar;