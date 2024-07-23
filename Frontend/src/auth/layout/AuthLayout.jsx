import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import img from "/icono_gsi_d.png";

export const AuthLayout = ({ children, title = "" }) => {
  return (
    <main className="w-full bg-gsi-three">
      <div className="container min-h-screen flex justify-center items-center">
        <Card className="bg-background w-full md:w-5/6 lg:w-2/3 xl:w-[650px] border-gsi-one border-2 ">
          <CardHeader>
            <img src={img} className="object-contain h-48" />
            <CardTitle className="text-center">{title}</CardTitle>
          </CardHeader>
          {children}
        </Card>
      </div>
    </main>
  );
};
