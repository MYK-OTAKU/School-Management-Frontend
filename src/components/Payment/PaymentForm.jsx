import React, { useState, useContext, useEffect } from 'react';
import { PaymentContext } from '../../contexts/PaymentContext';
import { NotificationContext } from '../../contexts/NotificationContext';
import PaymentService from '../../services/PaymentService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentForm = ({ payment, students = [], schoolYears = [], onClose }) => {
  const { addPayment, updatePayment } = useContext(PaymentContext);
  const { showSuccess, showError } = useContext(NotificationContext);
  const [studentId, setStudentId] = useState('');
  const [schoolYearId, setSchoolYearId] = useState('');
  const [type, setType] = useState('tuition');
  const [method, setMethod] = useState('cash');
  const [amount, setAmount] = useState('');
  const [expectedAmount, setExpectedAmount] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (payment) {
      setStudentId(payment.studentId || '');
      setSchoolYearId(payment.schoolYearId || '');
      setType(payment.type || 'tuition');
      setMethod(payment.method || 'cash');
      setAmount(payment.amount || '');
      setExpectedAmount(payment.expectedAmount || '');
      setAppliedDiscount(payment.appliedDiscount || 0);
      setPaymentDate(payment.paymentDate ? payment.paymentDate.split('T')[0] : new Date().toISOString().split('T')[0]);
      setNotes(payment.notes || '');
    } else {
      const activeSchoolYear = schoolYears.find(sy => sy.isActive);
      if (activeSchoolYear) {
        setSchoolYearId(activeSchoolYear.id);
      }
      setStudentId('');
      setType('tuition');
      setMethod('cash');
      setAmount('');
      setExpectedAmount('');
      setAppliedDiscount(0);
      setPaymentDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [payment, schoolYears]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const paymentData = { 
      studentId: parseInt(studentId),
      schoolYearId: schoolYearId ? parseInt(schoolYearId) : null,
      type,
      method,
      amount: parseFloat(amount),
      expectedAmount: expectedAmount ? parseFloat(expectedAmount) : null,
      appliedDiscount: parseFloat(appliedDiscount) || 0,
      paymentDate,
      notes: notes || null
    };

    const handleResponse = (response) => {
      if (response && response.data) {
        const action = payment ? 'mis à jour' : 'créé';
        showSuccess(`Le paiement a été ${action} avec succès.`);
        if (payment) {
          updatePayment(response.data);
        } else {
          addPayment(response.data);
        }
        onClose();
      } else {
        showError('La réponse du serveur est invalide.');
        setError('La réponse du serveur est invalide.');
      }
    };

    const handleError = (err) => {
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue.';
      showError(errorMessage);
      setError(errorMessage);
    };

    if (payment) {
      PaymentService.update(payment.id, paymentData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    } else {
      PaymentService.create(paymentData)
        .then(handleResponse)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-card p-8 rounded-lg shadow-lg w-full max-w-4xl my-8">
        <h2 className="text-2xl font-bold text-text-main mb-6">{payment ? 'Modifier le Paiement' : 'Nouveau Paiement'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-6">{error}</div>}
          
          {/* Informations Principales */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-secondary-600 pb-2">Informations Principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="student" className="block text-sm font-medium text-text-muted mb-1">Étudiant *</label>
                <select
                  id="student"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Sélectionner un étudiant</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.matricule})</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="schoolYear" className="block text-sm font-medium text-text-muted mb-1">Année Scolaire</label>
                <select
                  id="schoolYear"
                  value={schoolYearId}
                  onChange={(e) => setSchoolYearId(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Année active (par défaut)</option>
                  {schoolYears.map((sy) => (
                    <option key={sy.id} value={sy.id}>{sy.name} {sy.isActive ? '(Active)' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-muted mb-1">Type de Paiement *</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="registration">Inscription</option>
                  <option value="tuition">Scolarité</option>
                  <option value="transport">Transport</option>
                  <option value="misc">Divers</option>
                </select>
              </div>
              <div>
                <label htmlFor="method" className="block text-sm font-medium text-text-muted mb-1">Méthode de Paiement *</label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="cash">Espèces</option>
                  <option value="card">Carte</option>
                  <option value="transfer">Virement</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="check">Chèque</option>
                </select>
              </div>
              <div>
                <label htmlFor="paymentDate" className="block text-sm font-medium text-text-muted mb-1">Date de Paiement *</label>
                <input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Détails Financiers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-main mb-4 border-b border-secondary-600 pb-2">Détails Financiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-text-muted mb-1">Montant Payé *</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="expectedAmount" className="block text-sm font-medium text-text-muted mb-1">Montant Attendu</label>
                <input
                  id="expectedAmount"
                  type="number"
                  step="0.01"
                  value={expectedAmount}
                  onChange={(e) => setExpectedAmount(e.target.value)}
                  placeholder="Optionnel"
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="appliedDiscount" className="block text-sm font-medium text-text-muted mb-1">Réduction Appliquée</label>
                <input
                  id="appliedDiscount"
                  type="number"
                  step="0.01"
                  value={appliedDiscount}
                  onChange={(e) => setAppliedDiscount(e.target.value)}
                  className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-text-muted mb-1">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              placeholder="Informations complémentaires..."
              className="w-full px-4 py-2 bg-secondary-700/50 border border-secondary-600 rounded-lg text-text-main focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-secondary-600 text-text-main rounded-lg hover:bg-secondary-700 transition-colors"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : (payment ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
