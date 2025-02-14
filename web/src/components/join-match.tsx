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
import Match from "@/components/match"

function JoinMatch() {
    const [hasJoined, setHasJoined] = useState(false)
    const [match, setMatch] = useState<Match | null>(null)
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
            const res = await getMatch(params?.id)
            setMatch(res)
        } catch (error) {
            console.error("Error al traer el partido:", error)
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
                <span className="text-6xl rotate-180 animate-bounce">⚽</span>
            </div>
        )
    }

    if (!match && !loading) {
        return (
            <div className="h-[100dvh] p-4 grid gap-2 place-content-center">
                <span className="text-4xl text-center">🙁</span>
                <div className="text-center">
                    <h1 className="text-2xl font-bold italic">Partido no encontrado</h1>
                    <p className="text-lg italic">No se pudo encontrar el partido</p>
                </div>
            </div>
        )
    }

    if (!hasJoined) {
        return (
            <div className="p-4">
                <p className="first-letter:uppercase whitespace-nowrap text-ellipsis overflow-hidden italic mb-4">
                    Te has unido al partido
                </p>
                <button
                    onClick={copyToClipboard}
                    className="bg-[#151515] text-white p-2 text-sm flex items-center justify-center gap-2 w-full italic"
                >
                    <div className="flex gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clip-path="url(#clip0_620_617)">
                                <path d="M12.8192 11.8092C12.2087 11.8092 11.6626 12.0502 11.2449 12.4277L5.51798 9.09438C5.55814 8.90964 5.59027 8.7249 5.59027 8.53213C5.59027 8.33936 5.55814 8.15462 5.51798 7.96988L11.1806 4.66867C11.6144 5.07028 12.1847 5.31928 12.8192 5.31928C14.1525 5.31928 15.2288 4.24297 15.2288 2.90964C15.2288 1.57631 14.1525 0.5 12.8192 0.5C11.4859 0.5 10.4096 1.57631 10.4096 2.90964C10.4096 3.10241 10.4417 3.28715 10.4818 3.47189L4.81919 6.77309C4.38545 6.37149 3.81517 6.12249 3.18063 6.12249C1.8473 6.12249 0.770996 7.19879 0.770996 8.53213C0.770996 9.86546 1.8473 10.9418 3.18063 10.9418C3.81517 10.9418 4.38545 10.6928 4.81919 10.2912L10.5381 13.6325C10.4979 13.8012 10.4738 13.9779 10.4738 14.1546C10.4738 15.4478 11.526 16.5 12.8192 16.5C14.1124 16.5 15.1646 15.4478 15.1646 14.1546C15.1646 12.8614 14.1124 11.8092 12.8192 11.8092Z" fill="#FEFFFA" />
                            </g>
                            <defs>
                                <clipPath id="clip0_620_617">
                                    <rect width="15.99" height="16" fill="white" transform="translate(0.00488281)" />
                                </clipPath>
                            </defs>
                        </svg>
                        Compartir Link
                    </div>
                </button>
            </div>
        )
    }

    return (
        <>
            {match && <Match match={match} />}
            <div className="fixed bottom-0 max-w-[480px] w-full">
                <div className="bg-[#151515]">
                    <button onClick={gmailSSO} className="p-4 text-xl font-bold flex justify-center items-center italic gap-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M18 7.875H10.125V0H7.875V7.875H0V10.125H7.875V18H10.125V10.125H18V7.875Z" fill="#D9FA53" />
                        </svg>
                        <p className="font-bold text-[#D9FA53] text-xl">
                            Unirse al partido
                        </p>
                    </button>
                </div>
            </div>
        </>
    )
}

export default JoinMatch