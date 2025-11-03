export default function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo - More Compact */}
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">🏢 Nandighosh</h1>
        <p className="text-xs text-gray-500">Estate Manager</p>
      </div>
      
      {/* Navigation - Tighter Spacing */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        <a 
          href="/" 
          className="flex items-center px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded font-medium"
        >
          <span className="mr-2 text-base">📊</span>
          <span>Dashboard</span>
        </a>
        
        <a 
          href="/projects" 
          className="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded transition"
        >
          <span className="mr-2 text-base">📁</span>
          <span>Projects</span>
        </a>
      </nav>
      
      {/* User Profile - More Compact */}
      <div className="px-3 py-3 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <div className="ml-2 min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@nandighosh.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}