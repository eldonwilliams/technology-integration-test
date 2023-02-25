import { ChangeEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/apiHooks/useApi";
import useAuthUpdate from "../hooks/apiHooks/useAuthUpdate";

function Login() {
    const [formState, setFormState] = useState<Record<string, string>>({});
    const updateAuth = useAuthUpdate();
    const api = useApi();

    const loginRequest = api.path('/authentication/login').method('post').create();

    const getFormUpdater = (key: string): ChangeEventHandler<HTMLInputElement> => {
        return (event) => setFormState((old) => ({ ...old, [key]: event.target.value, }));
    }

    const submit = () => {
        if (Object.keys(formState).length !== 2) return;
        setFormState((old) => ({ ...old, pending: "true", }));

        loginRequest({ username: formState.username, password: formState.password, })
            .then((response) => {
                if (response.status !== 200) return;
                setFormState({ successState: "Successfully logged in!", });
            })
            .catch((e) => {
                if (e instanceof loginRequest.Error) {
                    const error = e.getActualType();
                    let successState = "Something really weird happened..."
                    switch (error.status) {
                        case 401:
                            successState = "Incorrect Password";
                            break;
                        case 403:
                            successState = "You are already logged in";
                            break;
                        case 404:
                            successState = "No account exists by that username";
                            break;
                    }
                    setFormState({ successState, })
                }
            })
            .finally(updateAuth);
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