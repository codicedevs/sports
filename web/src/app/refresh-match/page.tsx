'use client'

import type { Match as IMatch } from "@/types";
import { useState } from "react";
import getMatch from "@/services/get-match";
import getToken from "@/services/get-token"
import Match from "@/components/match";
import JoinMatch from "@/components/join-match";

function RefreshMatch() {
    const [match, setMatch] = useState<IMatch | null>(null);
    const [token, setToken] = useState<string | null>(null);

    async function fetchUser() {
        try {
            const user = await getToken();
            const match = await getMatch(user.access_token);
            
            setToken(user.access_token);
            setMatch(match);
        } catch (e) {
            console.error("Error al traer partido UI:", e);
        }
    }
    async function fetchMatch() {
        try {
            const match = await getMatch(token!);
            setMatch(match);
        } catch (e) {
            console.error("Error al traer partido UI:", e);
        }
    }

    if (match) return (
        <>
            <Match match={match} />
            <JoinMatch match={match} token={token} fetchMatch={fetchMatch} />
        </>
    )


    return (
        <button
            className="bg-[#0a2b1d] text-white p-2 mt-4 rounded uppercase text-sm flex mx-auto"
            onClick={fetchUser}
        >
            Nuevo Token
        </button>
    )
}

export default RefreshMatch