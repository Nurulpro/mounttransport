import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/maintenance';
import { dashboard } from '@/routes';

type Maintenance = {
    id: number; vehicle_id: number; maintenance_type: string; service_date: string;
    garage: string | null; vendor: string | null; cost: number; next_service_due: string | null;
    description: string | null; status: string; invoice_number: string | null; notes: string | null;
};
type Vehicle = { id: number; registration_number: string };

export default function MaintenanceEdit({ maintenance, vehicles }: { maintenance: Maintenance; vehicles: Vehicle[] }) {
    const { data, setData, put, processing, errors } = useForm({
        vehicle_id: maintenance.vehicle_id.toString(),
        maintenance_type: maintenance.maintenance_type,
        service_date: maintenance.service_date,
        garage: maintenance.garage ?? '',
        vendor: maintenance.vendor ?? '',
        cost: maintenance.cost.toString(),
        next_service_due: maintenance.next_service_due ?? '',
        description: maintenance.description ?? '',
        status: maintenance.status,
        invoice_number: maintenance.invoice_number ?? '',
        notes: maintenance.notes ?? '',
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
            <Head title="Edit Maintenance" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <h1 className="text-2xl font-bold">Edit Maintenance Record</h1>
                <form onSubmit={e => { e.preventDefault(); put(`/maintenance/${maintenance.id}`); }} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Maintenance Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Vehicle" id="vehicle_id" required>
                                <select id="vehicle_id" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                                </select>
                            </Field>
                            <Field label="Type" id="maintenance_type" required>
                                <select id="maintenance_type" value={data.maintenance_type} onChange={e => setData('maintenance_type', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="oil_change">Oil Change</option>
                                    <option value="engine_service">Engine Service</option>
                                    <option value="tire_replacement">Tire Replacement</option>
                                    <option value="brake_service">Brake Service</option>
                                    <option value="battery">Battery</option>
                                    <option value="ac_service">AC Service</option>
                                    <option value="general_repair">General Repair</option>
                                </select>
                            </Field>
                            <Field label="Service Date" id="service_date" required>
                                <Input id="service_date" type="date" value={data.service_date} onChange={e => setData('service_date', e.target.value)} />
                            </Field>
                            <Field label="Next Service Due" id="next_service_due">
                                <Input id="next_service_due" type="date" value={data.next_service_due} onChange={e => setData('next_service_due', e.target.value)} />
                            </Field>
                            <Field label="Garage" id="garage">
                                <Input id="garage" value={data.garage} onChange={e => setData('garage', e.target.value)} />
                            </Field>
                            <Field label="Cost (BDT)" id="cost">
                                <Input id="cost" type="number" value={data.cost} onChange={e => setData('cost', e.target.value)} />
                            </Field>
                            <Field label="Status" id="status" required>
                                <select id="status" value={data.status} onChange={e => setData('status', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </Field>
                            <Field label="Invoice Number" id="invoice_number">
                                <Input id="invoice_number" value={data.invoice_number} onChange={e => setData('invoice_number', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

MaintenanceEdit.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Maintenance', href: routes.index().url }, { title: 'Edit', href: '#' }],
};
