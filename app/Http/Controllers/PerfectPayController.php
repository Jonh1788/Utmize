<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PerfectPayService;
use App\Models\Integration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PerfectPayController extends Controller
{
    public function showIntegrationForm()
    {
        $user = Auth::user();
    
        $integrationExists = $user->integrations()->where('provider', 'perfectpay')->exists();
    
        return Inertia::render('Integrations/PerfectPayIntegration', [
            'auth' => [
                'user' => $user,
            ],
            'integrationExists' => $integrationExists,
        ]);
    }

    public function saveIntegration(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        $user = Auth::user();

        Integration::updateOrCreate(
            [
                'user_id' => $user->id,
                'provider' => 'perfectpay',
            ],
            [
                'access_token' => $request->access_token,
            ]
        );

        return redirect()->route('dashboard')->with('success', 'Integração com Perfect Pay configurada com sucesso.');
    }

    public function getLatestSales()
    {
        $user = Auth::user();

        try {
            $perfectPayService = new PerfectPayService($user->id);
            $perfectPayService->getLatestSales();

            return redirect()->back()->with('success', 'Vendas atualizadas com sucesso.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erro ao obter as vendas: ' . $e->getMessage());
        }
    }

    public function handleWebhook(Request $request, $userId)
{
    // Validar a origem do webhook, se necessário

    $payload = $request->all();

    $perfectPayService = new PerfectPayService($userId);

    $perfectPayService->handleWebhook($payload);

    return response()->json(['message' => 'Webhook recebido com sucesso.']);
}

    private function getUserIdFromWebhook($payload)
    {
        // Implementar lógica para obter o user_id a partir do payload do webhook
        // Pode ser necessário mapear o produto ou outras informações
        // Exemplo:
        // $userId = $this->mapProductToUser($payload['product_id']);
        // return $userId;
    }
}