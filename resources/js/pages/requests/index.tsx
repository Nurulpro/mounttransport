import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/requests';
import { dashboard } from '@/routes';
import { useState } from 'react';

type VehicleRequest = {
    id: number; request_number: string; employee_name: string; department: string;
    destination: string; start_datetime: string; end_datetime: string;
    passenger_count: number; status: string;
    vehicle: { registration_number: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    assigned: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
};

export default function RequestsIndex({ requests, filters }: { requests: { data: VehicleRequest[]; total: number }; filters: Record<string, string> }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleDelete(id: number) {
        if (confirm('Delete this request?')) router.delete(`/requests/${id}`);
    }

    return (
        <>
            <Head title="Vehicle Requests" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList className="h-6 w-6" /> Vehicle Requests</h1>
                        <p className="text-muted-foreground">Manage vehicle booking requests — {requests.total} total</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> New Request</Link></Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <form onSubmit={e => { e.preventDefault(); router.get(routes.index().url, { ...filters, search }, { preserveState: true }); }} className="flex gap-2">
                                <Input placeholder="Employee, request no..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
                                <Button type="submit" variant="secondary" size="icon"><Search className="h-4 w-4" /></Button>
                            </form>
                            <select value={filters.status ?? ''} onChange={e => router.get(routes.index().url, { ...filters, status: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="assigned">Assigned</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request #</TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>Pax</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No requests found.</TableCell></TableRow>
                                ) : (
                                    requests.data.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-medium">{r.request_number}</TableCell>
                                            <TableCell>{r.employee_name}</TableCell>
                                            <TableCell>{r.department}</TableCell>
                                            <TableCell>{r.destination}</TableCell>
                                            <TableCell>{new Date(r.start_datetime).toLocaleDateString()}</TableCell>
                                            <TableCell>{r.passenger_count}</TableCell>
                                            <TableCell>{r.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[r.status] ?? ''}`}>
                                                    {r.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/requests/${r.id}`}><Eye className="h-4 w-4" /></Link></Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
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

RequestsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Requests', href: routes.index().url }],
};
