import { Users, LayoutDashboardIcon, ToolCase, StoreIcon, ListOrdered } from "lucide-react";

export const moderatorSidebar = [
  {
    title: "Dashboard",
    items: [
      { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboardIcon },
      { title: "POS", url: "/staff/dashboard/pos", icon: StoreIcon },
      { title: "Leads", url: "/staff/dashboard/leads", icon: ListOrdered },
      { title: "My Orders", url: "/staff/dashboard/my-orders", icon: ListOrdered }
    ],
  }
];


export const adminSidebar = [
  {
    title: "Dashboard",
    items: [
      { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboardIcon },
      { title: "Products", url: "/staff/dashboard/admin/product-management", icon: ToolCase },
      { title: "Categories", url: "/staff/dashboard/admin/category-management", icon: ToolCase },
      { title: "Brands", url: "/staff/dashboard/admin/brand-management", icon: ToolCase },
      { title: "Users", url: "/staff/dashboard/admin/user-management", icon: Users },
      { title: "Customers", url: "/staff/dashboard/admin/customer-management", icon: Users },
      { title: "Orders", url: "/staff/dashboard/admin/orders-management", icon: ListOrdered },
      { title: "Leads", url: "/staff/dashboard/leads", icon: ListOrdered },
      { title: "POS", url: "/staff/dashboard/pos", icon: StoreIcon },
      { title: "My Orders", url: "/staff/dashboard/my-orders", icon: ListOrdered },
    ],
  }
];

export const customerSidebar = [
  {
    title: " Dashboard",
    items: [
      { title: "My Orders", url: "/customer/dashboard/my-orders", icon: ToolCase },
    ],
  }
];

