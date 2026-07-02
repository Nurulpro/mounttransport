import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/requests';
import { dashboard } from '@/routes';

export default function RequestCreate() {
    const { data, setData, post, processing, errors } = useForm({
        employee_name: '',
        employee_id: '',
        department: '',
        purpose: '',
        destination: '',
        start_datetime: '',
        end_datetime: '',
        passenger_count: '1',
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
            <Head title="Request Vehicle" />
            <div className="flex flex-col gap-6 p-6 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-bold">Vehicle Booking Request</h1>
                    <p className="text-muted-foreground">Submit a vehicle request for approval</p>
                </div>
                <form onSubmit={e => { e.preventDefault(); post(routes.store().url); }} className="flex flex-col gap-6">
                    <Card>
                        <CardHeader><CardTitle>Requester Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Employee Name" id="employee_name" required>
                                <Input id="employee_name" value={data.employee_name} onChange={e => setData('employee_name', e.target.value)} />
                            </Field>
                            <Field label="Employee ID" id="employee_id" required>
                                <Input id="employee_id" value={data.employee_id} onChange={e => setData('employee_id', e.target.value)} />
                            </Field>
                            <Field label="Department" id="department" required>
                                <Input id="department" value={data.department} onChange={e => setData('department', e.target.value)} />
                            </Field>
                            <Field label="Passenger Count" id="passenger_count" required>
                                <Input id="passenger_count" type="number" min="1" value={data.passenger_count} onChange={e => setData('passenger_count', e.target.value)} />
                            </Field>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Trip Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Purpose" id="purpose" required>
                                <Input id="purpose" value={data.purpose} onChange={e => setData('purpose', e.target.value)} placeholder="Why do you need a vehicle?" />
                            </Field>
                            <Field label="Destination" id="destination" required>
                                <Input id="destination" value={data.destination} onChange={e => setData('destination', e.target.value)} />
                            </Field>
                            <Field label="Start Date & Time" id="start_datetime" required>
                                <Input id="start_datetime" type="datetime-local" value={data.start_datetime} onChange={e => setData('start_datetime', e.target.value)} />
                            </Field>
                            <Field label="End Date & Time" id="end_datetime" required>
                                <Input id="end_datetime" type="datetime-local" value={data.end_datetime} onChange={e => setData('end_datetime', e.target.value)} />
                            </Field>
                            <div className="sm:col-span-2">
                                <Field label="Notes" id="notes">
                                    <textarea id="notes" value={data.notes} onChange={e => setData('notes', e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Any additional information..." />
                                </Field>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3">
                        <Button type="submit" disabled={processing}>{processing ? 'Submitting...' : 'Submit Request'}</Button>
                        <Button type="button" variant="outline" onClick={() => history.back()}>Cancel</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RequestCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Requests', href: routes.index().url },
        { title: 'New Request', href: routes.create().url },
    ],
};
