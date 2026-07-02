<?php

namespace Database\Seeders;

use App\Models\Driver;
use App\Models\Expense;
use App\Models\FuelRecord;
use App\Models\Maintenance;
use App\Models\Trip;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class TmsSeeder extends Seeder
{
    public function run(): void
    {
        $vehicles = [
            ['registration_number' => 'Dhaka Metro-GA 11-1234', 'vehicle_type' => 'car', 'brand' => 'Toyota', 'model' => 'Corolla', 'manufacturing_year' => 2020, 'fuel_type' => 'petrol', 'seating_capacity' => 5, 'color' => 'White', 'status' => 'active', 'current_odometer' => 45000, 'insurance_expiry' => Carbon::now()->addMonths(8), 'fitness_certificate_expiry' => Carbon::now()->addDays(25), 'tax_token_expiry' => Carbon::now()->addMonths(3)],
            ['registration_number' => 'Dhaka Metro-GA 12-5678', 'vehicle_type' => 'bus', 'brand' => 'Toyota', 'model' => 'Hiace', 'manufacturing_year' => 2019, 'fuel_type' => 'diesel', 'seating_capacity' => 15, 'color' => 'Silver', 'status' => 'in_service', 'current_odometer' => 120000, 'insurance_expiry' => Carbon::now()->addMonths(2), 'fitness_certificate_expiry' => Carbon::now()->addMonths(6), 'tax_token_expiry' => Carbon::now()->addDays(15)],
            ['registration_number' => 'Dhaka Metro-GA 13-9012', 'vehicle_type' => 'truck', 'brand' => 'Isuzu', 'model' => 'ELF', 'manufacturing_year' => 2018, 'fuel_type' => 'diesel', 'seating_capacity' => 2, 'load_capacity' => 3.5, 'color' => 'Blue', 'status' => 'active', 'current_odometer' => 200000, 'insurance_expiry' => Carbon::now()->addMonths(5)],
            ['registration_number' => 'Dhaka Metro-GA 14-3456', 'vehicle_type' => 'pickup', 'brand' => 'Mitsubishi', 'model' => 'L200', 'manufacturing_year' => 2021, 'fuel_type' => 'diesel', 'seating_capacity' => 4, 'load_capacity' => 1.5, 'color' => 'Black', 'status' => 'under_maintenance', 'current_odometer' => 30000],
            ['registration_number' => 'Dhaka Metro-GA 15-7890', 'vehicle_type' => 'car', 'brand' => 'Honda', 'model' => 'Civic', 'manufacturing_year' => 2022, 'fuel_type' => 'petrol', 'seating_capacity' => 5, 'color' => 'Red', 'status' => 'active', 'current_odometer' => 15000, 'insurance_expiry' => Carbon::now()->addMonths(10)],
        ];

        $createdVehicles = [];
        foreach ($vehicles as $v) {
            $createdVehicles[] = Vehicle::create($v);
        }

        $drivers = [
            ['employee_id' => 'DRV-001', 'name' => 'Md. Karim', 'phone' => '01711-111111', 'license_number' => 'DL-001', 'license_expiry' => Carbon::now()->addYear(), 'joining_date' => Carbon::now()->subYears(3), 'salary' => 20000, 'assigned_vehicle_id' => $createdVehicles[0]->id, 'rating' => 5, 'status' => 'active'],
            ['employee_id' => 'DRV-002', 'name' => 'Rahim Mia', 'phone' => '01722-222222', 'license_number' => 'DL-002', 'license_expiry' => Carbon::now()->addMonths(6), 'joining_date' => Carbon::now()->subYears(2), 'salary' => 18000, 'assigned_vehicle_id' => $createdVehicles[1]->id, 'rating' => 4, 'status' => 'active'],
            ['employee_id' => 'DRV-003', 'name' => 'Jamal Uddin', 'phone' => '01733-333333', 'license_number' => 'DL-003', 'license_expiry' => Carbon::now()->addMonths(18), 'joining_date' => Carbon::now()->subYear(), 'salary' => 22000, 'assigned_vehicle_id' => $createdVehicles[2]->id, 'rating' => 4, 'status' => 'active'],
            ['employee_id' => 'DRV-004', 'name' => 'Sohel Rana', 'phone' => '01744-444444', 'license_number' => 'DL-004', 'license_expiry' => Carbon::now()->addMonths(3), 'joining_date' => Carbon::now()->subMonths(8), 'salary' => 15000, 'rating' => 3, 'status' => 'on_leave'],
        ];

        $createdDrivers = [];
        foreach ($drivers as $d) {
            $createdDrivers[] = Driver::create($d);
        }

        $trips = [
            ['trip_number' => 'TRP-'.strtoupper(Str::random(8)), 'vehicle_id' => $createdVehicles[0]->id, 'driver_id' => $createdDrivers[0]->id, 'start_location' => 'Dhaka HQ', 'destination' => 'Chittagong Office', 'purpose' => 'Business Meeting', 'client_department' => 'Sales', 'start_datetime' => Carbon::now()->subDays(5)->setTime(8, 0), 'end_datetime' => Carbon::now()->subDays(4)->setTime(18, 0), 'odometer_start' => 44000, 'odometer_end' => 44270, 'distance' => 270, 'status' => 'completed'],
            ['trip_number' => 'TRP-'.strtoupper(Str::random(8)), 'vehicle_id' => $createdVehicles[1]->id, 'driver_id' => $createdDrivers[1]->id, 'start_location' => 'Dhaka HQ', 'destination' => 'Gazipur Factory', 'purpose' => 'Staff Transport', 'client_department' => 'Operations', 'start_datetime' => Carbon::now()->setTime(7, 0), 'odometer_start' => 119500, 'status' => 'running'],
            ['trip_number' => 'TRP-'.strtoupper(Str::random(8)), 'vehicle_id' => $createdVehicles[2]->id, 'driver_id' => $createdDrivers[2]->id, 'start_location' => 'Warehouse A', 'destination' => 'Customer Site', 'purpose' => 'Cargo Delivery', 'start_datetime' => Carbon::now()->addDays(2)->setTime(9, 0), 'odometer_start' => 200000, 'status' => 'scheduled'],
        ];

        foreach ($trips as $t) {
            Trip::create($t);
        }

        $fuelRecords = [
            ['vehicle_id' => $createdVehicles[0]->id, 'driver_id' => $createdDrivers[0]->id, 'date' => Carbon::now()->subDays(10), 'fuel_type' => 'petrol', 'fuel_station' => 'Meghna Petrol Pump', 'quantity' => 40, 'price_per_liter' => 113, 'total_cost' => 4520, 'odometer_reading' => 44000, 'mileage' => 12.5],
            ['vehicle_id' => $createdVehicles[1]->id, 'driver_id' => $createdDrivers[1]->id, 'date' => Carbon::now()->subDays(8), 'fuel_type' => 'diesel', 'fuel_station' => 'Padma Fuel', 'quantity' => 60, 'price_per_liter' => 109, 'total_cost' => 6540, 'odometer_reading' => 119000, 'mileage' => 8.2],
            ['vehicle_id' => $createdVehicles[2]->id, 'driver_id' => $createdDrivers[2]->id, 'date' => Carbon::now()->subDays(3), 'fuel_type' => 'diesel', 'fuel_station' => 'Jamuna Fuel Station', 'quantity' => 80, 'price_per_liter' => 109, 'total_cost' => 8720, 'odometer_reading' => 199500, 'mileage' => 7.8],
            ['vehicle_id' => $createdVehicles[0]->id, 'driver_id' => $createdDrivers[0]->id, 'date' => Carbon::now()->subDays(2), 'fuel_type' => 'petrol', 'fuel_station' => 'Meghna Petrol Pump', 'quantity' => 35, 'price_per_liter' => 113, 'total_cost' => 3955, 'odometer_reading' => 44500, 'mileage' => 12.1],
        ];

        foreach ($fuelRecords as $f) {
            FuelRecord::create($f);
        }

        $maintenances = [
            ['vehicle_id' => $createdVehicles[3]->id, 'maintenance_type' => 'engine_service', 'service_date' => Carbon::now()->subDays(2), 'garage' => 'Mia Auto Garage', 'vendor' => 'Toyota Service Center', 'cost' => 25000, 'next_service_due' => Carbon::now()->addMonths(6), 'status' => 'in_progress', 'description' => 'Full engine overhaul'],
            ['vehicle_id' => $createdVehicles[0]->id, 'maintenance_type' => 'oil_change', 'service_date' => Carbon::now()->subMonth(), 'garage' => 'Quick Lube', 'cost' => 2500, 'next_service_due' => Carbon::now()->addDays(20), 'status' => 'completed'],
            ['vehicle_id' => $createdVehicles[1]->id, 'maintenance_type' => 'tire_replacement', 'service_date' => Carbon::now()->addDays(5), 'garage' => 'Tire World', 'cost' => 15000, 'next_service_due' => Carbon::now()->addMonths(24), 'status' => 'scheduled'],
        ];

        foreach ($maintenances as $m) {
            Maintenance::create($m);
        }

        $expenses = [
            ['vehicle_id' => $createdVehicles[0]->id, 'category' => 'fuel', 'date' => Carbon::now()->subDays(2), 'amount' => 4520, 'description' => 'Fuel refill', 'department' => 'Operations'],
            ['vehicle_id' => $createdVehicles[1]->id, 'category' => 'fuel', 'date' => Carbon::now()->subDays(8), 'amount' => 6540, 'description' => 'Diesel refill', 'department' => 'Operations'],
            ['vehicle_id' => $createdVehicles[3]->id, 'category' => 'repair', 'date' => Carbon::now()->subDays(2), 'amount' => 25000, 'description' => 'Engine overhaul', 'department' => 'Administration', 'approved_by' => 'Manager'],
            ['vehicle_id' => $createdVehicles[0]->id, 'category' => 'toll', 'date' => Carbon::now()->subDays(5), 'amount' => 300, 'description' => 'Highway toll Dhaka-Ctg', 'department' => 'Sales'],
            ['vehicle_id' => $createdVehicles[1]->id, 'category' => 'driver_allowance', 'date' => Carbon::now()->subDays(1), 'amount' => 2000, 'description' => 'Daily allowance', 'department' => 'Operations'],
        ];

        foreach ($expenses as $e) {
            Expense::create($e);
        }

        VehicleRequest::create([
            'request_number' => 'REQ-'.strtoupper(Str::random(8)),
            'employee_name' => 'Ahmed Hassan',
            'employee_id' => 'EMP-050',
            'department' => 'HR',
            'purpose' => 'Airport pickup for guest',
            'destination' => 'Hazrat Shahjalal Airport',
            'start_datetime' => Carbon::now()->addDays(1)->setTime(14, 0),
            'end_datetime' => Carbon::now()->addDays(1)->setTime(18, 0),
            'passenger_count' => 3,
            'status' => 'pending',
        ]);

        VehicleRequest::create([
            'request_number' => 'REQ-'.strtoupper(Str::random(8)),
            'employee_name' => 'Fatima Begum',
            'employee_id' => 'EMP-075',
            'department' => 'Finance',
            'purpose' => 'Bank visit',
            'destination' => 'Motijheel',
            'start_datetime' => Carbon::now()->addDays(2)->setTime(10, 0),
            'end_datetime' => Carbon::now()->addDays(2)->setTime(13, 0),
            'passenger_count' => 2,
            'status' => 'approved',
            'approved_by' => 'Department Head',
            'vehicle_id' => $createdVehicles[4]->id,
            'driver_id' => $createdDrivers[0]->id,
        ]);
    }
}
