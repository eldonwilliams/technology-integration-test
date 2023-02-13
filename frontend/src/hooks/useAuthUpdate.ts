import { useDispatch } from "react-redux";
import { updateAuthentication } from "../Store/AuthSlice";

/**
 * Creates a function which can be used to update the auth state in redux
 */
function useAuthUpdate(): () => void {
    const dispatch = useDispatch();

    return () => {
        let who: string | undefined;
        const submit = () => dispatch(updateAuthentication({ who: who, }))

        fetch(`${import.meta.env.VITE_API_URL}/auth/whoami`, { credentials: "include", cache: "reload", })
            .then(res => res.json())
            .then(res => { who = res.success; submit(); })
            .catch(() => { who = undefined; submit(); });
    }
}

export default useAuthUpdate;