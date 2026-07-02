import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import * as routes from '@/routes/requests';
import { dashboard } from '@/routes';

type VehicleRequest = {
    id: number; request_number: string; employee_name: string; employee_id: string;
    department: string; purpose: string; destination: string;
    start_datetime: string; end_datetime: string; passenger_count: number;
    status: string; approved_by: string | null; rejection_reason: string | null; notes: string | null;
    vehicle: { registration_number: string } | null;
    driver: { name: string } | null;
};
type Vehicle = { id: number; registration_number: string };
type Driver = { id: number; name: string };

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    assigned: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-0.5 border-b pb-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || '—'}</span>
        </div>
    );
}

export default function RequestShow({ request: req, vehicles, drivers }: { request: VehicleRequest; vehicles: Vehicle[]; drivers: Driver[] }) {
    const approveForm = useForm({ vehicle_id: '', driver_id: '' });
    const rejectForm = useForm({ rejection_reason: '' });

    function handleApprove(e: React.FormEvent) {
        e.preventDefault();
        approveForm.post(`/requests/${req.id}/approve`);
    }

    function handleReject(e: React.FormEvent) {
        e.preventDefault();
        rejectForm.post(`/requests/${req.id}/reject`);
    }

    return (
        <>
            <Head title={req.request_number} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{req.request_number}</h1>
                        <p className="text-muted-foreground">{req.employee_name} — {req.department}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${STATUS_COLORS[req.status]}`}>
                            {req.status}
                        </span>
                        <Button variant="outline" asChild><Link href={routes.index().url}>Back</Link></Button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Request Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="Employee ID" value={req.employee_id} />
                            <DetailRow label="Department" value={req.department} />
                            <DetailRow label="Purpose" value={req.purpose} />
                            <DetailRow label="Destination" value={req.destination} />
                            <DetailRow label="Start" value={new Date(req.start_datetime).toLocaleString()} />
                            <DetailRow label="End" value={new Date(req.end_datetime).toLocaleString()} />
                            <DetailRow label="Passengers" value={req.passenger_count} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Assignment</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <DetailRow label="Assigned Vehicle" value={req.vehicle?.registration_number} />
                            <DetailRow label="Assigned Driver" value={req.driver?.name} />
                            <DetailRow label="Approved By" value={req.approved_by} />
                            {req.rejection_reason && <DetailRow label="Rejection Reason" value={req.rejection_reason} />}
                        </CardContent>
                    </Card>
                </div>

                {req.status === 'pending' && (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader><CardTitle className="text-green-700">Approve Request</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleApprove} className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="vehicle_id">Assign Vehicle</Label>
                                        <select id="vehicle_id" value={approveForm.data.vehicle_id} onChange={e => approveForm.setData('vehicle_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            <option value="">Select vehicle</option>
                                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="driver_id">Assign Driver</Label>
                                        <select id="driver_id" value={approveForm.data.driver_id} onChange={e => approveForm.setData('driver_id', e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                            <option value="">Select driver</option>
                                            {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={approveForm.processing}>
                                        {approveForm.processing ? 'Approving...' : 'Approve Request'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-red-700">Reject Request</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleReject} className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="rejection_reason">Reason for Rejection <span className="text-red-500">*</span></Label>
                                        <textarea id="rejection_reason" value={rejectForm.data.rejection_reason} onChange={e => rejectForm.setData('rejection_reason', e.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                    </div>
                                    <Button type="submit" variant="destructive" disabled={rejectForm.processing}>
                                        {rejectForm.processing ? 'Rejecting...' : 'Reject Request'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}

RequestShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Requests', href: routes.index().url },
        { title: 'Details', href: '#' },
    ],
};
