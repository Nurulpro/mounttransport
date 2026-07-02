import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/documents';
import { dashboard } from '@/routes';

type Document = {
    id: number; document_type: string; title: string; document_number: string | null;
    issue_date: string | null; expiry_date: string | null;
    vehicle: { registration_number: string } | null;
    driver: { name: string } | null;
};
type Vehicle = { id: number; registration_number: string };

const DOC_LABELS: Record<string, string> = {
    insurance: 'Insurance', registration: 'Registration', tax_token: 'Tax Token',
    fitness: 'Fitness', route_permit: 'Route Permit', pollution_certificate: 'Pollution Certificate',
    driver_license: 'Driver License', purchase_invoice: 'Purchase Invoice', other: 'Other',
};

export default function DocumentsIndex({
    documents, filters, vehicles, expiringSoon,
}: {
    documents: { data: Document[]; total: number; current_page: number; last_page: number; per_page: number };
    filters: Record<string, string>;
    vehicles: Vehicle[];
    expiringSoon: number;
}) {
    function handleDelete(id: number) {
        if (confirm('Delete this document?')) router.delete(`/documents/${id}`);
    }

    function isExpiring(dateStr: string | null) {
        if (!dateStr) return false;
        const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
        return diff <= 30;
    }

    return (
        <>
            <Head title="Documents" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6" /> Document Management</h1>
                        <p className="text-muted-foreground">{documents.total} documents stored</p>
                    </div>
                    <Button asChild><Link href={routes.create().url}><Plus className="h-4 w-4 mr-1" /> Add Document</Link></Button>
                </div>

                {expiringSoon > 0 && (
                    <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-orange-800">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">{expiringSoon} document(s) expiring within 30 days</span>
                    </div>
                )}

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <select value={filters.document_type ?? ''} onChange={e => router.get(routes.index().url, { ...filters, document_type: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Types</option>
                                {Object.entries(DOC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <select value={filters.vehicle_id ?? ''} onChange={e => router.get(routes.index().url, { ...filters, vehicle_id: e.target.value || undefined }, { preserveState: true })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="">All Vehicles</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number}</option>)}
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>Doc Number</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.data.length === 0 ? (
                                    <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No documents found.</TableCell></TableRow>
                                ) : (
                                    documents.data.map(d => (
                                        <TableRow key={d.id} className={d.expiry_date && isExpiring(d.expiry_date) ? 'bg-orange-50' : ''}>
                                            <TableCell className="font-medium">{d.title}</TableCell>
                                            <TableCell>{DOC_LABELS[d.document_type] ?? d.document_type}</TableCell>
                                            <TableCell>{d.vehicle?.registration_number ?? '—'}</TableCell>
                                            <TableCell>{d.driver?.name ?? '—'}</TableCell>
                                            <TableCell>{d.document_number ?? '—'}</TableCell>
                                            <TableCell>{d.issue_date ?? '—'}</TableCell>
                                            <TableCell className={d.expiry_date && isExpiring(d.expiry_date) ? 'text-orange-600 font-medium' : ''}>{d.expiry_date ?? '—'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(d.id)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DocumentsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard().url }, { title: 'Documents', href: routes.index().url }],
};
