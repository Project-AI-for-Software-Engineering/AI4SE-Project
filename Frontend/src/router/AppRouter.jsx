import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes, useCheckAuth } from "../auth";
import { GoSafeRoutes } from "../goSafe";
import { Loading } from "../ui";

export const AppRouter = () => {
  const status = useCheckAuth();

  if (status === "checking") {
    return <Loading />;
  }
  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<GoSafeRoutes />} />
      ) : (
        <Route path="auth/*" element={<AuthRoutes />} />
      )}
      <Route path="/*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};
