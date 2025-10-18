import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../context/globalContext";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useContext(GlobalContext);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-black">
                <img src="/logo.png" alt="Gammerce Logo" className="h-16 animate-bounce mb-4" />
                <p className="text-lg tracking-wide">Please Wait...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
