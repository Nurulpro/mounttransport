import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as routes from '@/routes/drivers';
import { dashboard } from '@/routes';

type Driver = {
    id: number; employee_id: string; name: string; phone: string; email: string | null;
    address: string | null; emergency_contact_name: string | null; emergency_contact_phone: string | null;
    license_number: string; license_type: string | null; license_expiry: string;
    nid_number: string | null; joining_date: string; salary: number | null;
    medical_certificate_expiry: string | null; rating: number; status: string; notes: string | null;
    assigned_vehicle: { registration_number: string; brand: string; model: string } | null;
    trips: { id: number; trip_number: string; start_location: string; destination: string; status: string }[];
    fuel_records: { id: number; date: string; quantity: number; total_cost: number }[];
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    on_leave: 'bg-yellow-100 text-yellow-800',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 border-b pb-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || '—'}</span>
        </div>
    );
}

export default function DriverShow({ driver }: { driver: Driver }) {
    return (
        <>
            <Head title={driver.name} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{driver.name}</h1>
                        <p className="text-muted-foreground">{driver.employee_id} • {'★'.repeat(driver.rating)}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild><Link href={`/drivers/${driver.id}/edit`}>Edit</Link></Button>
                        <Button variant="outline" asChild><Link href={routes.index().url}>Back</Link></Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="Status" value={
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[driver.status]}`}>
                                    {driver.status.replace(/_/g, ' ')}
                                </span>
                            } />
                            <DetailRow label="Phone" value={driver.phone} />
                            <DetailRow label="Email" value={driver.email} />
                            <DetailRow label="NID" value={driver.nid_number} />
                            <DetailRow label="Address" value={driver.address} />
                            <DetailRow label="Emergency Contact" value={driver.emergency_contact_name} />
                            <DetailRow label="Emergency Phone" value={driver.emergency_contact_phone} />
                            <DetailRow label="Joining Date" value={driver.joining_date} />
                            <DetailRow label="Salary" value={driver.salary ? `BDT ${driver.salary.toLocaleString()}` : null} />
                            <DetailRow label="Assigned Vehicle" value={driver.assigned_vehicle ? `${driver.assigned_vehicle.registration_number} (${driver.assigned_vehicle.brand} ${driver.assigned_vehicle.model})` : null} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>License & Documents</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="License Number" value={driver.license_number} />
                            <DetailRow label="License Type" value={driver.license_type} />
                            <DetailRow label="License Expiry" value={driver.license_expiry} />
                            <DetailRow label="Medical Certificate" value={driver.medical_certificate_expiry} />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Recent Trips</CardTitle></CardHeader>
                        <CardContent>
                            {driver.trips?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No trips yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {driver.trips?.map(t => (
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
                        <CardHeader><CardTitle>Fuel Records</CardTitle></CardHeader>
                        <CardContent>
                            {driver.fuel_records?.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No fuel records yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {driver.fuel_records?.map(f => (
                                        <div key={f.id} className="text-sm border rounded p-2">
                                            <p className="font-medium">{f.date} — {f.quantity}L</p>
                                            <p className="text-muted-foreground text-xs">BDT {f.total_cost.toLocaleString()}</p>
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

DriverShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Drivers', href: routes.index().url },
        { title: 'Details', href: '#' },
    ],
};
