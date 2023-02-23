import { useSelector } from "react-redux";
import { FarmIdleBackend } from "../../api-client";
import { RootState } from "../../store";

function useApi(): FarmIdleBackend {
    const selected = useSelector((state: RootState) => state.api.farmIdleClient);
    return selected
}

export default useApi;