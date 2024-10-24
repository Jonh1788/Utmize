<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRulesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('product')->nullable();
            $table->string('ad_accounts')->nullable();
            $table->string('apply_to');
            $table->json('condition');
            $table->string('action');
            $table->string('period');
            $table->string('frequency');
            $table->json('fb_rule_ids')->nullable(); // ID da regra no Facebook Ads
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('rules');
    }
}