// js/components/app-header.tsx
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CheckSquare, ChevronDown, ClipboardList, HelpCircle, LayoutGrid, Menu, Search, Target, TrendingUp, Users } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

// User Navigation Items
const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Tasks',
        href: '/tasks',
        icon: CheckSquare,
        children: [
            { title: 'All Tasks', href: '/tasks' },
            { title: 'Create New Task', href: '/tasks/create' },
        ],
    },
    {
        title: 'Habits',
        href: '/habits',
        icon: Target,
        children: [
            { title: 'My Habits', href: '/habits' },
            { title: 'Add New Habit', href: '/habits/create' },
            { title: 'Calendar View', href: '/habits/calendar' },
        ],
    },
    {
        title: 'Statistics',
        href: '/statistics',
        icon: TrendingUp,
        children: [
            { title: 'Tasks Completed', href: '/statistics/tasks' },
            { title: 'Habit Streaks', href: '/statistics/habits' },
            { title: 'Weekly Summary', href: '/statistics/weekly' },
        ],
    },
];

// Admin Navigation Items - Reorganized
const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
        children: [
            { title: 'All Users', href: '/admin/users' },
            { title: 'All Roles', href: '/admin/roles' },
            { title: 'Create Role', href: '/admin/roles/create' },
            { title: 'Assign Permissions', href: '/admin/permissions' },
        ],
    },
    {
        title: 'Tasks Management',
        href: '/admin/tasks',
        icon: ClipboardList,
        children: [
            { title: 'All Tasks', href: '/admin/tasks' },
            { title: 'Pending Approval', href: '/admin/tasks/pending' },
            { title: 'Overdue Tasks', href: '/admin/tasks/overdue' },
        ],
    },
    {
        title: 'Habits Management',
        href: '/admin/habits',
        icon: Target,
        children: [
            { title: 'All Habits', href: '/admin/habits' },
            { title: 'Habit Logs', href: '/admin/habits/logs' },
        ],
    },
    {
        title: 'Statistics & Reports',
        href: '/admin/reports',
        icon: TrendingUp,
        children: [
            { title: 'User Activity Reports', href: '/admin/reports/activity' },
            { title: 'Task Completion Trends', href: '/admin/reports/tasks' },
            { title: 'Habit Streak Summaries', href: '/admin/reports/habits' },
            { title: 'Audit Logs', href: '/admin/audit' },
        ],
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Help',
        href: '/help',
        icon: HelpCircle,
    },
];

const activeItemStyles = 'text-[#2B5398] bg-[#2B5398]/20 dark:bg-[#2B5398]/30 dark:text-[#5b82c7]';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();

    // Determine which navigation items to show based on user role
    const isAdmin = auth.user.roles?.some((role) => role.name === 'admin') || false;
    const mainNavItems = isAdmin ? adminNavItems : userNavItems;

    // Helper function to check if current URL matches nav item
    const isActiveNavItem = (item: NavItem): boolean => {
        if (page.url === item.href) return true;
        if (item.children) {
            return item.children.some((child) => page.url === child.href);
        }
        return false;
    };

    return (
        <>
            {/* Top Header Row */}
            <div className="text-white" style={{ backgroundColor: '#2B5398' }}>
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    {/* Left side - Logo and Title */}
                    <div className="flex items-center space-x-3">
                        <AppLogoIcon className="h-8 w-8 fill-current text-white" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">PERSONAL TASK & HABIT TRACKER</span>
                            <span className="text-xs opacity-80">Stay organized, build habits</span>
                        </div>
                    </div>

                    {/* Right side - User actions */}
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-[#1e4080]">
                            Log in
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1 text-white hover:bg-[#1e4080]">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg text-white" style={{ backgroundColor: '#2B5398' }}>
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Navigation Row */}
            <div className="sticky top-0 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto px-4 md:max-w-7xl">
                    {/* Mobile Menu for small screens */}
                    <div className="flex h-12 items-center lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <div className="flex flex-col space-y-2">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                        <div className="text-xs font-medium text-muted-foreground">Personal Task & Habit Tracker</div>
                                    </div>
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-2">
                                            {mainNavItems.map((item) => (
                                                <div key={item.title} className="flex flex-col space-y-1">
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            'flex items-center space-x-2 rounded-md p-2 font-medium transition-colors',
                                                            isActiveNavItem(item)
                                                                ? activeItemStyles
                                                                : 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                                                        )}
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                        {item.children && <ChevronDown className="ml-auto h-4 w-4" />}
                                                    </Link>
                                                    {item.children && (
                                                        <div className="ml-6 flex flex-col space-y-1">
                                                            {item.children.map((child) => (
                                                                <Link
                                                                    key={child.title}
                                                                    href={child.href}
                                                                    className={cn(
                                                                        'rounded px-2 py-1 text-sm transition-colors',
                                                                        page.url === child.href
                                                                            ? activeItemStyles
                                                                            : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800',
                                                                    )}
                                                                >
                                                                    {child.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="ml-4 flex items-center space-x-4">
                            <Search className="h-4 w-4 text-gray-500" />
                            <HelpCircle className="h-4 w-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="sticky-top z-50 hidden lg:flex lg:h-8 lg:items-center lg:space-x-6">
                        {mainNavItems.map((item, index) => (
                            <div key={index} className="relative flex h-full items-center">
                                {item.children ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    'flex h-full items-center space-x-1 rounded-none border-b-2 border-transparent px-3 text-sm font-medium hover:border-[#1e3a70] hover:text-[#1e3a70]',
                                                    isActiveNavItem(item) && 'border-[#1e3a70] text-[#1e3a70]',
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-1 h-4 w-4" />}
                                                {item.title}
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-48" align="start">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.title}
                                                    href={child.href}
                                                    className={cn(
                                                        'flex items-center rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                                                        page.url === child.href && 'bg-accent text-accent-foreground',
                                                    )}
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex h-full items-center border-b-2 border-transparent px-3 text-sm font-medium transition-colors hover:border-[#1e3a70] hover:text-[#1e3a70]',
                                            isActiveNavItem(item) && 'border-[#1e3a70] text-[#1e3a70]',
                                        )}
                                    >
                                        {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Right side icons - FIXED */}
                        <div className="ml-auto flex items-center space-x-2">
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Search</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {rightNavItems.map((item) => (
                                <TooltipProvider key={item.title} delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.href}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="h-4 w-4" />}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.title}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <div className="mx-auto flex h-10 w-full items-center justify-start px-4 text-gray-600 md:max-w-7xl dark:text-gray-400">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
