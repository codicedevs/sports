'use client'
import { useState } from "react"
function Button() {
    const [open, setOpen] = useState(false)
    
    function toggle() {
        setOpen(() => !open)
    }

    return (
        <button onClick={toggle} className={`fixed bg-[#0a2b1d] bottom-0 w-full rounded-t-lg duration-300 transition-all ${open ? 'h-2/3' : 'h-14'}`}>
            <div className="p-4 text-center">
                <p className="font-semibold text-white">ANOTARME</p>
            </div>
        </button>
    )
}

export default Button