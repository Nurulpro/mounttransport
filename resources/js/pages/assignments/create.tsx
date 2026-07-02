import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/assignments';
import { dashboard } from '@/routes';

type Vehicle = { id: number; registration_number: string; brand: string; model: string };
type Driver = { id: number; name: string; employee_id: string };

export default function AssignmentCreate({ vehicles, drivers }: { vehicles: Vehicle[]; drivers: Driver[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '',
        driver_id: '',
        employee_name: '',
        department: '',
        project: '',
        assigned_by: '',
        assignment_date: new Date().toISOString().split('T')[0],
        return_date: '',
        purpose: '',
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
            <Head title="New Assignment" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold">Assign Vehicle</h1>
                    <p className="text-muted-foreground">Assign a vehicle to employee, department, driver, or project</p>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Assignment Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Vehicle" id="vehicle_id" required>
                                <select id="vehicle_id" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select vehicle</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.brand} {v.model}</option>)}
                                </select>
                            </Field>
                            <Field label="Driver" id="driver_id">
                                <select id="driver_id" value={data.driver_id} onChange={e => setData('driver_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">Select driver (optional)</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.employee_id})</option>)}
                                </select>
                            </Field>
                            <Field label="Employee Name" id="employee_name">
                                <Input id="employee_name" value={data.employee_name} onChange={e => setData('employee_name', e.target.value)} />
                            </Field>
                            <Field label="Department" id="department">
                                <Input id="department" value={data.department} onChange={e => setData('department', e.target.value)} />
                            </Field>
                            <Field label="Project" id="project">
                                <Input id="project" value={data.project} onChange={e => setData('project', e.target.value)} />
                            </Field>
                            <Field label="Assigned By" id="assigned_by" required>
                                <Input id="assigned_by" value={data.assigned_by} onChange={e => setData('assigned_by', e.target.value)} />
                            </Field>
                            <Field label="Assignment Date" id="assignment_date" required>
                                <Input id="assignment_date" type="date" value={data.assignment_date} onChange={e => setData('assignment_date', e.target.value)} />
                            </Field>
                            <Field label="Expected Return Date" id="return_date">
                                <Input id="return_date" type="date" value={data.return_date} onChange={e => setData('return_date', e.target.value)} />
                            </Field>
                            <Field label="Purpose" id="purpose" required>
                                <Input id="purpose" value={data.purpose} onChange={e => setData('purpose', e.target.value)} placeholder="Why is this vehicle being assigned?" />
                            </Field>
                            <Field label="Status" id="status" required>
                                <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="active">Active</option>
                                    <option value="returned">Returned</option>
                                </select>
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Assigning...' : 'Assign Vehicle'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AssignmentCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Assignments', href: routes.index().url },
        { title: 'New Assignment', href: routes.create().url },
    ],
};
