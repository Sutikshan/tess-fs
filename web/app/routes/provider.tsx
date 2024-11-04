import { NavLink, Outlet } from "@remix-run/react"
import { Menu, UserCircle } from "lucide-react"
import { useState } from "react"
import { ModeToggle } from "~/components/mode-toggle"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "~/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"

const isMenuActive = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium relative ${isActive
    ? 'pt-4 text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-primary after:to-purple-500'
    : 'text-gray-600 hover:text-gray-900'
  }`

export default function ProviderLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <nav className="flex flex-col gap-4">
                  <NavLink
                    to="/provider/customers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={isMenuActive}
                  >
                    Customers
                  </NavLink>
                  <NavLink
                    to="/provider/organization"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={isMenuActive}
                  >
                    Organization
                  </NavLink>
                  {/* Add more mobile menu items */}
                </nav>
              </SheetContent>
            </Sheet>
            {/* Main Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavLink
                    to="/provider/customers"
                    className={isMenuActive
                    }
                  >
                    Customers
                  </NavLink>
                </NavigationMenuItem>
                <NavLink
                  to="/provider/organization"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={isMenuActive}
                >
                  Organization
                </NavLink>
                {/* Add more menu items as needed */}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <ModeToggle />
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>

                    <NavLink to="/provider/profile" className="w-full">
                      Profile
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <NavLink to="/sign-out" className="w-full">
                      Sign out
                    </NavLink>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        <Outlet />
      </main>
    </div>
  )
}