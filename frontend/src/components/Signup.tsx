import { HTMLInputTypeAttribute, useState } from "react";
import { Link } from "react-router-dom";


type InputEventHandler = React.ChangeEventHandler<HTMLInputElement>;

interface SignupInputProps {
    type: HTMLInputTypeAttribute,
    name: string,
    state: Record<string, string>,
    eventFactory: (key: string) => InputEventHandler,
}

function SignupInput({ type, name, state, eventFactory, }: SignupInputProps) {
    const capitalized = name.slice(0,1).toUpperCase() + name.toLowerCase().slice(1);
    const lowercase = name.toLowerCase();

    return (
        <>
            <input type={type} placeholder={capitalized} value={state[lowercase] ?? ""} onChange={eventFactory(lowercase)} />
            <input type={type} placeholder={`Confirm ${capitalized}`} value={state[`confirm${capitalized}`] ?? ""} onChange={eventFactory(`confirm${capitalized}`)}/>
        </>
    );
}

function Signup() {
    const [formState, setFormState] = useState<Record<string, string>>({});

    const getFormUpdater = (key: string): InputEventHandler => {
        return (event) => setFormState((old) => ({ ...old, [key]: event.target.value, }));
    }

    const submit = () => {
        if (
            (formState.username !== formState.confirmUsername) ||
            (formState.password !== formState.confirmPassword) ||
            (Object.keys(formState).length !== 4)
        ) return;

        setFormState((old) => ({ ...old, pending: "true", }));

        fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
            body: JSON.stringify({
                username: formState.username,
                password: formState.password,
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => setFormState((old) => ({ ...old, successState: res.status === 200 ? "Successfully created account!" : "Error", })))
            .catch(err => setFormState((old) => ({ ...old, successState: "Bad Error", })))
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
                <SignupInput type="text" name="Username" state={formState} eventFactory={getFormUpdater} />
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