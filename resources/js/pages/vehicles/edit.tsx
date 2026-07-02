import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    purchase_date: string | null;
    purchase_price: number | null;
    color: string | null;
    insurance_company: string | null;
    insurance_policy_number: string | null;
    insurance_expiry: string | null;
    fitness_certificate_expiry: string | null;
    tax_token_expiry: string | null;
    route_permit_expiry: string | null;
    current_odometer: number;
    status: string;
    notes: string | null;
};

export default function VehicleEdit({ vehicle }: { vehicle: Vehicle }) {
    const { data, setData, put, processing, errors } = useForm({
        registration_number: vehicle.registration_number,
        vehicle_type: vehicle.vehicle_type,
        brand: vehicle.brand,
        model: vehicle.model,
        manufacturing_year: vehicle.manufacturing_year.toString(),
        chassis_number: vehicle.chassis_number ?? '',
        engine_number: vehicle.engine_number ?? '',
        fuel_type: vehicle.fuel_type,
        seating_capacity: vehicle.seating_capacity.toString(),
        load_capacity: vehicle.load_capacity?.toString() ?? '',
        purchase_date: vehicle.purchase_date ?? '',
        purchase_price: vehicle.purchase_price?.toString() ?? '',
        color: vehicle.color ?? '',
        insurance_company: vehicle.insurance_company ?? '',
        insurance_policy_number: vehicle.insurance_policy_number ?? '',
        insurance_expiry: vehicle.insurance_expiry ?? '',
        fitness_certificate_expiry: vehicle.fitness_certificate_expiry ?? '',
        tax_token_expiry: vehicle.tax_token_expiry ?? '',
        route_permit_expiry: vehicle.route_permit_expiry ?? '',
        current_odometer: vehicle.current_odometer.toString(),
        status: vehicle.status,
        notes: vehicle.notes ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/vehicles/${vehicle.id}`);
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
            <Head title={`Edit ${vehicle.registration_number}`} />
            <div className="flex flex-col gap-6 p-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold">Edit Vehicle</h1>
                    <p className="text-muted-foreground">{vehicle.registration_number}</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Registration Number" id="registration_number" required>
                                <Input id="registration_number" value={data.registration_number} onChange={e => setData('registration_number', e.target.value)} />
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
                                <Input id="brand" value={data.brand} onChange={e => setData('brand', e.target.value)} />
                            </Field>
                            <Field label="Model" id="model" required>
                                <Input id="model" value={data.model} onChange={e => setData('model', e.target.value)} />
                            </Field>
                            <Field label="Year" id="manufacturing_year" required>
                                <Input id="manufacturing_year" type="number" value={data.manufacturing_year} onChange={e => setData('manufacturing_year', e.target.value)} />
                            </Field>
                            <Field label="Color" id="color">
                                <Input id="color" value={data.color} onChange={e => setData('color', e.target.value)} />
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
                                <Input id="seating_capacity" type="number" value={data.seating_capacity} onChange={e => setData('seating_capacity', e.target.value)} />
                            </Field>
                            <Field label="Odometer (km)" id="current_odometer">
                                <Input id="current_odometer" type="number" value={data.current_odometer} onChange={e => setData('current_odometer', e.target.value)} />
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
                            <Field label="Fitness Expiry" id="fitness_certificate_expiry">
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

                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update Vehicle'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

VehicleEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Vehicles', href: routes.index().url },
        { title: 'Edit', href: '#' },
    ],
};
