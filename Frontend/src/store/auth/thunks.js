import {
  signInGoogle,
  signUpWithEmailPassword,
  signInWithEmailPassword,
  signOutApp,
  signInWithConfirmationCode,
  resetPasswordWithEmail,
  confirmResetPasswordWithEmail,
} from "../../amplify";
import {
  chekingCredentials,
  logIn,
  logOut,
  confirmCode,
  confirmCodeReset,
} from "./";

export const startGoogleSignIn = () => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    const result = await signInGoogle();
    if (!result.ok) return dispatch(logOut(result));
    dispatch(logIn(result));
  };
};

//Empieza el proceso de registro
export const startSignUp = ({
  userName,
  userLastName,
  userEmail,
  userPhoneNumber,
  userCountry,
  userPassword,
  userConfirmPassword,
}) => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    userPhoneNumber = definePhoneNumber(userCountry, userPhoneNumber);
    const result = await signUpWithEmailPassword({
      userName,
      userLastName,
      userEmail,
      userPhoneNumber,
      userCountry,
      userPassword,
      userConfirmPassword,
    });
    if (result.confirm)
      return dispatch(confirmCode({ userEmail, userPassword }));
    if (!result.ok) return dispatch(logOut(result));
  };
};

const definePhoneNumber = (country, phoneNumber) => {
  let newNumber = "";
  switch (country) {
    case "Colombia":
      newNumber = `+57${phoneNumber}`;
    case "Mexico":
      newNumber = `+52${phoneNumber}`;
    case "Argentina":
      newNumber = `+54${phoneNumber}`;
    case "Peru":
      newNumber = `+51${phoneNumber}`;
    default:
      newNumber = `+57${phoneNumber}`;
  }
  return newNumber;
};

//Confirmar el codigo de inicio de sesion
export const starSignUpConfirm = ({
  username,
  confirmationCode,
  userPassword,
}) => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    const result = await signInWithConfirmationCode({
      username,
      confirmationCode,
      userPassword,
    });
    if (!result.ok) return dispatch(confirmCode(result));
    return dispatch(startSignIn(result));
  };
};

//Proceso de inicio de sesión
export const startSignIn = ({ userEmail, userPassword }) => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    const result = await signInWithEmailPassword({ userEmail, userPassword });
    if (result.confirm)
      return dispatch(confirmCode({ userEmail, userPassword }));
    if (!result.ok) return dispatch(logOut(result));
    return dispatch(logIn());
  };
};

//Proceso de cierrre de sesión
export const startSignOut = () => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    const result = await signOutApp();
    if (!result.ok) return dispatch(logOut(result));
    return dispatch(logOut());
  };
};

//Proceso de reestablecer clave
export const startResetPassword = ({ userEmail: username }) => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    const result = await resetPasswordWithEmail({ username });
    if (result.confirm) return dispatch(confirmCodeReset(result));
    if (!result.ok) return dispatch(logOut(result));
  };
};

export const startConfirmResetPassword = ({
  value: confirmationCode,
  userPassword: newPassword,
  userConfirmPassword,
  userEmail,
}) => {
  return async (dispatch) => {
    dispatch(chekingCredentials());
    const result = await confirmResetPasswordWithEmail({
      confirmationCode,
      newPassword,
      userConfirmPassword,
      userEmail,
    });
    if (!result.ok) return dispatch(confirmCodeReset(result));
    return dispatch(startSignIn(result));
  };
};
