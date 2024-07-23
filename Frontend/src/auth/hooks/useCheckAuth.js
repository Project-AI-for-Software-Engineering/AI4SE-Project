import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { logIn, logOut } from "../../store/auth";

export const useCheckAuth = () => {
  const { status, userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const currentAuthenticatedUser = async () => {
    try {
      const { username } = await getCurrentUser();
      return dispatch(logIn({ username }));
    } catch (err) {
      return dispatch(logOut());
    }
  };

  useEffect(() => {
    currentAuthenticatedUser();
  }, [userId]);

  return status;
};
