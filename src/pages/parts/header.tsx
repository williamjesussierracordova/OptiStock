'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"
import { LogOut, User } from 'lucide-react'
import { useSessionStore } from '@/store/sessionStore'
import { useNavigate } from 'react-router-dom'


export default function Header() {
  const { session, logout } = useSessionStore();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(session?.email);
  const [displayName, setDisplayName] = React.useState(session?.displayName);
  const [avatarSrc, setAvatarSrc] = React.useState(session?.photoURL);

  React.useEffect(() => {
    setEmail(session?.email);
    setDisplayName(session?.displayName);
    setAvatarSrc(session?.photoURL);
  } , [session]);

  const handleLogout = async () => {
    await logout(navigate);
  };

  React.useEffect(() => {
    console.log(session);
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">

      <div>
        <a href='/home'>
        <img src='/chartLineBlack.svg' alt="Logo" className="h-8 " />
        </a>
      </div>

      <div className="flex items-center space-x-4 font-mono text-xl">
        OptiStock
        </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback>
                <span>{displayName ? displayName[0] : ''}</span>
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <a href='/profile' className='text-black'>
          <DropdownMenuItem >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          </a>
          <DropdownMenuSeparator />
          <a onClick={handleLogout} className='text-black'>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}