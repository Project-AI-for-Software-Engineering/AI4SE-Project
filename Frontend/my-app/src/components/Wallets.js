import React, { useState , useEffect} from 'react';
import api from './api';
import Dropdown from 'react-bootstrap/Dropdown';
import {Col, Row} from 'react-bootstrap';
import "../css/Wallets.css";
import ConfirmBox from "react-dialog-confirm";
import ConfirmationDialog from './ConfirmationDialog'; // Adjust the path if necessary


const Wallet = ({match}) => {
  const [amount, setAmount] = useState('');
  const [amountFund, setAmountFund] = useState('');
  const [senderId, setSenderId] = useState('1');
  const [receiverId, setReceiverId] = useState('');
  const [balance,  setBalance]= useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to open the dialog
  const openDialog = () => setIsDialogOpen(true);

  // Function to close the dialog
  const closeDialog = () => setIsDialogOpen(false);

  // Function to handle confirmation
  const handleConfirm = () => {
    handleTransfer();
    console.log('User confirmed the action.');
    alert("Your bet is confirmed")
    closeDialog(); // Close dialog after confirmation
  };

  // Function to handle cancellation
  const handleCancel = () => {
    console.log('User cancelled the action.');
    alert("Your bet is declined")
    closeDialog(); // Close dialog after cancellation
  };


  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const handleRecharge = async () => {
    if (!senderId) {
      console.error('El ID del usuario no puede estar vacío');
      return;
    }
  
    try {
      const response = await api.post(`/wallets/${senderId}/recharge/`, {"amount": amount });
      console.log(response.data);
      getBalance();
    } catch (error) {
      console.error('Error recargando la billetera:', error);
    }
  };

  const getBalance = async () => {
    if (!senderId) {
      console.error('El ID del usuario no puede estar vacío');
      return;
    }
    try {
      const response = await api.get(`/wallets/${senderId}/balance/`);
      console.log(response.data);
      console.log("Nuevo balance");
      console.log(response.data.balance);
      setBalance(response.data.balance)
    } catch (error) {
      console.error('Error en el status de la billetera:', error);
    }
  };
  

  const handleTransfer = async () => {
    try {
      const response = await api.post('/wallets/transfer/', {
        sender: '1',
        receiver: '10',
        amount:amount,
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error transfiriendo dinero:', error);
    }
  };

  useEffect(() => {
		  getBalance()
	  }, []);
  return (
    <div>
      <Row className='tospl'><Col lg={6} className='bordered'>
      <h2>Recargar Billetera. Saldo actual: {balance}</h2> 
      <input
        type="text"
        placeholder='1'
        disabled='true'
        value={senderId}
        onChange={(e) => setSenderId(1)}
      />
      <input
        type="number"
        placeholder="Monto"
        value={amountFund}
        onChange={(e) => setAmountFund(e.target.value)}
      />
      <button onClick={handleRecharge}>Recargar</button>

      
      </Col>
      
      <Col lg={6} className='bordered'>
      <h2>Hacer Apuesta</h2>
      <div>
      <label htmlFor="myDropdown"> ¿Quién ganará el proximo encuentro el {match[2]} ?</label>
      <select id="myDropdown" value={selectedOption} onChange={handleChange}>
        <option value="">Selecciona</option>
        <option value="option1">{match[0]}</option>
        <option value="option2">{match[1]}</option>
   
      </select>
      
      {/* Display the selected value */}

    </div>
   

      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
     
     <button onClick={openDialog}>Open Confirmation Dialog</button>
      
      <ConfirmationDialog
        isOpen={isDialogOpen}
        message="Are you sure you want to proceed?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      /></Col>
      </Row>
     
    </div>
  );
};

export default Wallet;
