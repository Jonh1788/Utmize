<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/Register', [
            'referral_code' => $request->query('ref'),
        ]);
    }
    
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'referral_code' => 'nullable|string|exists:users,referral_code',
        ], [
            // Mensagens para o campo 'name'
            'name.required' => 'Por favor, informe o seu nome.',
            'name.string' => 'O nome deve ser um texto válido.',
            'name.max' => 'O nome não pode exceder 255 caracteres.',
        
            // Mensagens para o campo 'email'
            'email.required' => 'O campo email é obrigatório.',
            'email.string' => 'O email deve ser um texto válido.',
            'email.lowercase' => 'O email deve estar em letras minúsculas.',
            'email.email' => 'Por favor, informe um endereço de email válido.',
            'email.max' => 'O email não pode exceder 255 caracteres.',
            'email.unique' => 'Este email já está cadastrado.',
        
            // Mensagens para o campo 'password'
            'password.required' => 'A senha é obrigatória.',
            'password.confirmed' => 'A confirmação da senha não corresponde.',
            // As regras de senha adicionais podem ter suas próprias mensagens
            'password.min' => 'A senha deve ter pelo menos :min caracteres.',
            'password.mixed' => 'A senha deve conter pelo menos uma letra maiúscula e uma minúscula.',
            'password.numbers' => 'A senha deve conter pelo menos um número.',
            'password.symbols' => 'A senha deve conter pelo menos um símbolo.',
        
            // Mensagens para o campo 'referral_code'
            'referral_code.string' => 'O código de indicação deve ser um texto válido.',
            'referral_code.exists' => 'O código de indicação informado não existe.',
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'referred_by' => $request->referral_code,
        ]);
    
        event(new Registered($user));
    
        Auth::login($user);
    
        return redirect(route('dashboard'));
    }
}
