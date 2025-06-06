import type { Match, User } from "@/types"
import { format } from "@formkit/tempo"

const Match = ({ match, players }: { match: Match, players: any }) => {
    return (
        <div className="p-4 text-[#151515]">
            <div className="bg-[#151515] rounded-lg p-4 grid gap-2">
                <p title={match.user.name} className="text-[#D9FA53] first-letter:uppercase whitespace-nowrap text-ellipsis overflow-hidden">
                    {match.user.name} te ha invitado a un partido
                </p>
                <div className="flex gap-2">
                    <div className="flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M14.94 4.16063C14.89 4.07064 14.83 3.97063 14.78 3.88063C13.7 2.15063 12.02 0.920635 10.06 0.400635C8.72 0.0406348 7.28 0.0406348 5.96 0.390635C4 0.910635 2.33 2.14063 1.25 3.86063C1.25 3.86063 1.25 3.86063 1.25 3.87063C0.47 5.07063 0.05 6.44063 0 7.85063C0 7.95063 0 8.04064 0 8.13064C0 9.92064 0.6 11.6606 1.7 13.0606L1.79 13.1806C2.7 14.3106 3.9 15.1606 5.25 15.6506C6.12 15.9706 7.05 16.1306 7.99 16.1306C8.93 16.1306 9.85 15.9706 10.73 15.6506C11.24 15.4706 11.72 15.2306 12.18 14.9506C12.79 14.5806 13.35 14.1206 13.84 13.5906C13.96 13.4606 14.08 13.3206 14.2 13.1806C15.36 11.7606 16 9.96063 16 8.12063C16 8.03063 16 7.93063 16 7.84063C15.96 6.54064 15.59 5.27063 14.95 4.15063L14.94 4.16063ZM8.27 3.14063L10.34 1.63063C10.4 1.58063 10.45 1.52063 10.48 1.46063C11.74 1.93063 12.84 2.74063 13.66 3.82063C13.62 3.86063 13.59 3.92063 13.57 3.98063L12.78 6.40063L10.35 7.10063L8.28 5.59063V3.14063H8.27ZM5.52 1.46063C5.55 1.53063 5.6 1.59063 5.66 1.63063L7.73 3.14063V5.59063L5.66 7.10063L3.23 6.40063L2.44 3.98063C2.42 3.92063 2.39 3.87063 2.35 3.82063C3.17 2.74063 4.26 1.93063 5.53 1.46063H5.52ZM2.22 12.2206C2.22 12.2206 2.2 12.2206 2.19 12.2206C1.42 11.1206 0.97 9.82064 0.9 8.48064C0.93 8.47064 0.96 8.45064 0.99 8.43064L3.07 6.92063L5.5 7.62063L6.28 10.0406L4.68 12.2306H2.22V12.2206ZM10 14.9506C9.35 15.1406 8.68 15.2406 8 15.2406C7.32 15.2406 6.65 15.1406 6 14.9506L5.21 12.5206C5.21 12.5206 5.19 12.4706 5.18 12.4406L6.72 10.3306H9.26L10.75 12.5306C10.75 12.5306 10.76 12.5406 10.77 12.5506L9.99 14.9406L10 14.9506ZM13.81 12.2206C13.81 12.2206 13.79 12.2206 13.78 12.2206H11.21C11.21 12.2206 11.19 12.2206 11.18 12.2206L9.7 10.0406L10.49 7.62063L12.92 6.92063L15 8.43064C15 8.43064 15.06 8.47064 15.09 8.48064C15.02 9.83064 14.57 11.1306 13.8 12.2306L13.81 12.2206Z" fill="#FEFFFA" />
                        </svg>
                        <p className="text-sm text-white whitespace-nowrap text-ellipsis overflow-hidden">
                            Fútbol 5
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M11.74 9.1L8.86 7.67V4.02C8.86 3.61 8.53 3.28 8.12 3.28C7.71 3.28 7.38 3.61 7.38 4.02V8.12C7.38 8.4 7.54 8.65 7.79 8.78L11.07 10.42C11.17 10.47 11.29 10.5 11.4 10.5C11.68 10.5 11.93 10.34 12.06 10.1C12.15 9.93 12.17 9.72 12.11 9.53C12.05 9.34 11.91 9.18 11.74 9.1Z" fill="#FEFFFA" />
                            <path d="M13.87 2.38C12.34 0.85 10.3 0 8.13 0C5.96 0 3.92 0.85 2.38 2.38C0.850001 3.91 0 5.95 0 8.13C0 10.31 0.850001 12.34 2.38 13.88C3.91 15.42 5.99 16.26 8.13 16.26C10.27 16.26 12.34 15.41 13.88 13.88C15.42 12.35 16.26 10.3 16.26 8.13C16.26 5.96 15.41 3.92 13.88 2.39L13.87 2.38ZM14.77 8.12C14.77 9.89 14.08 11.56 12.82 12.82C11.57 14.07 9.9 14.77 8.12 14.77C6.35 14.77 4.68 14.08 3.42 12.82C2.17 11.56 1.47 9.9 1.47 8.12C1.47 6.34 2.16 4.68 3.42 3.42C4.68 2.17 6.34 1.47 8.12 1.47C9.9 1.47 11.56 2.16 12.82 3.42C14.07 4.68 14.77 6.34 14.77 8.12Z" fill="#FEFFFA" />
                        </svg>
                        <p className="capitalize text-sm text-white whitespace-nowrap text-ellipsis overflow-hidden">
                            {match?.date ? format(new Date(match?.date), "ddd DD MMM HH:mm", 'es') : 'A definir'}
                            {match?.date ? <span className="text-xs"> hs</span> : ''}
                        </p>
                    </div>
                </div>
                <p title={match.name} className="text-sm text-white whitespace-nowrap text-ellipsis overflow-hidden flex items-center gap-1">
                    <span className="text-xs">📍</span>{match?.location?.address ? match.location.address : 'A definir'}
                </p>
            </div>
            <div>
                <p className="italic mt-6 mb-1">Partido</p>
                <div className="flex rounded-lg border border-[#151515]">
                    <div className="w-[136px] shrink-0 grid place-items-center py-4 px-3 bg-[#D9FA53] rounded-l-lg border-r border-dashed border-[#151515]">
                        <p className="capitalize">
                            {match?.date ? format(new Date(match?.date), "dddd", 'es') : 'Día a definir'}
                        </p>
                        <p className="italic font-black text-[56px]">
                            {match?.date ? format(new Date(match?.date), "DD", 'es') : '00'}
                        </p>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                <path d="M11.74 9.1L8.86 7.67V4.02C8.86 3.61 8.53 3.28 8.12 3.28C7.71 3.28 7.38 3.61 7.38 4.02V8.12C7.38 8.4 7.54 8.65 7.79 8.78L11.07 10.42C11.17 10.47 11.29 10.5 11.4 10.5C11.68 10.5 11.93 10.34 12.06 10.1C12.15 9.93 12.17 9.72 12.11 9.53C12.05 9.34 11.91 9.18 11.74 9.1Z" fill="#151515" />
                                <path d="M13.87 2.38C12.34 0.85 10.3 0 8.13 0C5.96 0 3.92 0.85 2.38 2.38C0.850001 3.91 0 5.95 0 8.13C0 10.31 0.850001 12.34 2.38 13.88C3.91 15.42 5.99 16.26 8.13 16.26C10.27 16.26 12.34 15.41 13.88 13.88C15.42 12.35 16.26 10.3 16.26 8.13C16.26 5.96 15.41 3.92 13.88 2.39L13.87 2.38ZM14.77 8.12C14.77 9.89 14.08 11.56 12.82 12.82C11.57 14.07 9.9 14.77 8.12 14.77C6.35 14.77 4.68 14.08 3.42 12.82C2.17 11.56 1.47 9.9 1.47 8.12C1.47 6.34 2.16 4.68 3.42 3.42C4.68 2.17 6.34 1.47 8.12 1.47C9.9 1.47 11.56 2.16 12.82 3.42C14.07 4.68 14.77 6.34 14.77 8.12Z" fill="#151515" />
                            </svg>
                            <p>
                                {match?.date ? format(new Date(match?.date), "HH:mm", 'es') : 'A definir'}
                                {match?.date ? <span className="text-xs"> hs</span> : ''}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 overflow-hidden whitespace-nowrap w-full flex flex-col justify-between">
                        <div>
                            <p className="font-extrabold text-2xl uppercase italic text-ellipsis overflow-hidden">{match?.location?.name ? match.location.name : 'Cancha'}</p>
                            <p className="font-extrabold text-2xl uppercase italic text-ellipsis overflow-hidden">{match?.location?.address ? match.location.address : 'A definir'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                    <path d="M16.25 7.84998C16.21 6.53998 15.84 5.23998 15.18 4.09998L15.14 4.02998C15.1 3.95998 15.06 3.87998 15.01 3.80998C13.91 2.05998 12.21 0.799984 10.23 0.279984H10.2C8.85 -0.0900165 7.42 -0.0900165 6.05 0.269984H6.03C4.04 0.799984 2.34 2.04998 1.26 3.77998L1.24 3.80998C0.48 5.02998 0.05 6.41998 0 7.84998C0 7.93998 0 8.03998 0 8.12998C0 9.93998 0.61 11.72 1.73 13.14L1.86 13.31C2.78 14.43 3.99 15.28 5.35 15.77C6.24 16.09 7.17 16.26 8.13 16.26C9.09 16.26 10.02 16.1 10.91 15.77C11.42 15.58 11.92 15.34 12.38 15.06C13 14.68 13.57 14.22 14.07 13.68C14.19 13.55 14.32 13.41 14.43 13.27C15.61 11.83 16.26 9.99998 16.26 8.12998C16.26 8.03998 16.26 7.93998 16.26 7.84998H16.25ZM10.72 7.71998L13.03 7.05998L15.07 8.53998C15.07 8.53998 15.09 8.55998 15.11 8.55998C15.03 9.82998 14.61 11.05 13.89 12.1H11.39L9.98 10.03L10.73 7.71998H10.72ZM13.57 3.93998L12.8 6.29998L10.49 6.95998L8.51 5.51998V3.19998L10.53 1.72998C10.53 1.72998 10.62 1.65998 10.65 1.60998C11.82 2.05998 12.84 2.81998 13.62 3.81998C13.6 3.85998 13.58 3.89998 13.57 3.93998ZM10.76 12.59L10.02 14.85C8.78 15.2 7.46 15.2 6.22 14.85L5.45 12.49V12.47L6.91 10.47H9.32L10.76 12.59ZM5.76 6.96998L3.45 6.30998L2.68 3.94998C2.68 3.94998 2.65 3.86998 2.63 3.82998C3.4 2.83998 4.43 2.07998 5.6 1.61998C5.63 1.66998 5.67 1.70998 5.72 1.73998L7.74 3.20998V5.52998L5.76 6.96998ZM3.22 7.04998L5.53 7.70998L6.27 9.99998L4.74 12.09H2.37C1.65 11.04 1.22 9.81998 1.15 8.54998C1.16 8.54998 1.17 8.53998 1.19 8.52998L3.23 7.04998H3.22Z" fill="#151515" />
                                </svg>
                                <p>5</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                    <path d="M13.4719 13.5006C13.4719 10.5345 11.7482 8.0759 9.24583 7.1047C10.9432 5.79226 11.267 3.35113 9.9458 1.64496C8.63336 -0.0524597 6.19223 -0.376194 4.48606 0.944993C2.78864 2.25743 2.4649 4.69856 3.78609 6.40473C3.98733 6.66722 4.22357 6.90346 4.48606 7.1047C1.98368 8.0759 0.26001 10.5345 0.26001 13.5006V14.1306H1.51995V13.5006C1.51995 10.342 3.79484 7.94466 6.8222 7.92716H6.90969C9.93705 7.94466 12.2119 10.342 12.2119 13.5006V14.1306H13.4719V13.5006ZM4.23232 4.0336C4.23232 2.58117 5.41351 1.39997 6.86594 1.40872C8.31838 1.40872 9.49957 2.58991 9.49082 4.04235C9.49082 5.47728 8.33588 6.64972 6.90094 6.66722H6.81345C5.37851 6.64097 4.22357 5.47728 4.22357 4.0336H4.23232Z" fill="#151515" />
                                </svg>
                                <p>{match.users.length}/{match.playersLimit ?? '10'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
                <p className="italic mt-6 mb-1">Jugadores</p>
                <div className="flex rounded-lg border border-[#151515] p-4 h-full">
                    <ul className="list-disc list-inside">
                        {players?.map((user: User) => (
                            <li key={user._id} className="text-sm pl-2 capitalize">{user.name}</li>
                        ))}
                    </ul>
                </div>
            </div> */}
        </div>
    )
}

export default Match