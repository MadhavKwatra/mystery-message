"use client";

import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <>
      <aside className="h-screen sticky top-0 md:block hidden">
        <nav className="h-full flex flex-col bg-white dark:bg-gray-900 dark:text-white  border-r shadow-sm">
          <div className="p-4 pb-2 flex flex-row-reverse">
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </nav>
      </aside>
    </>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  handleClick?: () => void;
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  handleClick
}: SidebarItemProps) {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }

  const { expanded } = context;

  return (
    <li
      onClick={handleClick}
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-32 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 dark:bg-gray-700 dark:text-gray-200 z-50`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
