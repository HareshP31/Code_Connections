import React, { useEffect } from "react";

const Chatbot = () => {
    useEffect(() => {
        console.log("Bot ID:", import.meta.env.VITE_BOTPRESS_BOT_ID); // Check if the bot ID is loaded correctly

        const script = document.createElement("script");
        script.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";
        script.async = true;
        document.body.appendChild(script);

        // When the script is successfully loaded
        script.onload = () => {
            console.log("Botpress WebChat script loaded");

            // Wait for the script to fully initialize before calling botpress.init
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
                        color: "#3B82F6", // Customize as needed
                        variant: "solid", // Customize as needed
                        themeMode: "light", // Customize as needed
                        fontFamily: "inter", // Customize as needed
                        radius: 1, // Customize as needed
                    },
                    clientId: import.meta.env.VITE_BOTPRESS_BOT_ID,
                });
            }, 1000); // Delay to ensure everything is loaded
        };

        // Handle error in loading the script
        script.onerror = () => {
            console.error("Error loading Botpress WebChat script.");
        };

        return () => {
            document.body.removeChild(script); // Clean up the script when the component is unmounted
        };
    }, []);

    return null; // No need to return anything as Botpress injects the chat window
};

export default Chatbot;
