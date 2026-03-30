import { adminSidebar, customerSidebar } from "./sidebarItems";


export const getSidebarData = (role: "ADMIN" | "MANAGER" | "MODERATOR" | "CUSTOMER") => {
  if (role === "ADMIN") {
    return adminSidebar;
  }
  if (role === "MODERATOR") {
    return adminSidebar;
  }

  if (role === "CUSTOMER") {
    return customerSidebar;
  }
};