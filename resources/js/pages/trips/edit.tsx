import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/trips';
import { dashboard } from '@/routes';

type Trip = {
    id: number; trip_number: string; vehicle_id: number; driver_id: number | null;
    start_location: string; destination: string; purpose: string; client_department: string | null;
    start_datetime: string; end_datetime: string | null; odometer_start: number; odometer_end: number | null;
    status: string; notes: string | null;
};
type Vehicle = { id: number; registration_number: string; brand: string; model: string };
type Driver = { id: number; name: string; employee_id: string };

export default function TripEdit({ trip, vehicles, drivers }: { trip: Trip; vehicles: Vehicle[]; drivers: Driver[] }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicle_id: trip.vehicle_id.toString(),
        driver_id: trip.driver_id?.toString() ?? '',
        start_location: trip.start_location,
        destination: trip.destination,
        purpose: trip.purpose,
        client_department: trip.client_department ?? '',
        start_datetime: trip.start_datetime?.slice(0, 16) ?? '',
        end_datetime: trip.end_datetime?.slice(0, 16) ?? '',
        odometer_start: trip.odometer_start.toString(),
        odometer_end: trip.odometer_end?.toString() ?? '',
        status: trip.status,
        notes: trip.notes ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/trips/${trip.id}`);
    }

    function Field({ label, id, required, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
        return (
            <div className="flex flex-col gap-1">
                <Label htmlFor={id}>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
                {children}
                {errors[id as keyof typeof errors] && <p className="text-xs text-red-500">{errors[id as keyof typeof errors]}</p>}
            </div>
        );
    }

    return (
        <>
            <Head title={`Edit ${trip.trip_number}`} />
            <div className="flex flex-col gap-6 p-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold">Edit Trip</h1>
                    <p className="text-muted-foreground">{trip.trip_number}</p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Trip Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Vehicle" id="vehicle_id" required>
                                <select id="vehicle_id" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.brand} {v.model}</option>)}
                                </select>
                            </Field>
                            <Field label="Driver" id="driver_id">
                                <select id="driver_id" value={data.driver_id} onChange={e => setData('driver_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">No driver</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.employee_id})</option>)}
                                </select>
                            </Field>
                            <Field label="Start Location" id="start_location" required>
                                <Input id="start_location" value={data.start_location} onChange={e => setData('start_location', e.target.value)} />
                            </Field>
                            <Field label="Destination" id="destination" required>
                                <Input id="destination" value={data.destination} onChange={e => setData('destination', e.target.value)} />
                            </Field>
                            <Field label="Purpose" id="purpose" required>
                                <Input id="purpose" value={data.purpose} onChange={e => setData('purpose', e.target.value)} />
                            </Field>
                            <Field label="Client / Department" id="client_department">
                                <Input id="client_department" value={data.client_department} onChange={e => setData('client_department', e.target.value)} />
                            </Field>
                            <Field label="Start Date & Time" id="start_datetime" required>
                                <Input id="start_datetime" type="datetime-local" value={data.start_datetime} onChange={e => setData('start_datetime', e.target.value)} />
                            </Field>
                            <Field label="End Date & Time" id="end_datetime">
                                <Input id="end_datetime" type="datetime-local" value={data.end_datetime} onChange={e => setData('end_datetime', e.target.value)} />
                            </Field>
                            <Field label="Odometer Start" id="odometer_start" required>
                                <Input id="odometer_start" type="number" value={data.odometer_start} onChange={e => setData('odometer_start', e.target.value)} />
                            </Field>
                            <Field label="Odometer End" id="odometer_end">
                                <Input id="odometer_end" type="number" value={data.odometer_end} onChange={e => setData('odometer_end', e.target.value)} />
                            </Field>
                            <Field label="Status" id="status" required>
                                <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="scheduled">Scheduled</option>
                                    <option value="running">Running</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update Trip'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TripEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Trips', href: routes.index().url },
        { title: 'Edit', href: '#' },
    ],
};
