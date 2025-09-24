import React from 'react';
import { CreditCard, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Subscription: React.FC = () => {
  const { store } = useAuth();

  const paymentHistory = [
    { date: '15/06/2024', description: 'Mensalidade - Plano Profissional', amount: '99,90', status: 'Pago' },
    { date: '15/05/2024', description: 'Mensalidade - Plano Profissional', amount: '99,90', status: 'Pago' },
    { date: '15/04/2024', description: 'Mensalidade - Plano Profissional', amount: '99,90', status: 'Pago' },
    { date: '15/03/2024', description: 'Mensalidade - Plano Profissional', amount: '99,90', status: 'Pago' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <CreditCard className="w-8 h-8 mr-3 text-purple-600" />
          Sua Assinatura
        </h1>
        <p className="text-gray-600">Gerencie seu plano e histórico de pagamentos</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Seu Plano Atual</h2>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Plano Profissional</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                  store?.subscription_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {store?.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-700">$</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Valor Mensal</p>
                    <p className="text-xl font-bold text-gray-900">R$ 99,90</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expira em</p>
                    <p className="text-xl font-bold text-gray-900">
                      {store?.subscription_expires_at 
                        ? new Date(store.subscription_expires_at).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'Não definido'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ml-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <RefreshCw className="w-5 h-5" />
                <span>Renovar Assinatura</span>
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Clique para renovar por mais 30 dias.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Histórico de Pagamentos
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Data</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Descrição</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Valor (R$)</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentHistory.map((payment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-900">{payment.date}</td>
                  <td className="py-4 px-6 text-gray-900">{payment.description}</td>
                  <td className="py-4 px-6 text-gray-900">{payment.amount}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscription;