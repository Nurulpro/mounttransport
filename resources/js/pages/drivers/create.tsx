import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/drivers';
import { dashboard } from '@/routes';

type Vehicle = { id: number; registration_number: string; brand: string; model: string };

export default function DriverCreate({ vehicles }: { vehicles: Vehicle[] }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        license_number: '',
        license_type: '',
        license_expiry: '',
        nid_number: '',
        joining_date: '',
        salary: '',
        assigned_vehicle_id: '',
        medical_certificate_expiry: '',
        rating: '5',
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
                <Label htmlFor={id}>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
                {children}
                {errors[id as keyof typeof errors] && <p className="text-xs text-red-500">{errors[id as keyof typeof errors]}</p>}
            </div>
        );
    }

    return (
        <>
            <Head title="Add Driver" />
            <div className="flex flex-col gap-6 p-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold">Add New Driver</h1>
                    <p className="text-muted-foreground">Register a new driver profile</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Employee ID" id="employee_id" required>
                                <Input id="employee_id" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} placeholder="e.g. EMP-001" />
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
                            <Field label="Emergency Contact Name" id="emergency_contact_name">
                                <Input id="emergency_contact_name" value={data.emergency_contact_name} onChange={e => setData('emergency_contact_name', e.target.value)} />
                            </Field>
                            <Field label="Emergency Contact Phone" id="emergency_contact_phone">
                                <Input id="emergency_contact_phone" value={data.emergency_contact_phone} onChange={e => setData('emergency_contact_phone', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>License & Documents</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="License Number" id="license_number" required>
                                <Input id="license_number" value={data.license_number} onChange={e => setData('license_number', e.target.value)} />
                            </Field>
                            <Field label="License Type" id="license_type">
                                <Input id="license_type" value={data.license_type} onChange={e => setData('license_type', e.target.value)} placeholder="e.g. Professional" />
                            </Field>
                            <Field label="License Expiry" id="license_expiry" required>
                                <Input id="license_expiry" type="date" value={data.license_expiry} onChange={e => setData('license_expiry', e.target.value)} />
                            </Field>
                            <Field label="Medical Certificate Expiry" id="medical_certificate_expiry">
                                <Input id="medical_certificate_expiry" type="date" value={data.medical_certificate_expiry} onChange={e => setData('medical_certificate_expiry', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Employment Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Joining Date" id="joining_date" required>
                                <Input id="joining_date" type="date" value={data.joining_date} onChange={e => setData('joining_date', e.target.value)} />
                            </Field>
                            <Field label="Monthly Salary (BDT)" id="salary">
                                <Input id="salary" type="number" value={data.salary} onChange={e => setData('salary', e.target.value)} />
                            </Field>
                            <Field label="Assigned Vehicle" id="assigned_vehicle_id">
                                <select id="assigned_vehicle_id" value={data.assigned_vehicle_id} onChange={e => setData('assigned_vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">None</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.registration_number} — {v.brand} {v.model}</option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Rating (1-5)" id="rating">
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
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Add Driver'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DriverCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Drivers', href: routes.index().url },
        { title: 'Add Driver', href: routes.create().url },
    ],
};
