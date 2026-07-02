import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Car,
    ClipboardList,
    FileText,
    Fuel,
    LayoutGrid,
    MapPin,
    Settings,
    Truck,
    Users,
    Wallet,
    Wrench,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import * as vehicleRoutes from '@/routes/vehicles';
import * as driverRoutes from '@/routes/drivers';
import * as tripRoutes from '@/routes/trips';
import * as assignmentRoutes from '@/routes/assignments';
import * as fuelRoutes from '@/routes/fuel';
import * as maintenanceRoutes from '@/routes/maintenance';
import * as expenseRoutes from '@/routes/expenses';
import * as documentRoutes from '@/routes/documents';
import * as requestRoutes from '@/routes/requests';
import * as reportRoutes from '@/routes/reports';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Vehicles',
        href: vehicleRoutes.index().url,
        icon: Car,
    },
    {
        title: 'Drivers',
        href: driverRoutes.index().url,
        icon: Users,
    },
    {
        title: 'Trips',
        href: tripRoutes.index().url,
        icon: MapPin,
    },
    {
        title: 'Assignments',
        href: assignmentRoutes.index().url,
        icon: Truck,
    },
    {
        title: 'Fuel',
        href: fuelRoutes.index().url,
        icon: Fuel,
    },
    {
        title: 'Maintenance',
        href: maintenanceRoutes.index().url,
        icon: Wrench,
    },
    {
        title: 'Expenses',
        href: expenseRoutes.index().url,
        icon: Wallet,
    },
    {
        title: 'Documents',
        href: documentRoutes.index().url,
        icon: FileText,
    },
    {
        title: 'Requests',
        href: requestRoutes.index().url,
        icon: ClipboardList,
    },
    {
        title: 'Reports',
        href: reportRoutes.index().url,
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
