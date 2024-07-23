export const initFacebookSDK = () => {

    return new Promise(resolve => {
        window.fbAsyncInit = function() {
            FB.init({
                appId: '3695293237458988',
                cookie: true,
                xfbml: true,
                status: true,
                version: "v2.0",
            });

            resolve();
    }
});
}

export const getFacebookLoginStatus = () => {
    return new Promise((resolve, reject) => {
        FB.getLoginStatus(response => {
            resolve(response);
    });
});
}

export const fbLogin = () => {
    return new Promise((resolve, reject) => {
        FB.login(response => {
            resolve(response);
    });
})
}

export const fbLogout = () => {
    return new Promise((resolve, reject) => {
        FB.logout(response => {
            resolve(response);
    });
})
}