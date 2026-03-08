import { useState, useEffect, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths, isSameMonth, isSameDay, parseISO, isWithinInterval, isBefore, isAfter, getMonth, getDate, isEqual } from "date-fns";
import { Icon } from "@iconify/react";
import axios from "axios";
import PdfModal from "./PdfModal";

const today = new Date();

function UniversityCalendar() {

	const [academicYear, setAcademicYear] = useState(null)
	const [semesterLabel, setSemesterLabel] = useState(null)
	const [semesterStart, setSemesterStart] = useState(null)
	const [semesterEnd, setSemesterEnd] = useState(null)
	const [calendarPdf, setCalendarPdf] = useState(null)
	const [universityEvents, setUniversityEvents] = useState([]);
	const [holidays, setHolidays] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(null);
	const [selectedDayEvents, setSelectedDayEvents] = useState([]);
	const [selectedDayDate, setSelectedDayDate] = useState(null); 
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
				const response = await axios.get(`/api/calendar/university`);
				console.log("Fetched university events:", response.data);

				const school_year = response.data.school_year
				const semester = response.data.semester
				const semester_start = new Date(response.data.semester_start)
				const semester_end = new Date(response.data.semester_end)

				setAcademicYear(school_year)
				setSemesterLabel(semester)
				setSemesterStart(semester_start)
				setSemesterEnd(semester_end)
				setCurrentMonth(isWithinInterval(today, {start: semester_start, end: semester_end}) ? today : semester_start)
				setCalendarPdf(response.data.calendar_url)
				
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
			setSelectedDayDate(date); // Store the clicked date
			setIsDayModalOpen(true);
		}
	};

	const closeDayModal = () => {
		setIsDayModalOpen(false);
		setSelectedDayDate(null);
		setSelectedDayEvents([]);
	};

	const downloadPDF = async (pdfUrl, title) => {
		try {

			const response = await fetch(pdfUrl);
			if (!response.ok) throw new Error("Failed to fetch PDF");

			const blob = await response.blob();

			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = `${title}.pdf`;
			document.body.appendChild(link);
			link.click();

			link.remove();
			window.URL.revokeObjectURL(link.href);

		} catch (err) {
			console.error("PDF download failed:", err);
			alert("Unable to download PDF. Make sure the URL is HTTPS.");
		}
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
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px] animate-pulse">
			
			{/* Calendar Card */}
			<div className="w-full mx-auto mt-4 mb-10 rounded-xl bg-neutral-50 px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 pt-4 sm:pt-8 shadow-[0_13px_34px_rgba(0,0,0,0.1)]">
				
				{/* Header skeleton */}
				<div className="flex justify-between items-center mb-4">
					<div className="h-8 w-8 bg-gray-200 rounded-full"></div>
					<div className="h-6 w-32 bg-gray-200 rounded"></div>
					<div className="h-8 w-8 bg-gray-200 rounded-full"></div>
				</div>
				<hr className="text-gray-200 mb-3" />

				{/* Days of week skeleton */}
				<div className="grid grid-cols-7 gap-1 mb-2">
				{Array.from({ length: 7 }).map((_, i) => (
					<div key={i} className="h-6 bg-gray-200 rounded"></div>
				))}
				</div>

				{/* Calendar cells skeleton */}
				<div className="grid grid-rows-5 grid-cols-7 gap-1 mb-4">
				{Array.from({ length: 35 }).map((_, i) => (
					<div key={i} className="h-12 sm:h-16 bg-gray-200 rounded relative">

					</div>
				))}
				</div>

				{/* Event list skeleton */}
				<div className="mt-4">
				<div className="h-6 w-48 bg-gray-200 rounded mb-3"></div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
					{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-gray-200 h-20 rounded-md border border-gray-200"></div>
					))}
				</div>
				</div>

				{/* Action buttons skeleton */}
				<div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
				<div className="h-10 w-full sm:w-32 bg-gray-200 rounded"></div>
				<div className="h-10 w-full sm:w-40 bg-gray-200 rounded"></div>
				</div>

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
						onClick={closeDayModal}
					></div>

					<div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
									bg-white rounded-xl shadow-lg 
									w-[90%] sm:max-w-md
									max-h-[80vh] overflow-y-auto
									z-100 px-4 pt-4 pb-2 sm:p-6">
						
						<h3 className="font-semibold text-base sm:text-lg mb-4 text-gray-900 pr-8">
							Events on{" "}
							{selectedDayDate ? format(selectedDayDate, "MMMM d, yyyy") : ""}
						</h3>

						<button 
							onClick={closeDayModal}
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
								onClick={closeDayModal}
								className="w-full sm:w-auto px-5 py-2.5 sm:py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition text-sm sm:text-base"
							>
								Close
							</button>
						</div>
					</div>
				</>
			)}

			<PdfModal
				isOpen={isPreviewOpen}
				onClose={() => setIsPreviewOpen(false)}
				pdfFile={calendarPdf}
				title="Calendar Preview"
			/>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[900px]">
				{/* Title */}
				<div>
					<h1 className="text-[18px] sm:text-[21px] md:text-[26px] font-semibold flex items-center gap-2 text-gray-800 mt-4 sm:mt-5">
						<Icon
							icon="solar:calendar-bold"
							width={24}
							height={24}
							className="hidden sm:w-7 sm:h-7 sm:block text-neutral-800"
						/>
						<span className="break-words">University Calendar</span>
					</h1>
					<p className="text-sm sm:text-base md:text-lg font-regular text-gray-600 mb-3 pl-0 sm:pl-10">
						{semesterLabel} | {format(semesterStart, "MMM d yyyy")} - {format(semesterEnd, "MMM d yyyy")}
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
							className="flex items-center justify-center gap-2 border border-gray-400 rounded-lg px-3 sm:px-6 py-3 text-gray-900 hover:bg-gray-100 transition cursor-pointer select-none w-full sm:w-auto"
							aria-label="Preview calendar events"
							type="button"
						>
							<span className="text-sm sm:text-base text-neutral-500">Preview</span>
						</button>

						<button
							onClick={() => downloadPDF(calendarPdf, `University Calendar - ${academicYear}`)}
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