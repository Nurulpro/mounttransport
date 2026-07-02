import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/trips';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Trip = {
    id: number; trip_number: string; start_location: string; destination: string;
    purpose: string; status: string; start_datetime: string; distance: number | null;
    vehicle: { registration_number: string } | null;
    driver: { name: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    running: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function TripsIndex({ trips, filters }: { trips: { data: Trip[]; current_page: number; last_page: number; total: number; per_page: number }; filters: Record<string, string> }) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(routes.index().url, { ...filters, search }, { preserveState: true, replace: true });
    }

    function handleDelete(id: number) {
        if (confirm('Delete this trip?')) router.delete(`/trips/${id}`);
    }

    return (
        <>
            <Head title="Trips" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6" /> Trip Management</h1>
                        <p className="text-muted-foreground">{trips.total} total trips</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> New Trip</Link></Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input placeholder="Trip no, location..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
                                <Button type="submit" variant="secondary" size="icon"><Search className="h-4 w-4" /></Button>
                            </form>
                            <select value={filters.status ?? ''} onChange={e => router.get(routes.index().url, { ...filters, status: e.target.value || undefined }, { preserveState: true, replace: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="running">Running</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Trip #</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>Distance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trips.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No trips found.</TableCell></TableRow>
                                ) : (
                                    trips.data.map(t => (
                                        <TableRow key={t.id}>
                                            <TableCell className="font-medium">{t.trip_number}</TableCell>
                                            <TableCell>{t.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>{t.driver?.name ?? '—'}</TableCell>
                                            <TableCell>{t.start_location}</TableCell>
                                            <TableCell>{t.destination}</TableCell>
                                            <TableCell>{new Date(t.start_datetime).toLocaleDateString()}</TableCell>
                                            <TableCell>{t.distance ? `${t.distance} km` : '—'}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[t.status] ?? ''}`}>
                                                    {t.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/trips/${t.id}`}><Eye className="h-4 w-4" /></Link></Button>
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/trips/${t.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4" /></Button>
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

TripsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Trips', href: routes.index().url }],
};
