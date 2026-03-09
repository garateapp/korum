<?php

$migrations = glob('database/migrations/*.php');
$schemas = [
    'departments_table.php' => "
    public function up(): void
    {
        Schema::create('departments', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->string('description')->nullable();
            \$table->timestamps();
        });
    }",
    'meeting_types_table.php' => "
    public function up(): void
    {
        Schema::create('meeting_types', function (Blueprint \$table) {
            \$table->id();
            \$table->string('name');
            \$table->string('color')->nullable();
            \$table->timestamps();
        });
    }",
    'meetings_table.php' => "
    public function up(): void
    {
        Schema::create('meetings', function (Blueprint \$table) {
            \$table->id();
            \$table->string('code')->unique();
            \$table->string('subject');
            \$table->text('description')->nullable();
            \$table->date('date');
            \$table->time('start_time');
            \$table->time('end_time');
            \$table->enum('mode', ['presencial', 'virtual', 'hibrida']);
            \$table->string('location_link')->nullable();
            \$table->foreignId('organizer_id')->constrained('users');
            \$table->foreignId('department_id')->constrained('departments');
            \$table->foreignId('meeting_type_id')->nullable()->constrained('meeting_types');
            \$table->enum('status', ['programada', 'realizada', 'cancelada', 'cerrada'])->default('programada');
            \$table->timestamps();
        });
    }",
    'meeting_participants_table.php' => "
    public function up(): void
    {
        Schema::create('meeting_participants', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('meeting_id')->constrained('meetings')->cascadeOnDelete();
            \$table->foreignId('user_id')->nullable()->constrained('users');
            \$table->string('external_name')->nullable();
            \$table->string('external_email')->nullable();
            \$table->string('role_in_meeting')->nullable();
            \$table->enum('attendance_status', ['presente', 'ausente', 'excusado'])->nullable();
            \$table->text('observation')->nullable();
            \$table->timestamps();
        });
    }",
    'meeting_agenda_items_table.php' => "
    public function up(): void
    {
        Schema::create('meeting_agenda_items', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('meeting_id')->constrained('meetings')->cascadeOnDelete();
            \$table->string('title');
            \$table->text('description')->nullable();
            \$table->foreignId('speaker_id')->nullable()->constrained('users');
            \$table->integer('order')->default(0);
            \$table->integer('estimated_time_min')->nullable();
            \$table->boolean('was_treated')->default(false);
            \$table->timestamps();
        });
    }",
    'meeting_minutes_table.php' => "
    public function up(): void
    {
        Schema::create('meeting_minutes', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('meeting_id')->constrained('meetings')->cascadeOnDelete();
            \$table->integer('version')->default(1);
            \$table->enum('status', ['draft', 'published'])->default('draft');
            \$table->text('summary')->nullable();
            \$table->text('general_observations')->nullable();
            \$table->foreignId('published_by')->nullable()->constrained('users');
            \$table->timestamp('published_at')->nullable();
            \$table->timestamps();
        });
    }",
    'minute_decisions_table.php' => "
    public function up(): void
    {
        Schema::create('minute_decisions', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('minute_id')->constrained('meeting_minutes')->cascadeOnDelete();
            \$table->text('description');
            \$table->string('taken_by')->nullable();
            \$table->date('decision_date')->nullable();
            \$table->timestamps();
        });
    }",
    'minute_agreements_table.php' => "
    public function up(): void
    {
        Schema::create('minute_agreements', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('minute_id')->constrained('meeting_minutes')->cascadeOnDelete();
            \$table->text('description');
            \$table->foreignId('responsible_id')->constrained('users');
            \$table->foreignId('department_id')->nullable()->constrained('departments');
            \$table->enum('priority', ['baja', 'media', 'alta'])->default('media');
            \$table->date('due_date');
            \$table->enum('status', ['pendiente', 'en proceso', 'bloqueado', 'cumplido', 'vencido', 'cancelado'])->default('pendiente');
            \$table->integer('progress_percentage')->default(0);
            \$table->boolean('requires_evidence')->default(false);
            \$table->foreignId('closed_by')->nullable()->constrained('users');
            \$table->timestamp('closed_at')->nullable();
            \$table->timestamps();
        });
    }",
    'agreement_updates_table.php' => "
    public function up(): void
    {
        Schema::create('agreement_updates', function (Blueprint \$table) {
            \$table->id();
            \$table->foreignId('agreement_id')->constrained('minute_agreements')->cascadeOnDelete();
            \$table->text('comment')->nullable();
            \$table->integer('progress_percentage')->default(0);
            \$table->string('status_changed_to')->nullable();
            \$table->foreignId('created_by')->constrained('users');
            \$table->timestamps();
        });
    }",
    'attachments_table.php' => "
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint \$table) {
            \$table->id();
            \$table->morphs('attachable');
            \$table->string('file_name');
            \$table->string('file_path');
            \$table->string('extension')->nullable();
            \$table->integer('size_kb')->nullable();
            \$table->foreignId('uploaded_by')->constrained('users');
            \$table->timestamps();
        });
    }",
    'add_department_id_to_users_table.php' => "
    public function up(): void
    {
        Schema::table('users', function (Blueprint \$table) {
            if (!Schema::hasColumn('users', 'department_id')) {
                \$table->foreignId('department_id')->nullable()->after('id')->constrained('departments')->nullOnDelete();
            }
            if (!Schema::hasColumn('users', 'status')) {
                \$table->string('status')->default('active')->after('password');
            }
        });
    }",
];

foreach ($migrations as $file) {
    foreach ($schemas as $key => $schemaCode) {
        if (strpos($file, $key) !== false) {
            $content = file_get_contents($file);
            $content = preg_replace('/public function up\(\):\s*void\s*\{.*?\n    \}/s', trim($schemaCode), $content);
            file_put_contents($file, $content);
            echo "Updated \$file\n";
        }
    }
}
echo "Done replacing schemas.\n";

