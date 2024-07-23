import { AuthLayout } from "../layout";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo } from "react";
import { starSignUpConfirm } from "../../store/auth";
import { Terminal } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

export const ConfirmRegisterPage = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");

  const { status, errorMessage, userEmail, userPassword } = useSelector(
    (state) => state.auth
  );

  const isChekingAuth = useMemo(() => status === "checking", [status]);

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch(
      starSignUpConfirm({
        username: userEmail,
        confirmationCode: value,
        userPassword: userPassword,
      })
    );
  };

  return (
    <AuthLayout title="Confirmar codigo">
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
