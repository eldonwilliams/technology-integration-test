

function Signup() {
    return (
        <>
            <form>
                <input type="text" placeholder="Username" />
                <input type="text" placeholder="Confirm Username" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
            </form>
            <button>Sign-up</button>
        </>
    )
}

export default Signup;