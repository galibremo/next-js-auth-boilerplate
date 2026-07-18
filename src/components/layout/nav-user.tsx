"use client";

import { Logout03Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import {
  NavUserItemProps,
  NavUserMaxItemProps,
} from "@/components/layout/layout.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getUserInitials } from "@/core/helper";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/features/auth/login/actions/login.mutations";

interface NavUserComponentProps {
  items: NavUserMaxItemProps;
}

export function NavUser(props: NavUserComponentProps) {
  const { isMobile } = useSidebar();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  if (!user) return null;

  const userName = user.name ? user.name : user.email;
  const userImage = user.image || undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg bg-transparent">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="text-foreground rounded-lg bg-transparent">
                  {getUserInitials(userName)}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>

              <HugeiconsIcon
                icon={MoreVerticalIcon}
                className="ml-auto size-4"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="text-foreground h-8 w-8 rounded-lg bg-transparent">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="text-foreground rounded-lg bg-transparent">
                    {getUserInitials(userName)}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="text-foreground truncate font-medium">
                    {userName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {props.items.length > 0 &&
                props.items
                  .filter(
                    (item): item is NavUserItemProps => item !== undefined,
                  )
                  .map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.url}>
                        <HugeiconsIcon icon={item.icon} />
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => logout()} disabled={isPending}>
              <HugeiconsIcon icon={Logout03Icon} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
