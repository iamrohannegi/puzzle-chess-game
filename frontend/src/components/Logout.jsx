const Logout = () => {
    localStorage.clear()

    return (
        <Navigate to="/login" />
    )
}

export default Logout