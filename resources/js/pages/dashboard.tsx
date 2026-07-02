import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Car, CheckCircle, Clock, Fuel, MapPin, TrendingUp, Users, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type VehicleStats = {
    total: number;
    active: number;
    in_service: number;
    under_maintenance: number;
    inactive: number;
};

type DriverStats = {
    total: number;
    active: number;
    on_leave: number;
};

type TripStats = {
    active: number;
    completed_this_month: number;
};

type UpcomingMaintenance = {
    id: number;
    vehicle: string;
    type: string;
    due: string;
};

type ExpiryAlert = {
    vehicle: string;
    type: string;
    expiry: string;
};

type Props = {
    vehicleStats: VehicleStats;
    driverStats: DriverStats;
    tripStats: TripStats;
    fuelThisMonth: number;
    fuelQuantityThisMonth: number;
    monthlyExpense: number;
    upcomingMaintenance: UpcomingMaintenance[];
    expiryAlerts: ExpiryAlert[];
    pendingRequests: number;
    monthlyExpenseBreakdown: { category: string; total: number }[];
};

function StatCard({
    title,
    value,
    sub,
    icon: Icon,
    color,
}: {
    title: string;
    value: number | string;
    sub?: string;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-5">
                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(amount);
}

function daysUntil(dateStr: string) {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    if (diff < 0) return <span className="text-red-500 font-medium">Expired</span>;
    if (diff === 0) return <span className="text-red-500 font-medium">Today</span>;
    return <span className={diff <= 7 ? 'text-orange-500 font-medium' : 'text-muted-foreground'}>{diff}d left</span>;
}

export default function Dashboard({
    vehicleStats,
    driverStats,
    tripStats,
    fuelThisMonth,
    fuelQuantityThisMonth,
    monthlyExpense,
    upcomingMaintenance,
    expiryAlerts,
    pendingRequests,
    monthlyExpenseBreakdown,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Transport Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your fleet management system</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Vehicles" value={vehicleStats.total} icon={Car} color="bg-blue-500" sub={`${vehicleStats.active} active`} />
                    <StatCard title="Total Drivers" value={driverStats.total} icon={Users} color="bg-indigo-500" sub={`${driverStats.active} active`} />
                    <StatCard title="Active Trips" value={tripStats.active} icon={MapPin} color="bg-green-500" sub={`${tripStats.completed_this_month} completed this month`} />
                    <StatCard title="Pending Requests" value={pendingRequests} icon={Clock} color="bg-orange-500" sub="Vehicle requests" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Vehicles Available" value={vehicleStats.active} icon={CheckCircle} color="bg-emerald-500" />
                    <StatCard title="In Service" value={vehicleStats.in_service} icon={TrendingUp} color="bg-cyan-500" />
                    <StatCard title="Under Maintenance" value={vehicleStats.under_maintenance} icon={Wrench} color="bg-yellow-500" />
                    <StatCard title="Inactive / Sold" value={vehicleStats.inactive} icon={Car} color="bg-gray-400" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Fuel className="h-4 w-4 text-amber-500" />
                                Fuel This Month
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(fuelThisMonth)}</p>
                            <p className="text-sm text-muted-foreground">{fuelQuantityThisMonth.toFixed(1)} L consumed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                Monthly Transport Cost
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(monthlyExpense)}</p>
                            <p className="text-sm text-muted-foreground">All categories this month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                Expiry Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{expiryAlerts.length}</p>
                            <p className="text-sm text-muted-foreground">Documents expiring in 30 days</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wrench className="h-4 w-4" />
                                Upcoming Maintenance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {upcomingMaintenance.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming maintenance in next 30 days.</p>
                            ) : (
                                <div className="space-y-2">
                                    {upcomingMaintenance.map((m) => (
                                        <div key={m.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                                            <div>
                                                <p className="font-medium text-sm">{m.vehicle}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{m.type.replace(/_/g, ' ')}</p>
                                            </div>
                                            <div className="text-right text-xs">
                                                <p>{m.due}</p>
                                                {daysUntil(m.due)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                Expiry Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {expiryAlerts.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No expiry alerts in next 30 days.</p>
                            ) : (
                                <div className="space-y-2">
                                    {expiryAlerts.map((a, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2">
                                            <div>
                                                <p className="font-medium text-sm">{a.vehicle}</p>
                                                <p className="text-xs text-muted-foreground">{a.type}</p>
                                            </div>
                                            <div className="text-right text-xs">
                                                <p>{a.expiry}</p>
                                                {daysUntil(a.expiry)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {monthlyExpenseBreakdown.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Expense Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {monthlyExpenseBreakdown.map((item) => (
                                    <div key={item.category} className="flex items-center justify-between rounded-lg border px-3 py-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {item.category.replace(/_/g, ' ')}
                                        </Badge>
                                        <span className="font-medium text-sm">{formatCurrency(item.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }],
};
