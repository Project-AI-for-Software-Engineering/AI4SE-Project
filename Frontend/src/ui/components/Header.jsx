import { MdLogout, MdCancel } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import logo from "/icono_gsi.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startSignOut } from "../../store/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const [isNavbar, setIsNavbar] = useState(null);

  const onSignOut = () => {
    dispatch(startSignOut());
  };

  return (
    <>
      {isNavbar && (
        <div className="absolute bg-gsi-eight/25 w-full h-screen">
          <div className="bg-gsi-three w-2/3 h-full p-4 text-white text-lg flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row-reverse gap-4 items-start">
                <button
                  className="text-4xl"
                  onClick={() => setIsNavbar(!isNavbar)}
                >
                  <MdCancel />
                </button>
                <div className="w-full flex justify-center">
                  <img src={logo} className="object-contain h-24" />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <NavLink to="/home" onClick={() => setIsNavbar(!isNavbar)}>
                  Inicio
                </NavLink>
                <NavLink to="/info" onClick={() => setIsNavbar(!isNavbar)}>
                  Informacion
                </NavLink>
                <NavLink to="/profile" onClick={() => setIsNavbar(!isNavbar)}>
                  Perfil
                </NavLink>
              </div>
            </div>
            <div className="w-full text-center">Derechos reservados</div>
          </div>
        </div>
      )}
      <div className="bg-gsi-three text-white text-lg">
        <div className="flex container justify-between py-5 items-center ">
          <button
            className="text-2xl lg:hidden"
            onClick={() => setIsNavbar(!isNavbar)}
          >
            <TiThMenu />
          </button>
          <div className="flex gap-6 max-lg:hidden">
            <NavLink to="/home">Inicio</NavLink>
            <NavLink to="/info">Informacion</NavLink>
            <NavLink to="/profile">Perfil</NavLink>
          </div>
          <div>
            <button
              onClick={onSignOut}
              className="text-2xl p-2 rounded-lg border-2 border-gsi-one hover:border-gsi-two hover:text-gsi-two duration-500 flex gap-2 items-center"
            >
              <MdLogout />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
