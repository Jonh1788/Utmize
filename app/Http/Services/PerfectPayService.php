<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
use App\Models\Sale;
use App\Models\Integration;

class PerfectPayService
{
    protected $accessToken;
    protected $userId;

    public function __construct($userId)
    {
        $this->userId = $userId;

        // Obter o token de acesso da Perfect Pay para o usuário
        $integration = Integration::where('user_id', $userId)->where('provider', 'perfectpay')->first();
        if ($integration) {
            $this->accessToken = $integration->access_token;
        } else {
            throw new \Exception('Token de acesso da Perfect Pay não encontrado.');
        }
    }

    public function getLatestSales($startDate = null, $endDate = null)
    {
        $page = 1;
        $totalPages = 1;

        if (!$startDate) {
            $startDate = now()->subDays(30)->format('Y-m-d');
        }
        if (!$endDate) {
            $endDate = now()->format('Y-m-d');
        }

        try {
            do {
                $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->accessToken,
                        'Content-Type' => 'application/json',
                    ])
                    ->post('https://app.perfectpay.com.br/api/v1/sales/get', [
                        'start_date_sale' => $startDate,
                        'end_date_sale' => $endDate,
                        'page'=> $page
                    ]);

                if ($response->successful()) {
                    $salesData = $response->json();

                    if (isset($salesData['sales']['data'])) {
                        foreach ($salesData['sales']['data'] as $saleData) {
                            $this->saveSale($saleData);
                            \Log::info("Página" . $page . " " . $saleData['transaction_token']);
                        }
                    } else {
                        \Log::warning('Estrutura de dados inesperada na resposta da Perfect Pay.', ['response' => $salesData]);
                    }

                    $totalPages = $salesData['sales']['total_pages'] ?? 1;
                    $page++;
                    
                } else {
                    \Log::error('Erro ao obter vendas da Perfect Pay.', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                        'response' => $response,
                        'start_date' => $startDate,
                    ]);
                    throw new \Exception('Erro ao obter vendas da Perfect Pay. Código de status: ' . $response->status());
                }
            } while ($page <= $totalPages);

        } catch (\Exception $e) {
            \Log::error('Exceção ao obter vendas da Perfect Pay: ' . $e->getMessage());
            throw $e;
        }
    }

    private function saveSale($saleData)
    {

        $sale = Sale::updateOrCreate(
            ['external_id' => $saleData['transaction_token']],
            [   'user_id' => $this->userId,
                'product_name' => $saleData['product_name'],
                'amount' => floatval($saleData['value']),
                'taxes' => 0,
                'status' => $saleData['sale_status'],
                'payment_type' => $this->mapPaymentType($saleData['payment_type']),
                'utm_source' => $saleData['metadata']['utm_source'] ?? null,
                'utm_medium' => $saleData['metadata']['utm_medium'] ?? null,
                'utm_campaign' => $saleData['metadata']['utm_campaign'] ?? null,
                'utm_term' => $saleData['metadata']['utm_term'] ?? null,
                'utm_content' => $saleData['metadata']['utm_content'] ?? null,
                'customer_name' => $saleData['customer'][0]['full_name'] ?? null,
                'customer_email' => $saleData['customer'][0]['email'] ?? null,
                'plan_name' => $saleData['plan'][0]['plan_name'] ?? null,
                'quantity' => $saleData['plan'][0]['quantity'] ?? 1,
                'created_at' => $saleData['date_created'],
            ]
        );


    }

    private function mapPaymentType($paymentTypeCode)
    {
        $paymentTypes = [
            1 => 'Cartão de crédito',
            2 => 'Boleto',
            3 => 'PayPal',
            5 => 'Gratuito',
            6 => 'Cartão de crédito - upsell',
            7 => 'Pix',
       
        ];

        return $paymentTypes[$paymentTypeCode] ?? 'Desconhecido';
    }

    public function handleWebhook($payload)
    {
        // Processar os dados recebidos do webhook e salvar na tabela 'sales'
        try {
            $saleData = $payload; // Ajuste conforme necessário
            $this->saveSale($saleData);
            \Log::info('Venda recebida via webhook.', ['external_id' => $saleData['transaction_token']]);
        } catch (\Exception $e) {
            \Log::error('Erro ao processar webhook da Perfect Pay: ' . $e->getMessage());
        }
    }
}