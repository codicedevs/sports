import type { Match, User } from "@/types"
import { format } from "@formkit/tempo"

const Match = ({ match }: { match: Match }) => {
    return (
        <div className="grid gap-4 p-4">
            <div className="bg-[#0a2b1d] rounded-md p-2 w-full overflow-hidden flex flex-col gap-1">
                <p title={match.name} className="text-sm text-white uppercase font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                    {match.name}
                </p>
                <p title={match.name} className="text-sm text-white whitespace-nowrap text-ellipsis overflow-hidden flex items-center gap-1">
                    <span className="text-xs">📍</span>
                    {match.location.address}
                    <span>
                        {format({
                            date: new Date(match.date),
                            format: "medium",
                            locale: 'es'
                        })}
                    </span>
                </p>
                <hr className="my-1 border-[#D9D9D950]" />
                <div>
                    <p className="text-sm text-white mb-1">Jugadores confirmados: {match.users.length} de {match.playersLimit}</p>
                    <ul className="list-disc list-inside">
                        {match.users.map((user: User) => (
                            <li key={user._id} className="text-sm text-white pl-2 capitalize">{user.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Match