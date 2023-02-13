import useAuthUpdate from "../hooks/useAuthUpdate";

function Logout() {
    const update = useAuthUpdate();

    return (
        <button
            onClick={() => {
                fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, { credentials: "include", })
                    .then(update)
                    .catch(update);
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