import { Link } from "react-router-dom";


function Signup() {
    return (
        <>
            <form>
                <input type="text" placeholder="Username" />
                <input type="text" placeholder="Confirm Username" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
            </form>
            <div className="links">
                <button>Sign-up</button>
                <Link to="/">Back</Link>
            </div>
        </>
    )
}

export default Signup;