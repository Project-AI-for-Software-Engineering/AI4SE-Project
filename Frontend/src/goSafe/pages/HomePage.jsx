

import { useUser } from "../hooks";

export const HomePage = () => {
  const { accessToken, idToken } = useUser();

  return (
    <>
      <div className="break-words">{JSON.stringify(accessToken)}</div>
      <hr/>
      <div className="break-words">{JSON.stringify(idToken)}</div>
    </>
  );
};
