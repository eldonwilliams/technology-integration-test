import { useEffect, useState } from "react";

function useOnline(): boolean {
    const [online, setOnline] = useState(navigator.onLine);
    const update = () => setOnline(navigator.onLine);

    useEffect(() => {
        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        }
    });

    return online;
}

export default useOnline;