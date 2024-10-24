<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Facebook\Facebook;
use Illuminate\Support\Facades\Auth;

class GraphController extends Controller
{
    public function create(Request $request)
    {
        $user = Auth::user();
        $accessToken = $user->fb_access_token;

        if (!$accessToken) {
            // Redirecionar ou lidar com a ausência do access token
            return redirect()->route('facebook.login');
        }

        try {
            $fb = new Facebook([
                'app_id' => env('FACEBOOK_APP_ID'),
                'app_secret' => env('FACEBOOK_APP_SECRET'),
                'default_graph_version' => env('FACEBOOK_DEFAULT_GRAPH_VERSION', 'v17.0'),
            ]);

            // Obter as contas de anúncio do usuário
            $response = $fb->get('/me/adaccounts', $accessToken);
            $adAccounts = $response->getDecodedBody()['data'];

            // Inicializar variáveis para cálculos
            $totalSpend = 0;
            $totalRevenue = 0;
            $totalPurchases = 0;
            $chartData = [];
            $productRanking = [];

            foreach ($adAccounts as $account) {
                $accountId = $account['id'];

                // Definir o período (por exemplo, últimos 30 dias)
                $since = now()->subDays(30)->format('Y-m-d');
                $until = now()->format('Y-m-d');

                // Obter insights da conta
                $insightsResponse = $fb->get("/$accountId/insights?fields=spend,actions,action_values&time_range={'since':'$since','until':'$until'}", $accessToken);
                $insights = $insightsResponse->getDecodedBody()['data'];

                foreach ($insights as $insight) {
                    // Gastos com anúncios
                    $totalSpend += $insight['spend'];

                    // Obter o valor de conversão de compras (receita)
                    if (isset($insight['action_values'])) {
                        foreach ($insight['action_values'] as $actionValue) {
                            if ($actionValue['action_type'] === 'offsite_conversion.purchase') {
                                $totalRevenue += $actionValue['value'];
                            }
                        }
                    }

                    // Número de compras
                    if (isset($insight['actions'])) {
                        foreach ($insight['actions'] as $action) {
                            if ($action['action_type'] === 'offsite_conversion.purchase') {
                                $totalPurchases += $action['value'];
                            }
                        }
                    }

                    // Dados para o gráfico (exemplo simplificado)
                    $chartData[] = [
                        'date' => $insight['date_start'],
                        'profit' => $totalRevenue - $totalSpend,
                    ];
                }

                // Obter o ranking de produtos (exemplo simplificado)
                // Aqui, você precisaria de mais dados para identificar produtos
            }

            // Realizar cálculos adicionais
            $profit = $totalRevenue - $totalSpend;
            $roas = $totalSpend > 0 ? $totalRevenue / $totalSpend : 0;
            $profitMargin = $totalRevenue > 0 ? ($profit / $totalRevenue) * 100 : 0;
            $arpu = $totalPurchases > 0 ? $totalRevenue / $totalPurchases : 0;
            $cpa = $totalPurchases > 0 ? $totalSpend / $totalPurchases : 0;
            $avgTicket = $arpu; // Valor médio por usuário

            // Enviar os dados para a view
            return Inertia::render('Dashboard/Dashboard', [
                'auth' => [
                    'user' => $user,
                ],
                'revenue' => $totalRevenue,
                'roas' => number_format($roas, 2),
                'marketing' => $totalSpend,
                'profit' => $profit,
                'profitMargin' => number_format($profitMargin, 2),
                'roi' => number_format($profitMargin, 2), // Aqui, estou usando margem de lucro como ROI, ajuste conforme necessário
                'arpu' => $arpu,
                'refund' => 0, // Se tiver dados de reembolso, insira aqui
                'approvedPurchases' => $totalPurchases, // Ajuste conforme seus dados
                'pendingPurchases' => 0, // Se tiver dados de compras pendentes
                'cpa' => $cpa,
                'avgTicket' => $avgTicket,
                'taxes' => 0, // Se tiver dados de taxas e impostos
                'chartData' => $chartData,
                'productRanking' => $productRanking,
            ]);
        } catch (\Facebook\Exceptions\FacebookResponseException $e) {
            // Quando o Graph retorna um erro
            return back()->with('error', 'Erro no Graph: ' . $e->getMessage());
        } catch (\Facebook\Exceptions\FacebookSDKException $e) {
            // Quando há problemas de validação ou outros
            return back()->with('error', 'Erro no SDK do Facebook: ' . $e->getMessage());
        }
    }

    public function campanhas(Request $request)
{
    $user = Auth::user();
    $accessToken = $user->fb_access_token;

    if (!$accessToken) {
        // Redirecionar ou lidar com a ausência do access token
        return redirect()->route('facebook.login');
    }

    try {
        $fb = new Facebook([
            'app_id' => env('FACEBOOK_APP_ID'),
            'app_secret' => env('FACEBOOK_APP_SECRET'),
            'default_graph_version' => env('FACEBOOK_DEFAULT_GRAPH_VERSION', 'v17.0'),
        ]);

        // Obter as contas de anúncio do usuário
        $response = $fb->get('/me/adaccounts', $accessToken);
        $adAccounts = $response->getDecodedBody()['data'];

        $campaignsData = [];

        foreach ($adAccounts as $account) {
            $accountId = $account['id'];

            // Definir o período (por exemplo, últimos 30 dias)
            $since = now()->subDays(30)->format('Y-m-d');
            $until = now()->format('Y-m-d');

            // Obter as campanhas da conta com insights
            $campaignsResponse = $fb->get("/$accountId/campaigns?fields=id,name,status,effective_status,daily_budget,insights.time_range({'since':'$since','until':'$until'}){spend,actions,action_values}", $accessToken);
            $campaigns = $campaignsResponse->getDecodedBody()['data'];

            foreach ($campaigns as $campaign) {
                $spend = 0;
                $purchases = 0;
                $revenue = 0;

                if (isset($campaign['insights']['data'][0])) {
                    $insight = $campaign['insights']['data'][0];
                    $spend = $insight['spend'];

                    // Obter o valor de conversão de compras (receita)
                    if (isset($insight['action_values'])) {
                        foreach ($insight['action_values'] as $actionValue) {
                            if ($actionValue['action_type'] === 'offsite_conversion.purchase') {
                                $revenue += $actionValue['value'];
                            }
                        }
                    }

                    // Número de compras
                    if (isset($insight['actions'])) {
                        foreach ($insight['actions'] as $action) {
                            if ($action['action_type'] === 'offsite_conversion.purchase') {
                                $purchases += $action['value'];
                            }
                        }
                    }
                }

                // Calcular métricas
                $roas = $spend > 0 ? $revenue / $spend : 0;
                $profit = $revenue - $spend;
                $profitMargin = $revenue > 0 ? ($profit / $revenue) * 100 : 0;
                $cpa = $purchases > 0 ? $spend / $purchases : 0;

                $campaignsData[] = [
                    'id' => $campaign['id'],
                    'name' => $campaign['name'],
                    'status' => $campaign['effective_status'],
                    'daily_budget' => isset($campaign['daily_budget']) ? $campaign['daily_budget'] / 100 : 0,
                    'spend' => $spend,
                    'revenue' => $revenue,
                    'purchases' => $purchases,
                    'roas' => number_format($roas, 2),
                    'profit' => $profit,
                    'profitMargin' => number_format($profitMargin, 2),
                    'cpa' => $cpa,
                ];
            }
        }

        return Inertia::render('Campanhas/Campanhas', [
            'auth' => [
                'user' => $user,
            ],
            'campaignsData' => $campaignsData,
        ]);
    } catch (\Facebook\Exceptions\FacebookResponseException $e) {
        return back()->with('error', 'Erro no Graph: ' . $e->getMessage());
    } catch (\Facebook\Exceptions\FacebookSDKException $e) {
        return back()->with('error', 'Erro no SDK do Facebook: ' . $e->getMessage());
    }
}
}