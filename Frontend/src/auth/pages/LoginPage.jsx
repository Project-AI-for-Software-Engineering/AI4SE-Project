import { Link } from "react-router-dom";
import { AuthLayout } from "../layout";
import { useState, useMemo } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { startSignIn, startGoogleSignIn } from "../../store/auth";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const formData = {
  userEmail: "",
  userPassword: "",
};

const formValidations = {
  userEmail: [(value) => value.includes("@"), "El email debe contener una @"],
  userPassword: [
    (value) => value.length > 6,
    "La clave debe ser mayor a 6 caracteres",
  ],
};

export const LoginPage = () => {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { status, errorMessage } = useSelector((state) => state.auth);
  const isChekingAuth = useMemo(() => status === "checking", [status]);

  const { formState, formValidation, onInputChange, isFormValid } = useForm(
    formData,
    formValidations
  );

  const { userEmail, userPassword } = formState;
  const { userEmailValid, userPasswordValid } = formValidation;

  const onSignIn = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startSignIn(formState));
  };

  const onGoogleSingIn = () => {
    dispatch(startGoogleSignIn());
  };

  return (
    <AuthLayout title="Iniciar sesión">
      {/* {isLogin && <Navigate to="/home" replace={true} />} */}
      <form onSubmit={onSignIn}>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              name="userEmail"
              value={userEmail}
              onChange={onInputChange}
              className={`${
                userEmailValid && formSubmitted
                  ? "border-destructive text-destructive"
                  : ""
              }  `}
            />
            {userEmailValid && formSubmitted && (
              <p className="text-destructive">{userEmailValid}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Clave</Label>
            <Input
              type="password"
              id="password"
              placeholder="Clave"
              name="userPassword"
              value={userPassword}
              onChange={onInputChange}
              className={`${
                userPasswordValid && formSubmitted
                  ? "border-destructive text-destructive"
                  : ""
              }  `}
            />
            {userPasswordValid && formSubmitted && (
              <p className="text-destructive">{userPasswordValid}</p>
            )}
          </div>
          {errorMessage && (
            <Alert variant="destructive" display="none">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          )}
          <Button
            variant="gsi-primary"
            size="lg"
            type="submit"
            disabled={isChekingAuth}
          >
            Ingresar
          </Button>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center gap-2 items-center">
            <div>¿No tienes cuenta?</div>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/auth/register"
            >
              Crear cuenta
            </Link>
          </div>
          <div className="flex justify-center">
            <Link
              className={buttonVariants({ variant: "link" })}
              to={"/auth/reset-password"}
            >
              ¿Olvidaste tu clave?
            </Link>
          </div>
          <div className="flex justify-center gap-2 items-center">
            <div>Tambien puedes iniciar sesion con:</div>
            <Button variant="outline" onClick={onGoogleSingIn} type="button">
              <FaGoogle className="text-4xl" />
            </Button>
          </div>
        </CardFooter>
      </form>
    </AuthLayout>
  );
};
