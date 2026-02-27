function LoginActivity() {

  const sessions = [
    {
      location: "Quezon City, Philippines",
      session_id: "000001",
      ip: "27.49.10.2",
      os: "Windows",
      browser: "Chrome",
      lastAccessed: "Just now",
      created: "Created 1 month ago",
    },
    {
      location: "Manila, Philippines",
      session_id: "000002",
      ip: "112.198.12.45",
      os: "Android",
      browser: "Chrome Mobile",
      lastAccessed: "2 days ago",
      created: "Created 2 months ago",
    },
    {
      location: "Manila, Philippines",
      session_id: "000003",
      ip: "112.198.12.46",
      os: "Android",
      browser: "Chrome Mobile",
      lastAccessed: "2 days ago",
      created: "Created 2 months ago",
    },
  ];

  return (
    <div className="flex flex-col w-full gap-2 bg-neutral-50 p-2 shadow-lg rounded-lg max-h-[230px] sm:max-h-[250px] overflow-y-auto">
      {sessions.map((session, idx) => (
        <section key={idx}
          className="
            grid 
            grid-cols-2 
            gap-4
			gap-y-2 
            bg-white 
            shadow-sm 
            hover:shadow-md 
            transition 
            rounded-lg 
            p-3
          "
        >
          {/* Column 1: Location */}
          <div className="flex flex-col text-[12px] sm:text-sm">
            <p className="font-semibold text-gray-800">{session.location}</p>
            <p className="text-gray-500">{session.ip}</p>
          </div>

          {/* Column 2: Session ID */}
          <div className="flex flex-col text-[12px] sm:text-sm">
            <p className="font-semibold text-gray-700">Session ID</p>
            <p className="text-gray-500">{session.session_id}</p>
          </div>

          {/* Column 3: Device Info */}
          <div className="flex flex-col text-[12px] sm:text-sm">
            <p className="font-semibold text-gray-700">{session.os}</p>
            <p className="text-gray-500">{session.browser}</p>
          </div>

          {/* Column 4: Activity */}
          <div className="flex flex-col text-[12px] sm:text-sm">
            <p className="font-semibold text-gray-700">{session.lastAccessed}</p>
            <p className="text-gray-500">{session.created}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

export default LoginActivity;