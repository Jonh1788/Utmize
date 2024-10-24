<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
use FacebookAds\Api;
use FacebookAds\Object\AdAccount;
use FacebookAds\Object\AdRule;
use FacebookAds\Object\Fields\AdRuleFields;
use FacebookAds\Object\AdRuleTrigger;
use FacebookAds\Object\AdRuleSchedule;
use FacebookAds\Object\AdRuleAction;
use FacebookAds\Object\Business;
use App\Models\Sale;

class FacebookService {

    public static function getLongToken($accessToken){
        $metaId = env("META_APP_ID");
        $metaSecret = env("META_SECRET_KEY");

        $link = "https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${metaId}&client_secret=${metaSecret}&fb_exchange_token=${accessToken}";

        $response = Http::get($link);

        return $response->json();
    }

    public static function getAdaccounts($accessToken){
        $link = "https://graph.facebook.com/v20.0/me?fields=adaccounts&access_token=${accessToken}";

        $response = Http::get($link);

        return $response->json();
    }

    public static function getCampaignInsights($adAccountId, $accessToken, $since, $until)
    {
        $link = "https://graph.facebook.com/v20.0/{$adAccountId}/insights?fields=spend,impressions,clicks,actions,action_values,roas&time_range={'since':'{$since}','until':'{$until}'}&access_token={$accessToken}";

        $response = Http::get($link);

        return $response->json();
    }

    public static function dashboard($user)
    {
        $accessToken = $user->fb_access_token;

        // Tenta buscar as ad accounts
        $adAccountsData = self::getAdaccounts($accessToken);
        $adAccounts = $adAccountsData['adaccounts']['data'] ?? [];

        // Inicializando variáveis com valores padrões
        $totalSpend = 0;
        $totalRevenue = 0;
        $totalPurchases = 0;
        $chartData = [];
        $productRanking = [];

        $since = now()->subDays(30)->format('Y-m-d');
        $until = now()->format('Y-m-d');

        if (!empty($adAccounts)) {
            foreach ($adAccounts as $account) {
                $adAccountId = $account['id'];

                // Busca as métricas da conta
                $insightsData = self::getCampaignInsights($adAccountId, $accessToken, $since, $until);

                if (isset($insightsData['data'])) {
                    foreach ($insightsData['data'] as $insight) {
                        // Gastos com anúncios
                        $spend = $insight['spend'] ?? 0;
                        $totalSpend += $spend;

                        // Receitas
                        if (isset($insight['action_values'])) {
                            foreach ($insight['action_values'] as $actionValue) {
                                if ($actionValue['action_type'] === 'offsite_conversion.purchase') {
                                    $revenue = $actionValue['value'];
                                    $totalRevenue += $revenue;
                                }
                            }
                        }

                        // Número de compras
                        if (isset($insight['actions'])) {
                            foreach ($insight['actions'] as $action) {
                                if ($action['action_type'] === 'offsite_conversion.purchase') {
                                    $purchases = $action['value'];
                                    $totalPurchases += $purchases;
                                }
                            }
                        }

                        // Dados para o gráfico
                        $chartData[] = [
                            'date' => $insight['date_start'],
                            'profit' => $totalRevenue - $totalSpend,
                        ];

                        // Aqui você pode preencher o productRanking se tiver dados de produtos
                    }
                }
            }

            // Realizar cálculos adicionais
            $profit = $totalRevenue - $totalSpend;
            $roas = $totalSpend > 0 ? $totalRevenue / $totalSpend : 0;
            $profitMargin = $totalRevenue > 0 ? ($profit / $totalRevenue) * 100 : 0;
            $arpu = $totalPurchases > 0 ? $totalRevenue / $totalPurchases : 0;
            $cpa = $totalPurchases > 0 ? $totalSpend / $totalPurchases : 0;
            $avgTicket = $arpu;

            $data = [
                'revenue' => $totalRevenue,
                'roas' => number_format($roas, 2),
                'marketing' => $totalSpend,
                'profit' => $profit,
                'profitMargin' => number_format($profitMargin, 2),
                'roi' => number_format($profitMargin, 2), // Ajuste conforme necessário
                'arpu' => $arpu,
                'refund' => 0, // Se tiver dados de reembolso
                'approvedPurchases' => $totalPurchases,
                'pendingPurchases' => 0, // Se tiver dados de compras pendentes
                'cpa' => $cpa,
                'avgTicket' => $avgTicket,
                'taxes' => 0, // Se tiver dados de taxas e impostos
                'chartData' => $chartData,
                'productRanking' => $productRanking,
            ];

            return $data;
        }

        // Caso não haja ad account, retornar dados zerados
        $data = [
            'error' => 'Nenhuma conta de anúncio foi encontrada para o seu perfil.',
            'revenue' => 0,
            'roas' => 0,
            'marketing' => 0,
            'profit' => 0,
            'profitMargin' => 0,
            'roi' => 0,
            'arpu' => 0,
            'refund' => 0,
            'approvedPurchases' => 0,
            'pendingPurchases' => 0,
            'cpa' => 0,
            'avgTicket' => 0,
            'taxes' => 0,
            'chartData' => [],
            'productRanking' => [],
        ];

        return $data;
    }

    public static function getProfileInfo($accessToken){
        $link = "https://graph.facebook.com/v20.0/me?fields=name,picture&access_token=${accessToken}";

        $response  = Http::get($link);

        if($response->successful()){
            return $response->json();
        }

        return null;
    }

    public static function getCampaignsData($user)
    {
        $accessToken = $user->fb_access_token;

        // Tenta buscar as ad accounts
        $adAccountsData = self::getAdaccounts($accessToken);
        $adAccounts = $adAccountsData['adaccounts']['data'] ?? [];

        $campaignsData = [];

        $since = now()->subDays(30)->format('Y-m-d');
        $until = now()->format('Y-m-d');

        if (!empty($adAccounts)) {
            foreach ($adAccounts as $account) {
                $adAccountId = $account['id'];

                // Obter campanhas
                $link = "https://graph.facebook.com/v20.0/{$adAccountId}/campaigns?fields=id,name,status,effective_status,daily_budget,insights.time_range({'since':'{$since}','until':'{$until}'}){spend,actions,action_values}&access_token={$accessToken}";

                $response = Http::get($link);
                $campaigns = $response->json()['data'] ?? [];

                foreach ($campaigns as $campaign) {
                    $spend = 0;
                    $purchases = 0;
                    $revenue = 0;

                    if (isset($campaign['insights']['data'][0])) {
                        $insight = $campaign['insights']['data'][0];
                        $spend = $insight['spend'] ?? 0;

                        if (isset($insight['action_values'])) {
                            foreach ($insight['action_values'] as $actionValue) {
                                if ($actionValue['action_type'] === 'offsite_conversion.purchase') {
                                    $revenue += $actionValue['value'];
                                }
                            }
                        }

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
                        'purchases' => $purchases,
                        'cpa' => $cpa,
                        'spend' => $spend,
                        'revenue' => $revenue,
                        'profit' => $profit,
                        'roas' => number_format($roas, 2),
                        'profitMargin' => number_format($profitMargin, 2),
                    ];
                }
            }
        }

        return $campaignsData;
    }

    public static function getAdsData($user)
    {
        $accessToken = $user->fb_access_token;
        $adAccountsData = self::getAdaccounts($accessToken);
        $adAccounts = $adAccountsData['adaccounts']['data'] ?? [];

        $adsData = [];

        if (!empty($adAccounts)) {
            foreach ($adAccounts as $account) {
                $adAccountId = $account['id'];

                $link = "https://graph.facebook.com/v20.0/{$adAccountId}/ads?fields=id,name,insights{impressions,clicks,spend,actions,action_values}&access_token={$accessToken}";

                $response = Http::get($link);
                $ads = $response->json()['data'] ?? [];

                foreach ($ads as $ad) {
                    $insights = $ad['insights']['data'][0] ?? [];
                    $adsData[] = [
                        'id' => $ad['id'],
                        'name' => $ad['name'],
                        'impressions' => $insights['impressions'] ?? 0,
                        'clicks' => $insights['clicks'] ?? 0,
                        'spend' => $insights['spend'] ?? 0,
                        // Adicione outros campos conforme necessário
                    ];
                }
            }
        }

        return $adsData;
    }

    public static function getAdSetsData($user)
    {
        $accessToken = $user->fb_access_token;
        $adAccountsData = self::getAdaccounts($accessToken);
        $adAccounts = $adAccountsData['adaccounts']['data'] ?? [];

        $adSetsData = [];

        if (!empty($adAccounts)) {
            foreach ($adAccounts as $account) {
                $adAccountId = $account['id'];

                $link = "https://graph.facebook.com/v20.0/{$adAccountId}/adsets?fields=id,name,insights{impressions,clicks,spend,actions,action_values}&access_token={$accessToken}";

                $response = Http::get($link);
                $adSets = $response->json()['data'] ?? [];

                foreach ($adSets as $adSet) {
                    $insights = $adSet['insights']['data'][0] ?? [];
                    $adSetsData[] = [
                        'id' => $adSet['id'],
                        'name' => $adSet['name'],
                        'impressions' => $insights['impressions'] ?? 0,
                        'clicks' => $insights['clicks'] ?? 0,
                        'spend' => $insights['spend'] ?? 0,
                        // Adicione outros campos conforme necessário
                    ];
                }
            }
        }

        return $adSetsData;
    }

    public static function createAdRule($user, $ruleData)
    {
        // Inicializar o SDK do Facebook Ads
        $accessToken = $user->fb_access_token;
        $appId = env('META_APP_ID');
        $appSecret = env('META_SECRET_KEY');

        Api::init($appId, $appSecret, $accessToken);

        // Determinar quais contas de anúncio aplicar a regra
        if ($ruleData['ad_accounts'] === 'All' || $ruleData['ad_accounts'] === 'Todas') {
            // Buscar todas as contas de anúncio
            $adAccountsData = self::getAdaccounts($accessToken);
            $adAccounts = $adAccountsData['adaccounts']['data'] ?? [];
        } else {
            // Usar a conta de anúncio selecionada
            $adAccounts = [
                ['id' => $ruleData['ad_accounts']]
            ];
        }

        // Para cada conta de anúncio, criar a regra
        $fbRuleIds = []; // Para armazenar todos os IDs das Regras do Facebook
        foreach ($adAccounts as $account) {
            $adAccountId = $account['id'];

            // Construir as condições (triggers)
            $conditions = [];

            foreach ($ruleData['condition'] as $condition) {
                $operator = $condition['rule_m'];
                $field = $condition['rule_on'];
                $value = $condition['rule_value'];

                // Mapear os campos e operadores para os valores esperados pela API
                $fieldMap = [
                    'Gasto' => 'spend',
                    'CPA' => 'cost_per_action_type:offsite_conversion.purchase',
                    'ROAS' => 'return_on_ad_spend',
                    'Lucro' => 'profit',
                    'Margem de Lucro' => 'profit_margin',
                    'Orçamento' => 'campaign.lifetime_budget',
                    'CPI' => 'cpi',
                    'Vendas' => 'actions:offsite_conversion.purchase',
                    'ICs' => 'impressions',
                    'CTR' => 'ctr',
                    'CPM' => 'cpm',
                    'Cliques' => 'clicks',
                    // Adicione outros mapeamentos conforme necessário
                ];

                $operatorMap = [
                    '>' => 'GREATER_THAN',
                    '<' => 'LESS_THAN',
                    // Adicione outros operadores se necessário
                ];

                $conditionItem = [
                    'field' => $fieldMap[$field] ?? $field,
                    'operator' => $operatorMap[$operator] ?? $operator,
                    'value' => floatval($value),
                ];

                $conditions[] = $conditionItem;
            }

            // Construir a ação
            $action = [
                'action_type' => null,
            ];

            if (strpos($ruleData['action'], 'Aumentar orçamento em') !== false) {
                $action['action_type'] = 'INCREASE_BUDGET';
                $amount = floatval(str_replace(['Aumentar orçamento em', 'R$', '%'], '', $ruleData['action']));
                $isPercentage = strpos($ruleData['action'], '%') !== false;
                $action['budget_adjustment_type'] = $isPercentage ? 'PERCENTAGE' : 'ABSOLUTE_VALUE';
                $action['budget_adjustment_value'] = $amount;
            } elseif (strpos($ruleData['action'], 'Diminuir orçamento em') !== false) {
                $action['action_type'] = 'DECREASE_BUDGET';
                $amount = floatval(str_replace(['Diminuir orçamento em', 'R$', '%'], '', $ruleData['action']));
                $isPercentage = strpos($ruleData['action'], '%') !== false;
                $action['budget_adjustment_type'] = $isPercentage ? 'PERCENTAGE' : 'ABSOLUTE_VALUE';
                $action['budget_adjustment_value'] = $amount;
            } elseif ($ruleData['action'] === 'Ativar') {
                $action['action_type'] = 'TURN_ON';
            } elseif ($ruleData['action'] === 'Pausar') {
                $action['action_type'] = 'TURN_OFF';
            }

            // Construir o evaluation_spec
            $evaluationSpec = new AdRuleEvaluationSpec();
            $evaluationSpec->setData([
                'evaluation_type' => 'SCHEDULE',
                'filters' => $conditions,
                'evaluation_frequency' => self::getFrequencyInMinutes($ruleData['frequency']),
                'period' => self::getPeriodInMinutes($ruleData['period']),
            ]);

            // Construir o execution_spec
            $executionSpec = new AdRuleExecutionSpec();
            $executionSpec->setData([
                'execution_type' => 'RECURRING',
                'execution_options' => [
                    'execution_object_type' => self::getExecutionObjectType($ruleData['apply_to']),
                ],
                'action' => $action,
            ]);

            // Se um produto específico for selecionado, adicioná-lo aos filtros do execution_spec
            if ($ruleData['product'] !== 'All' && $ruleData['product'] !== 'Todos') {
                $executionSpecData = $executionSpec->getData();
                $executionSpecData['filters'][] = [
                    'field' => 'product_id',
                    'operator' => 'EQUAL',
                    'value' => $ruleData['product'],
                ];
                $executionSpec->setData($executionSpecData);
            }

            // Construir a regra de anúncio
            $adRule = new AdRule(null, $adAccountId);
            $adRule->setData([
                AdRuleFields::NAME => $ruleData['name'],
                AdRuleFields::STATUS => 'ACTIVE',
                AdRuleFields::EVALUATION_SPEC => $evaluationSpec,
                AdRuleFields::EXECUTION_SPEC => $executionSpec,
            ]);

            try {
                $adRule->create();
                // Armazenar o ID da Regra do Facebook
                $fbRuleIds[] = $adRule->id;
            } catch (\Exception $e) {
                // Lidar com exceções, registrar erro, etc.
                // Por enquanto, podemos continuar para a próxima conta
                continue;
            }
        }

        return $fbRuleIds;
    }

    public static function deleteAdRule($user, $fbRuleId)
    {
        $accessToken = $user->fb_access_token;
        $appId = env('META_APP_ID');
        $appSecret = env('META_SECRET_KEY');

        Api::init($appId, $appSecret, $accessToken);

        $adRule = new AdRule($fbRuleId);
        $adRule->delete();
    }

    public static function getProducts($accessToken, $adAccounts)
    {
        $products = [];

        Api::init(env('META_APP_ID'), env('META_SECRET_KEY'), $accessToken);

        foreach ($adAccounts as $account) {
            $adAccountId = $account['id'];

            // Fetch product catalogs associated with the ad account
            $adAccount = new AdAccount($adAccountId);
            $catalogs = $adAccount->getProductCatalogs();

            foreach ($catalogs as $catalog) {
                $catalogId = $catalog->id;

                // Fetch products from the catalog
                $productsData = $catalog->getProducts();

                foreach ($productsData as $product) {
                    // Add ad account ID to each product for filtering
                    $products[] = [
                        'id' => $product->id,
                        'name' => $product->getData()['name'] ?? 'Unnamed Product',
                        'ad_account_id' => $adAccountId,
                    ];
                }
            }
        }

        return $products;
    }

    private static function getExecutionObjectType($applyTo)
        {
            $map = [
                'Campanhas Ativas' => 'CAMPAIGN',
                'Conjuntos Ativos' => 'ADSET',
                'Anúncios Ativos' => 'AD',

            ];

            return $map[$applyTo] ?? 'AD';
        }

        private static function getFrequencyInMinutes($frequency)
        {
            $map = [
                'A cada 15 minutos' => 15,
                'A cada 30 minutos' => 30,
                'A cada hora' => 60,
                'A cada 2 horas' => 120,
                'A cada 3 horas' => 180,
                'A cada 6 horas' => 360,
                'Uma vez por dia' => 1440,
            ];

            return $map[$frequency] ?? 60;
        }

        public static function updateAdRuleStatus($user, $fbRuleIds, $status)
{
    $accessToken = $user->fb_access_token;
    $appId = env('META_APP_ID');
    $appSecret = env('META_SECRET_KEY');

    Api::init($appId, $appSecret, $accessToken);

    foreach ($fbRuleIds as $fbRuleId) {
        $adRule = new AdRule($fbRuleId);
        $adRule->{AdRuleFields::STATUS} = $status;

        try {
            $adRule->update();
        } catch (\Exception $e) {
            // Lidar com erros conforme necessário
            throw new \Exception("Erro ao atualizar a regra ID {$fbRuleId}: " . $e->getMessage());
        }
    }
}




    public static function getAllAdAccounts($accessToken)
    {
        Api::init(env('META_APP_ID'), env('META_SECRET_KEY'), $accessToken);

        $allAdAccounts = [];

        // 1. Obter os Business Managers do usuário
        $userBusinessManagers = self::getUserBusinessManagers($accessToken);

        // 2. Para cada Business Manager, obter as contas de anúncios
        foreach ($userBusinessManagers as $business) {
            $businessAdAccounts = self::getAdAccountsFromBusiness($business['id'], $accessToken);
            $allAdAccounts = array_merge($allAdAccounts, $businessAdAccounts);
        }

        // 3. Obter as contas de anúncios diretas do usuário
        $userAdAccounts = self::getUserAdAccounts($accessToken);
        $allAdAccounts = array_merge($allAdAccounts, $userAdAccounts);

        // Remover duplicatas, se houver
        $allAdAccounts = array_unique($allAdAccounts, SORT_REGULAR);

        return $allAdAccounts;
    }

    private static function getUserBusinessManagers($accessToken)
    {
        $response = Http::get('https://graph.facebook.com/v20.0/me/businesses', [
            'access_token' => $accessToken,
        ]);

        $businesses = $response->json()['data'] ?? [];

        return $businesses;
    }

    private static function getAdAccountsFromBusiness($businessId, $accessToken)
    {
        $adAccounts = [];

        // Obter contas de anúncios que o business possui
        $responseOwned = Http::get("https://graph.facebook.com/v20.0/{$businessId}/owned_ad_accounts", [
            'access_token' => $accessToken,
            'fields' => 'id,name',
        ]);
        $ownedAdAccounts = $responseOwned->json()['data'] ?? [];

        foreach ($ownedAdAccounts as $adAccount) {
            $adAccounts[] = [
                'id' => $adAccount['id'],
                'name' => $adAccount['name'],
            ];
        }

        // Obter contas de anúncios que o business gerencia
        $responseClient = Http::get("https://graph.facebook.com/v20.0/{$businessId}/client_ad_accounts", [
            'access_token' => $accessToken,
            'fields' => 'id,name',
        ]);
        $clientAdAccounts = $responseClient->json()['data'] ?? [];

        foreach ($clientAdAccounts as $adAccount) {
            $adAccounts[] = [
                'id' => $adAccount['id'],
                'name' => $adAccount['name'],
            ];
        }

        return $adAccounts;
    }

    private static function getUserAdAccounts($accessToken)
    {
        $response = Http::get('https://graph.facebook.com/v20.0/me/adaccounts', [
            'access_token' => $accessToken,
            'fields' => 'id,name',
        ]);

        $adAccounts = $response->json()['data'] ?? [];

        return array_map(function($adAccount) {
            return [
                'id' => $adAccount['id'],
                'name' => $adAccount['name'],
            ];
        }, $adAccounts);
    }

    // Método para obter os conjuntos de anúncios
    public static function getAdSets($accessToken, $adAccounts)
    {
        Api::init(env('META_APP_ID'), env('META_SECRET_KEY'), $accessToken);

        $adSets = [];

        foreach ($adAccounts as $account) {
            $adAccountId = $account['id'];
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/adsets", [
                'access_token' => $accessToken,
                'fields' => 'id,name,campaign_id',
            ]);

            $adSetsData = $response->json()['data'] ?? [];

            foreach ($adSetsData as $adSet) {
                $adSets[] = [
                    'id' => $adSet['id'],
                    'name' => $adSet['name'],
                    'ad_account_id' => $adAccountId,
                    'campaign_id' => $adSet['campaign_id'],
                ];
            }
        }

        return $adSets;
    }

    public static function getAllAds($accessToken)
{
    $adAccounts = self::getAllAdAccounts($accessToken);

    $allAds = [];

    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $ads = self::getAdsFromAdAccount($adAccountId, $accessToken);

        $allAds = array_merge($allAds, $ads);
    }

    return $allAds;
}

private static function getAdsFromAdAccount($adAccountId, $accessToken)
{
    $ads = [];

    $after = null;
    do {
        $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/ads", [
            'access_token' => $accessToken,
            'fields' => 'id,name,adset_id,campaign_id,account_id,configured_status',
            'limit' => 100,
            'after' => $after,
        ]);

        $adsData = $response->json();

        if (isset($adsData['data'])) {
            foreach ($adsData['data'] as $ad) {
                $ads[] = [
                    'id' => $ad['id'],
                    'name' => $ad['name'],
                    'adset_id' => $ad['adset_id'],
                    'campaign_id' => $ad['campaign_id'],
                    'account_id' => $ad['account_id'],
                    'status' => $ad['configured_status'],
                ];
            }
        }

        // Verificar paginação
        if (isset($adsData['paging']['cursors']['after'])) {
            $after = $adsData['paging']['cursors']['after'];
        } else {
            $after = null;
        }

    } while ($after);

    return $ads;
}

public static function getAllCampaigns($accessToken)
{
    $adAccounts = self::getAllAdAccounts($accessToken);

    $campaigns = [];

    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null;
        do {
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/campaigns", [
                'access_token' => $accessToken,
                'fields' => 'id,name,status',
                'limit' => 100,
                'after' => $after,
            ]);

            $data = $response->json();

            if (isset($data['data'])) {
                foreach ($data['data'] as $campaign) {
                    $campaigns[] = [
                        'id' => $campaign['id'],
                        'name' => $campaign['name'],
                        'status' => $campaign['status'],
                        'ad_account_id' => $adAccountId,
                    ];
                }
            }

            // Verificar paginação
            if (isset($data['paging']['cursors']['after'])) {
                $after = $data['paging']['cursors']['after'];
            } else {
                $after = null;
            }

        } while ($after);
    }

    return $campaigns;
}

public static function getAllAdSets($accessToken)
{
    $adAccounts = self::getAllAdAccounts($accessToken);

    $adSets = [];

    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null;
        do {
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/adsets", [
                'access_token' => $accessToken,
                'fields' => 'id,name,campaign_id,status',
                'limit' => 100,
                'after' => $after,
            ]);

            $data = $response->json();

            if (isset($data['data'])) {
                foreach ($data['data'] as $adSet) {
                    $adSets[] = [
                        'id' => $adSet['id'],
                        'name' => $adSet['name'],
                        'campaign_id' => $adSet['campaign_id'],
                        'status' => $adSet['status'],
                        'ad_account_id' => $adAccountId,
                    ];
                }
            }

            // Verificar paginação
            if (isset($data['paging']['cursors']['after'])) {
                $after = $data['paging']['cursors']['after'];
            } else {
                $after = null;
            }

        } while ($after);
    }

    return $adSets;
}

public static function getAdSpendData($accessToken)
{
    $adAccounts = self::getAllAdAccounts($accessToken);

    $totalSpend = 0;
    $dailySpend = []; // Armazenar gasto por dia

    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null;
        do {
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/insights", [
                'access_token' => $accessToken,
                'fields' => 'spend,date_start',
                'date_preset' => 'last_30d',
                'time_increment' => 1, // Quebra diária
                'limit' => 100,
                'after' => $after,
            ]);

            $data = $response->json();

            if (isset($data['data'])) {
                foreach ($data['data'] as $insight) {
                    $date = $insight['date_start'];
                    $spend = floatval($insight['spend']);

                    $totalSpend += $spend;

                    if (!isset($dailySpend[$date])) {
                        $dailySpend[$date] = 0;
                    }
                    $dailySpend[$date] += $spend;
                }
            }

            // Paginação
            if (isset($data['paging']['next'])) {
                $after = $data['paging']['cursors']['after'];
            } else {
                $after = null;
            }

        } while ($after);
    }

    return [
        'totalSpend' => $totalSpend,
        'dailySpend' => $dailySpend,
    ];
}

public static function getAllDataAccount($accessToken)
{
    // Obtém todas as contas de anúncios do usuário
    $adAccounts = self::getAllAdAccounts($accessToken);
    $dados = []; // Inicializa o array para armazenar os dados combinados
    $vendasRealizadas = [];
    $adqt = 0;
    // Itera sobre cada conta de anúncio
    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null; // Variável para controle da paginação

        do {
            // Realiza a chamada à API do Facebook para obter os insights
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/insights", [
                'access_token'   => $accessToken,
                'date_preset'    => 'last_30d',
                'fields'         => 'account_name,impressions,spend,clicks,account_id,ad_id,cpc,cpm,ctr,date_start,date_stop',
                'level'          => 'ad',
                'limit'          => 100, // Ajuste conforme necessário
                'after'          => $after,
            ]);

            // Verifica se a resposta é bem-sucedida
            if ($response->successful()) {
                $data = $response->json();

                // Verifica se a resposta contém dados de insights
                if (isset($data['data'])) {
                    foreach ($data['data'] as $insight) {
                        // Extrai o ad_id
                        $adId = $insight['ad_id'] ?? null;
                        if (!$adId) {
                            continue; // Pula se não houver ad_id
                        }

                        // Busca os dados de vendas correspondentes ao ad_id
                        $sales = Sale::where(function($query) use ($adId) {
                            $query->where('utm_medium', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_campaign', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_content', 'like', "%" . $adId . "%");
                        })->where('status', 'approved')->get();
                        $vendasRealizadas[] = $sales;

                        
                        // Calcula as métricas de vendas
                        $vendas = $sales->count();                        
                        $faturamento = $sales->sum('amount'); // Supondo que 'amount' seja o campo de receita
                        $gastos = floatval($insight['spend']) ?? 0.0;
                        $cpa = $vendas > 0 ? $gastos / $vendas : 0.0;
                        $lucro = $faturamento - $gastos;
                        $roas = $gastos > 0 ? $faturamento / $gastos : 0.0;
                        $margem = $faturamento > 0 ? ($lucro / $faturamento) * 100 : 0.0;
                        $roi = $gastos > 0 ? ($lucro / $gastos) * 100 : 0.0;
                        $ic = 0; // Defina conforme a métrica desejada
                        $cpi = 0; // Defina conforme a métrica desejada

                        $accountName = $insight['account_name'] ?? 'Desconhecido';
                        
                        if(!isset($dados[$accountName])){
                            $dados[$accountName] = [
                                'account_name' => $insight['account_name'],
                                'orçamento'       => isset($insight['daily_budget']) ? floatval($insight['daily_budget']) : 0.0, // Ou 'lifetime_budget'
                                'vendas'          => 0,
                                'cpa'             => 0,
                                'gastos'          => 0,
                                'faturamento'     => 0,
                                'lucro'           => 0,
                                'roas'            => 0,
                                'margem'          => 0,
                                'roi'             => 0,
                                'ic'              => 0,
                                'cpi'             => 0,
                                'cpc'             => isset($insight['cpc']) ? round(floatval($insight['cpc']), 2) : 0.0,
                                'ctr'             => isset($insight['ctr']) ? round(floatval($insight['ctr']), 2) : 0.0,
                                'cpm'             => isset($insight['cpm']) ? round(floatval($insight['cpm']), 2) : 0.0,
                                'impressões'      => 0,
                                'cliques'         => 0,
                                'status'          => $insight['status'] ?? 'N/A',
                                'data_inicio'     => isset($insight['date_start']) ? date('d/m/Y', strtotime($insight['date_start'])) : 'N/A',
                                'data_fim'        => isset($insight['date_stop']) ? date('d/m/Y', strtotime($insight['date_stop'])) : 'N/A',
                                'adqt'            => 0,
                            ];
                        } 

                            $dados[$accountName]['vendas'] += $vendas;
                            $dados[$accountName]['cpa'] += $cpa;
                            $dados[$accountName]['faturamento'] += $faturamento;
                            $dados[$accountName]['lucro'] += $lucro;
                            $dados[$accountName]['roas'] = $roas; // Considera o ROAS do último insight
                            $dados[$accountName]['margem'] = $margem;
                            $dados[$accountName]['roi'] = $roi;
                            $dados[$accountName]['ic'] += $ic;
                            $dados[$accountName]['cpi'] += $cpi;
                            $dados[$accountName]['impressões'] += $insight['impressions'];
                            $dados[$accountName]['cliques'] += $insight['clicks'];
                            $dados[$accountName]['cpc'] += $insight['cpc'];
                            $dados[$accountName]['ctr'] += $insight['ctr'];
                            $dados[$accountName]['cpm'] += $insight['cpm'];
                            $dados[$accountName]['adqt'] += 1;
                            $dados[$accountName]['gastos'] += $gastos;
                    }
                }

                // Controle da paginação: verifica se há uma próxima página
                if (isset($data['paging']['cursors']['after'])) {
                    $after = $data['paging']['cursors']['after'];
                } else {
                    $after = null; // Não há mais páginas
                }

            } else {
                // Lida com erros na resposta da API
                \Log::error("Erro ao obter insights para a conta {$adAccountId}: " . $response->body());
                break; // Sai do loop caso haja um erro
            }

        } while($after);
    }

    foreach($dados as $dado){
        $dado['cpa'] = $dado['vendas'] > 0 ? ($dado['gastos'] / $dado['vendas']) : 0.0;
        $dado['roi'] = $dado['gastos'] > 0 ? ($dado['lucro'] / $dado['gastos']) * 100 : 0.0;
        $dado['ic'] = $dado['ic'] / $dado['adqt'];
        $dado['cpi'] = $dado['cpi'] / $dado['adqt'];
        $dado['cpc'] = $dado['cliques'] > 0 ? $dado['gastos'] / $dado['cliques'] : 0.0;
        $dado['ctr'] = $dado['ctr'] / $dado['adqt'];
        $dado['cpm'] = $dado['impressões'] > 0 ? ($dado['gastos'] / $dado['impressões']) * 1000 : 0;
        $dado['roas'] = $dado['gastos'] > 0 ? (($dado['faturamento'] - $dado['gastos']) / $dado['gastos']) * 100 : 0;
    }
    
    return ['dados' => $dados, 'adaccounts' => $adAccounts, 'vendasRealizadas' => $vendasRealizadas];
}

public static function getAllDataCampaign($accessToken)
{
    // Obtém todas as contas de anúncios do usuário
    $adAccounts = self::getAllAdAccounts($accessToken);
    $dados = []; // Inicializa o array para armazenar os dados combinados
    $vendasRealizadas = [];
    $adqt = 0;
    // Itera sobre cada conta de anúncio
    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null; // Variável para controle da paginação

        do {
            // Realiza a chamada à API do Facebook para obter os insights
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/insights", [
                'access_token'   => $accessToken,
                'date_preset'    => 'last_30d',
                'fields'         => 'account_name,impressions,spend,clicks,account_id,ad_id,cpc,cpm,ctr,date_start,date_stop,campaign_name,campaign_id',
                'level'          => 'ad',
                'limit'          => 100, // Ajuste conforme necessário
                'after'          => $after,
            ]);

            // Verifica se a resposta é bem-sucedida
            if ($response->successful()) {
                $data = $response->json();

                // Verifica se a resposta contém dados de insights
                if (isset($data['data'])) {
                    foreach ($data['data'] as $insight) {
                        // Extrai o ad_id
                        $adId = $insight['ad_id'] ?? null;
                        if (!$adId) {
                            continue; // Pula se não houver ad_id
                        }

                        // Busca os dados de vendas correspondentes ao ad_id
                        $sales = Sale::where(function($query) use ($adId) {
                            $query->where('utm_medium', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_campaign', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_content', 'like', "%" . $adId . "%");
                        })->where('status', 'approved')->get();
                        $vendasRealizadas[] = $sales;

                        
                        // Calcula as métricas de vendas
                        $vendas = $sales->count();                        
                        $faturamento = $sales->sum('amount'); // Supondo que 'amount' seja o campo de receita
                        $gastos = floatval($insight['spend']) ?? 0.0;
                        $cpa = $vendas > 0 ? $gastos / $vendas : 0.0;
                        $lucro = $faturamento - $gastos;
                        $roas = $gastos > 0 ? $faturamento / $gastos : 0.0;
                        $margem = $faturamento > 0 ? ($lucro / $faturamento) * 100 : 0.0;
                        $roi = $gastos > 0 ? ($lucro / $gastos) * 100 : 0.0;
                        $ic = 0; // Defina conforme a métrica desejada
                        $cpi = 0; // Defina conforme a métrica desejada

                        $accountName = $insight['campaign_id'] ?? 'Desconhecido';
                        
                        if(!isset($dados[$accountName])){
                            $dados[$accountName] = [
                                'campaign_name' => $insight['campaign_name'],
                                'orçamento'       => isset($insight['daily_budget']) ? floatval($insight['daily_budget']) : 0.0, // Ou 'lifetime_budget'
                                'vendas'          => 0,
                                'cpa'             => 0,
                                'gastos'          => 0,
                                'faturamento'     => 0,
                                'lucro'           => 0,
                                'roas'            => 0,
                                'margem'          => 0,
                                'roi'             => 0,
                                'ic'              => 0,
                                'cpi'             => 0,
                                'cpc'             => isset($insight['cpc']) ? round(floatval($insight['cpc']), 2) : 0.0,
                                'ctr'             => isset($insight['ctr']) ? round(floatval($insight['ctr']), 2) : 0.0,
                                'cpm'             => isset($insight['cpm']) ? round(floatval($insight['cpm']), 2) : 0.0,
                                'impressões'      => 0,
                                'cliques'         => 0,
                                'status'          => $insight['status'] ?? 'N/A',
                                'data_inicio'     => isset($insight['date_start']) ? date('d/m/Y', strtotime($insight['date_start'])) : 'N/A',
                                'data_fim'        => isset($insight['date_stop']) ? date('d/m/Y', strtotime($insight['date_stop'])) : 'N/A',
                                'adqt'            => 0,
                            ];
                        } 

                            $dados[$accountName]['vendas'] += $vendas;
                            $dados[$accountName]['cpa'] += $cpa;
                            $dados[$accountName]['faturamento'] += $faturamento;
                            $dados[$accountName]['lucro'] += $lucro;
                            $dados[$accountName]['roas'] = $roas; // Considera o ROAS do último insight
                            $dados[$accountName]['margem'] = $margem;
                            $dados[$accountName]['roi'] = $roi;
                            $dados[$accountName]['ic'] += $ic;
                            $dados[$accountName]['cpi'] += $cpi;
                            $dados[$accountName]['impressões'] += $insight['impressions'];
                            $dados[$accountName]['cliques'] += $insight['clicks'];
                            $dados[$accountName]['cpc'] += $insight['cpc'];
                            $dados[$accountName]['ctr'] = $insight['ctr'];
                            $dados[$accountName]['cpm'] += $insight['cpm'];
                            $dados[$accountName]['adqt'] += 1;
                            $dados[$accountName]['gastos'] += $gastos;
                    }
                }

                // Controle da paginação: verifica se há uma próxima página
                if (isset($data['paging']['cursors']['after'])) {
                    $after = $data['paging']['cursors']['after'];
                } else {
                    $after = null; // Não há mais páginas
                }

            } else {
                // Lida com erros na resposta da API
                \Log::error("Erro ao obter insights para a conta {$adAccountId}: " . $response->body());
                break; // Sai do loop caso haja um erro
            }

        } while($after);
    }

    foreach($dados as $dado){
        $dado['cpa'] = $dado['vendas'] > 0 ? ($dado['gastos'] / $dado['vendas']) : 0.0;
        $dado['roi'] = $dado['gastos'] > 0 ? ($dado['lucro'] / $dado['gastos']) * 100 : 0.0;
        $dado['ic'] = $dado['ic'] / $dado['adqt'];
        $dado['cpi'] = $dado['cpi'] / $dado['adqt'];
        $dado['cpc'] = $dado['cliques'] > 0 ? $dado['gastos'] / $dado['cliques'] : 0.0;
        $dado['ctr'] = $dado['ctr'] / $dado['adqt'];
        $dado['cpm'] = $dado['impressões'] > 0 ? ($dado['gastos'] / $dado['impressões']) * 1000 : 0;
        $dado['roas'] = $dado['gastos'] > 0 ? (($dado['faturamento'] - $dado['gastos']) / $dado['gastos']) * 100 : 0;
    }
    
    return ['dados' => $dados, 'adaccounts' => $adAccounts, 'vendasRealizadas' => $vendasRealizadas];
}

public static function getAllDataAdset($accessToken)
{
    // Obtém todas as contas de anúncios do usuário
    $adAccounts = self::getAllAdAccounts($accessToken);
    $dados = []; // Inicializa o array para armazenar os dados combinados
    $vendasRealizadas = [];
    $adqt = 0;
    // Itera sobre cada conta de anúncio
    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null; // Variável para controle da paginação

        do {
            // Realiza a chamada à API do Facebook para obter os insights
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/insights", [
                'access_token'   => $accessToken,
                'date_preset'    => 'last_30d',
                'fields'         => 'account_name,impressions,spend,clicks,account_id,ad_id,cpc,cpm,ctr,date_start,date_stop,adset_name,adset_id',
                'level'          => 'ad',
                'limit'          => 100, // Ajuste conforme necessário
                'after'          => $after,
            ]);

            // Verifica se a resposta é bem-sucedida
            if ($response->successful()) {
                $data = $response->json();

                // Verifica se a resposta contém dados de insights
                if (isset($data['data'])) {
                    foreach ($data['data'] as $insight) {
                        // Extrai o ad_id
                        $adId = $insight['ad_id'] ?? null;
                        if (!$adId) {
                            continue; // Pula se não houver ad_id
                        }

                        // Busca os dados de vendas correspondentes ao ad_id
                        $sales = Sale::where(function($query) use ($adId) {
                            $query->where('utm_medium', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_campaign', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_content', 'like', "%" . $adId . "%");
                        })->where('status', 'approved')->get();
                        $vendasRealizadas[] = $sales;

                        
                        // Calcula as métricas de vendas
                        $vendas = $sales->count();                        
                        $faturamento = $sales->sum('amount'); // Supondo que 'amount' seja o campo de receita
                        $gastos = floatval($insight['spend']) ?? 0.0;
                        $cpa = $vendas > 0 ? $gastos / $vendas : 0.0;
                        $lucro = $faturamento - $gastos;
                        $roas = $gastos > 0 ? $faturamento / $gastos : 0.0;
                        $margem = $faturamento > 0 ? ($lucro / $faturamento) * 100 : 0.0;
                        $roi = $gastos > 0 ? ($lucro / $gastos) * 100 : 0.0;
                        $ic = 0; // Defina conforme a métrica desejada
                        $cpi = 0; // Defina conforme a métrica desejada

                        $accountName = $insight['adset_id'] ?? 'Desconhecido';
                        
                        if(!isset($dados[$accountName])){
                            $dados[$accountName] = [
                                'campaign_name' => $insight['adset_name'],
                                'orçamento'       => isset($insight['daily_budget']) ? floatval($insight['daily_budget']) : 0.0, // Ou 'lifetime_budget'
                                'vendas'          => 0,
                                'cpa'             => 0,
                                'gastos'          => 0,
                                'faturamento'     => 0,
                                'lucro'           => 0,
                                'roas'            => 0,
                                'margem'          => 0,
                                'roi'             => 0,
                                'ic'              => 0,
                                'cpi'             => 0,
                                'cpc'             => isset($insight['cpc']) ? round(floatval($insight['cpc']), 2) : 0.0,
                                'ctr'             => isset($insight['ctr']) ? round(floatval($insight['ctr']), 2) : 0.0,
                                'cpm'             => isset($insight['cpm']) ? round(floatval($insight['cpm']), 2) : 0.0,
                                'impressões'      => 0,
                                'cliques'         => 0,
                                'status'          => $insight['status'] ?? 'N/A',
                                'data_inicio'     => isset($insight['date_start']) ? date('d/m/Y', strtotime($insight['date_start'])) : 'N/A',
                                'data_fim'        => isset($insight['date_stop']) ? date('d/m/Y', strtotime($insight['date_stop'])) : 'N/A',
                                'adqt'            => 0,
                            ];
                        } 

                            $dados[$accountName]['vendas'] += $vendas;
                            $dados[$accountName]['cpa'] += $cpa;
                            $dados[$accountName]['faturamento'] += $faturamento;
                            $dados[$accountName]['lucro'] += $lucro;
                            $dados[$accountName]['roas'] = $roas; // Considera o ROAS do último insight
                            $dados[$accountName]['margem'] = $margem;
                            $dados[$accountName]['roi'] = $roi;
                            $dados[$accountName]['ic'] += $ic;
                            $dados[$accountName]['cpi'] += $cpi;
                            $dados[$accountName]['impressões'] += $insight['impressions'];
                            $dados[$accountName]['cliques'] += $insight['clicks'];
                            $dados[$accountName]['cpc'] += $insight['cpc'];
                            $dados[$accountName]['ctr'] = $insight['ctr'];
                            $dados[$accountName]['cpm'] += $insight['cpm'];
                            $dados[$accountName]['adqt'] += 1;
                            $dados[$accountName]['gastos'] += $gastos;
                    }
                }

                // Controle da paginação: verifica se há uma próxima página
                if (isset($data['paging']['cursors']['after'])) {
                    $after = $data['paging']['cursors']['after'];
                } else {
                    $after = null; // Não há mais páginas
                }

            } else {
                // Lida com erros na resposta da API
                \Log::error("Erro ao obter insights para a conta {$adAccountId}: " . $response->body());
                break; // Sai do loop caso haja um erro
            }

        } while($after);
    }

    foreach($dados as $dado){
        $dado['cpa'] = $dado['vendas'] > 0 ? ($dado['gastos'] / $dado['vendas']) : 0.0;
        $dado['roi'] = $dado['gastos'] > 0 ? ($dado['lucro'] / $dado['gastos']) * 100 : 0.0;
        $dado['ic'] = $dado['ic'] / $dado['adqt'];
        $dado['cpi'] = $dado['cpi'] / $dado['adqt'];
        $dado['cpc'] = $dado['cliques'] > 0 ? $dado['gastos'] / $dado['cliques'] : 0.0;
        $dado['ctr'] = $dado['ctr'] / $dado['adqt'];
        $dado['cpm'] = $dado['impressões'] > 0 ? ($dado['gastos'] / $dado['impressões']) * 1000 : 0;
        $dado['roas'] = $dado['gastos'] > 0 ? (($dado['faturamento'] - $dado['gastos']) / $dado['gastos']) * 100 : 0;
    }
    
    return ['dados' => $dados, 'adaccounts' => $adAccounts, 'vendasRealizadas' => $vendasRealizadas];
}

public static function getAllDataAds($accessToken)
{
    // Obtém todas as contas de anúncios do usuário
    $adAccounts = self::getAllAdAccounts($accessToken);
    $dados = []; // Inicializa o array para armazenar os dados combinados
    $vendasRealizadas = [];
    $adqt = 0;
    // Itera sobre cada conta de anúncio
    foreach ($adAccounts as $adAccount) {
        $adAccountId = $adAccount['id'];

        $after = null; // Variável para controle da paginação

        do {
            // Realiza a chamada à API do Facebook para obter os insights
            $response = Http::get("https://graph.facebook.com/v20.0/{$adAccountId}/insights", [
                'access_token'   => $accessToken,
                'date_preset'    => 'last_30d',
                'fields'         => 'account_name,impressions,spend,clicks,account_id,ad_id,cpc,cpm,ctr,date_start,date_stop,ad_name',
                'level'          => 'ad',
                'limit'          => 100, // Ajuste conforme necessário
                'after'          => $after,
            ]);

            // Verifica se a resposta é bem-sucedida
            if ($response->successful()) {
                $data = $response->json();

                // Verifica se a resposta contém dados de insights
                if (isset($data['data'])) {
                    foreach ($data['data'] as $insight) {
                        // Extrai o ad_id
                        $adId = $insight['ad_id'] ?? null;
                        if (!$adId) {
                            continue; // Pula se não houver ad_id
                        }

                        // Busca os dados de vendas correspondentes ao ad_id
                        $sales = Sale::where(function($query) use ($adId) {
                            $query->where('utm_medium', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_campaign', 'like', "%" . $adId . "%")
                                  ->orWhere('utm_content', 'like', "%" . $adId . "%");
                        })->where('status', 'approved')->get();
                        $vendasRealizadas[] = $sales;

                        
                        // Calcula as métricas de vendas
                        $vendas = $sales->count();                        
                        $faturamento = $sales->sum('amount'); // Supondo que 'amount' seja o campo de receita
                        $gastos = floatval($insight['spend']) ?? 0.0;
                        $cpa = $vendas > 0 ? $gastos / $vendas : 0.0;
                        $lucro = $faturamento - $gastos;
                        $roas = $gastos > 0 ? $faturamento / $gastos : 0.0;
                        $margem = $faturamento > 0 ? ($lucro / $faturamento) * 100 : 0.0;
                        $roi = $gastos > 0 ? ($lucro / $gastos) * 100 : 0.0;
                        $ic = 0; // Defina conforme a métrica desejada
                        $cpi = 0; // Defina conforme a métrica desejada

                        $accountName = $insight['ad_id'] ?? 'Desconhecido';
                        
                        if(!isset($dados[$accountName])){
                            $dados[$accountName] = [
                                'campaign_name' => $insight['ad_name'],
                                'orçamento'       => isset($insight['daily_budget']) ? floatval($insight['daily_budget']) : 0.0, // Ou 'lifetime_budget'
                                'vendas'          => 0,
                                'cpa'             => 0,
                                'gastos'          => 0,
                                'faturamento'     => 0,
                                'lucro'           => 0,
                                'roas'            => 0,
                                'margem'          => 0,
                                'roi'             => 0,
                                'ic'              => 0,
                                'cpi'             => 0,
                                'cpc'             => isset($insight['cpc']) ? round(floatval($insight['cpc']), 2) : 0.0,
                                'ctr'             => isset($insight['ctr']) ? round(floatval($insight['ctr']), 2) : 0.0,
                                'cpm'             => isset($insight['cpm']) ? round(floatval($insight['cpm']), 2) : 0.0,
                                'impressões'      => 0,
                                'cliques'         => 0,
                                'status'          => $insight['status'] ?? 'N/A',
                                'data_inicio'     => isset($insight['date_start']) ? date('d/m/Y', strtotime($insight['date_start'])) : 'N/A',
                                'data_fim'        => isset($insight['date_stop']) ? date('d/m/Y', strtotime($insight['date_stop'])) : 'N/A',
                                'adqt'            => 0,
                            ];
                        } 

                            $dados[$accountName]['vendas'] += $vendas;
                            $dados[$accountName]['cpa'] += $cpa;
                            $dados[$accountName]['faturamento'] += $faturamento;
                            $dados[$accountName]['lucro'] += $lucro;
                            $dados[$accountName]['roas'] = $roas; // Considera o ROAS do último insight
                            $dados[$accountName]['margem'] = $margem;
                            $dados[$accountName]['roi'] = $roi;
                            $dados[$accountName]['ic'] += $ic;
                            $dados[$accountName]['cpi'] += $cpi;
                            $dados[$accountName]['impressões'] += $insight['impressions'];
                            $dados[$accountName]['cliques'] += $insight['clicks'];
                            $dados[$accountName]['cpc'] += $insight['cpc'];
                            $dados[$accountName]['ctr'] = $insight['ctr'];
                            $dados[$accountName]['cpm'] += $insight['cpm'];
                            $dados[$accountName]['adqt'] += 1;
                            $dados[$accountName]['gastos'] += $gastos;
                    }
                }

                // Controle da paginação: verifica se há uma próxima página
                if (isset($data['paging']['cursors']['after'])) {
                    $after = $data['paging']['cursors']['after'];
                } else {
                    $after = null; // Não há mais páginas
                }

            } else {
                // Lida com erros na resposta da API
                \Log::error("Erro ao obter insights para a conta {$adAccountId}: " . $response->body());
                break; // Sai do loop caso haja um erro
            }

        } while($after);
    }

    foreach($dados as $dado){
        $dado['cpa'] = $dado['vendas'] > 0 ? ($dado['gastos'] / $dado['vendas']) : 0.0;
        $dado['roi'] = $dado['gastos'] > 0 ? ($dado['lucro'] / $dado['gastos']) * 100 : 0.0;
        $dado['ic'] = $dado['ic'] / $dado['adqt'];
        $dado['cpi'] = $dado['cpi'] / $dado['adqt'];
        $dado['cpc'] = $dado['cliques'] > 0 ? $dado['gastos'] / $dado['cliques'] : 0.0;
        $dado['ctr'] = $dado['ctr'] / $dado['adqt'];
        $dado['cpm'] = $dado['impressões'] > 0 ? ($dado['gastos'] / $dado['impressões']) * 1000 : 0;
        $dado['roas'] = $dado['gastos'] > 0 ? (($dado['faturamento'] - $dado['gastos']) / $dado['gastos']) * 100 : 0;
    }
    
    return ['dados' => $dados, 'adaccounts' => $adAccounts, 'vendasRealizadas' => $vendasRealizadas];
}
}
