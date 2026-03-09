<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Meeting;
use App\Models\MeetingType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Roles & Permissions
        $this->call(RolesAndPermissionsSeeder::class);

        $adminRole = Role::where('name', 'Admin')->first();
        $userRole = Role::where('name', 'User')->first();

        // 2. Departments
        $dep1 = Department::firstOrCreate(
            ['name' => 'Gerencia General'],
            ['description' => 'Dirección estratégica de la organización.']
        );
        $dep2 = Department::firstOrCreate(
            ['name' => 'Operaciones'],
            ['description' => 'Ejecución operativa y seguimiento diario.']
        );
        $dep3 = Department::firstOrCreate(
            ['name' => 'Tecnología'],
            ['description' => 'Gestión tecnológica y sistemas.']
        );
        $dep4 = Department::firstOrCreate(
            ['name' => 'Recursos Humanos'],
            ['description' => 'Gestión de personas y talento.']
        );

        // 3. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@korum.cl'],
            [
                'name' => 'Administrador Korum',
                'password' => Hash::make('password'),
                'department_id' => $dep1->id,
            ]
        );
        $admin->syncRoles([$adminRole]);

        $user1 = User::firstOrCreate(
            ['email' => 'juan.perez@korum.cl'],
            [
                'name' => 'Juan Pérez',
                'password' => Hash::make('password'),
                'department_id' => $dep2->id,
            ]
        );
        $user1->syncRoles([$userRole]);

        $user2 = User::firstOrCreate(
            ['email' => 'maria.gonzalez@korum.cl'],
            [
                'name' => 'María González',
                'password' => Hash::make('password'),
                'department_id' => $dep3->id,
            ]
        );
        $user2->syncRoles([$userRole]);

        // 4. Meeting Types
        $type1 = MeetingType::firstOrCreate(
            ['name' => 'Comité Ejecutivo'],
            ['description' => 'Revisión estratégica con jefaturas.', 'color' => 'primary']
        );
        $type2 = MeetingType::firstOrCreate(
            ['name' => 'Planificación Semanal'],
            ['description' => 'Coordinación semanal de actividades.', 'color' => 'info']
        );
        $type3 = MeetingType::firstOrCreate(
            ['name' => 'Revisión de Proyectos'],
            ['description' => 'Seguimiento de iniciativas y entregables.', 'color' => 'success']
        );

        // 5. Sample Meeting (Programada)
        $meeting1 = Meeting::updateOrCreate(['code' => 'MTG-2024-001'], [
            'subject' => 'Revisión de Estrategia Trimestral Q2',
            'description' => "Analizar los resultados del primer trimestre y proyectar metas para Q2.\n\nPuntos clave:\n- Resultados financieros\n- Nuevos proyectos TI\n- Expansión de equipo",
            'date' => now()->addDays(2)->format('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'mode' => 'hibrida',
            'location_link' => 'Sala de Directorio / https://zoom.us/j/12345678',
            'status' => 'programada',
            'organizer_id' => $admin->id,
            'department_id' => $dep1->id,
            'meeting_type_id' => $type1->id,
        ]);

        $meeting1->agendaItems()->delete();
        $meeting1->agendaItems()->createMany([
            ['title' => 'Bienvenida y aprobación acta anterior', 'estimated_time_min' => 10, 'speaker_id' => $admin->id],
            ['title' => 'Resultados Financieros Q1', 'estimated_time_min' => 30, 'speaker_id' => $user1->id],
            ['title' => 'Plan de expansión TI', 'estimated_time_min' => 20, 'speaker_id' => $user2->id],
        ]);

        $meeting1->participants()->delete();
        $meeting1->participants()->createMany([
            ['user_id' => $admin->id, 'role_in_meeting' => 'Presidente', 'attendance_status' => 'presente'],
            ['user_id' => $user1->id, 'role_in_meeting' => 'Expositor Finanzas'],
            ['user_id' => $user2->id, 'role_in_meeting' => 'Líder TI'],
            ['external_name' => 'Consultor Externo', 'role_in_meeting' => 'Invitado Especial'],
        ]);

        // 6. Sample Meeting (Realizada con Minuta y Acuerdos)
        $meeting2 = Meeting::updateOrCreate(['code' => 'MTG-2024-002'], [
            'subject' => 'Planificación de Lanzamiento Korum',
            'description' => 'Definir fechas críticas para el lanzamiento del sistema internamente.',
            'date' => now()->subDays(3)->format('Y-m-d'),
            'start_time' => '15:00:00',
            'end_time' => '16:00:00',
            'mode' => 'virtual',
            'location_link' => 'https://meet.google.com/abc-defg-hij',
            'status' => 'realizada',
            'organizer_id' => $admin->id,
            'department_id' => $dep3->id,
            'meeting_type_id' => $type2->id,
        ]);

        $meeting2->participants()->delete();
        $meeting2->participants()->createMany([
            ['user_id' => $admin->id, 'role_in_meeting' => 'Moderador', 'attendance_status' => 'presente'],
            ['user_id' => $user2->id, 'role_in_meeting' => 'Actuario', 'attendance_status' => 'presente'],
        ]);

        $minute = $meeting2->minute()->updateOrCreate(['meeting_id' => $meeting2->id], [
            'summary' => "Se revisó el cronograma de despliegue.\nTI confirma que los servidores están listos.\nRRHH solicita una capacitación previa para jefaturas.",
            'general_observations' => 'Hubo buena disposición de todas las áreas.',
            'published_by' => $admin->id,
            'published_at' => now()->subDays(3),
            'status' => 'published',
        ]);

        $minute->decisions()->delete();
        $minute->topics()->delete();
        $minute->agreements()->delete();

        $minute->decisions()->create(['description' => 'Se aprueba el lanzamiento para el día 15 del próximo mes.']);
        $minute->topics()->create([
            'title' => 'Estado del Cronograma',
            'detail' => 'Se revisaron hitos críticos de despliegue y dependencia con áreas de soporte.',
            'conclusions' => 'Se mantiene fecha de lanzamiento con plan de contingencia.',
            'order' => 0,
        ]);

        $agreement = $minute->agreements()->create([
            'subject' => 'Preparar manual de usuario para jefaturas',
            'responsible_id' => $user2->id,
            'commitment_date' => now()->addDays(5)->format('Y-m-d'),
            'department_id' => $dep3->id,
            'status' => 'en proceso',
        ]);
        $agreement->responsibles()->sync([$user2->id, $admin->id]);

        $agreement->updates()->create([
            'created_by' => $user2->id,
            'comment' => 'Se ha completado el primer borrador del manual.',
            'status_changed_to' => 'en proceso',
            'progress_percentage' => 50,
        ]);

        $agreement2 = $minute->agreements()->create([
            'subject' => 'Enviar correo masivo de convocatoria a capacitación',
            'responsible_id' => $user1->id,
            'commitment_date' => now()->addDays(2)->format('Y-m-d'),
            'department_id' => $dep2->id,
            'status' => 'pendiente',
        ]);
        $agreement2->responsibles()->sync([$user1->id]);

        $meeting2->update(['status' => 'realizada']);
    }
}
