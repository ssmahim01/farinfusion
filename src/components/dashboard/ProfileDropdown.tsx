"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LogOut, User2 } from "lucide-react"
import { logoutUser } from "@/utils/logoutUser"
import { useGetMeQuery } from "@/redux/features/user/user.api"
import { ProfileAvatar } from "./ProfileAvatar"

export function ProfileDropdown() {

  const {data} = useGetMeQuery(undefined)

  const router = useRouter()

  const handleLogout = async () => {
    logoutUser()
    toast.success("Logout successful")
    router.push("/")

  }

  // console.log("user data in dropdown ", data)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="p-0 rounded-full h-10 w-10 flex items-center justify-center"
        >
          <ProfileAvatar />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`${((data?.data?.role === "ADMIN") || ( data?.data?.role === "MANAGER") || ( data?.data?.role === "MODERATOR")) ? "/staff/dashboard/profile" : "/customer/dashboard/my-orders"}`}>
            {/* <Link href={`/staff/dashboard/profile`}> */}
              <User2 />
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
