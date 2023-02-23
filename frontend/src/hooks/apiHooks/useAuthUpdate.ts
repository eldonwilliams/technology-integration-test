import { useDispatch } from "react-redux";
import useApi from "./useApi";

function useAuthUpdate(): () => void {
    const api = useApi();
    const dispatch = useDispatch();
    
    return () => {
        api.authentication.getSessionInfo()
            .then(value => {
                
            })
    }
}

export default useAuthUpdate;