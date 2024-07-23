import { Link } from "react-router-dom";
import { AuthLayout } from "../layout";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { useForm } from "../../hooks";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startResetPassword } from "../../store/auth";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const formData = {
  userEmail: "",
};

const formValidations = {
  userEmail: [(value) => value.includes("@"), "El email debe contener una @"],
};

export const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { status, errorMessage } = useSelector((state) => state.auth);
  const isChekingAuth = useMemo(() => status === "checking", [status]);

  const { formState, formValidation, onInputChange, isFormValid } = useForm(
    formData,
    formValidations
  );

  const { userEmail } = formState;
  const { userEmailValid } = formValidation;

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startResetPassword(formState));
  };

  return (
    <>
      <AuthLayout title="Recuperar clave">
        <form onSubmit={onSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label>Email:</Label>
              <Input
                type="email"
                placeholder="Ingrese su email"
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
            {errorMessage && (
            <Alert variant="destructive" display="none">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          )}
            <Button variant="gsi-primary" size="lg">
              Enviar
            </Button>
          </CardContent>
          <CardFooter>
            <div className="flex justify-center gap-2 items-center">
              <Link
                className={buttonVariants({ variant: "link" })}
                to="/auth/login"
              >
                Regresar
              </Link>
            </div>
          </CardFooter>
        </form>
      </AuthLayout>
    </>
  );
};
