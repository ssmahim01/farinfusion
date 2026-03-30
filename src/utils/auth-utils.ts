// export type UserRole = "ADMIN" | "EDITOR";
export type UserRole = "USER" | "SELLER" | "OWNER";

export type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};


export const userRoutes: RouteConfig = {
  exact: ["/customer/dashboard"],
  patterns: [/^\/customer\/dashboard/],
};

export const staffRoutes: RouteConfig = {
  exact: ["/staff/dashboard"],
  patterns: [/^\/staff\/dashboard(?!\/owner)/],
};

export const ownerRoutes: RouteConfig = {
  exact: ["/staff/dashboard/owner"],
  patterns: [/^\/staff\/dashboard\/owner/],
};


export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
): boolean => {
  if (routes.exact.includes(pathname)) return true;
  return routes.patterns.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string
): UserRole | "STAFF" | null => {

  if (isRouteMatches(pathname, ownerRoutes)) {
    return "OWNER";
  }

  if (isRouteMatches(pathname, staffRoutes)) {
    return "STAFF"; // SELLER + OWNER
  }

  if (isRouteMatches(pathname, userRoutes)) {
    return "USER";
  }

  return null;
};

export const isValidRouteForRole = (
  pathname: string,
  role: UserRole
): boolean => {
  const routeOwner = getRouteOwner(pathname);

  // Public route
  if (routeOwner === null) return true;

  if (routeOwner === "USER") {
    return role === "USER";
  }

  if (routeOwner === "STAFF") {
    return role === "SELLER" || role === "OWNER";
  }

  if (routeOwner === "OWNER") {
    return role === "OWNER";
  }

  return false;
};


export const getDefaultDashboardRoute = (
  role: UserRole
): string => {
  if (role === "USER") return "/customer/dashboard/my-orders";
  if (role === "SELLER") return "/staff/dashboard";
  if (role === "OWNER") return "/staff/dashboard";
  return "/";
};
