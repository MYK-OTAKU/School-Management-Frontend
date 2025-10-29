import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { PaymentProvider } from '../../contexts/PaymentContext';
import PaymentList from '../../components/Payment/PaymentList';
import PaymentForm from '../../components/Payment/PaymentForm';
import StudentService from '../../services/StudentService';
import SchoolYearService from '../../services/SchoolYearService';

const PaymentPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [students, setStudents] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);

  useEffect(() => {
    StudentService.getAll().then((data) => {
      if (Array.isArray(data)) {
        setStudents(data);
      }
    });
    SchoolYearService.getAll().then((data) => {
      if (Array.isArray(data)) {
        setSchoolYears(data);
      }
    });
  }, []);

  const handleCreate = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  return (
    <PaymentProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-primary-400" />
            <h1 className="text-3xl font-bold text-text-main">Gestion des Paiements</h1>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Nouveau Paiement</span>
          </button>
        </div>
        <PaymentList onEdit={handleEdit} />
        {showForm && (
          <PaymentForm
            payment={editingPayment}
            students={students}
            schoolYears={schoolYears}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </PaymentProvider>
  );
};

export default PaymentPage;
