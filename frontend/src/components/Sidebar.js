function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-5 hidden md:block">

      <h1 className="text-2xl font-bold mb-10">
        Civic Dashboard
      </h1>

      <ul className="space-y-5">
        <li className="hover:text-blue-400 cursor-pointer">
          Dashboard
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          AQI Analytics
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Maps
        </li>

        <li className="hover:text-blue-400 cursor-pointer">
          Reports
        </li>
      </ul>

    </div>
  );
}

export default Sidebar;