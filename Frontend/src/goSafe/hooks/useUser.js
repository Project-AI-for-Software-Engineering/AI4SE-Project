import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";

export const useUser = () => {
  const [userState, setUserState] = useState({
    accessToken: "",
    idToken: "",
  });

  const { accessToken, idToken } = userState;

  useEffect(() => {
    getUserCredentials();
  }, []);

  const getUserCredentials = async () => {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      setUserState({
        accessToken,
        idToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    accessToken,
    idToken,
  };
};
