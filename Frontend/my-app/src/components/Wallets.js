import React, { useState } from 'react';
import api from './api';

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const handleRecharge = async () => {
    try {
      const response = await api.post(`/wallets/${senderId}/recharge/`, { amount });
      console.log(response.data);
    } catch (error) {
      console.error('Error recargando la billetera:', error);
    }
  };

  const handleTransfer = async () => {
    try {
      const response = await api.post('/wallets/transfer/', {
        sender: senderId,
        receiver: receiverId,
        amount,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error transfiriendo dinero:', error);
    }
  };

  return (
    <div>
      <h2>Recargar Billetera</h2>
      <input
        type="text"
        placeholder="ID del usuario"
        value={senderId}
        onChange={(e) => setSenderId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleRecharge}>Recargar</button>

      <h2>Transferir Dinero</h2>
      <input
        type="text"
        placeholder="ID del remitente"
        value={senderId}
        onChange={(e) => setSenderId(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID del receptor"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transferir</button>
    </div>
  );
};

export default Wallet;
