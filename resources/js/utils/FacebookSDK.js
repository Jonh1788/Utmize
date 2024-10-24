export const initFacebookSDK = () => {
    return new Promise(resolve => {
        // Verificar se o SDK já foi inicializado
        if (window.FB) {
            resolve(window.FB);
        } else {
            window.fbAsyncInit = function() {
                FB.init({
                    appId: '955055336199035',
                    cookie: true,
                    xfbml: true,
                    version: "v20.0",
                });
                resolve(FB);
            };

            // Carregar o SDK do Facebook dinamicamente
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    });
}

export const getFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        if (!window.FB) {
            return reject('Facebook SDK não foi inicializado.');
        }
        FB.getLoginStatus(response => {
            if (response) {
                resolve(response);
            } else {
                reject('Não foi possível obter o status de login.');
            }
        });
    });
}

export const fbLogin = () => {
    return new Promise((resolve, reject) => {
        if (!window.FB) {
            return reject('Facebook SDK não foi inicializado.');
        }
        FB.login(response => {
            if (response.authResponse) {
                resolve(response);
            } else {
                reject('Usuário cancelou o login ou não autorizou o aplicativo.');
            }
        }, { scope: 'public_profile,email,ads_management,business_management, ads_read' }); // Adicione os escopos necessários
    });
}

export const fbLogout = () => {
    return new Promise((resolve, reject) => {
        if (!window.FB) {
            return reject('Facebook SDK não foi inicializado.');
        }
        FB.logout(response => {
            resolve(response);
        });
    });
}