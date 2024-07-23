<?php

namespace App\Http\Controllers\Facebook;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Facebook\Facebook;
use App\Http\Services\FacebookService;

class FacebookLoginController extends Controller
{
    public function create(){

    }

    public function callback(){

    }

    public function store(Request $request){
       $dados = $request->json()->all();
        if($dados['data']['status'] == 'connected'){
            $authResponse = $dados['data']['authResponse'];
           
            $response = FacebookService::getLongToken($authResponse['accessToken']);
            
            $getLongToken = $response->json();
      
            $longToken = $getLongToken['access_token'];

            $user = $request->user();
            dd($user);
            $user->fb_access_token = $longToken;
            $user->save();

            return response()->json(["token" => $longToken ]);
            return Inertia('Dashboard/Integracoes', [
                'token' => $longToken
            ]);
        }

        return response()->json(["error" => "Não foi possível obter o token de acesso."]);
    }

}
