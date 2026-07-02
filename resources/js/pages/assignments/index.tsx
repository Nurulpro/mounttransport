import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Trash2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/assignments';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Assignment = {
    id: number; employee_name: string | null; department: string | null; project: string | null;
    assigned_by: string; assignment_date: string; return_date: string | null; purpose: string; status: string;
    vehicle: { registration_number: string } | null;
    driver: { name: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    returned: 'bg-gray-100 text-gray-800',
};

export default function AssignmentsIndex({ assignments, filters }: { assignments: { data: Assignment[]; total: number }; filters: Record<string, string> }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleDelete(id: number) {
        if (confirm('Remove this assignment?')) router.delete(`/assignments/${id}`);
    }

    return (
        <>
            <Head title="Vehicle Assignments" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Truck className="h-6 w-6" /> Vehicle Assignments</h1>
                        <p className="text-muted-foreground">Track vehicle assignments — {assignments.total} total</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> New Assignment</Link></Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <form onSubmit={e => { e.preventDefault(); router.get(routes.index().url, { ...filters, search }, { preserveState: true }); }} className="flex gap-2">
                                <Input placeholder="Employee, dept, project..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
                                <Button type="submit" variant="secondary" size="icon"><Search className="h-4 w-4" /></Button>
                            </form>
                            <select value={filters.status ?? ''} onChange={e => router.get(routes.index().url, { ...filters, status: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="returned">Returned</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Assigned By</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Return</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assignments.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No assignments found.</TableCell></TableRow>
                                ) : (
                                    assignments.data.map(a => (
                                        <TableRow key={a.id}>
                                            <TableCell className="font-medium">{a.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>{a.driver?.name ?? '—'}</TableCell>
                                            <TableCell>{a.employee_name ?? '—'}</TableCell>
                                            <TableCell>{a.department ?? '—'}</TableCell>
                                            <TableCell>{a.assigned_by}</TableCell>
                                            <TableCell>{a.assignment_date}</TableCell>
                                            <TableCell>{a.return_date ?? '—'}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[a.status] ?? ''}`}>
                                                    {a.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
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

AssignmentsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Assignments', href: routes.index().url }],
};
