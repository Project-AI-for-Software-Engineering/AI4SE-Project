import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  resetPassword,
  confirmResetPassword,
  signInWithRedirect,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useNavigate } from "react-router-dom";

export const useFormAuth = (initialForm = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const navigate = useNavigate();

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onSingIn = async (event) => {
    event.preventDefault();
    const { userEmail, userPassword } = formState;
    const username = userEmail;
    const password = userPassword;
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      if (nextStep.signInStep === "DONE" && isSignedIn) {
        navigate("/home");
      }
    } catch (error) {
      setAlert({
        icon: "error",
        text: error,
        title: "Ups",
      });
    }
  };

  const onSingUp = async (event) => {
    event.preventDefault();
    const { userEmail, userPassword, userConfirmPassword } = formState;

    const username = userEmail;
    const password = userPassword;

    if (password !== userConfirmPassword) return;

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email: username,
          },
          // optional
          //autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
        },
      });
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setFormState({
          ...formState,
          isConfirm: true,
        });

        return;
      }
    } catch (error) {
      setAlert({
        icon: "error",
        text: error,
        title: "Ups",
      });
    }
  };

  const onSingUpConfirmation = async (event) => {
    event.preventDefault();
    const { userEmail, userConfirmCode } = formState;
    const username = userEmail;
    const confirmationCode = userConfirmCode;

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode,
      });

      if (nextStep.signUpStep === "DONE" && isSignUpComplete) {
        navigate("/login", {
          replace: true,
        });
      }
    } catch (error) {
      setAlert({
        icon: "error",
        text: error,
        title: "Ups",
      });
    }
  };

  const onSignOut = async (event) => {
    event.preventDefault();
    try {
      await signOut();
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setAlert({
        icon: "error",
        text: error,
        title: "Ups",
      });
    }
  };

  const onResetPassword = async (event) => {
    event.preventDefault();
    const { userEmail } = formState;
    const username = userEmail;
    try {
      const output = await resetPassword({ username });
      handleResetPasswordNextSteps(output);
    } catch (error) {
      setAlert({
        icon: "error",
        text: error,
        title: "Ups",
      });
    }
  };

  const onConfirmResetPassword = async (event) => {
    event.preventDefault();
    const { userEmail, userPassword, userConfirmPassword, userConfirmCode } =
      formState;

    if (userPassword !== userConfirmPassword) return;

    const username = userEmail;
    const confirmationCode = userConfirmCode;
    const newPassword = userPassword;

    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      });
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      setAlert({
        icon: "error",
        text: error,
        title: "Ups",
      });
    }
  };

  const handleResetPasswordNextSteps = (output) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        setFormState({
          ...formState,
          isConfirm: true,
        });
        /*const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );*/
        // Collect the confirmation code from the user and pass to confirmResetPassword.
        break;
      case "DONE":
        console.log("Successfully reset password.");
        break;
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          //getUser();
          break;
        case "signInWithRedirect_failure":
          //setError("An error has occurred during the OAuth flow.");
          break;
        case "customOAuthState":
          //setCustomState(payload.data); // this is the customState provided on signInWithRedirect function
          break;
        case "signedIn":
          setFormState({
            ...formState,
            isLogin: true,
          });
      }
    });
    return unsubscribe;
  }, [signInWithRedirect]);

  const setAlert = ({ icon, text, title }) => {
    Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: `${icon}`,
      confirmButtonText: "Ok",
    });
  };

  return {
    formState,
    onInputChange,
    onSingIn,
    onSingUp,
    onSingUpConfirmation,
    onSignOut,
    onResetPassword,
    onConfirmResetPassword,
    signInWithRedirect,
  };
};
