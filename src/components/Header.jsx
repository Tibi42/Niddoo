import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <h1 className="app-header__brand">Niddoo</h1>
        <nav className="app-header__nav">
          <NavLink to="/" className="app-header__link">
            Accueil
          </NavLink>
          <NavLink to="/renovation" className="app-header__link">
            Rénovation
          </NavLink>
          <NavLink to="/maitrise" className="app-header__link">
            Maîtrise d'œuvre
          </NavLink>
          <NavLink to="/garanties" className="app-header__link">
            Garanties
          </NavLink>
          <NavLink to="/aide" className="app-header__link">
            Aide à la vente
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
