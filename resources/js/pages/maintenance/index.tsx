import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/maintenance';
import { dashboard } from '@/routes';

type Maintenance = {
    id: number; maintenance_type: string; service_date: string; garage: string | null;
    vendor: string | null; cost: number; next_service_due: string | null; status: string;
    vehicle: { registration_number: string } | null;
};
type Vehicle = { id: number; registration_number: string };

const STATUS_COLORS: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
};

const TYPE_LABELS: Record<string, string> = {
    oil_change: 'Oil Change', engine_service: 'Engine Service', tire_replacement: 'Tire Replacement',
    brake_service: 'Brake Service', battery: 'Battery', ac_service: 'AC Service', general_repair: 'General Repair',
};

export default function MaintenanceIndex({
    maintenances, filters, vehicles,
}: {
    maintenances: { data: Maintenance[]; total: number; current_page: number; last_page: number; per_page: number };
    filters: Record<string, string>;
    vehicles: Vehicle[];
}) {
    function handleDelete(id: number) {
        if (confirm('Delete this maintenance record?')) router.delete(`/maintenance/${id}`);
    }

    return (
        <>
            <Head title="Maintenance" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Wrench className="h-6 w-6" /> Maintenance Management</h1>
                        <p className="text-muted-foreground">{maintenances.total} maintenance records</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> Schedule Maintenance</Link></Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <select value={filters.vehicle_id ?? ''} onChange={e => router.get(routes.index().url, { ...filters, vehicle_id: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Vehicles</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                            </select>
                            <select value={filters.status ?? ''} onChange={e => router.get(routes.index().url, { ...filters, status: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Status</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                            <select value={filters.type ?? ''} onChange={e => router.get(routes.index().url, { ...filters, type: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Types</option>
                                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Service Date</TableHead>
                                    <TableHead>Garage</TableHead>
                                    <TableHead>Cost (BDT)</TableHead>
                                    <TableHead>Next Due</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {maintenances.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No maintenance records found.</TableCell></TableRow>
                                ) : (
                                    maintenances.data.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">{m.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>{TYPE_LABELS[m.maintenance_type] ?? m.maintenance_type}</TableCell>
                                            <TableCell>{m.service_date}</TableCell>
                                            <TableCell>{m.garage ?? '—'}</TableCell>
                                            <TableCell>{Number(m.cost).toLocaleString()}</TableCell>
                                            <TableCell>{m.next_service_due ?? '—'}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[m.status] ?? ''}`}>
                                                    {m.status.replace(/_/g, ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/maintenance/${m.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4" /></Button>
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

MaintenanceIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Maintenance', href: routes.index().url }],
};
