import { Link } from "react-router-dom";
import { AuthLayout } from "../layout";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "../../hooks";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSignUp } from "../../store/auth";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import { paises } from "../data";
import { RiLockPasswordFill } from "react-icons/ri";

const formData = {
  userName: "",
  userLastName: "",
  userEmail: "",
  userPhoneNumber: "",
  userCountry: "",
  userPassword: "",
  userConfirmPassword: "",
};

const formValidations = {
  userName: [(value) => value.length > 0, "El nombre no puede ser vacio"],
  userLastName: [(value) => value.length > 0, "El apellido no puede ser vacio"],
  userEmail: [(value) => value.includes("@"), "El email debe contener una @"],
  userPhoneNumber: [
    (value) => value.length > 9,
    "El numero de celular debe contener más de 9 digitos",
  ],
  userCountry: [(value) => value.length > 0, "Debe seleccionar un pais"],
  userPassword: [
    (value) => value.length > 6,
    "La clave debe ser mayor a 6 caracteres",
  ],
  userConfirmPassword: [
    (value) => value.length > 6,
    "La clave debe ser mayor a 6 caracteres",
  ],
};

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { status, errorMessage } = useSelector((state) => state.auth);
  const isChekingAuth = useMemo(() => status === "checking", [status]);

  const { formState, formValidation, onInputChange, isFormValid } = useForm(
    formData,
    formValidations
  );
  const {
    userName,
    userLastName,
    userEmail,
    userPhoneNumber,
    userCountry,
    userPassword,
    userConfirmPassword,
  } = formState;
  const {
    userNameValid,
    userLastNameValid,
    userEmailValid,
    userPhoneNumberValid,
    userPasswordValid,
    userConfirmPasswordValid,
  } = formValidation;

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startSignUp(formState));
  };

  return (
    <AuthLayout title="Crear cuenta">
      <form onSubmit={onSubmit}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex relative items-center">
              <FaUser className="absolute text-xl left-2 text-gsi-three/50" />
              <Input
                type="text"
                placeholder="Nombre"
                name="userName"
                value={userName}
                onChange={onInputChange}
                className={`pl-10 ${
                  userNameValid && formSubmitted
                    ? "border-destructive text-destructive"
                    : ""
                }  `}
              />
            </div>
            {userNameValid && formSubmitted && (
              <p className="text-destructive">{userNameValid}</p>
            )}
          </div>
          <div>
            <div className="flex relative items-center">
              <FaUser className="absolute text-xl left-2 text-gsi-three/50" />
              <Input
                type="text"
                placeholder="Apellido"
                name="userLastName"
                value={userLastName}
                onChange={onInputChange}
                className={`pl-10 ${
                  userLastNameValid && formSubmitted
                    ? "border-destructive text-destructive"
                    : ""
                }  `}
              />
            </div>
            {userLastNameValid && formSubmitted && (
              <p className="text-destructive">{userLastNameValid}</p>
            )}
          </div>
          <div>
            <div className="flex relative items-center">
              <MdEmail className="absolute text-xl left-2 text-gsi-three/50" />
              <Input
                type="email"
                placeholder="Correo electronico"
                name="userEmail"
                value={userEmail}
                onChange={onInputChange}
                className={`pl-10 ${
                  userEmailValid && formSubmitted
                    ? "border-destructive text-destructive"
                    : ""
                }  `}
              />
            </div>
            {userEmailValid && formSubmitted && (
              <p className="text-destructive">{userEmailValid}</p>
            )}
          </div>
          <div>
            <div className="flex relative items-center">
              <MdLocalPhone className="absolute text-xl left-2 text-gsi-three/50" />
              <Input
                type="text"
                placeholder="Numero de celular"
                name="userPhoneNumber"
                value={userPhoneNumber}
                onChange={onInputChange}
                className={`pl-10 ${
                  userPhoneNumberValid && formSubmitted
                    ? "border-destructive text-destructive"
                    : ""
                }  `}
              />
            </div>
            {userPhoneNumberValid && formSubmitted && (
              <p className="text-destructive">{userPhoneNumberValid}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <div className="flex relative items-center">
              <FaEarthAmericas className="absolute text-xl left-2 text-gsi-three/50" />
              <select
                name="userCountry"
                value={userCountry}
                onChange={onInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background  pl-9"
              >
                {paises.map((pais) => (
                  <option key={pais.id} value={pais.nombre}>
                    {pais.nombre}
                  </option>
                ))}
              </select>
            </div>
            {/* <p className="w-full">error</p> */}
          </div>
          <div>
            <div className="flex relative items-center">
              <RiLockPasswordFill className="absolute text-xl left-2 text-gsi-three/50" />
              <Input
                type="password"
                placeholder="Contraseña"
                name="userPassword"
                value={userPassword}
                onChange={onInputChange}
                className={`pl-10 ${
                  userPasswordValid && formSubmitted
                    ? "border-destructive text-destructive"
                    : ""
                }  `}
              />
            </div>
            {userPasswordValid && formSubmitted && (
              <p className="text-destructive">{userPasswordValid}</p>
            )}
          </div>
          <div>
            <div className="flex relative items-center">
              <RiLockPasswordFill className="absolute text-xl left-2 text-gsi-three/50" />
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                name="userConfirmPassword"
                value={userConfirmPassword}
                onChange={onInputChange}
                className={`pl-10 ${
                  userConfirmPasswordValid && formSubmitted
                    ? "border-destructive text-destructive"
                    : ""
                }  `}
              />
            </div>
            {userConfirmPasswordValid && formSubmitted && (
              <p className="text-destructive">{userConfirmPasswordValid}</p>
            )}
          </div>
          {errorMessage && (
            <Alert variant="destructive" className="md:col-span-2">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          )}
          <Button
            className="md:col-span-2"
            variant="gsi-primary"
            size="lg"
            type="submit"
            disabled={isChekingAuth}
          >
            Registrar
          </Button>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center gap-2 items-center">
            <div>¿Ya tienes cuenta?</div>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/auth/login"
            >
              Iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthLayout>
  );
};
