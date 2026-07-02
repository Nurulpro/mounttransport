import { Head, Link, router } from '@inertiajs/react';
import { Edit, Fuel, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/fuel';
import { dashboard } from '@/routes';

type FuelRecord = {
    id: number; date: string; fuel_type: string; fuel_station: string | null;
    quantity: number; price_per_liter: number; total_cost: number; odometer_reading: number; mileage: number | null;
    vehicle: { registration_number: string } | null;
    driver: { name: string } | null;
};

type Summary = { total_cost: number; total_quantity: number; avg_mileage: number | null };
type Vehicle = { id: number; registration_number: string };

export default function FuelIndex({
    records, filters, vehicles, summary,
}: {
    records: { data: FuelRecord[]; total: number; current_page: number; last_page: number; per_page: number };
    filters: Record<string, string>;
    vehicles: Vehicle[];
    summary: Summary;
}) {
    function handleDelete(id: number) {
        if (confirm('Delete this fuel record?')) router.delete(`/fuel/${id}`);
    }

    return (
        <>
            <Head title="Fuel Management" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><Fuel className="h-6 w-6" /> Fuel Management</h1>
                        <p className="text-muted-foreground">Track fuel purchases and consumption</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> Add Record</Link></Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: 'Total Cost', value: `BDT ${Number(summary.total_cost).toLocaleString()}` },
                        { label: 'Total Quantity', value: `${Number(summary.total_quantity).toFixed(1)} L` },
                        { label: 'Avg Mileage', value: summary.avg_mileage ? `${Number(summary.avg_mileage).toFixed(2)} km/L` : '—' },
                    ].map(s => (
                        <Card key={s.label}>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="text-xl font-bold">{s.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <select value={filters.vehicle_id ?? ''} onChange={e => router.get(routes.index().url, { ...filters, vehicle_id: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Vehicles</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                            </select>
                            <Input type="date" value={filters.from ?? ''} onChange={e => router.get(routes.index().url, { ...filters, from: e.target.value || undefined }, { preserveState: true })} className="w-40" placeholder="From" />
                            <Input type="date" value={filters.to ?? ''} onChange={e => router.get(routes.index().url, { ...filters, to: e.target.value || undefined }, { preserveState: true })} className="w-40" placeholder="To" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Fuel Type</TableHead>
                                    <TableHead>Station</TableHead>
                                    <TableHead>Qty (L)</TableHead>
                                    <TableHead>Price/L</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Odometer</TableHead>
                                    <TableHead>Mileage</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={11} className="text-center text-muted-foreground py-8">No fuel records found.</TableCell></TableRow>
                                ) : (
                                    records.data.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.date}</TableCell>
                                            <TableCell className="font-medium">{r.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>{r.driver?.name ?? '—'}</TableCell>
                                            <TableCell className="capitalize">{r.fuel_type}</TableCell>
                                            <TableCell>{r.fuel_station ?? '—'}</TableCell>
                                            <TableCell>{Number(r.quantity).toFixed(2)}</TableCell>
                                            <TableCell>{Number(r.price_per_liter).toFixed(2)}</TableCell>
                                            <TableCell className="font-medium">BDT {Number(r.total_cost).toLocaleString()}</TableCell>
                                            <TableCell>{r.odometer_reading.toLocaleString()}</TableCell>
                                            <TableCell>{r.mileage ? `${Number(r.mileage).toFixed(2)} km/L` : '—'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild><Link href={`/fuel/${r.id}/edit`}><Edit className="h-4 w-4" /></Link></Button>
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

FuelIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Fuel', href: routes.index().url }],
};
