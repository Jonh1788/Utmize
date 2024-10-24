<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToRulesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('rules', function (Blueprint $table) {
            $table->string('status')->default('ACTIVE'); // Ou 'PAUSED', dependendo do estado inicial desejado
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('rules', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
}