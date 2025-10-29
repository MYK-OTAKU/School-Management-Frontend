import React, { createContext, useState, useEffect } from 'react';
import PaymentService from '../services/PaymentService';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    PaymentService.getAll().then((data) => {
      if (Array.isArray(data)) {
        setPayments(data);
      } else if (data && Array.isArray(data.payments)) {
        setPayments(data.payments);
      } else if (data && Array.isArray(data.items)) {
        // Structure générique paginée: {items: [...], pagination: {...}}
        setPayments(data.items);
      } else {
        console.error("Invalid data structure for payments:", data);
        setPayments([]);
      }
    }).catch(error => {
      console.error("Failed to fetch payments:", error);
      setPayments([]);
    });
  }, []);

  const addPayment = (payment) => {
    setPayments((prev) => [...prev, payment]);
  };

  const updatePayment = (updatedPayment) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === updatedPayment.id ? updatedPayment : payment
      )
    );
  };

  const deletePayment = (id) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        setPayments,
        addPayment,
        updatePayment,
        deletePayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
