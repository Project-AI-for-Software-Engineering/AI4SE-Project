import { Navigate, Route, Routes } from "react-router-dom";
import {
  ConfirmRegisterPage,
  ConfirmResetPassword,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from "../pages";
import { useSelector } from "react-redux";

export const AuthRoutes = () => {
  const { status } = useSelector((state) => state.auth);

  if (status === "confirm-code") {
    return <ConfirmRegisterPage />;
  }

  if (status === "confirm-code-reset") {
    return <ConfirmResetPassword />;
  }

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
