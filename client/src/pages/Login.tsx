import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { IUser } from "../Interfaces/IUser";
import Cookie from "js-cookie";
import { useLocation, useHistory } from "react-router";
import { getAccessToken, setAccessToken } from "../accessToken";
import { Link } from "react-router-dom";

interface IProp{
    user : {
      username? : string | undefined;
      email? : string | undefined;
      id? : string | undefined;
      accessToken? : string;
    } 

}


const Login = (prop : any) => {
    const history = useHistory()
    const { setUser, setToken } = prop;

    const [ person, setPerson ] = useState<IUser>()
    const handleChange = (e : React.ChangeEvent) => {
        let name = (e.target as HTMLInputElement).name;
        let value = (e.target as HTMLInputElement).value;
        setPerson({...person, [name] : value} as IUser );
    }

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:5000/user/login", {
                    ...person,
                }, {
                    withCredentials : true
                })
            
            
            const data : IProp["user"] = response.data

            localStorage.setItem("user", JSON.stringify({
                id : data.id,
                username : data.username,
                email : data.email,
            }))
            
            setAccessToken(data?.accessToken as string);

            setToken(getAccessToken())
            
            history.push("/secret")
        } catch (error : any ) {
            const errorMessage = error.response.data.message;
            console.log(errorMessage);
            // We can show the error to user accordingly
            
            
        }
    } 
    return <section className="login-page">
        <div>

        </div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username" >Username</label>
            <input onChange={handleChange} value={person?.username} name="username" placeholder="username" required/>
            <br/>

            <label htmlFor="email" >Email</label>
            <input onChange={handleChange} value={person?.email} name="email" placeholder="email" type="email" required/>
            <br />

            <label htmlFor="password" >password</label>
            <input onChange={handleChange} value={person?.password} name="password" placeholder="password" type="password" required/>
            <br />
            <button type="submit" className="btn cursor-pointer">
                Login
            </button>
            <div>No Account?<Link to="/register">Register</Link></div>

        </form>
    </section>
}

export default Login;