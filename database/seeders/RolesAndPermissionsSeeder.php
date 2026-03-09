<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User Management
            'manage users',
            'manage roles',
            
            // Meetings
            'view meetings',
            'create meetings',
            'edit meetings',
            'delete meetings',
            'cancel meetings',
            
            // Minutes
            'view minutes',
            'create minutes',
            'edit minutes',
            'publish minutes',
            
            // Agreements
            'view agreements',
            'update agreements',
            
            // Master Data
            'manage departments',
            'manage meeting types',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions

        // Admin: Everything
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $adminRole->syncPermissions(Permission::all());

        // Manager: Meetings and Minutes
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);
        $managerRole->syncPermissions([
            'view meetings',
            'create meetings',
            'edit meetings',
            'cancel meetings',
            'view minutes',
            'create minutes',
            'edit minutes',
            'publish minutes',
            'view agreements',
            'update agreements',
        ]);

        // User: Basic view and update
        $userRole = Role::firstOrCreate(['name' => 'User']);
        $userRole->syncPermissions([
            'view meetings',
            'view minutes',
            'view agreements',
            'update agreements',
        ]);
    }
}
