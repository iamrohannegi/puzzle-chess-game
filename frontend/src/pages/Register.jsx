import Header from '../components/Header';
import Form from "../components/Form";

const Register = () => {
    localStorage.clear()
    
    return (
        <>
            <Header />
            <Form route="/api/user/register/" method="register" />
        </>
    )
}

export default Register