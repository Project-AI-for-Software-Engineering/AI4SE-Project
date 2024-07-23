import logo from "/icono_gsi.png";

export const ConfirmCode = () => {
  return (
    <form className="flex flex-col gap-6 text-xl">
      <div>
        <img src={logo} alt="Gsi-Logo" className="object-contain" />
      </div>
      <h2 className="text-3xl text-center text-white border-y-4 py-4 border-gsi-two">
        Confirmar cuenta
      </h2>
      <div>
        <label className="block text-white mb-2">Codigo de verificacion:</label>
        <input
          type="number"
          className="w-full h-12 rounded-lg border-4 border-gsi-two p-4"
          placeholder="Ingrese su codigo de verificacion"
          name="userCode"
          //value={userEmail}
          //onChange={onInputChange}
        />
      </div>
      <button
        className="bg-gsi-two hover:bg-gsi-seven duration-500 rounded-lg h-12"
        type="submit"
      >
        Confirmar
      </button>
    </form>
  );
};
