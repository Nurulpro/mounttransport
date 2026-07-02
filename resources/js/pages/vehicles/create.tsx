import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/vehicles';
import { dashboard } from '@/routes';

type FormData = {
    registration_number: string;
    vehicle_type: string;
    brand: string;
    model: string;
    manufacturing_year: string;
    chassis_number: string;
    engine_number: string;
    fuel_type: string;
    seating_capacity: string;
    load_capacity: string;
    purchase_date: string;
    purchase_price: string;
    color: string;
    insurance_company: string;
    insurance_policy_number: string;
    insurance_expiry: string;
    fitness_certificate_expiry: string;
    tax_token_expiry: string;
    route_permit_expiry: string;
    current_odometer: string;
    status: string;
    notes: string;
};

export default function VehicleCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        registration_number: '',
        vehicle_type: 'car',
        brand: '',
        model: '',
        manufacturing_year: new Date().getFullYear().toString(),
        chassis_number: '',
        engine_number: '',
        fuel_type: 'diesel',
        seating_capacity: '5',
        load_capacity: '',
        purchase_date: '',
        purchase_price: '',
        color: '',
        insurance_company: '',
        insurance_policy_number: '',
        insurance_expiry: '',
        fitness_certificate_expiry: '',
        tax_token_expiry: '',
        route_permit_expiry: '',
        current_odometer: '0',
        status: 'active',
        notes: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(routes.store().url);
    }

    function Field({ label, id, required, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
        return (
            <div className="flex flex-col gap-1">
                <Label htmlFor={id}>
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
                {children}
                {errors[id as keyof typeof errors] && (
                    <p className="text-xs text-red-500">{errors[id as keyof typeof errors]}</p>
                )}
            </div>
        );
    }

    return (
        <>
            <Head title="Add Vehicle" />
            <div className="flex flex-col gap-6 p-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold">Register New Vehicle</h1>
                    <p className="text-muted-foreground">Add a new vehicle to the fleet</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Registration Number" id="registration_number" required>
                                <Input id="registration_number" value={data.registration_number} onChange={e => setData('registration_number', e.target.value)} placeholder="e.g. Dhaka Metro-A 11-1234" />
                            </Field>
                            <Field label="Vehicle Type" id="vehicle_type" required>
                                <select id="vehicle_type" value={data.vehicle_type} onChange={e => setData('vehicle_type', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="car">Car</option>
                                    <option value="bus">Bus</option>
                                    <option value="truck">Truck</option>
                                    <option value="pickup">Pickup</option>
                                    <option value="motorcycle">Motorcycle</option>
                                </select>
                            </Field>
                            <Field label="Brand" id="brand" required>
                                <Input id="brand" value={data.brand} onChange={e => setData('brand', e.target.value)} placeholder="e.g. Toyota" />
                            </Field>
                            <Field label="Model" id="model" required>
                                <Input id="model" value={data.model} onChange={e => setData('model', e.target.value)} placeholder="e.g. Hiace" />
                            </Field>
                            <Field label="Manufacturing Year" id="manufacturing_year" required>
                                <Input id="manufacturing_year" type="number" value={data.manufacturing_year} onChange={e => setData('manufacturing_year', e.target.value)} />
                            </Field>
                            <Field label="Color" id="color">
                                <Input id="color" value={data.color} onChange={e => setData('color', e.target.value)} placeholder="e.g. White" />
                            </Field>
                            <Field label="Chassis Number" id="chassis_number">
                                <Input id="chassis_number" value={data.chassis_number} onChange={e => setData('chassis_number', e.target.value)} />
                            </Field>
                            <Field label="Engine Number" id="engine_number">
                                <Input id="engine_number" value={data.engine_number} onChange={e => setData('engine_number', e.target.value)} />
                            </Field>
                            <Field label="Fuel Type" id="fuel_type" required>
                                <select id="fuel_type" value={data.fuel_type} onChange={e => setData('fuel_type', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="cng">CNG</option>
                                    <option value="electric">Electric</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </Field>
                            <Field label="Seating Capacity" id="seating_capacity" required>
                                <Input id="seating_capacity" type="number" min="1" value={data.seating_capacity} onChange={e => setData('seating_capacity', e.target.value)} />
                            </Field>
                            <Field label="Load Capacity (tons)" id="load_capacity">
                                <Input id="load_capacity" type="number" step="0.01" value={data.load_capacity} onChange={e => setData('load_capacity', e.target.value)} placeholder="Optional" />
                            </Field>
                            <Field label="Current Odometer (km)" id="current_odometer">
                                <Input id="current_odometer" type="number" min="0" value={data.current_odometer} onChange={e => setData('current_odometer', e.target.value)} />
                            </Field>
                            <Field label="Status" id="status" required>
                                <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="active">Active</option>
                                    <option value="in_service">In Service</option>
                                    <option value="under_maintenance">Under Maintenance</option>
                                    <option value="sold">Sold</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Purchase Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Purchase Date" id="purchase_date">
                                <Input id="purchase_date" type="date" value={data.purchase_date} onChange={e => setData('purchase_date', e.target.value)} />
                            </Field>
                            <Field label="Purchase Price (BDT)" id="purchase_price">
                                <Input id="purchase_price" type="number" step="0.01" value={data.purchase_price} onChange={e => setData('purchase_price', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Insurance & Documents</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Insurance Company" id="insurance_company">
                                <Input id="insurance_company" value={data.insurance_company} onChange={e => setData('insurance_company', e.target.value)} />
                            </Field>
                            <Field label="Policy Number" id="insurance_policy_number">
                                <Input id="insurance_policy_number" value={data.insurance_policy_number} onChange={e => setData('insurance_policy_number', e.target.value)} />
                            </Field>
                            <Field label="Insurance Expiry" id="insurance_expiry">
                                <Input id="insurance_expiry" type="date" value={data.insurance_expiry} onChange={e => setData('insurance_expiry', e.target.value)} />
                            </Field>
                            <Field label="Fitness Certificate Expiry" id="fitness_certificate_expiry">
                                <Input id="fitness_certificate_expiry" type="date" value={data.fitness_certificate_expiry} onChange={e => setData('fitness_certificate_expiry', e.target.value)} />
                            </Field>
                            <Field label="Tax Token Expiry" id="tax_token_expiry">
                                <Input id="tax_token_expiry" type="date" value={data.tax_token_expiry} onChange={e => setData('tax_token_expiry', e.target.value)} />
                            </Field>
                            <Field label="Route Permit Expiry" id="route_permit_expiry">
                                <Input id="route_permit_expiry" type="date" value={data.route_permit_expiry} onChange={e => setData('route_permit_expiry', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
                        <CardContent>
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Additional notes..."
                            />
                        </CardContent>
                    </Card>

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Register Vehicle'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

VehicleCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Vehicles', href: routes.index().url },
        { title: 'Add Vehicle', href: routes.create().url },
    ],
};
