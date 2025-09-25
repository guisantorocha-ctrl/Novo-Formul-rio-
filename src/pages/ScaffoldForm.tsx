import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Minus, Plus } from 'lucide-react';
import { scaffoldData, heightPresets } from '../data/scaffoldData';
import { supabase } from '../lib/supabase';
import { QuoteItem } from '../types';

const ScaffoldForm: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [loading, setLoading] = useState(true);
  const [storeActive, setStoreActive] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [scaffoldType, setScaffoldType] = useState('1x1');
  const [scaffoldHeight, setScaffoldHeight] = useState('2M');
  const [towerQuantity, setTowerQuantity] = useState(1);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkStoreStatus();
  }, [storeId]);

  useEffect(() => {
    // Apply height preset when scaffold type or height changes
    applyHeightPreset();
  }, [scaffoldType, scaffoldHeight, towerQuantity]);

  const checkStoreStatus = async () => {
    if (!storeId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stores')
        .select('name, whatsapp_number, subscription_status, subscription_expires_at')
        .eq('id', parseInt(storeId))
        .single();

      if (error) throw error;

      if (data) {
        const isActive = data.subscription_status === 'active' && 
                        (!data.subscription_expires_at || new Date(data.subscription_expires_at) > new Date());
        
        setStoreActive(isActive);
        setStoreName(data.name);
        setWhatsappNumber(data.whatsapp_number);
      }
    } catch (error) {
      console.error('Erro ao verificar status da loja:', error);
      setStoreActive(false);
    } finally {
      setLoading(false);
    }
  };

  const applyHeightPreset = () => {
    const preset = heightPresets[scaffoldType]?.presets[scaffoldHeight];
    if (preset) {
      const newSelectedItems: { [key: string]: number } = {};
      
      Object.entries(preset).forEach(([itemId, quantity]) => {
        newSelectedItems[itemId] = quantity * towerQuantity;
      });
      
      setSelectedItems(newSelectedItems);
    }
  };

  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !clientPhone || !clientEmail) {
      alert('Por favor, preencha todos os dados do cliente.');
      return;
    }

    const hasSelectedItems = Object.values(selectedItems).some(qty => qty > 0);
    if (!hasSelectedItems) {
      alert('Por favor, selecione pelo menos um item.');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare quote items
      const items: QuoteItem[] = [];
      const currentItems = scaffoldData[scaffoldType];
      
      Object.entries(currentItems).forEach(([category, categoryItems]) => {
        categoryItems.forEach(item => {
          const quantity = selectedItems[item.id] || 0;
          if (quantity > 0) {
            items.push({
              id: item.id,
              name: item.name,
              quantity,
              category
            });
          }
        });
      });

      // Save quote to database
      const { error } = await supabase
        .from('quotes')
        .insert({
          store_id: parseInt(storeId!),
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
          scaffold_type: scaffoldType,
          scaffold_height: scaffoldHeight,
          tower_quantity: towerQuantity,
          items: items,
          status: 'pending'
        });

      if (error) throw error;

      // Generate WhatsApp message
      let message = `*SOLICITAÇÃO DE ORÇAMENTO - ANDAIMES TUBULARES*\n\n`;
      message += `*Cliente:* ${clientName.toUpperCase()}\n`;
      message += `*Telefone:* ${clientPhone}\n`;
      message += `*Email:* ${clientEmail}\n\n`;
      message += `*Tipo de Andaime:* Andaime Tubular ${scaffoldType.replace('x', 'x')}\n`;
      message += `*Altura:* ${scaffoldHeight}\n`;
      message += `*Torres:* ${towerQuantity}\n\n`;

      // Group items by category
      const itemsByCategory: { [category: string]: QuoteItem[] } = {};
      items.forEach(item => {
        if (!itemsByCategory[item.category]) {
          itemsByCategory[item.category] = [];
        }
        itemsByCategory[item.category].push(item);
      });

      Object.entries(itemsByCategory).forEach(([category, categoryItems]) => {
        message += `*${category}*\n`;
        categoryItems.forEach(item => {
          message += `• ${item.name} → Quantidade: ${item.quantity}\n`;
        });
        message += '\n';
      });

      message += `Aguardo retorno com o orçamento. Obrigado!`;

      // Open WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://api.whatsapp.com/send/?phone=55${whatsappNumber.replace(/\D/g, '')}&text=${encodedMessage}&type=phone_number&app_absent=0`;
      
      window.open(whatsappURL, '_blank');

      // Reset form
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setTowerQuantity(1);
      applyHeightPreset();

      alert('Orçamento enviado com sucesso! Você será redirecionado para o WhatsApp.');

    } catch (error) {
      console.error('Erro ao enviar orçamento:', error);
      alert('Erro ao enviar orçamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  if (!storeActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Formulário Indisponível</h1>
          <p className="text-gray-600 mb-4">
            Este formulário não está disponível no momento. A assinatura da loja pode ter expirado ou o link pode estar incorreto.
          </p>
          <p className="text-sm text-gray-500">
            Entre em contato com a loja para obter um novo link de orçamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Orçamento de Andaime Tubular</h1>
                <p className="text-purple-100">{storeName}</p>
              </div>
            </div>
            <p className="text-purple-100">
              Preencha os dados abaixo para solicitar seu orçamento gratuito
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Client Data */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Dados do Cliente</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Digite seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="(41) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Scaffold Type */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tipo de Andaime</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(scaffoldData).map((type) => (
                  <label
                    key={type}
                    className={`relative cursor-pointer rounded-xl border-2 p-6 text-center transition-all ${
                      scaffoldType === type
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="scaffoldType"
                      value={type}
                      checked={scaffoldType === type}
                      onChange={(e) => setScaffoldType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-lg font-semibold text-gray-900">Andaime Tubular</div>
                    <div className={`text-2xl font-bold ${
                      scaffoldType === type ? 'text-purple-600' : 'text-gray-600'
                    }`}>
                      {type.replace('x', 'x')}m
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Height and Towers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xl font-semibold text-gray-900 mb-4">
                  Altura do Andaime
                </label>
                <select
                  value={scaffoldHeight}
                  onChange={(e) => setScaffoldHeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                >
                  {heightPresets[scaffoldType]?.heights.map((height) => (
                    <option key={height} value={height}>
                      {height}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xl font-semibold text-gray-900 mb-4">
                  Quantidade de Torres
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setTowerQuantity(Math.max(1, towerQuantity - 1))}
                    className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-3xl font-bold text-gray-900 min-w-[60px] text-center">
                    {towerQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTowerQuantity(towerQuantity + 1)}
                    className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Itens do Andaime Tubular {scaffoldType.replace('x', 'x')}
              </h2>
              <div className="space-y-6">
                {Object.entries(scaffoldData[scaffoldType]).map(([category, items]) => (
                  <div key={category} className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                      {category}
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <span className="text-gray-900 font-medium">{item.name}</span>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => handleItemQuantityChange(item.id, (selectedItems[item.id] || 0) - 1)}
                              className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-semibold text-gray-900 min-w-[40px] text-center">
                              {selectedItems[item.id] || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleItemQuantityChange(item.id, (selectedItems[item.id] || 0) + 1)}
                              className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? 'Enviando...' : 'Solicitar Orçamento via WhatsApp'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScaffoldForm;