import { ChangeEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import useAuthUpdate from "../hooks/useAuthUpdate";

function Login() {
    const [formState, setFormState] = useState<Record<string, string>>({});
    const updateAuth = useAuthUpdate();

    const getFormUpdater = (key: string): ChangeEventHandler<HTMLInputElement> => {
        return (event) => setFormState((old) => ({ ...old, [key]: event.target.value, }));
    }

    const submit = () => {
        if (Object.keys(formState).length !== 2) return;
        setFormState((old) => ({ ...old, pending: "true", }));

        fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            body: JSON.stringify(formState),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then(res => {
                setFormState((old) => ({ ...old, successState: res.status === 200 ? "Successfully logged in!" : "Error", }))
                updateAuth();
            })
            .catch(err => setFormState((old) => ({ ...old, successState: err.toString(), })));
    }

    if (formState?.successState)
        return (
            <>
                <p>{formState.successState}</p>
                <Link to="/">Back</Link>
            </>
        )

    return (
        <>
            <form>
                <input type="text" placeholder="Username" value={formState.username ?? ""} onChange={getFormUpdater("username")} />
                <input type="password" placeholder="Password" value={formState.password ?? ""} onChange={getFormUpdater("password")} />
            </form>
            <div className="links">
                <button onClick={() => submit()} disabled={formState?.pending === "true"}>Login</button>
                <Link to="/">Back</Link>
            </div>
        </>
    )
}

export default Login;