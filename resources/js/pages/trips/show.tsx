import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as routes from '@/routes/trips';
import { dashboard } from '@/routes';

type Trip = {
    id: number; trip_number: string; start_location: string; destination: string;
    purpose: string; client_department: string | null; status: string;
    start_datetime: string; end_datetime: string | null;
    odometer_start: number; odometer_end: number | null; distance: number | null;
    notes: string | null;
    vehicle: { registration_number: string; brand: string; model: string } | null;
    driver: { name: string; phone: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    running: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 border-b pb-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || '—'}</span>
        </div>
    );
}

export default function TripShow({ trip }: { trip: Trip }) {
    return (
        <>
            <Head title={trip.trip_number} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{trip.trip_number}</h1>
                        <p className="text-muted-foreground">{trip.start_location} → {trip.destination}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild><Link href={`/trips/${trip.id}/edit`}>Edit</Link></Button>
                        <Button variant="outline" asChild><Link href={routes.index().url}>Back</Link></Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Trip Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="Status" value={
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[trip.status]}`}>
                                    {trip.status}
                                </span>
                            } />
                            <DetailRow label="Purpose" value={trip.purpose} />
                            <DetailRow label="Client / Dept" value={trip.client_department} />
                            <DetailRow label="Start" value={new Date(trip.start_datetime).toLocaleString()} />
                            <DetailRow label="End" value={trip.end_datetime ? new Date(trip.end_datetime).toLocaleString() : null} />
                            <DetailRow label="Odometer Start" value={`${trip.odometer_start.toLocaleString()} km`} />
                            <DetailRow label="Odometer End" value={trip.odometer_end ? `${trip.odometer_end.toLocaleString()} km` : null} />
                            <DetailRow label="Distance" value={trip.distance ? `${trip.distance} km` : null} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Vehicle & Driver</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="Vehicle" value={trip.vehicle ? `${trip.vehicle.registration_number} (${trip.vehicle.brand} ${trip.vehicle.model})` : null} />
                            <DetailRow label="Driver" value={trip.driver?.name} />
                            <DetailRow label="Driver Phone" value={trip.driver?.phone} />
                        </CardContent>
                    </Card>
                </div>

                {trip.notes && (
                    <Card>
                        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{trip.notes}</p></CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

TripShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Trips', href: routes.index().url },
        { title: 'Details', href: '#' },
    ],
};
