// /**
//  * @description: Enhanced Header with Pink Theme + Dark/Light Toggle
//  * @version: 2.1.0
//  * @date: 2025-01-27
//  */

// "use client";
// import { useState, useEffect } from "react";
// import { Menu, Bell, Moon, Sun, ChevronDown, Users, LogOut } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";
// import { Pacifico } from "next/font/google";

// const pacifico = Pacifico({
//   subsets: ["latin"],
//   weight: ["400"],
//   variable: "--font-pacifico",
// });

// type HeaderProps = {
//   onToggle?: () => void;
//   collapsed?: boolean;
// };

// export default function Header({ onToggle }: HeaderProps) {
//   const [scrolled, setScrolled] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notificationCount] = useState(2);

//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem("theme") || "light";
//     const isDark = saved === "dark";
//     setDarkMode(isDark);
//     document.documentElement.classList.toggle("dark", isDark);
//   }, []);

//   const toggleTheme = () => {
//     if (darkMode) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     }
//     setDarkMode(!darkMode);
//   };

//   // Handle scroll shadow
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <motion.header
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
//       className={cn(
//         "relative z-40 flex items-center justify-between mx-2 mt-3 mr-2 px-3 py-2 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.7,-0.15,0.25,1.15)] will-change-transform ",
//         "shadow-[0_8px_30px_rgb(236,72,153,0.15)] dark:shadow-[0_8px_30px_rgb(236,72,153,0.07)]",
//         "hover:shadow-[0_15px_50px_rgb(236,72,153,0.25)] dark:hover:shadow-[0_15px_50px_rgb(236,72,153,0.15)] dark:border:white",
//         scrolled
//           ? "shadow-[0_12px_40px_rgb(236,72,153,0.25)] dark:shadow-[0_12px_40px_rgb(236,72,153,0.12)]"
//           : ""
//       )}
//     >
//       {/* Background with pink glow */}
//       <div className="absolute inset-0 rounded-xl overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-pink-500/5 dark:from-pink-500/10 dark:via-transparent dark:to-pink-500/10 rounded-xl blur-xl" />
//         <div className="absolute inset-0 p-[1px] rounded-xl bg-gradient-to-br from-pink-500/30 via-white/20 to-pink-500/30 dark:from-pink-500/20 dark:via-white/10 dark:to-pink-500/20">
//           <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl" />
//         </div>
//         <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
//           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(236,72,153,0.4),transparent_70%)]" />
//           <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.4),transparent_70%)]" />
//         </div>
//       </div>

//       {/* Left Section */}
//       <div className="relative z-10 flex items-center space-x-4">
//         {onToggle && (
//           <button
//             onClick={onToggle}
//             className="p-2 rounded-lg bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 transition-all duration-300 shadow-sm border border-pink-200/40 dark:border-pink-700/40 active:scale-95"
//             title="Toggle Sidebar"
//             type="button"
//           >
//             <Menu className="w-4 h-4 text-pink-600 dark:text-pink-300" />
//           </button>
//         )}

//         <div className="flex flex-col">
//           <h1 className="text-sm font-semibold text-pink-600 dark:text-gray-200">
//             Mirror Salon
//           </h1>
//           <div className="text-[10px] text-gray-600 dark:text-gray-400">
//             Welcome to{" "}
//             <span className="relative inline-block group">
//               <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent blur-sm opacity-50"></span>
//               <span
//                 className={cn(
//                   "relative bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 bg-clip-text text-transparent transition-all duration-300 ease-out",
//                   pacifico.className
//                 )}
//               >
//                 Your Salon
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100" />
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="relative z-10 flex items-center space-x-3">
//         {/* Notifications */}
//         <div className="relative">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="p-2 rounded-lg bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 transition-all duration-300 shadow-sm border border-pink-200/40 dark:border-pink-700/40"
//           >
//             <Bell className="w-4 h-4 text-pink-600 dark:text-pink-300" />
//             {notificationCount > 0 && (
//               <span className="absolute top-0 right-0 flex h-5 w-5 -mt-1 -mr-1">
//                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
//                 <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-600 text-[10px] text-white font-medium justify-center items-center">
//                   {notificationCount}
//                 </span>
//               </span>
//             )}
//           </motion.button>

//           {/* Notification Dropdown */}
//           {showNotifications && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.95 }}
//               className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg border border-pink-200/40 dark:border-pink-700/40 z-50"
//             >
//               <div className="p-4 border-b border-pink-200/40 dark:border-pink-700/40">
//                 <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                   Notifications
//                 </h3>
//               </div>
//               <div className="max-h-64 overflow-y-auto">
//                 <div className="p-3 hover:bg-pink-50 dark:hover:bg-pink-800/30 transition-colors duration-200 border-b border-pink-200/30 dark:border-pink-700/30">
//                   <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                     New sale completed
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400">
//                     Order #1234 has been processed successfully
//                   </p>
//                   <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
//                     2 minutes ago
//                   </p>
//                 </div>
//                 <div className="p-3 hover:bg-pink-50 dark:hover:bg-pink-800/30 transition-colors duration-200">
//                   <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                     Low stock alert
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400">
//                     Product 'Coffee Beans' is running low
//                   </p>
//                   <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
//                     15 minutes ago
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Theme Toggle */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={toggleTheme}
//           className="p-2 rounded-lg border bg-pink-100/40 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 shadow-sm"
//         >
//           {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//         </motion.button>

       
//       </div>
//     </motion.header>

   
//   );
// }






    // code no 2
  


// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Menu, Bell, Moon, Sun, User, LogIn, LogOut } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { motion } from "framer-motion";
// import { Pacifico } from "next/font/google";
// import { useAuth } from "@/contexts/AuthContext";
// import { signOutUser } from "@/lib/auth";
// import { useRouter } from "next/navigation";

// const pacifico = Pacifico({
//   subsets: ["latin"],
//   weight: ["400"],
//   variable: "--font-pacifico",
// });

// type HeaderProps = {
//   onToggle?: () => void;
//   collapsed?: boolean;
// };

// export default function Header({ onToggle }: HeaderProps) {
//   const router = useRouter();
//   const { user, userRole } = useAuth();

//   const [scrolled, setScrolled] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notificationCount] = useState(2);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);

//   const menuRef = useRef<HTMLDivElement>(null);

//   // Theme setup
//   useEffect(() => {
//     const saved = localStorage.getItem("theme") || "light";
//     const isDark = saved === "dark";
//     setDarkMode(isDark);
//     document.documentElement.classList.toggle("dark", isDark);
//   }, []);

//   const toggleTheme = () => {
//     if (darkMode) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     }
//     setDarkMode(!darkMode);
//   };

//   // Handle scroll shadow
//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close user menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         showUserMenu &&
//         menuRef.current &&
//         !menuRef.current.contains(event.target as Node)
//       ) {
//         setShowUserMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showUserMenu]);

//   // Handle sign out
//   const handleSignOut = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     try {
//       const { error } = await signOutUser();
//       if (error) {
//         alert("Error signing out: " + error);
//         setShowUserMenu(false);
//       } else {
//         setShowUserMenu(false);
//         router.push("/signin");
//       }
//     } catch (error) {
//       alert("Error signing out: " + error);
//       setShowUserMenu(false);
//     }
//   };

//   return (
//     <motion.header
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
//       className={cn(
//         "relative z-40 flex items-center justify-between mx-2 mt-3 mr-2 px-3 py-2 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.7,-0.15,0.25,1.15)]",
//         "shadow-[0_8px_30px_rgb(236,72,153,0.15)] dark:shadow-[0_8px_30px_rgb(236,72,153,0.07)]",
//         "hover:shadow-[0_15px_50px_rgb(236,72,153,0.25)] dark:hover:shadow-[0_15px_50px_rgb(236,72,153,0.15)]",
//         scrolled
//           ? "shadow-[0_12px_40px_rgb(236,72,153,0.25)] dark:shadow-[0_12px_40px_rgb(236,72,153,0.12)]"
//           : ""
//       )}
//     >
//       {/* Background Glow */}
//       <div className="absolute inset-0 rounded-xl overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-pink-500/5 dark:from-pink-500/10 dark:via-transparent dark:to-pink-500/10 blur-xl" />
//         <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-pink-500/30 via-white/20 to-pink-500/30 dark:from-pink-500/20 dark:via-white/10 dark:to-pink-500/20 rounded-xl">
//           <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl" />
//         </div>
//       </div>

//       {/* Left Section */}
//       <div className="relative z-10 flex items-center space-x-4">
//         {onToggle && (
//           <button
//             onClick={onToggle}
//             className="p-2 rounded-lg bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 border border-pink-200/40 dark:border-pink-700/40 shadow-sm"
//             title="Toggle Sidebar"
//             type="button"
//           >
//             <Menu className="w-4 h-4 text-pink-600 dark:text-pink-300" />
//           </button>
//         )}

//         <div className="flex flex-col">
//           <h1 className="text-sm font-semibold text-pink-600 dark:text-gray-200">
//             Mirror Salon
//           </h1>
//           <div className="text-[10px] text-gray-600 dark:text-gray-400">
//             Welcome to{" "}
//             <span className="relative inline-block group">
//               <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 text-transparent blur-sm opacity-50 bg-clip-text"></span>
//               <span
//                 className={cn(
//                   "relative bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 text-transparent bg-clip-text",
//                   pacifico.className
//                 )}
//               >
//                 Your Salon
//               </span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="relative z-10 flex items-center space-x-3">
//         {/* Notifications */}
//         <div className="relative">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="p-2 rounded-lg bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 border border-pink-200/40 dark:border-pink-700/40 shadow-sm"
//           >
//             <Bell className="w-4 h-4 text-pink-600 dark:text-pink-300" />
//             {notificationCount > 0 && (
//               <span className="absolute top-0 right-0 flex h-5 w-5 -mt-1 -mr-1">
//                 <span className="animate-ping absolute h-full w-full rounded-full bg-pink-400 opacity-75"></span>
//                 <span className="relative flex items-center justify-center h-4 w-4 rounded-full bg-pink-600 text-[10px] text-white font-medium">
//                   {notificationCount}
//                 </span>
//               </span>
//             )}
//           </motion.button>

//           {/* Notification Dropdown */}
//           {showNotifications && (
//             <motion.div
//               initial={{ opacity: 0, y: -10, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.95 }}
//               className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg border border-pink-200/40 dark:border-pink-700/40 z-50"
//             >
//               <div className="p-4 border-b border-pink-200/40 dark:border-pink-700/40">
//                 <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                   Notifications
//                 </h3>
//               </div>
//               <div className="max-h-64 overflow-y-auto">
//                 <div className="p-3 border-b border-pink-200/30 dark:border-pink-700/30 hover:bg-pink-50 dark:hover:bg-pink-800/30">
//                   <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                     New sale completed
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400">
//                     Order #1234 has been processed successfully
//                   </p>
//                   <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
//                     2 minutes ago
//                   </p>
//                 </div>
//                 <div className="p-3 hover:bg-pink-50 dark:hover:bg-pink-800/30">
//                   <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                     Low stock alert
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400">
//                     Product 'Coffee Beans' is running low
//                   </p>
//                   <p className="text-xs text-pink-600 dark:text-pink-400 mt-1">
//                     15 minutes ago
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </div>

//         {/* Theme Toggle */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={toggleTheme}
//           className="p-2 rounded-lg border bg-pink-100/40 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 shadow-sm"
//         >
//           {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//         </motion.button>

//         {/* Profile / Auth Section */}
//         <div className="relative flex items-center" ref={menuRef}>
//           {user ? (
//             <div className="relative">
//               {/* User Button */}
//               <button
//                 onClick={() => setShowUserMenu(!showUserMenu)}
//                 className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 rounded-lg border border-pink-200/40 
//                            bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 
//                            shadow-sm transition"
//               >
//                 {/* Avatar */}
//                 <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-100/60 to-pink-200/50 
//                                 flex items-center justify-center border border-pink-200/50">
//                   <User className="h-3.5 w-3.5 text-pink-600" />
//                 </div>
//                 {/* Username */}
//                 <span className="hidden sm:inline text-xs font-medium text-gray-900 dark:text-gray-200">
//                   {user.displayName || user.email?.split("@")[0] || "User"}
//                 </span>
//               </button>

//               {/* Dropdown Menu */}
//               {showUserMenu && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl 
//                                 border border-pink-200/30 dark:border-pink-700/40 rounded-xl shadow-lg z-50">
//                   {/* User Info */}
//                   <div className="p-3 border-b border-pink-100 dark:border-pink-700/40">
//                     <p className="text-xs font-medium text-gray-900 dark:text-gray-200 truncate">
//                       {user.displayName || user.email?.split("@")[0]}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                       {user.email}
//                     </p>
//                     <p className="text-xs text-pink-600 capitalize">
//                       {userRole?.role || "User"}
//                     </p>
//                   </div>

//                   {/* Actions */}
//                   <div className="p-2 space-y-1">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         router.push("/profile");
//                         setShowUserMenu(false);
//                       }}
//                       className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium 
//                                  text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 
//                                  rounded-lg transition"
//                     >
//                       <User className="h-3.5 w-3.5" />
//                       <span>Profile</span>
//                     </button>
//                     <button
//                       onClick={handleSignOut}
//                       className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium 
//                                  text-red-600 hover:bg-red-50 dark:hover:bg-red-800/40 
//                                  rounded-lg transition"
//                     >
//                       <LogOut className="h-3.5 w-3.5" />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             // Sign In Button
//             <button
//               onClick={() => router.push("/signin")}
//               className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium 
//                          text-pink-700 bg-pink-100/60 hover:bg-pink-200/70 
//                          rounded-lg shadow-sm border border-pink-200/50 transition"
//             >
//               <LogIn className="h-3.5 w-3.5" />
//               <span className="hidden sm:inline">Sign In</span>
//             </button>
//           )}
//         </div>
//       </div>
//     </motion.header>
//   );
// }

// code no 3
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, Bell, Moon, Sun, User, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Pacifico } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

type HeaderProps = {
  onToggle?: () => void;
  collapsed?: boolean;
};

export default function Header({ onToggle }: HeaderProps) {
  const router = useRouter();
  const { user, userRole } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(2);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Theme setup
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const isDark = saved === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  // Handle sign out
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const { error } = await signOutUser();
      if (error) {
        alert("Error signing out: " + error);
        setShowUserMenu(false);
      } else {
        setShowUserMenu(false);
        router.push("/signin");
      }
    } catch (error) {
      alert("Error signing out: " + error);
      setShowUserMenu(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
      className={cn(
        "relative z-40 flex items-center justify-between mx-2 mt-3 mr-2 px-3 py-2 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.7,-0.15,0.25,1.15)]",
        "shadow-[0_8px_30px_rgb(236,72,153,0.15)] dark:shadow-[0_8px_30px_rgb(236,72,153,0.07)]",
        "hover:shadow-[0_15px_50px_rgb(236,72,153,0.25)] dark:hover:shadow-[0_15px_50px_rgb(236,72,153,0.15)]",
        scrolled
          ? "shadow-[0_12px_40px_rgb(236,72,153,0.25)] dark:shadow-[0_12px_40px_rgb(236,72,153,0.12)]"
          : ""
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-pink-500/5 dark:from-pink-500/10 dark:via-transparent dark:to-pink-500/10 blur-xl" />
        <div className="absolute inset-0 p-[1px] bg-gradient-to-br from-pink-500/30 via-white/20 to-pink-500/30 dark:from-pink-500/20 dark:via-white/10 dark:to-pink-500/20 rounded-xl">
          <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl" />
        </div>
      </div>

      {/* Left Section */}
      <div className="relative z-10 flex items-center space-x-4">
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 border border-pink-200/40 dark:border-pink-700/40 shadow-sm"
            title="Toggle Sidebar"
            type="button"
          >
            <Menu className="w-4 h-4 text-pink-600 dark:text-pink-300" />
          </button>
        )}

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-pink-600 dark:text-gray-200">
            Mirror Salon
          </h1>
          <div className="text-[10px] text-gray-600 dark:text-gray-400">
            Welcome to{" "}
            <span className="relative inline-block group">
              <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 text-transparent blur-sm opacity-50 bg-clip-text"></span>
              <span
                className={cn(
                  "relative bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 text-transparent bg-clip-text",
                  pacifico.className
                )}
              >
                Your Salon
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative z-10 flex items-center space-x-3">
        

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg border bg-pink-100/40 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 shadow-sm"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        {/* Profile / Auth Section */}
        <div className="relative flex items-center" ref={menuRef}>
          {user ? (
            <div className="relative">
              {/* User Button with Display Name */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-2 sm:px-3 py-1.5 rounded-lg border border-pink-200/40 
                           bg-pink-100/40 dark:bg-pink-900/20 hover:bg-pink-200/50 dark:hover:bg-pink-800/30 
                           shadow-sm transition"
              >
                {/* Avatar */}
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-100/60 to-pink-200/50 
                                flex items-center justify-center border border-pink-200/50">
                  <User className="h-3.5 w-3.5 text-pink-600" />
                </div>
                {/* Display Name or Email */}
                <span className="hidden sm:inline text-xs font-medium text-gray-900 dark:text-gray-200">
                  {user.displayName || user.email}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl 
                                border border-pink-200/30 dark:border-pink-700/40 rounded-xl shadow-lg z-50">
                  {/* User Info */}
                  <div className="p-3 border-b border-pink-100 dark:border-pink-700/40">
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-200 truncate">
                      {user.displayName || user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-pink-600 capitalize">
                      {userRole?.role || "User"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium 
                                 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40 
                                 rounded-lg transition"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium 
                                 text-red-600 hover:bg-red-50 dark:hover:bg-red-800/40 
                                 rounded-lg transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Sign In Button
            <button
              onClick={() => router.push("/signin")}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium 
                         text-pink-700 bg-pink-100/60 hover:bg-pink-200/70 
                         rounded-lg shadow-sm border border-pink-200/50 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}



