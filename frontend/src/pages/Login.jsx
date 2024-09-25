import Form from "../components/Form"
import Header from "../components/Header"

const Login = () => {
    return (
        <>
            <Header />
            <Form route="/api/token/" method="login" />
        </>
    )
}

export default Login

