import React, { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";

const GoogleAuthButton = () => {
    const initialized = useRef(false);
    const { loading, handleGoogleAuth } = useAuth()

    const handleGoogleSignIn = async (response) => {
        const success = await handleGoogleAuth(response.credential)
        // console.log("Google Sign-In Response:", response.credential);
        
    };

    useEffect(() => {
        if (initialized.current || !window.google) return;

        window.google.accounts.id.initialize({
            client_id: "501409311648-u2hvus2o19gleh4dmjemtrgjiiobjeoa.apps.googleusercontent.com",
            callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-signin"),
            {
                theme: "outline",
                size: "large",
                text: "continue_with",
                width: 350,
            }
        );

        initialized.current = true;
    }, []);

    return (
        <div>
            <div id="google-signin"></div>
            {loading && <div className="mt-2 text-sm text-gray-500">Processing...</div>}
        </div>
    );
};

export default GoogleAuthButton;