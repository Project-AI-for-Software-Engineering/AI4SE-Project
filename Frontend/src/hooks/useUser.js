import { useEffect, useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export const useUser = () => {
  const [user, setUser] = useState({
    userName: null,
    userId: null,
    accessToken: null,
    idToken: null,
    signInDetails: null
  });

  const getUser = async () => {
    try {
      const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
      const { username, userId, signInDetails } = await getCurrentUser();
      setUser({
        userName: username,
        userId: userId,
        accessToken: accessToken,
        idToken: idToken,
        signInDetails: signInDetails
      });
    } catch (error) {
      setUser({
        ...user
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return {
    userName: user.userName,
    userId: user.userId,
    accessToken: user.accessToken,
    idToken: user.idToken,
    signInDetails: user.signInDetails
  };
};
