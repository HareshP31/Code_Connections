import React, { useEffect } from "react";

const Chatbot = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            setTimeout(() => {
                if (typeof window.botpress === "undefined") {
                    console.error("Botpress is not defined!");
                    return;
                }
                console.log("Botpress initialized");
                window.botpress.init({
                    botId: import.meta.env.VITE_BOTPRESS_BOT_ID,
                    configuration: {
                        website: {},
                        email: {},
                        phone: {},
                        termsOfService: {},
                        privacyPolicy: {},
                        color: "4F20E8", 
                        variant: "solid", 
                        themeMode: "dark", 
                        fontFamily: "inter", 
                        radius: 1, 
                        botName: "Code Connections",
                        description: "Here to assist you with any hackathon-related questions!",
                    },
                    clientId: import.meta.env.VITE_BOTPRESS_BOT_ID,
                });
            }, 500); 
        };
        script.onerror = () => {
            console.error("Error loading Botpress WebChat script.");
        };
        return () => {
            document.body.removeChild(script); 
        };
    }, []);
    return null; 
};

export default Chatbot;
