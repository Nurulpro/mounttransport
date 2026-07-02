import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/drivers';
import { dashboard } from '@/routes';

type Driver = {
    id: number; employee_id: string; name: string; phone: string; email: string | null;
    address: string | null; emergency_contact_name: string | null; emergency_contact_phone: string | null;
    license_number: string; license_type: string | null; license_expiry: string;
    nid_number: string | null; joining_date: string; salary: number | null;
    assigned_vehicle_id: number | null; medical_certificate_expiry: string | null;
    rating: number; status: string; notes: string | null;
};
type Vehicle = { id: number; registration_number: string; brand: string; model: string };

export default function DriverEdit({ driver, vehicles }: { driver: Driver; vehicles: Vehicle[] }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: driver.employee_id,
        name: driver.name,
        phone: driver.phone,
        email: driver.email ?? '',
        address: driver.address ?? '',
        emergency_contact_name: driver.emergency_contact_name ?? '',
        emergency_contact_phone: driver.emergency_contact_phone ?? '',
        license_number: driver.license_number,
        license_type: driver.license_type ?? '',
        license_expiry: driver.license_expiry,
        nid_number: driver.nid_number ?? '',
        joining_date: driver.joining_date,
        salary: driver.salary?.toString() ?? '',
        assigned_vehicle_id: driver.assigned_vehicle_id?.toString() ?? '',
        medical_certificate_expiry: driver.medical_certificate_expiry ?? '',
        rating: driver.rating.toString(),
        status: driver.status,
        notes: driver.notes ?? '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/drivers/${driver.id}`);
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
            <Head title={`Edit ${driver.name}`} />
            <div className="flex flex-col gap-6 p-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold">Edit Driver</h1>
                    <p className="text-muted-foreground">{driver.name} — {driver.employee_id}</p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Employee ID" id="employee_id" required>
                                <Input id="employee_id" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} />
                            </Field>
                            <Field label="Full Name" id="name" required>
                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} />
                            </Field>
                            <Field label="Phone" id="phone" required>
                                <Input id="phone" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                            </Field>
                            <Field label="Email" id="email">
                                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </Field>
                            <Field label="NID Number" id="nid_number">
                                <Input id="nid_number" value={data.nid_number} onChange={e => setData('nid_number', e.target.value)} />
                            </Field>
                            <Field label="Address" id="address">
                                <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>License & Employment</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="License Number" id="license_number" required>
                                <Input id="license_number" value={data.license_number} onChange={e => setData('license_number', e.target.value)} />
                            </Field>
                            <Field label="License Expiry" id="license_expiry" required>
                                <Input id="license_expiry" type="date" value={data.license_expiry} onChange={e => setData('license_expiry', e.target.value)} />
                            </Field>
                            <Field label="Joining Date" id="joining_date" required>
                                <Input id="joining_date" type="date" value={data.joining_date} onChange={e => setData('joining_date', e.target.value)} />
                            </Field>
                            <Field label="Salary (BDT)" id="salary">
                                <Input id="salary" type="number" value={data.salary} onChange={e => setData('salary', e.target.value)} />
                            </Field>
                            <Field label="Assigned Vehicle" id="assigned_vehicle_id">
                                <select id="assigned_vehicle_id" value={data.assigned_vehicle_id} onChange={e => setData('assigned_vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">None</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.brand} {v.model}</option>)}
                                </select>
                            </Field>
                            <Field label="Rating" id="rating">
                                <Input id="rating" type="number" min="1" max="5" value={data.rating} onChange={e => setData('rating', e.target.value)} />
                            </Field>
                            <Field label="Status" id="status" required>
                                <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                </select>
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update Driver'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DriverEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Drivers', href: routes.index().url },
        { title: 'Edit', href: '#' },
    ],
};
