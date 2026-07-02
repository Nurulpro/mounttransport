import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as routes from '@/routes/vehicles';
import { dashboard } from '@/routes';

type Vehicle = {
    id: number;
    registration_number: string;
    vehicle_type: string;
    brand: string;
    model: string;
    manufacturing_year: number;
    chassis_number: string | null;
    engine_number: string | null;
    fuel_type: string;
    seating_capacity: number;
    load_capacity: number | null;
    color: string | null;
    insurance_company: string | null;
    insurance_expiry: string | null;
    fitness_certificate_expiry: string | null;
    tax_token_expiry: string | null;
    route_permit_expiry: string | null;
    current_odometer: number;
    status: string;
    purchase_date: string | null;
    purchase_price: number | null;
    notes: string | null;
    trips: { id: number; trip_number: string; start_location: string; destination: string; status: string; start_datetime: string }[];
    fuel_records: { id: number; date: string; quantity: number; total_cost: number; fuel_type: string }[];
    maintenances: { id: number; maintenance_type: string; service_date: string; cost: number; status: string }[];
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    in_service: 'bg-blue-100 text-blue-800',
    under_maintenance: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-gray-100 text-gray-800',
    inactive: 'bg-red-100 text-red-800',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 border-b pb-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || '—'}</span>
        </div>
    );
}

export default function VehicleShow({ vehicle }: { vehicle: Vehicle }) {
    return (
        <>
            <Head title={vehicle.registration_number} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{vehicle.registration_number}</h1>
                        <p className="text-muted-foreground">{vehicle.brand} {vehicle.model} • {vehicle.manufacturing_year}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/vehicles/${vehicle.id}/edit`}>Edit Vehicle</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={routes.index().url}>Back</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Vehicle Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="Registration" value={vehicle.registration_number} />
                            <DetailRow label="Status" value={
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[vehicle.status]}`}>
                                    {vehicle.status.replace(/_/g, ' ')}
                                </span>
                            } />
                            <DetailRow label="Type" value={<span className="capitalize">{vehicle.vehicle_type}</span>} />
                            <DetailRow label="Fuel Type" value={<span className="capitalize">{vehicle.fuel_type}</span>} />
                            <DetailRow label="Color" value={vehicle.color} />
                            <DetailRow label="Seating Capacity" value={`${vehicle.seating_capacity} seats`} />
                            <DetailRow label="Chassis Number" value={vehicle.chassis_number} />
                            <DetailRow label="Engine Number" value={vehicle.engine_number} />
                            <DetailRow label="Current Odometer" value={`${vehicle.current_odometer.toLocaleString()} km`} />
                            <DetailRow label="Load Capacity" value={vehicle.load_capacity ? `${vehicle.load_capacity} tons` : null} />
                            {vehicle.purchase_date && <DetailRow label="Purchase Date" value={vehicle.purchase_date} />}
                            {vehicle.purchase_price && <DetailRow label="Purchase Price" value={`BDT ${vehicle.purchase_price.toLocaleString()}`} />}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Document Expiry</CardTitle></CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <DetailRow label="Insurance Company" value={vehicle.insurance_company} />
                            <DetailRow label="Insurance Expiry" value={vehicle.insurance_expiry} />
                            <DetailRow label="Fitness Certificate" value={vehicle.fitness_certificate_expiry} />
                            <DetailRow label="Tax Token" value={vehicle.tax_token_expiry} />
                            <DetailRow label="Route Permit" value={vehicle.route_permit_expiry} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card>
                        <CardHeader><CardTitle>Recent Trips</CardTitle></CardHeader>
                        <CardContent>
                            {vehicle.trips?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No trips yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {vehicle.trips?.map(t => (
                                        <div key={t.id} className="text-sm border rounded p-2">
                                            <p className="font-medium">{t.trip_number}</p>
                                            <p className="text-muted-foreground text-xs">{t.start_location} → {t.destination}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Fuel Records</CardTitle></CardHeader>
                        <CardContent>
                            {vehicle.fuel_records?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No fuel records yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {vehicle.fuel_records?.map(f => (
                                        <div key={f.id} className="text-sm border rounded p-2">
                                            <p className="font-medium">{f.date} — {f.quantity}L</p>
                                            <p className="text-muted-foreground text-xs">BDT {f.total_cost.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Maintenance</CardTitle></CardHeader>
                        <CardContent>
                            {vehicle.maintenances?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No maintenance records yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {vehicle.maintenances?.map(m => (
                                        <div key={m.id} className="text-sm border rounded p-2">
                                            <p className="font-medium capitalize">{m.maintenance_type.replace(/_/g, ' ')}</p>
                                            <p className="text-muted-foreground text-xs">{m.service_date} • BDT {m.cost.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

VehicleShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Vehicles', href: routes.index().url },
        { title: 'Details', href: '#' },
    ],
};
