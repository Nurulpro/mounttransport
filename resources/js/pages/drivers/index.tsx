import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Search, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/drivers';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Driver = {
    id: number;
    employee_id: string;
    name: string;
    phone: string;
    license_number: string;
    license_expiry: string;
    status: string;
    rating: number;
    assigned_vehicle: { registration_number: string } | null;
};

type PageProps = {
    drivers: {
        data: Driver[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters: { search?: string; status?: string };
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    on_leave: 'bg-yellow-100 text-yellow-800',
};

export default function DriversIndex({ drivers, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(routes.index().url, { ...filters, search }, { preserveState: true, replace: true });
    }

    function handleStatusFilter(value: string) {
        router.get(routes.index().url, { ...filters, status: value || undefined }, { preserveState: true, replace: true });
    }

    function handleDelete(id: number) {
        if (confirm('Delete this driver?')) {
            router.delete(`/drivers/${id}`);
        }
    }

    return (
        <>
            <Head title="Drivers" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="h-6 w-6" /> Driver Management</h1>
                        <p className="text-muted-foreground">Manage all drivers — {drivers.total} total</p>
                    </div>
                    <Button asChild>
                        <Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> Add Driver</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input placeholder="Name, ID, license..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
                                <Button type="submit" variant="secondary" size="icon"><Search className="h-4 w-4" /></Button>
                            </form>
                            <select value={filters.status ?? ''} onChange={e => handleStatusFilter(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="on_leave">On Leave</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>License</TableHead>
                                    <TableHead>License Expiry</TableHead>
                                    <TableHead>Assigned Vehicle</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center text-muted-foreground py-8">No drivers found.</TableCell>
                                    </TableRow>
                                ) : (
                                    drivers.data.map(d => (
                                        <TableRow key={d.id}>
                                            <TableCell className="font-medium">{d.employee_id}</TableCell>
                                            <TableCell>{d.name}</TableCell>
                                            <TableCell>{d.phone}</TableCell>
                                            <TableCell>{d.license_number}</TableCell>
                                            <TableCell>{d.license_expiry}</TableCell>
                                            <TableCell>{d.assigned_vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[d.status] ?? ''}`}>
                                                    {d.status.replace(/_/g, ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell>{'★'.repeat(d.rating)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/drivers/${d.id}`}><Eye className="h-4 w-4" /></Link></Button>
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/drivers/${d.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4" /></Button>
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

DriversIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Drivers', href: routes.index().url },
    ],
};
