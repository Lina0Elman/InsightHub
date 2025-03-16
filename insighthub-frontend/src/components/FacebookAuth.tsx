import { useEffect } from "react";

declare global {
    interface Window {
        fbAsyncInit: () => void;
        FB: {
            init: (options: {
                appId: string;
                cookie: boolean;
                xfbml: boolean;
                version: string;
            }) => void;
        };
    }
}

const FacebookAuth = () => {
    useEffect(() => {
        // Load Facebook SDK dynamically
        const loadFacebookSDK = () => {
            if (document.getElementById("facebook-jssdk")) return;

            const script = document.createElement("script");
            script.id = "facebook-jssdk";
            script.src = "https://connect.facebook.net/en_US/sdk.js";
            script.async = true;
            script.onload = initFacebookSDK;
            document.body.appendChild(script);
        };

        // Initialize the Facebook SDK
        const initFacebookSDK = () => {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: "4027226094160420", // Replace with your actual Facebook App ID
                    cookie: true,
                    xfbml: true,
                    version: "v17.0",
                });
            };
        };

        loadFacebookSDK();
    }, []);

    return null; // This component does not render UI
};

export default FacebookAuth;
