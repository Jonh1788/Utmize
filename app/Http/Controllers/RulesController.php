<?php

namespace App\Http\Controllers;

use App\Models\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Services\FacebookService;

class RulesController extends Controller
{
    /**
     * Exibir a lista de regras do usuário.
     */
    public function index()
    {
        $user = Auth::user();
        $rules = $user->rules()->get();
    
        // Obter todas as contas de anúncios
        $adAccounts = FacebookService::getAllAdAccounts($user->fb_access_token);
    
        // Obter os conjuntos de anúncios associados às contas de anúncios
        $adSets = FacebookService::getAdSets($user->fb_access_token, $adAccounts);
    
        return Inertia::render('Regras/Regras', [
            'auth' => [
                'user' => $user,
            ],
            'rules' => $rules,
            'adAccounts' => $adAccounts,
            'adSets' => $adSets,
        ]);
    }

    /**
     * Armazenar uma nova regra.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
    
        // Validar os dados
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'product' => 'nullable|string|max:255',
            'ad_accounts' => 'nullable|string|max:255',
            'apply_to' => 'required|string|max:255',
            'condition' => 'required|array',
            'action' => 'required|string|max:255',
            'period' => 'required|string|max:255',
            'frequency' => 'required|string|max:255',
        ]);
    
        try {
            // Enviar a regra para o Facebook Ads e obter os IDs das regras criadas
            //$fbRuleIds = FacebookService::createAdRule($user, $validatedData);
    
            // Salvar a regra no banco de dados
            $rule = Rule::create([
                'user_id' => $user->id,
                'name' => $validatedData['name'],
                'product' => $validatedData['product'],
                'ad_accounts' => $validatedData['ad_accounts'],
                'apply_to' => $validatedData['apply_to'],
                'condition' => $validatedData['condition'],
                'action' => $validatedData['action'],
                'period' => $validatedData['period'],
                'frequency' => $validatedData['frequency'],
                //'fb_rule_ids' => $fbRuleIds,
            ]);
    
            return redirect()->back()->with('success', 'Regra criada com sucesso!');
        } catch (\Exception $e) {
            // Capturar a mensagem de erro
            $errorMessage = $e->getMessage();
    
            // Retornar ao front-end com os erros e manter os dados do formulário
            return redirect()->back()
                ->withErrors(['facebook_error' => $errorMessage])
                ->withInput();
        }
    }

    /**
     * Excluir uma regra.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $rule = Rule::findOrFail($id);

        // Verificar se a regra pertence ao usuário
        if ($rule->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Você não tem permissão para excluir esta regra.');
        }

        // Excluir a regra do Facebook Ads
        if ($rule->fb_rule_id) {
            FacebookService::deleteAdRule($user, $rule->fb_rule_id);
        }

        // Excluir a regra do banco de dados
        $rule->delete();

        return redirect()->back()->with('success', 'Regra excluída com sucesso!');
    }

    public function pause($id)
{
    $user = Auth::user();
    $rule = Rule::findOrFail($id);

    // Verificar se a regra pertence ao usuário
    if ($rule->user_id !== $user->id) {
        return redirect()->back()->withErrors(['error' => 'Você não tem permissão para pausar esta regra.']);
    }

    try {
        // Pausar a regra no Facebook Ads
        if ($rule->fb_rule_ids) {
            FacebookService::updateAdRuleStatus($user, $rule->fb_rule_ids, 'PAUSED');
        }

        // Atualizar o status no banco de dados
        $rule->status = 'PAUSED';
        $rule->save();

        return redirect()->back()->with('success', 'Regra pausada com sucesso!');
    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
}

public function activate($id)
{
    $user = Auth::user();
    $rule = Rule::findOrFail($id);

    // Verificar se a regra pertence ao usuário
    if ($rule->user_id !== $user->id) {
        return redirect()->back()->withErrors(['error' => 'Você não tem permissão para ativar esta regra.']);
    }

    try {
        // Ativar a regra no Facebook Ads
        if ($rule->fb_rule_ids) {
            FacebookService::updateAdRuleStatus($user, $rule->fb_rule_ids, 'ACTIVE');
        }

        // Atualizar o status no banco de dados
        $rule->status = 'ACTIVE';
        $rule->save();

        return redirect()->back()->with('success', 'Regra ativada com sucesso!');
    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
}
}