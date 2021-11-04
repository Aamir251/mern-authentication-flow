import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {

    return <section>
        <h2>
        React, Typescript, Express and JWT <br></br>
        <span> AUTHENTICATION <br></br> FLOW</span>
      </h2>
      <div className="btn-container flex justify-between align-center">
          <NavLink to="/secret">
            <button className="btn btn-secret cursor-pointer">Secret Page</button>
          </NavLink>
          <NavLink to="/login">
            <button className="btn btn-login cursor-pointer">Login</button>
          </NavLink>
      </div>
    </section>
}

export default Home;