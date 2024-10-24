<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIntegrationsTable extends Migration
{
    public function up()
    {
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID do usuário
            $table->string('provider'); // Nome do provedor (e.g., 'perfectpay')
            $table->string('access_token'); // Token de acesso
            $table->timestamps();

            // Chave estrangeira
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('integrations');
    }
}