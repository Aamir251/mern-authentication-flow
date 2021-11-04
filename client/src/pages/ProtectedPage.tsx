import axios from "axios";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useLocation, useHistory } from "react-router";

interface IProp{
    user : {
      username? : string | undefined;
      email? : string | undefined;
      accessToken? : string | undefined;
      refreshToken? : string | undefined
    } | null
}

// first check if accesstoken & refreshToken is present or not
// if Present - try accessing protected route - 
//      if jwt expired - use RefreshToken to generate new access token
// If nothing present, redirect to login page

const ProtectedPage = (prop : any) => {
    const { user, setUser, token } = prop
    
    const history = useHistory()
    const [ message, setMessage ]  = useState<string>()
    useEffect(() => {
        // If nothing i present
        
        if (!user || !token) {
            // Redirect to login Page
            history.push("/login")
            return;
        }
        
        const getData = async () => {
            const response = await axios.get("http://localhost:5000/user/protected")
            // If the response is an error due to token exipry, our handler would automatically
            //  make a new renew token request
            setMessage(response?.data?.message)
        }
        getData()

    },[user])
    return <section>
        {message && <h2>{message}</h2>}
    </section>
}

export default ProtectedPage;