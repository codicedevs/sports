'use client'

import { signInWithPopup } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, googleProvider } from "../../lib/sso"
import { toast } from "react-toastify"
import { useParams } from "next/navigation"
import Image from "next/image"
import joinPlayerToMatch from "@/services/join-player"
import whatsapp from "../../assets/wsapp.svg"
import googleSignIn from "@/services/google-sign-in"
import getMatch from "@/services/get-match"
import Match from "@/components/match"

function JoinMatch() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')
    const [hasJoined, setHasJoined] = useState(false)
    const [match, setMatch] = useState<Match | null>(null)
    const [loading, setLoading] = useState(true)
    const { id }: { id: string } = useParams()

    function toggle() {
        setOpen(() => !open)
    }

    async function gmailSSO() {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const data = {
                idToken: result.user.getIdToken(),
                scopes: [],
                serverAuthCode: '1',
                user: {
                    email: result.user.email,
                    familyName: result.user.displayName,
                    givenName: result.user.displayName,
                    id: result.user.uid,
                    name: result.user.displayName,
                    photo: result.user.photoURL
                }
            }

            const user = await googleSignIn(data)
            console.log(user._doc._id);
            joinPlayer(user._doc._id)
        } catch (error) {
            console.log("Error de autenticación:", JSON.stringify(error));
        }
    }
    async function joinPlayer(userId: string) {
        try {
            await joinPlayerToMatch(id, userId)
            fetchMatch()
            setHasJoined(true)
            toast.success('Te has unido al partido 💛!')
        } catch (error) {
            console.error("Error al unirse al partido:", error);
        }
    }

    async function fetchMatch() {
        try {
            setLoading(true)
            const res = await getMatch(id)
            setMatch(res)
        } catch (error) {
            console.error("Error al traer el partido:", error);
        } finally {
            setLoading(false)
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Enlace copiado')
    }

    useEffect(() => {
        fetchMatch()
    }, [])

    if (loading) {
        return (
            <div className="grid place-items-center px-4 pt-4 h-[calc(100dvh-94px)]">
                <span className="text-2xl font-bold text-white animate-spin w-10 h-10 rounded-full border-t-green-600 border-4 border-white" />
            </div>
        )
    }

    if (!match && !loading) {
        return (
            <div className="grid place-items-center px-4 pt-4">
                <h1 className="text-2xl font-bold text-white">Partido no encontrado</h1>
                <p className="text-lg text-white">No se pudo encontrar el partido</p>
            </div>
        )
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
        <>
            <Match match={match} />
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
        </>
    )
}

export default JoinMatch