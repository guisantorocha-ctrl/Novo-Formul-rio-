import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Quote } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { store } = useAuth();

  useEffect(() => {
    if (store) {
      fetchQuotes();
    }
  }, [store]);

  const fetchQuotes = async () => {
    if (!store?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('store_id', store.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.client_phone.includes(searchTerm) ||
                         quote.client_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', class: 'bg-orange-100 text-orange-800' },
      responded: { label: 'Respondido', class: 'bg-green-100 text-green-800' },
      completed: { label: 'Concluído', class: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamentos</h1>
        <p className="text-gray-600">Gerencie todos os orçamentos recebidos</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-80"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendentes</option>
                <option value="responded">Respondidos</option>
                <option value="completed">Concluídos</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredQuotes.length} orçamento{filteredQuotes.length !== 1 ? 's' : ''} encontrado{filteredQuotes.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredQuotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum orçamento encontrado</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Compartilhe o link do formulário com seus clientes para começar a receber orçamentos'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Contato</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Andaime</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Data</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-purple-600">
                            {quote.client_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{quote.client_name}</p>
                          <p className="text-sm text-gray-500">{quote.client_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-900">{quote.client_phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{quote.scaffold_type}</p>
                        <p className="text-sm text-gray-500">
                          {quote.scaffold_height} • {quote.tower_quantity} torre{quote.tower_quantity !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900">
                          {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(quote.created_at).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(quote.status)}
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>Ver Detalhes</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;