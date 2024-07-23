import {
  signInWithRedirect,
  signUp,
  signIn,
  signOut,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";

export const signInGoogle = async () => {
  try {
    await signInWithRedirect({
      provider: "Google",
      customState: "shopping-cart",
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
};

//Registro con email/clave
export const signUpWithEmailPassword = async ({
  userName,
  userLastName,
  userEmail,
  userPhoneNumber,
  userCountry,
  userPassword,
  userConfirmPassword,
}) => {
  try {
    const username = userEmail;
    const password = userPassword;

    if (password !== userConfirmPassword)
      return {
        ok: false,
        errorMessage: "Las claves no son iguales",
      };

    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email: username,
          given_name: userName,
          family_name: userLastName,
          phone_number: userPhoneNumber,
          locale: userCountry,
        },
        // optional
        //autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
      },
    });

    if (!isSignUpComplete && nextStep.signUpStep === "CONFIRM_SIGN_UP") {
      return {
        ok: false,
        confirm: true,
      };
    }
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
};

export const signInWithEmailPassword = async ({ userEmail, userPassword }) => {
  const username = userEmail;
  const password = userPassword;

  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
    const { signInStep } = nextStep;
    if (!isSignedIn && signInStep === "CONFIRM_SIGN_UP") {
      return {
        ok: false,
        confirm: true,
      };
    }
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
};

export const signInWithConfirmationCode = async ({
  username,
  confirmationCode,
  userPassword,
}) => {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username,
      confirmationCode,
    });

    if (nextStep.signUpStep === "DONE" && isSignUpComplete) {
      return {
        ok: true,
        userEmail: username,
        userPassword: userPassword,
      };
    }
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
      userEmail: username,
      userPassword: userPassword,
    };
  }
};

export const signOutApp = async () => {
  try {
    await signOut();
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
};

export const resetPasswordWithEmail = async ({ username }) => {
  try {
    const { isPasswordReset, nextStep } = await resetPassword({ username });
    if (
      !isPasswordReset &&
      nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE"
    ) {
      return {
        ok: false,
        confirm: true,
        userEmail: username,
      };
    }
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
};

export const confirmResetPasswordWithEmail = async ({
  userEmail: username,
  confirmationCode,
  newPassword,
  userConfirmPassword,
}) => {
  try {
    if (newPassword !== userConfirmPassword) {
      return {
        ok: false,
        errorMessage: "Las claves no son iguales",
        userEmail: username,
      };
    }
    await confirmResetPassword({
      username,
      confirmationCode,
      newPassword,
    });
    return {
      ok: true,
      userEmail: username,
      userPassword: newPassword,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
      userEmail: username,
    };
  }
};
