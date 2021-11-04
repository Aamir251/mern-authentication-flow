import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../Interfaces/IUser";
import { useHistory } from "react-router";

const Register = () => {
    const history = useHistory()
    const [ person, setPerson ] = useState<IUser>()
    const handleChange = (e : React.ChangeEvent) => {
        let name = (e.target as HTMLInputElement).name;
        let value = (e.target as HTMLInputElement).value;
        setPerson({...person, [name] : value} as IUser );
    }

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:5000/user/register", {
                ...person,
            }, {
                withCredentials : true
            })

            if (response) {
                // User was created successfully
                history.push("/login")
            }

        } catch (error : any ) {
            const errorMessage = error.response.data.message;

            console.log(errorMessage);
            // Show the error message to user accordingly
            
        }
        
    }
    return <section>
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
                Register
            </button>
            <div>No Account?<Link to="/login">Login</Link></div>

        </form>
    </section>
}

export default Register;