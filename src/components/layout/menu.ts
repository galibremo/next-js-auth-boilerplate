import {
  ComputerProtectionIcon,
  DashboardSquare01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { route } from "@/routes/routes";
import { NavItemProps, NavUserMaxItemProps } from "./layout.types";

const userItems: NavUserMaxItemProps = [
  {
    title: "Profile",
    url: route.private.profile,
    icon: UserIcon,
  },
  {
    title: "Sessions",
    url: route.private.sessions,
    icon: ComputerProtectionIcon,
  },
];

const navPlatformItem: NavItemProps[] = [
  {
    title: "Dashboard",
    url: route.private.dashboard,
    icon: DashboardSquare01Icon,
  },
  {
    title: "Users",
    url: route.private.users,
    icon: UserGroupIcon,
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Sessions",
    url: route.private.sessions,
    icon: ComputerProtectionIcon,
  },
];

export { navPlatformItem, userItems };
