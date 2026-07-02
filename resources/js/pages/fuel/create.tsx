import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/fuel';
import { dashboard } from '@/routes';

type Vehicle = { id: number; registration_number: string; brand: string; model: string; fuel_type: string };
type Driver = { id: number; name: string; employee_id: string };

export default function FuelCreate({ vehicles, drivers }: { vehicles: Vehicle[]; drivers: Driver[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '',
        driver_id: '',
        date: new Date().toISOString().split('T')[0],
        fuel_type: 'diesel',
        fuel_station: '',
        quantity: '',
        price_per_liter: '',
        odometer_reading: '',
        notes: '',
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

    const totalCost = data.quantity && data.price_per_liter
        ? (parseFloat(data.quantity) * parseFloat(data.price_per_liter)).toFixed(2)
        : '0.00';

    return (
        <>
            <Head title="Add Fuel Record" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold">Record Fuel Purchase</h1>
                    <p className="text-muted-foreground">Log a fuel refill for a vehicle</p>
                </div>
                <form onSubmit={e => { e.preventDefault(); post(routes.store().url); }} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Fuel Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Vehicle" id="vehicle_id" required>
                                <select id="vehicle_id" value={data.vehicle_id} onChange={e => {
                                    setData('vehicle_id', e.target.value);
                                    const v = vehicles.find(v => v.id.toString() === e.target.value);
                                    if (v) setData('fuel_type', v.fuel_type);
                                }} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select vehicle</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.brand} {v.model}</option>)}
                                </select>
                            </Field>
                            <Field label="Driver" id="driver_id">
                                <select id="driver_id" value={data.driver_id} onChange={e => setData('driver_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select driver (optional)</option>
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
                            <Field label="Fuel Station" id="fuel_station">
                                <Input id="fuel_station" value={data.fuel_station} onChange={e => setData('fuel_station', e.target.value)} placeholder="Station name" />
                            </Field>
                            <Field label="Odometer Reading (km)" id="odometer_reading" required>
                                <Input id="odometer_reading" type="number" min="0" value={data.odometer_reading} onChange={e => setData('odometer_reading', e.target.value)} />
                            </Field>
                            <Field label="Quantity (Liters)" id="quantity" required>
                                <Input id="quantity" type="number" step="0.01" min="0" value={data.quantity} onChange={e => setData('quantity', e.target.value)} />
                            </Field>
                            <Field label="Price per Liter (BDT)" id="price_per_liter" required>
                                <Input id="price_per_liter" type="number" step="0.01" min="0" value={data.price_per_liter} onChange={e => setData('price_per_liter', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Calculated Total Cost</span>
                                <span className="text-xl font-bold">BDT {totalCost}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Record'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

FuelCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Fuel', href: routes.index().url },
        { title: 'Add Record', href: routes.create().url },
    ],
};
