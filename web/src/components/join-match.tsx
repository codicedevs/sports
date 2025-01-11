'use client'

import type { Match } from "@/types"
import Image from "next/image"
import { signInWithPopup, UserCredential } from "firebase/auth"
import { useState } from "react"
import { auth, googleProvider } from "../../lib/sso"
import { toast } from "react-toastify"
import joinPlayerToMatch from "@/services/join-player"
import whatsapp from "../../assets/wsapp.svg"

function JoinMatch(
    {
        match,
        token,
        fetchMatch
    }: {
        match: Match,
        token: string | null,
        fetchMatch: () => void
    }
) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [hasJoined, setHasJoined] = useState(false)

    function toggle() {
        setOpen(() => !open)
    }

    async function gmailSSO() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            joinPlayer(result.user)
        } catch (error) {
            console.error("Error de autenticación:", error);
        }
    }
    async function joinPlayer(user: UserCredential["user"]) {
        try {
            await joinPlayerToMatch(match._id, user.uid, token!)
            fetchMatch()
            setHasJoined(true)
            toast.success('Te has unido al partido 💛!')
        } catch (error) {
            console.error("Error al unirse al partido:", error);
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Enlace copiado')
    }

    if (hasJoined) {
        return (
            <button
                onClick={copyToClipboard}
                className="bg-[#0a2b1d] text-white p-2 m-4 rounded text-sm flex items-center gap-2 w-fit mx-auto"
            >
                Compartir enlace
                <Image src={whatsapp} alt="whatsapp" className="w-5 h-5" />
            </button>
        )
    }

    return (
        <div className={`fixed bg-[#0a2b1d] bottom-0 w-full rounded-t-lg duration-300 transition-all ${open ? 'h-1/3' : 'h-14'}`}>
            <button onClick={toggle} className={`p-4  w-full transition-all ${open ? 'text-right' : 'text-center'}`}>
                <p className="font-semibold text-white text-sm">
                    {open ? '❌' : 'Unirse al partido'}
                </p>
            </button>
            <form className="px-4 text-white">
                <label className="text-xs font-semibold">Nombre</label>
                <input
                    required
                    className="w-full bg-[#0a2b1d] outline-white border-[#D9D9D950] border rounded-md p-2"
                    placeholder="Lionel Messi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </form>
            {open && name && (
                <button
                    onClick={gmailSSO}
                    className="bg-[#115e2a] text-white p-2 m-4 rounded text-xs flex ml-auto"
                >
                    CONFIRMAR
                </button>
            )}
        </div>
    )
}

export default JoinMatch