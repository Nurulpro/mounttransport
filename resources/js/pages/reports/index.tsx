import { Head, router } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/reports';
import { dashboard } from '@/routes';

type MonthlyFuel = { month: string; cost: number; quantity: number };
type MonthlyExpense = { month: string; total: number };
type VehicleExpense = { vehicle: string; total: number };
type DeptExpense = { department: string; total: number };
type CategoryExpense = { category: string; total: number };

type Props = {
    monthlyFuel: MonthlyFuel[];
    monthlyExpense: MonthlyExpense[];
    vehicleExpense: VehicleExpense[];
    departmentExpense: DeptExpense[];
    categoryExpense: CategoryExpense[];
    tripSummary: { total: number; completed: number; total_distance: number };
    year: number;
    month: number;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CATEGORY_LABELS: Record<string, string> = {
    fuel: 'Fuel', toll: 'Toll', parking: 'Parking', repair: 'Repair',
    insurance: 'Insurance', tax: 'Tax', driver_allowance: 'Driver Allowance',
    spare_parts: 'Spare Parts', others: 'Others',
};

export default function ReportsIndex({
    monthlyFuel, monthlyExpense, vehicleExpense, departmentExpense, categoryExpense, tripSummary, year, month,
}: Props) {
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <>
            <Head title="Reports" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6" /> Reports</h1>
                        <p className="text-muted-foreground">Transport analytics and reports</p>
                    </div>
                    <div className="flex gap-3">
                        <select value={year} onChange={e => router.get(routes.index().url, { year: e.target.value, month }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select value={month} onChange={e => router.get(routes.index().url, { year, month: e.target.value }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                            {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Total Trips ({MONTHS[month - 1]} {year})</p>
                            <p className="text-2xl font-bold">{tripSummary.total}</p>
                            <p className="text-xs text-muted-foreground">{tripSummary.completed} completed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Total Distance</p>
                            <p className="text-2xl font-bold">{Number(tripSummary.total_distance).toLocaleString()} km</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                            <p className="text-2xl font-bold">
                                BDT {Number(monthlyExpense.find(e => e.month === `${year}-${String(month).padStart(2, '0')}`)?.total ?? 0).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Monthly Fuel Cost ({year})</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Quantity (L)</TableHead>
                                        <TableHead>Cost (BDT)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {monthlyFuel.length === 0 ? (
                                        <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">No data</TableCell></TableRow>
                                    ) : (
                                        monthlyFuel.map(f => (
                                            <TableRow key={f.month}>
                                                <TableCell>{f.month}</TableCell>
                                                <TableCell>{Number(f.quantity).toFixed(1)}</TableCell>
                                                <TableCell>{Number(f.cost).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Monthly Expenses ({year})</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Total (BDT)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {monthlyExpense.length === 0 ? (
                                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">No data</TableCell></TableRow>
                                    ) : (
                                        monthlyExpense.map(e => (
                                            <TableRow key={e.month}>
                                                <TableCell>{e.month}</TableCell>
                                                <TableCell>{Number(e.total).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader><CardTitle>Vehicle Expenses ({MONTHS[month - 1]} {year})</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Total (BDT)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicleExpense.length === 0 ? (
                                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">No data</TableCell></TableRow>
                                    ) : (
                                        vehicleExpense.map((e, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{e.vehicle}</TableCell>
                                                <TableCell>{Number(e.total).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Department Expenses</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Total (BDT)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {departmentExpense.length === 0 ? (
                                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">No data</TableCell></TableRow>
                                    ) : (
                                        departmentExpense.map((e, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{e.department}</TableCell>
                                                <TableCell>{Number(e.total).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Category Breakdown</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Total (BDT)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categoryExpense.length === 0 ? (
                                        <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-4">No data</TableCell></TableRow>
                                    ) : (
                                        categoryExpense.map((e, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{CATEGORY_LABELS[e.category] ?? e.category}</TableCell>
                                                <TableCell>{Number(e.total).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Reports', href: routes.index().url }],
};
