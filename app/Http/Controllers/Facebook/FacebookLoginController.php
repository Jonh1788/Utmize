<?php

namespace App\Http\Controllers\Facebook;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Services\FacebookService;
use App\Models\User;
use App\Models\Sale;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Services\PerfectPayService;
use Illuminate\Support\Facades\Cache;

class FacebookLoginController extends Controller
{
    public function store(Request $request) {
        $dados = $request->json()->all();

        if ($dados['data']['status'] == 'connected') {
            $authResponse = $dados['data']['authResponse'];
            $getLongToken = FacebookService::getLongToken($authResponse['accessToken']);

            $userJson = $request->user;
            $user = User::find($userJson['id']);
            $longToken = $getLongToken['access_token'];
            $user->fb_access_token = $longToken;
            $user->save();

            $profileInfo = FacebookService::getProfileInfo($longToken);

            return response()->json([
                "token" => $longToken,
                "user" => $user,
                "profile" => $profileInfo
            ]);
        }

        return response()->json(["error" => "Não foi possível obter o token de acesso."], 400);
    }

    public function dashboard(Request $request)
    {
        $user = $request->user();
        $accessToken = $user->fb_access_token;
    

        $revenue = 0;
        $roas = 0;
        $marketing = 0;
        $profit = 0;
        $profitMargin = 0;
        $roi = 0;
        $arpu = 0;
        $refund = 0;
        $approvedPurchases = 0;
        $pendingPurchases = 0;
        $cancelledPurchases = 0;
        $expiredPurchases = 0;
        $pixCount = 0;
        $cartaoCount = 0;
        $boletoCount = 0;
        $cpa = 0;
        $avgTicket = 0;
        $taxes = 0;
        $chartData = [];
        $productRanking = [];
    
        $error = '';
    
        // Atualizar dados da Perfect Pay antes de processar o dashboard
        $integration = $user->integrations()->where('provider', 'perfectpay')->first();
    
        if ($integration) {
            try {
                // Atualizar as vendas da Perfect Pay
                $perfectPayService = new PerfectPayService($user->id);
                $perfectPayService->getLatestSales();
            } catch (\Exception $e) {
                \Log::error('Erro ao atualizar vendas da Perfect Pay: ' . $e->getMessage());
                $error = 'Erro ao atualizar dados da Perfect Pay.';
            }
        } else {
            $error = 'Integração com Perfect Pay não configurada.';
        }
    
        if ($accessToken) {
            try {
                // Obter dados de investimento em anúncios do Facebook
                $adSpendData = FacebookService::getAdSpendData($accessToken);
    
                // Obter dados de vendas do usuário
                $salesData = Sale::where('user_id', $user->id)
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->get();
    
                // Calcular métricas de vendas
                $totalRevenue = $salesData->where('status', 'approved')->sum('amount');
                $approvedPurchases = $salesData->where('status', 'approved')->count();
                $pendingPurchases = $salesData->where('status', 'pending')->count();
                $totalTaxes = $salesData->sum('taxes');
                $refunds = $salesData->where('status', 'refunded')->sum('amount');
                $totalSales = $salesData->count();
                $expiredPurchases = $salesData->where('status', 'expired')->count();
                $cancelledPurchases = $salesData->where('status', 'cancelled')->count();
                $pixCount = $salesData->where('payment_type', 'Pix')->count();
                $cartaoCount = $salesData->where('payment_type', 'Cartão de crédito')->count();
                $boletoCount = $salesData->where('payment_type', 'Boleto')->count();

                // Calcular receita diária
                $dailyRevenue = $salesData->groupBy(function($item) {
                    return $item->created_at->format('Y-m-d');
                })->map(function($group) {
                    return $group->where('status', 'approved')->sum('amount');
                })->toArray();
    
                // Obter gasto diário com anúncios
                $dailySpend = $adSpendData['dailySpend'];
    
                // Construir dados para o gráfico
                $dates = array_unique(array_merge(array_keys($dailyRevenue), array_keys($dailySpend)));
                sort($dates);
    
                foreach ($dates as $date) {
                    $revenueDay = isset($dailyRevenue[$date]) ? $dailyRevenue[$date] : 0;
                    $spendDay = isset($dailySpend[$date]) ? $dailySpend[$date] : 0;
                    $profitDay = $revenueDay - $spendDay;
    
                    $chartData[] = [
                        'date' => $date,
                        'profit' => $profitDay,
                    ];
                }
    
                // Calcular métricas financeiras
                $revenue = $totalRevenue;
                $marketing = $adSpendData['totalSpend'];
                $profit = $revenue - $marketing - $totalTaxes;
                $roas = ($marketing > 0) ? $revenue / $marketing : 0;
                $profitMargin = ($revenue > 0) ? ($profit / $revenue) * 100 : 0;
                $roi = ($marketing > 0) ? ($profit / $marketing) * 100 : 0;
                $arpu = ($totalSales > 0) ? $revenue / $totalSales : 0;
                $refund = ($revenue > 0) ? ($refunds / $revenue) * 100 : 0;
                $cpa = ($approvedPurchases > 0) ? $marketing / $approvedPurchases : 0;
                $avgTicket = ($approvedPurchases > 0) ? $revenue / $approvedPurchases : 0;
                $taxes = $totalTaxes;
    
                // Ranking de Produtos
                $productRanking = Sale::where('user_id', $user->id)
                    ->whereDate('created_at', '>=', now()->subDays(30))
                    ->where('status', 'approved')
                    ->select('product_name', DB::raw('SUM(amount) as revenue'), DB::raw('COUNT(*) as sales'))
                    ->groupBy('product_name')
                    ->orderBy('revenue', 'desc')
                    ->get()
                    ->toArray();
    
            } catch (\Exception $e) {
                \Log::error('Erro ao obter dados: ' . $e->getMessage());
                $error = 'Erro ao obter dados do Facebook.';
            }
        } else {
            $error = 'Token de acesso do Facebook não disponível. Por favor, conecte sua conta do Facebook.';
        }
    
        // Passar os dados para a view
        return Inertia::render('Dashboard/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'revenue' => $revenue,
            'roas' => $roas,
            'marketing' => $marketing,
            'profit' => $profit,
            'profitMargin' => $profitMargin,
            'roi' => $roi,
            'arpu' => $arpu,
            'refund' => $refund,
            'approvedPurchases' => $approvedPurchases,
            'pendingPurchases' => $pendingPurchases,
            'cpa' => $cpa,
            'avgTicket' => $avgTicket,
            'taxes' => $taxes,
            'chartData' => $chartData,
            'productRanking' => $productRanking,
            'cancelledPurchases' => $cancelledPurchases,
            'expiredPurchases' => $expiredPurchases,
            'pixCount' => $pixCount,
            'cartaoCount' => $cartaoCount,
            'boletoCount' => $boletoCount,
            'error' => $error,
        ]);
    }

    public function getProfileInfo(Request $request) {
        $user = $request->user();
        $token = $user->fb_access_token;

        if ($token) {
            $profileInfo = FacebookService::getProfileInfo($token);

            if ($profileInfo) {
                return response()->json(['profile' => $profileInfo]);
            }
        }

        return response()->json(['profile' => null]);
    }

    public function campanhas(Request $request)
    {
        $user = $request->user();
        $campaignsData = FacebookService::getCampaignsData($user);

        // Passar os dados para a view
        return Inertia::render('Campanhas/Campanhas', [
            'auth' => [
                'user' => $user,
            ],
            'campaignsData' => $campaignsData,
        ]);
    }

    public function contas(Request $request)
    {
        $user = $request->user();
        $accessToken = $user->fb_access_token;
        
        try {

            $cacheKey = 'ad_accounts_user_' . $user->id;

            $adAccounts = Cache::remember($cacheKey, 600, function () use ($user, $accessToken) {
                return FacebookService::getAllDataAccount($accessToken);
            });
            
        } catch (\Exception $e) {
            \Log::error('Erro ao obter dados da conta de anúncios: ' . $e->getMessage());
        }

        // Passar os dados para a view
        return Inertia::render('Dashboard/Campanhas/Contas', [
            'auth' => [
                'user' => $user,
            ],
            'accountsData' => $adAccounts ?? [],
        ]);
    } 

    public function anuncios(Request $request)
    {
        $user = $request->user();
        $accessToken = $user->fb_access_token;
        
        try {

            $cacheKey = 'ads_user_' . $user->id;

            $adsData = Cache::remember($cacheKey, 600, function () use ($user, $accessToken) {
                return FacebookService::getAllDataAds($accessToken);
            });
            
        } catch (\Exception $e) {
            \Log::error('Erro ao obter dados da conta de anúncios: ' . $e->getMessage());
        }
        // Passar os dados para a view
        return Inertia::render('Dashboard/Campanhas/Anuncios', [
            'auth' => [
                'user' => $user,
            ],
            'adsData' => $adsData,
        ]);
    }

    public function conjuntos(Request $request)
    {
        $user = $request->user();
        $accessToken = $user->fb_access_token;
        
        try {

            $cacheKey = 'adset_user_' . $user->id;

            $adSetsData = Cache::remember($cacheKey, 600, function () use ($user, $accessToken) {
                return FacebookService::getAllDataAdset($accessToken);
            });
            
        } catch (\Exception $e) {
            \Log::error('Erro ao obter dados da conta de anúncios: ' . $e->getMessage());
        }

        // Passar os dados para a view
        return Inertia::render('Dashboard/Campanhas/Conjuntos', [
            'auth' => [
                'user' => $user,
            ],
            'adSetsData' => $adSetsData,
        ]);
    }

    public function campanhasList(Request $request)
    {
        $user = $request->user();
        $accessToken = $user->fb_access_token;
        
        try {

            $cacheKey = 'campaigns_user_' . $user->id;

            $campaignsData = Cache::remember($cacheKey, 600, function () use ($user, $accessToken) {
                return FacebookService::getAllDataCampaign($accessToken);
            });
            
        } catch (\Exception $e) {
            \Log::error('Erro ao obter dados da conta de anúncios: ' . $e->getMessage());
        }

        return Inertia::render('Dashboard/Campanhas/Sets', [
            'auth' => [
                'user' => $user,
            ],
            'campaignsData' => $campaignsData,
        ]);
    }

    public function refresh(Request $request)
{
    $user = $request->user();

    // Verificar se existe um token da Perfect Pay para o usuário
    $integration = $user->integrations()->where('provider', 'perfectpay')->first();

    if ($integration) {
        try {
            // Chamar o PerfectPayService para atualizar as vendas
            $perfectPayService = new PerfectPayService($user->id);
            $perfectPayService->getLatestSales();

            // Redirecionar de volta para o dashboard com sucesso
            return redirect()->route('dashboard')->with('success', 'Dados atualizados com sucesso.');
        } catch (\Exception $e) {
            // Em caso de erro, redirecionar com mensagem de erro
            return redirect()->route('dashboard')->with('error', 'Erro ao atualizar os dados: ' . $e->getMessage());
        }
    } else {
        // Se não houver integração, redirecionar com mensagem de erro
        return redirect()->route('dashboard')->with('error', 'Integração com Perfect Pay não configurada.');
    }
}
}