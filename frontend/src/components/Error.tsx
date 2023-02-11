import { Link, useRouteError } from "react-router-dom";

function Error() {
    const error = useRouteError() as Record<string, string>;

    return (
        <>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error?.statusText || error?.message || "Error Unspecified."}</i>
            </p>
            <Link to="/">Go Back.</Link>
        </>
    );
}

export default Error;