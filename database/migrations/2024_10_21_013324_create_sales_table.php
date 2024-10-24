<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalesTable extends Migration
{
    public function up()
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID do usuário que fez a venda
            $table->string('product_name'); // Nome do produto
            $table->decimal('amount', 10, 2); // Valor da venda
            $table->decimal('taxes', 10, 2)->default(0); // Impostos
            $table->string('status'); // Status da venda (approved, pending, refunded)
            $table->string('payment_type')->nullable(); // Tipo de pagamento
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('external_id')->unique()->nullable(); // Identificador externo
            $table->timestamps();

            // Chave estrangeira para a tabela de usuários
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sales');
    }
}