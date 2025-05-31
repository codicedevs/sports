'use client'

import { jwtDecode } from "jwt-decode";
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
import getPlayers from "@/services/get-players"
import Match from "@/components/match"

function JoinMatch() {
    const [hasJoined, setHasJoined] = useState(false)
    const [match, setMatch] = useState<Match | null>(null)
    const [players, setPlayers] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const params = useParams() as { id: string } | null

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
            const { sub } = jwtDecode(user.accessToken)
            joinPlayer(sub!)
        } catch (error) {
            console.log("Error de autenticación:", error);
        }
    }
    async function joinPlayer(userId: string) {
        try {
            if (!params?.id) {
                throw new Error('ID de partido no encontrado')
            }
            await joinPlayerToMatch(params?.id, userId)
            fetchMatch()
            setHasJoined(true)
            toast.success('Te has unido al partido 💛!')
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error('Error al unirse al partido')
            }
        }
    }

    async function fetchMatch() {
        try {
            setLoading(true)
            if (!params?.id) {
                throw new Error('ID de partido no encontrado')
            }
            const res = await getMatch(params.id)
            setMatch(res)
            // fetchPlayers()
        } catch (error) {
            console.error("Error al traer el partido/jugadores:", error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchPlayers() {
        if (!params?.id) {
            throw new Error('ID de partido no encontrado')
        }
        const res = await getPlayers(params.id)
        console.log(res);
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
                className="bg-[#151515] text-white py-2 px-4 m-4 text-sm flex items-center justify-center gap-2 w-full italic"
            >
                Compartir
                <Image src={whatsapp} alt="whatsapp" className="w-5 h-5" />
            </button>
        )
    }

    return (
        <>
            {match && <Match players={players} match={match} />}
            <div className="fixed bottom-0 max-w-[480px] w-full rounded-t-lg">
                <div className="bg-[#D9FA53] rounded-t-lg">
                    <button onClick={gmailSSO} className="p-4 text-xl font-bold flex justify-center items-center italic gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M18 7.875H10.125V0H7.875V7.875H0V10.125H7.875V18H10.125V10.125H18V7.875Z" fill="#151515" />
                        </svg>
                        <p className="font-bold text-[#0a2b1d] text-xl">
                            Unirse al partido
                        </p>
                    </button>
                </div>
            </div>
        </>
    )
}

export default JoinMatch