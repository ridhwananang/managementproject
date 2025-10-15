<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
             $table->morphs('subject'); // subject_type (string) + subject_id (unsignedBigInteger)

            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // actor (Auth::user())
            $table->enum('action', ['created', 'updated', 'deleted'])->index();

            $table->text('description'); // human readable text (format C)
            $table->json('changes')->nullable(); // { old: {...}, new: {...} }

            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();

            $table->index('created_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
