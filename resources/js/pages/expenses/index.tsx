import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/expenses';
import { dashboard } from '@/routes';

type Expense = {
    id: number; category: string; date: string; amount: number; description: string;
    department: string | null; approved_by: string | null;
    vehicle: { registration_number: string } | null;
    driver: { name: string } | null;
};
type Vehicle = { id: number; registration_number: string };

const CATEGORY_LABELS: Record<string, string> = {
    fuel: 'Fuel', toll: 'Toll', parking: 'Parking', repair: 'Repair',
    insurance: 'Insurance', tax: 'Tax', driver_allowance: 'Driver Allowance',
    spare_parts: 'Spare Parts', others: 'Others',
};

export default function ExpensesIndex({
    expenses, filters, vehicles, monthlyTotal, byCategory,
}: {
    expenses: { data: Expense[]; total: number; current_page: number; last_page: number; per_page: number };
    filters: Record<string, string>;
    vehicles: Vehicle[];
    monthlyTotal: number;
    byCategory: Record<string, number>;
}) {
    function handleDelete(id: number) {
        if (confirm('Delete this expense?')) router.delete(`/expenses/${id}`);
    }

    return (
        <>
            <Head title="Expenses" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Wallet className="h-6 w-6" /> Expense Management</h1>
                        <p className="text-muted-foreground">Track all transport expenses — {expenses.total} records</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> Add Expense</Link></Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm text-muted-foreground">This Month Total</p>
                            <p className="text-2xl font-bold">BDT {monthlyTotal.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                    {Object.entries(byCategory).slice(0, 4).map(([cat, total]) => (
                        <Card key={cat}>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[cat] ?? cat}</p>
                                <p className="text-xl font-bold">BDT {Number(total).toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <select value={filters.category ?? ''} onChange={e => router.get(routes.index().url, { ...filters, category: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Categories</option>
                                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <select value={filters.vehicle_id ?? ''} onChange={e => router.get(routes.index().url, { ...filters, vehicle_id: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Vehicles</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                            </select>
                            <Input type="date" value={filters.from ?? ''} onChange={e => router.get(routes.index().url, { ...filters, from: e.target.value || undefined }, { preserveState: true })} className="w-40" />
                            <Input type="date" value={filters.to ?? ''} onChange={e => router.get(routes.index().url, { ...filters, to: e.target.value || undefined }, { preserveState: true })} className="w-40" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Amount (BDT)</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No expenses found.</TableCell></TableRow>
                                ) : (
                                    expenses.data.map(e => (
                                        <TableRow key={e.id}>
                                            <TableCell>{e.date}</TableCell>
                                            <TableCell>{CATEGORY_LABELS[e.category] ?? e.category}</TableCell>
                                            <TableCell>{e.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>{e.driver?.name ?? '—'}</TableCell>
                                            <TableCell>{e.description}</TableCell>
                                            <TableCell>{e.department ?? '—'}</TableCell>
                                            <TableCell className="font-medium">{Number(e.amount).toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ExpensesIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Expenses', href: routes.index().url }],
};
