"use client";

import Image from "next/image";
import { Fragment } from "react";
import Head from "next/head";

interface User {
    _id: string;
    name: string;
}

export default async function Home() {
    const res = await fetch('https://e2be-181-199-145-212.ngrok-free.app/matches/676d903e73a26a0de5f38bde', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmY3MDU1YTI2ZmM3YWEyZWFiYjk0ZWYiLCJ1c2VybmFtZSI6ImRpZWdvKzEiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTczNTMxMTE1MiwiZXhwIjoxNzM1Mzk3NTUyfQ.5y94jC7n02mbYHScxjTeJ_0-87B4GhvqLiwbnH7jB7M'
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        return (
            <div>
                <h1>Error loading matches</h1>
                <p>Please try again later.</p>
            </div>
        );
    }

    const match = await res.json();
    console.log(match, 'match');

    return (
        <div className="p-4">
            {/* Dynamic meta tags */}
            <Head>
                <title>{`Partido: ${match.name}`}</title>
                <meta name="description" content={`Jugadores: ${match.users.map((user: User) => user.name).join(", ")}`} />
                <meta name="keywords" content={`Partido, ${match.name}, ${match.location.name}, ${match.users.map((user: User) => user.name).join(", ")}`} />
            </Head>
            <nav className="w-full flex justify-center items-center mb-4">
                <Image
                    src="/logo-sports.png"
                    alt="Sports"
                    width={80}
                    height={80}
                />
            </nav>
            <main>
                {match ? (
                    <Fragment key={match._id}>
                        <h3 className="font-bold">Partido</h3>
                        <p>Nombre {match.name}</p>
                        <p>Fecha {match.date}</p>
                        <p>Hora {match.hour}</p>
                        <p>Lugar {match.location.name}</p>
                        <h3 className="font-bold">Jugadores</h3>
                        {match.users.map((player: User) => (
                            <div key={player._id}>
                                <p>{player.name}</p>
                            </div>
                        ))}
                    </Fragment>
                ) : (
                    <p>No users found.</p>
                )}
            </main>
        </div>
    );
}
