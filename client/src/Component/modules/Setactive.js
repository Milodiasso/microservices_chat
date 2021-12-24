import { useState } from "react"

export default function useActive(){
    const [active, setActive] = useState('disable')

    function activator (){
        if (active == "active"){
            setActive('disable')
        } else {
            setActive('active')
        }
    }

    return [active, activator]
}
