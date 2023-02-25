import { HTMLInputTypeAttribute, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/apiHooks/useApi";


type InputEventHandler = React.ChangeEventHandler<HTMLInputElement>;

interface SignupInputProps {
    type: HTMLInputTypeAttribute,
    name: string,
    state: Record<string, string>,
    eventFactory: (key: string) => InputEventHandler,
    noConfirm?: boolean,
}

function SignupInput({ type, name, state, eventFactory, noConfirm = false }: SignupInputProps) {
    const capitalized = name.slice(0,1).toUpperCase() + name.toLowerCase().slice(1);
    const lowercase = name.toLowerCase();

    return (
        <>
            <input type={type} placeholder={capitalized} value={state[lowercase] ?? ""} onChange={eventFactory(lowercase)} />
            {!noConfirm && <input type={type} placeholder={`Confirm ${capitalized}`} value={state[`confirm${capitalized}`] ?? ""} onChange={eventFactory(`confirm${capitalized}`)}/>}
        </>
    );
}

function Signup() {
    const [formState, setFormState] = useState<Record<string, string>>({});
    const api = useApi();

    const signupRequest = api.path('/account/signup').method('post').create();

    const getFormUpdater = (key: string): InputEventHandler => {
        return (event) => setFormState((old) => ({ ...old, [key]: event.target.value, }));
    }

    const submit = () => {
        if (
            (formState.password !== formState.confirmPassword) ||
            (Object.keys(formState).length !== 3)
        ) return;

        setFormState({ pending: "true" });

        signupRequest({ username: formState.username, password: formState.password, })
            .then((response) => {
                if (response.status !== 201) return;
                setFormState({ successState: "Successfully created account!", });
            })
            .catch((e) => {
                if (e instanceof signupRequest.Error) {
                    const error = e.getActualType();
                    let successState = "An Unknown Error Occurred...";
                    switch (error.status) {
                        case 400:
                            let badUser = error.data.details.username.length !== 0;
                            let badPass = error.data.details.password.length !== 0;
                            successState = `The ${badUser ? "username" : ''}${badUser && badPass ? " and " : ""}${badPass ? "password" : ''} was invalid`
                            break;
                        case 403:
                            successState = "You may not register an account whilst logged in";
                            break;
                        case 409:
                            successState = "An account with that username already exists!";
                            break;
                        case 500:
                            successState = "There was an internal server error :(";
                            break;
                    }
                    setFormState({ successState, })
                }
            });
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
                <SignupInput type="text" name="Username" state={formState} eventFactory={getFormUpdater} noConfirm />
                <SignupInput type="password" name="Password" state={formState} eventFactory={getFormUpdater} />
            </form>
            <div className="links">
                <button onClick={submit} disabled={formState?.pending === "true"}>Sign-up</button>
                <Link to="/">Back</Link>
            </div>
        </>
    )
}

export default Signup;