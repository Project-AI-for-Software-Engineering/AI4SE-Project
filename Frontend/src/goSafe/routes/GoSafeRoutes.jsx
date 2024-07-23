import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "../../ui";
import { HomePage, InfoPage, ProfilePage } from "../pages";

export const GoSafeRoutes = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/*" element={<Navigate to={"/home"} />} />
        </Routes>
      </div>
    </>
  );
};
