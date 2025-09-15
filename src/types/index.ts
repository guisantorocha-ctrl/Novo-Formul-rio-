export interface Store {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  subscription_status: 'active' | 'inactive' | 'expired';
  subscription_expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  store_id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  scaffold_type: string;
  scaffold_height: string;
  tower_quantity: number;
  items: QuoteItem[];
  status: 'pending' | 'responded' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

export interface ScaffoldData {
  [key: string]: {
    [category: string]: {
      name: string;
      id: string;
    }[];
  };
}

export interface HeightPresets {
  [scaffoldType: string]: {
    heights: string[];
    presets: {
      [height: string]: {
        [itemId: string]: number;
      };
    };
  };
}