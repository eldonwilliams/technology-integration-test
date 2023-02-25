import { useDispatch } from "react-redux";
import { updateAuthentication } from "../../store/AuthSlice";
import useApi from "./useApi";

function useAuthUpdate(): () => void {
    const api = useApi();
    const dispatch = useDispatch();
    
    const request = api.path('/authentication/session').method('get').create()

    return () => {
        request({})
            .then((value) => {
                if (value.status !== 200) return;
                dispatch(updateAuthentication({ who: value.data.user, }))
            })
            .catch(e => {
                if (e instanceof request.Error) {
                    dispatch(updateAuthentication({ who: undefined, }))
                }
            });
    }
}

export default useAuthUpdate;