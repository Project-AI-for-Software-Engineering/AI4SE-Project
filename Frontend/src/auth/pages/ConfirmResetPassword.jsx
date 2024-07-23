import { AuthLayout } from "../layout";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CardContent } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { useForm } from "../../hooks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { startConfirmResetPassword } from "../../store/auth";

const formData = {
  userPassword: "",
  userConfirmPassword: "",
};

const formValidations = {
  userPassword: [
    (value) => value.length > 6,
    "La clave debe ser mayor a 6 caracteres",
  ],
  userConfirmPassword: [
    (value) => value.length > 6,
    "La clave debe ser mayor a 6 caracteres",
  ],
};

export const ConfirmResetPassword = () => {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { status, errorMessage, userEmail } = useSelector((state) => state.auth);
  const isChekingAuth = useMemo(() => status === "checking", [status]);

  const { formState, formValidation, onInputChange, isFormValid } = useForm(
    formData,
    formValidations
  );

  const [value, setValue] = useState("");
  const { userPassword, userConfirmPassword } = formState;
  const { userPasswordValid, userConfirmPasswordValid } = formValidation;

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    dispatch(startConfirmResetPassword({value, userPassword, userConfirmPassword, userEmail}));
  };

  return (
    <AuthLayout title="Reestablecer clave">
      <form onSubmit={onSubmit}>
        <CardContent className="flex flex-col gap-4">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div>
            <Label>Clave:</Label>
            <Input
              type="password"
              placeholder="Ingrese su clave"
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
          <div>
            <Label>Confirmar clave:</Label>
            <Input
              type="password"
              placeholder="Confirme su clave"
              name="userConfirmPassword"
              value={userConfirmPassword}
              onChange={onInputChange}
              className={`${
                userConfirmPasswordValid && formSubmitted
                  ? "border-destructive text-destructive"
                  : ""
              }  `}
            />
            {userConfirmPasswordValid && formSubmitted && (
              <p className="text-destructive">{userConfirmPasswordValid}</p>
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
            Confirmar
          </Button>
        </CardContent>
      </form>
    </AuthLayout>
  );
};
