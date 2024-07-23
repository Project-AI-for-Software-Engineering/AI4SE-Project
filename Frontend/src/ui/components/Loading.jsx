import { ImSpinner11 } from "react-icons/im";

export const Loading = () => {
  return (
    <main className="w-full bg-gsi-three min-h-screen flex justify-center items-center text-background">
        <ImSpinner11 className="animate-spin text-7xl"/>
    </main>
  );
};
