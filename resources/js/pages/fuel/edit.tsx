import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/fuel';
import { dashboard } from '@/routes';

type FuelRecord = {
    id: number; vehicle_id: number; driver_id: number | null; date: string; fuel_type: string;
    fuel_station: string | null; quantity: number; price_per_liter: number; total_cost: number;
    odometer_reading: number; notes: string | null;
};
type Vehicle = { id: number; registration_number: string };
type Driver = { id: number; name: string };

export default function FuelEdit({ record, vehicles, drivers }: { record: FuelRecord; vehicles: Vehicle[]; drivers: Driver[] }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicle_id: record.vehicle_id.toString(),
        driver_id: record.driver_id?.toString() ?? '',
        date: record.date,
        fuel_type: record.fuel_type,
        fuel_station: record.fuel_station ?? '',
        quantity: record.quantity.toString(),
        price_per_liter: record.price_per_liter.toString(),
        odometer_reading: record.odometer_reading.toString(),
        notes: record.notes ?? '',
    });

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
            <Head title="Edit Fuel Record" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <h1 className="text-2xl font-bold">Edit Fuel Record</h1>
                <form onSubmit={e => { e.preventDefault(); put(`/fuel/${record.id}`); }} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Fuel Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Vehicle" id="vehicle_id" required>
                                <select id="vehicle_id" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                                </select>
                            </Field>
                            <Field label="Driver" id="driver_id">
                                <select id="driver_id" value={data.driver_id} onChange={e => setData('driver_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">No driver</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Date" id="date" required>
                                <Input id="date" type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                            </Field>
                            <Field label="Fuel Type" id="fuel_type" required>
                                <select id="fuel_type" value={data.fuel_type} onChange={e => setData('fuel_type', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="cng">CNG</option>
                                    <option value="electric">Electric</option>
                                </select>
                            </Field>
                            <Field label="Station" id="fuel_station">
                                <Input id="fuel_station" value={data.fuel_station} onChange={e => setData('fuel_station', e.target.value)} />
                            </Field>
                            <Field label="Odometer" id="odometer_reading" required>
                                <Input id="odometer_reading" type="number" value={data.odometer_reading} onChange={e => setData('odometer_reading', e.target.value)} />
                            </Field>
                            <Field label="Quantity (L)" id="quantity" required>
                                <Input id="quantity" type="number" step="0.01" value={data.quantity} onChange={e => setData('quantity', e.target.value)} />
                            </Field>
                            <Field label="Price/L (BDT)" id="price_per_liter" required>
                                <Input id="price_per_liter" type="number" step="0.01" value={data.price_per_liter} onChange={e => setData('price_per_liter', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update Record'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

FuelEdit.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Fuel', href: routes.index().url }, { title: 'Edit', href: '#' }],
};
