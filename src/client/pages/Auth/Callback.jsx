import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Callback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authCode = params.get("code");

        if (authCode) {
            axios
                .get(`http://127.0.0.1:8000/spotify/api/callback/?code=${authCode}`)
                .then(() => {
                    navigate("/home"); // Redirect user to the dashboard
                })
                .catch((error) => {
                    console.error("Error during callback:", error);
                });
        } else {
            console.error("Authorization code not found in URL");
        }
    }, [navigate]);

    return <h1>Processing Login...</h1>;
}

export default Callback;