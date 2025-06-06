

import {
  ShoppingBasket,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Frame,
  LogOut,
  Map,
  PieChart,
  CircleUserRound,
  BookOpenText,
  BookUser,
  ShoppingCart,
  House
} from "lucide-react"
import { ReactNode } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSessionStore } from "@/store/sessionStore"
import { useNavigate } from "react-router-dom"
import { readUser } from "@/firebase/userController"
import { useState } from "react"
import React from "react"
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inicio",
      icon: House,
      url: "/home",
      items:[
        {
          title: "Dashboard",
          url: "/home",
        }
      ]
    },
    {
      title: "Productos",
      icon: ShoppingBasket,
      isActive: false,
      items: [
        {
          title: "Registrar",
          url: "/registrarProducto",
        },
        {
          title: "Editar",
          url: "/editProducts",
        },
        {
          title: "Eliminar",
          url: "/eliminarProducto",
        },
        {
          title: "Listar",
          url: "/listarProductos",
        }
      ],
    },
    {
      title: "Ventas",
      icon: ShoppingCart,
      items: [
        {
          title: "Registrar",
          url: "/registrarVenta",
        },
        {
          title: "Eliminar",
          url: "/eliminarVenta",
        },
        {
          title: "Listar",
          url: "/listaVentas",
        }
      ],
    }
  ],
  navSecondary: [
    {
      title: "Documentación",
      url: "/documentacion",
      icon: BookOpenText,
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar1({ children }: SidebarProps) {
  const {session,logout} = useSessionStore()
  const navigate = useNavigate()
  const handleLogout = async () => {
    await logout(navigate);
  };
  const [userData, setUserData] = useState(
    {
      codigoUsuario: "",
      email: "",
      displayName: "",
    }
  );

  React.useEffect(() => {
    const getUser = async () => {
      try{
        const user = await readUser(session.uid);
        setUserData(
          {
            codigoUsuario: user.codigoUsuario,
            email: user.email,
            displayName: user.displayname,
          }
        )
        console.log(user)
      }
      catch(e){
        console.error(e);
      }
    }
    getUser();

  } , [session]);

  

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar variant="inset" collapsible="offcanvas"  >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/home" >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg ">
                    <img src="/chartLineBlack.svg" alt="Logo" className="h-8" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight text-black">
                    <span className="truncate font-semibold">OptiStock</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title} className="text-black">
                      <a >
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90 bg-transparent">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className="">
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <a href={item.url} className="text-black">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="bg-white"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={data.user.avatar}
                        alt={data.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {String(userData.displayName).charAt(0).toLocaleUpperCase() + String(userData.displayName).charAt(1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.displayName}
                      </span>
                      <span className="truncate text-xs">
                        {userData.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={data.user.avatar}
                          alt={String(userData.displayName)}
                        />
                        <AvatarFallback className="rounded-lg">
                          {String(userData.displayName).charAt(0) + String(userData.displayName).charAt(1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {String(userData.displayName)}
                        </span>
                        <span className="truncate text-xs">
                          {userData.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <a href="/profile" className="text-black">
                    <DropdownMenuItem>
                      <CircleUserRound/>
                      Profile
                    </DropdownMenuItem>
                    </a>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <a onClick={handleLogout} className="text-black">
                  <DropdownMenuItem>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                  </a>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="pb-8">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 bg-white border-black border-1" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
