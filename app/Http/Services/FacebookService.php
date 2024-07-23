<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

class FacebookService {

    public static function getLongToken($accessToken){

        $metaId = env("META_APP_ID");
        $metaSecret = env("META_SECRET_KEY");

        $link = "https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${metaId}&client_secret=${metaSecret}&fb_exchange_token=${accessToken}";

    
        
        $response = Http::get($link);
       
        return $response;
    }

    public static function getAdaccounts($accessToken){

        $link = "https://graph.facebook.com/v20.0/me?fields=adaccounts&access_token=${accessToken}";

        $response = Http::get($link);
        
        return $response;
    }
}