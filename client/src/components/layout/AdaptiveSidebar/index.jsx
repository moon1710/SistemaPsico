import React from "react";
import { baseItems, roleSpecificItems } from "./sidebarConfig";
import MenuItem from "./MenuItem";
import SidebarHeader from "./SidebarHeader";
import SidebarUser from "./SidebarUser";
import SidebarFooter from "./SidebarFooter";

const AdaptiveSidebar = ({ user, onLogout, isCollapsed, onToggle }) => {
  const menuItems = [
    ...baseItems,
    ...roleSpecificItems.filter(
      (item) => item.roles.includes("all") || item.roles.includes(user?.rol)
    ),
  ];

  return (
    <div
      className={`
        sticky top-0 h-screen bg-[#21252d]
        border-r border-[#2b333c]/50 shadow-2xl
        flex flex-col transition-all duration-500 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle} />
      <SidebarUser user={user} onLogout={onLogout} isCollapsed={isCollapsed} />
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <MenuItem key={item.href} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <SidebarFooter isCollapsed={isCollapsed} />
    </div>
  );
};

export default AdaptiveSidebar;
