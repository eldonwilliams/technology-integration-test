import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ApiClient } from "../../store/ApiSlice";

function useApi(): ApiClient {
    const selected = useSelector((state: RootState) => state.api.apiClient);
    return selected
}

export default useApi;