import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/documents';
import { dashboard } from '@/routes';

type Vehicle = { id: number; registration_number: string };
type Driver = { id: number; name: string };

export default function DocumentCreate({ vehicles, drivers }: { vehicles: Vehicle[]; drivers: Driver[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '',
        driver_id: '',
        document_type: 'insurance',
        title: '',
        document_number: '',
        issue_date: '',
        expiry_date: '',
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

    return (
        <>
            <Head title="Add Document" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold">Add Document</h1>
                    <p className="text-muted-foreground">Store a vehicle or driver document</p>
                </div>
                <form onSubmit={e => { e.preventDefault(); post(routes.store().url); }} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Document Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Document Type" id="document_type" required>
                                <select id="document_type" value={data.document_type} onChange={e => setData('document_type', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="insurance">Insurance</option>
                                    <option value="registration">Registration</option>
                                    <option value="tax_token">Tax Token</option>
                                    <option value="fitness">Fitness Certificate</option>
                                    <option value="route_permit">Route Permit</option>
                                    <option value="pollution_certificate">Pollution Certificate</option>
                                    <option value="driver_license">Driver License</option>
                                    <option value="purchase_invoice">Purchase Invoice</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>
                            <Field label="Title" id="title" required>
                                <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Document title" />
                            </Field>
                            <Field label="Vehicle" id="vehicle_id">
                                <select id="vehicle_id" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">None</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                                </select>
                            </Field>
                            <Field label="Driver" id="driver_id">
                                <select id="driver_id" value={data.driver_id} onChange={e => setData('driver_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">None</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Document Number" id="document_number">
                                <Input id="document_number" value={data.document_number} onChange={e => setData('document_number', e.target.value)} />
                            </Field>
                            <Field label="Issue Date" id="issue_date">
                                <Input id="issue_date" type="date" value={data.issue_date} onChange={e => setData('issue_date', e.target.value)} />
                            </Field>
                            <Field label="Expiry Date" id="expiry_date">
                                <Input id="expiry_date" type="date" value={data.expiry_date} onChange={e => setData('expiry_date', e.target.value)} />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Notes" id="notes">
                                    <textarea id="notes" value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Document'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DocumentCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Documents', href: routes.index().url },
        { title: 'Add Document', href: routes.create().url },
    ],
};
