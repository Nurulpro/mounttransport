import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/expenses';
import { dashboard } from '@/routes';

type Vehicle = { id: number; registration_number: string };
type Driver = { id: number; name: string };
type Trip = { id: number; trip_number: string; start_location: string; destination: string };

export default function ExpenseCreate({ vehicles, drivers, trips }: { vehicles: Vehicle[]; drivers: Driver[]; trips: Trip[] }) {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '',
        driver_id: '',
        trip_id: '',
        category: 'fuel',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        department: '',
        approved_by: '',
        receipt_number: '',
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
            <Head title="Add Expense" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold">Record Expense</h1>
                    <p className="text-muted-foreground">Add a transport-related expense</p>
                </div>
                <form onSubmit={e => { e.preventDefault(); post(routes.store().url); }} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Expense Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Category" id="category" required>
                                <select id="category" value={data.category} onChange={e => setData('category', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="fuel">Fuel</option>
                                    <option value="toll">Toll</option>
                                    <option value="parking">Parking</option>
                                    <option value="repair">Repair</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="tax">Tax</option>
                                    <option value="driver_allowance">Driver Allowance</option>
                                    <option value="spare_parts">Spare Parts</option>
                                    <option value="others">Others</option>
                                </select>
                            </Field>
                            <Field label="Date" id="date" required>
                                <Input id="date" type="date" value={data.date} onChange={e => setData('date', e.target.value)} />
                            </Field>
                            <Field label="Amount (BDT)" id="amount" required>
                                <Input id="amount" type="number" step="0.01" min="0" value={data.amount} onChange={e => setData('amount', e.target.value)} />
                            </Field>
                            <Field label="Description" id="description" required>
                                <Input id="description" value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Brief description" />
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
                            <Field label="Trip" id="trip_id">
                                <select id="trip_id" value={data.trip_id} onChange={e => setData('trip_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <option value="">None</option>
                                    {trips.map(t => <option key={t.id} value={t.id}>{t.trip_number} — {t.start_location} → {t.destination}</option>)}
                                </select>
                            </Field>
                            <Field label="Department" id="department">
                                <Input id="department" value={data.department} onChange={e => setData('department', e.target.value)} />
                            </Field>
                            <Field label="Approved By" id="approved_by">
                                <Input id="approved_by" value={data.approved_by} onChange={e => setData('approved_by', e.target.value)} />
                            </Field>
                            <Field label="Receipt Number" id="receipt_number">
                                <Input id="receipt_number" value={data.receipt_number} onChange={e => setData('receipt_number', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Expense'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ExpenseCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Expenses', href: routes.index().url },
        { title: 'Add Expense', href: routes.create().url },
    ],
};
