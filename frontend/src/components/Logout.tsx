import useApi from "../hooks/apiHooks/useApi";
import useAuthUpdate from "../hooks/apiHooks/useAuthUpdate";


function Logout() {
    const update = useAuthUpdate();
    const api = useApi();

    const logoutRequest = api.path('/authentication/logout').method("get").create();

    return (
        <button
            onClick={() => {
                logoutRequest({})
                    .then(update)
                    .catch(update)
            }}
            style={{
                marginBottom: "10px",
                width: "100%",
            }}
        >
            Logout
        </button>
    )
}

export default Logout;