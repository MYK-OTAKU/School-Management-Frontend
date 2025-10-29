import React, { useContext, useState, useMemo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { PaymentContext } from '../../contexts/PaymentContext';
import { ActiveSchoolYearContext } from '../../contexts/ActiveSchoolYearContext';
import PaymentService from '../../services/PaymentService';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';

const PaymentList = ({ onEdit }) => {
  const { payments, setPayments } = useContext(PaymentContext);
  const { activeSchoolYear } = useContext(ActiveSchoolYearContext);
  const [confirmDialog, setConfirmDialog] = useState({ show: false, payment: null });

  const handleDelete = (payment) => {
    setConfirmDialog({ show: true, payment });
  };

  const confirmDelete = () => {
    const { payment } = confirmDialog;
    PaymentService.delete(payment.id).then(() => {
      setPayments(payments.filter((p) => p.id !== payment.id));
      setConfirmDialog({ show: false, payment: null });
    });
  };

  // Filtrer les paiements par année scolaire active
  const filteredPayments = useMemo(() => {
    if (!activeSchoolYear) return payments;
    return payments.filter(payment => payment.schoolYearId === activeSchoolYear.id);
  }, [payments, activeSchoolYear]);

  return (
    <>
      <div className="rounded-lg border border-primary-400/20 overflow-hidden bg-card backdrop-blur-sm">
        <table className="w-full">
          <thead className="bg-secondary-700/50 border-b border-primary-400/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Étudiant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-700/50">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-text-muted">
                  {activeSchoolYear 
                    ? `Aucun paiement pour l'année ${activeSchoolYear.name}` 
                    : 'Aucun paiement trouvé'}
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-secondary-700/30">
                <td className="px-6 py-4 whitespace-nowrap text-text-main">
                  {payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-main">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300">
                    {payment.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-text-main font-semibold">{payment.amount} FCFA</td>
                <td className="px-6 py-4 whitespace-nowrap text-text-main">
                  {new Date(payment.paymentDate).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(payment)}
                      className="p-2 text-accent-400 hover:text-accent-300 hover:bg-accent-600/20 rounded-lg transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(payment)}
                      className="p-2 text-error-400 hover:text-error-300 hover:bg-error-600/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationDialog
        isOpen={confirmDialog.show}
        title="Supprimer le Paiement"
        message={`Êtes-vous sûr de vouloir supprimer ce paiement d'un montant de "${confirmDialog.payment?.amount}" ?`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ show: false, payment: null })}
      />
    </>
  );
};

export default PaymentList;
