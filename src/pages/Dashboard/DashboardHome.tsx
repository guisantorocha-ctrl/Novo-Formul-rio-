import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, Calendar, Copy, ExternalLink } from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import { supabase } from '../../lib/supabase';
import { Quote } from '../../types';

const DashboardHome: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [storeId] = useState('demo-store-id'); // Em produção, pegar do contexto de autenticação
  
  const formUrl = `${window.location.origin}/form/${storeId}`;

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyFormUrl = () => {
    navigator.clipboard.writeText(formUrl);
    // Aqui você pode adicionar uma notificação de sucesso
  };

  const testForm = () => {
    window.open(formUrl, '_blank');
  };

  const totalQuotes = quotes.length;
  const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
  const respondedQuotes = quotes.filter(q => q.status === 'responded').length;
  const todayQuotes = quotes.filter(q => {
    const today = new Date().toDateString();
    const quoteDate = new Date(q.created_at).toDateString();
    return today === quoteDate;
  }).length;

  const recentQuotes = quotes.slice(0, 5);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bem-vindo, Loja Demonstração!
        </h1>
        <p className="text-gray-600">Sistema de Orçamentos de Andaimes Tubulares</p>
      </div>

      {/* Form Link Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2" />
              Link do Formulário para Clientes
            </h2>
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <code className="text-sm break-all">{formUrl}</code>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={copyFormUrl}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </button>
              <button
                onClick={testForm}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Testar</span>
              </button>
            </div>
          </div>
          <div className="ml-6">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Ativa
            </div>
            <p className="text-sm mt-2 opacity-90">Assinatura válida até: 14/10/2025</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Orçamentos"
          value={totalQuotes}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Pendentes"
          value={pendingQuotes}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Respondidos"
          value={respondedQuotes}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Hoje"
          value={todayQuotes}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Recent Quotes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Orçamentos Recentes
            </h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Ver Todos →
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {recentQuotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum orçamento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                Compartilhe o link do formulário com seus clientes para começar a receber orçamentos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {quote.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{quote.client_name}</p>
                      <p className="text-sm text-gray-500">{quote.client_phone}</p>
                      <p className="text-xs text-gray-400">
                        Andaime: {quote.scaffold_type} - {quote.scaffold_height}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      quote.status === 'pending' 
                        ? 'bg-orange-100 text-orange-800'
                        : quote.status === 'responded'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status === 'pending' ? 'Pendente' : 
                       quote.status === 'responded' ? 'Respondido' : 'Concluído'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(quote.created_at).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(quote.created_at).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <button className="text-purple-600 hover:text-purple-700 text-xs font-medium mt-1">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;