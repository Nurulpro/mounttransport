import { Head, Link, router } from '@inertiajs/react';
import { Car, Edit, Eye, Plus, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as routes from '@/routes/vehicles';
import { dashboard } from '@/routes';
import { useState } from 'react';

type Vehicle = {
    id: number;
    registration_number: string;
    vehicle_type: string;
    brand: string;
    model: string;
    manufacturing_year: number;
    fuel_type: string;
    seating_capacity: number;
    status: string;
    current_odometer: number;
    insurance_expiry: string | null;
};

type PageProps = {
    vehicles: {
        data: Vehicle[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters: { search?: string; status?: string; vehicle_type?: string };
};

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    in_service: 'bg-blue-100 text-blue-800',
    under_maintenance: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-gray-100 text-gray-800',
    inactive: 'bg-red-100 text-red-800',
};

export default function VehiclesIndex({ vehicles, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(routes.index().url, { ...filters, search }, { preserveState: true, replace: true });
    }

    function handleFilter(key: string, value: string) {
        router.get(routes.index().url, { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    }

    function handleDelete(id: number) {
        if (confirm('Delete this vehicle?')) {
            router.delete(`/vehicles/${id}`);
        }
    }

    return (
        <>
            <Head title="Vehicles" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Car className="h-6 w-6" /> Vehicle Management
                        </h1>
                        <p className="text-muted-foreground">Manage all company vehicles</p>
                    </div>
                    <Button asChild>
                        <Link href={routes.create().url}>
                            <Plus className="h-4 w-4 mr-1" /> Add Vehicle
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Search registration, brand..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                />
                                <Button type="submit" variant="secondary" size="icon">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                            <select
                                value={filters.status ?? ''}
                                onChange={(e) => handleFilter('status', e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="in_service">In Service</option>
                                <option value="under_maintenance">Under Maintenance</option>
                                <option value="sold">Sold</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={filters.vehicle_type ?? ''}
                                onChange={(e) => handleFilter('vehicle_type', e.target.value)}
                                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                                <option value="">All Types</option>
                                <option value="car">Car</option>
                                <option value="bus">Bus</option>
                                <option value="truck">Truck</option>
                                <option value="pickup">Pickup</option>
                                <option value="motorcycle">Motorcycle</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Registration</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Brand / Model</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Fuel</TableHead>
                                    <TableHead>Odometer</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicles.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                            No vehicles found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    vehicles.data.map((v) => (
                                        <TableRow key={v.id}>
                                            <TableCell className="font-medium">{v.registration_number}</TableCell>
                                            <TableCell className="capitalize">{v.vehicle_type}</TableCell>
                                            <TableCell>{v.brand} {v.model}</TableCell>
                                            <TableCell>{v.manufacturing_year}</TableCell>
                                            <TableCell className="capitalize">{v.fuel_type}</TableCell>
                                            <TableCell>{v.current_odometer.toLocaleString()} km</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[v.status] ?? ''}`}>
                                                    {v.status.replace(/_/g, ' ')}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/vehicles/${v.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/vehicles/${v.id}/edit`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() => handleDelete(v.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {vehicles.last_page > 1 && (
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                            Showing {(vehicles.current_page - 1) * vehicles.per_page + 1}–
                            {Math.min(vehicles.current_page * vehicles.per_page, vehicles.total)} of {vehicles.total}
                        </span>
                        <div className="flex gap-2">
                            {vehicles.current_page > 1 && (
                                <Button variant="outline" size="sm" onClick={() => router.get(routes.index().url, { ...filters, page: vehicles.current_page - 1 })}>
                                    Previous
                                </Button>
                            )}
                            {vehicles.current_page < vehicles.last_page && (
                                <Button variant="outline" size="sm" onClick={() => router.get(routes.index().url, { ...filters, page: vehicles.current_page + 1 })}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

VehiclesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Vehicles', href: routes.index().url },
    ],
};
