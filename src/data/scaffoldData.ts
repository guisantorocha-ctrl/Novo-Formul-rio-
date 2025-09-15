import { ScaffoldData, HeightPresets } from '../types';

export const scaffoldData: ScaffoldData = {
  '1x1': {
    'Painéis': [
      { name: 'Painel metálico 1,00x1,00m', id: 'painel-1x1' }
    ],
    'Pisos': [
      { name: 'Piso metálico 0,33x1,00m', id: 'piso-1x1' }
    ],
    'Diagonais': [
      { name: 'Diagonal metálica 1,41m', id: 'diagonal-1x1' }
    ],
    'Rodas': [
      { name: 'Roda metálica c/ rolamento PU 4"x1', id: 'roda-1x1' }
    ],
    'Sapatas ajustáveis': [
      { name: 'Sapata ajustável', id: 'sapata-1x1' }
    ],
    'Guarda-corpo': [
      { name: 'Guarda-corpo c/ porta 1,00m', id: 'guarda-corpo-porta-1x1' },
      { name: 'Guarda-corpo s/ porta c/ rodapé 1,00m', id: 'guarda-corpo-sem-porta-1x1' }
    ],
    'Escadas': [
      { name: 'Escada metálica 1,00m', id: 'escada-1m-1x1' },
      { name: 'Escada metálica 2,00m', id: 'escada-2m-1x1' }
    ]
  },
  '1x1.50': {
    'Painéis': [
      { name: 'Painel metálico 1,00x1,50m', id: 'painel-1x150' }
    ],
    'Pisos': [
      { name: 'Piso metálico 0,37x1,50m', id: 'piso-1x150' }
    ],
    'Diagonais': [
      { name: 'Diagonal metálica 2,12m', id: 'diagonal-1x150' }
    ],
    'Rodas': [
      { name: 'Roda metálica c/ rolamento PU 4"x1', id: 'roda-1x150' }
    ],
    'Sapatas ajustáveis': [
      { name: 'Sapata ajustável', id: 'sapata-1x150' }
    ],
    'Guarda-corpo': [
      { name: 'Guarda-corpo s/ porta c/ rodapé 1,50m', id: 'guarda-corpo-sem-porta-1x150' },
      { name: 'Guarda-corpo c/ porta c/ rodapé 1,50m', id: 'guarda-corpo-porta-1x150' }
    ],
    'Escadas': [
      { name: 'Escada metálica 1,00m', id: 'escada-1m-1x150' },
      { name: 'Escada metálica 2,00m', id: 'escada-2m-1x150' }
    ]
  },
  '1x2.00': {
    'Painéis': [
      { name: 'Painel metálico 1,00x2,00m', id: 'painel-1x200' }
    ],
    'Pisos': [
      { name: 'Piso metálico 0,37x2,00m', id: 'piso-1x200' }
    ],
    'Diagonais': [
      { name: 'Diagonal metálica 2,82m', id: 'diagonal-1x200' }
    ],
    'Rodas': [
      { name: 'Roda metálica c/ rolamento PU 4"x1', id: 'roda-1x200' }
    ],
    'Sapatas ajustáveis': [
      { name: 'Sapata ajustável', id: 'sapata-1x200' }
    ],
    'Guarda-corpo': [
      { name: 'Guarda-corpo s/ porta c/ rodapé 2,00m', id: 'guarda-corpo-sem-porta-1x200' },
      { name: 'Guarda-corpo c/ porta c/ rodapé 2,00m', id: 'guarda-corpo-porta-1x200' }
    ],
    'Escadas': [
      { name: 'Escada metálica 1,00m', id: 'escada-1m-1x200' },
      { name: 'Escada metálica 2,00m', id: 'escada-2m-1x200' }
    ]
  }
};

export const heightPresets: HeightPresets = {
  '1x1': {
    heights: ['2M', '3M', '4M', '5M'],
    presets: {
      '2M': {
        'painel-1x1': 4,
        'piso-1x1': 3,
        'diagonal-1x1': 1,
        'roda-1x1': 4,
        'sapata-1x1': 4,
        'guarda-corpo-porta-1x1': 1,
        'guarda-corpo-sem-porta-1x1': 3,
        'escada-1m-1x1': 0,
        'escada-2m-1x1': 1
      },
      '3M': {
        'painel-1x1': 6,
        'piso-1x1': 3,
        'diagonal-1x1': 2,
        'roda-1x1': 4,
        'sapata-1x1': 4,
        'guarda-corpo-porta-1x1': 1,
        'guarda-corpo-sem-porta-1x1': 3,
        'escada-1m-1x1': 1,
        'escada-2m-1x1': 1
      },
      '4M': {
        'painel-1x1': 8,
        'piso-1x1': 3,
        'diagonal-1x1': 2,
        'roda-1x1': 4,
        'sapata-1x1': 4,
        'guarda-corpo-porta-1x1': 1,
        'guarda-corpo-sem-porta-1x1': 3,
        'escada-1m-1x1': 0,
        'escada-2m-1x1': 2
      },
      '5M': {
        'painel-1x1': 10,
        'piso-1x1': 3,
        'diagonal-1x1': 2,
        'roda-1x1': 4,
        'sapata-1x1': 4,
        'guarda-corpo-porta-1x1': 1,
        'guarda-corpo-sem-porta-1x1': 3,
        'escada-1m-1x1': 1,
        'escada-2m-1x1': 2
      }
    }
  },
  '1x1.50': {
    heights: ['2M', '3M', '4M', '5M', '6M', '7M', '8M', '9M', '10M'],
    presets: {
      '2M': {
        'painel-1x150': 4,
        'piso-1x150': 4,
        'diagonal-1x150': 2,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 0,
        'escada-2m-1x150': 1
      },
      '3M': {
        'painel-1x150': 6,
        'piso-1x150': 4,
        'diagonal-1x150': 2,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 1,
        'escada-2m-1x150': 1
      },
      '4M': {
        'painel-1x150': 8,
        'piso-1x150': 4,
        'diagonal-1x150': 2,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 0,
        'escada-2m-1x150': 2
      },
      '5M': {
        'painel-1x150': 10,
        'piso-1x150': 4,
        'diagonal-1x150': 2,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 1,
        'escada-2m-1x150': 2
      },
      '6M': {
        'painel-1x150': 12,
        'piso-1x150': 4,
        'diagonal-1x150': 3,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 0,
        'escada-2m-1x150': 3
      },
      '7M': {
        'painel-1x150': 14,
        'piso-1x150': 4,
        'diagonal-1x150': 3,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 1,
        'escada-2m-1x150': 3
      },
      '8M': {
        'painel-1x150': 16,
        'piso-1x150': 4,
        'diagonal-1x150': 4,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 0,
        'escada-2m-1x150': 4
      },
      '9M': {
        'painel-1x150': 18,
        'piso-1x150': 4,
        'diagonal-1x150': 4,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 1,
        'escada-2m-1x150': 4
      },
      '10M': {
        'painel-1x150': 20,
        'piso-1x150': 4,
        'diagonal-1x150': 4,
        'roda-1x150': 4,
        'sapata-1x150': 4,
        'guarda-corpo-sem-porta-1x150': 3,
        'guarda-corpo-porta-1x150': 1,
        'escada-1m-1x150': 0,
        'escada-2m-1x150': 5
      }
    }
  },
  '1x2.00': {
    heights: ['2M', '3M', '4M', '5M', '6M', '7M', '8M', '9M', '10M'],
    presets: {
      '2M': {
        'painel-1x200': 4,
        'piso-1x200': 5,
        'diagonal-1x200': 2,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 0,
        'escada-2m-1x200': 1
      },
      '3M': {
        'painel-1x200': 6,
        'piso-1x200': 5,
        'diagonal-1x200': 2,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 1,
        'escada-2m-1x200': 1
      },
      '4M': {
        'painel-1x200': 8,
        'piso-1x200': 5,
        'diagonal-1x200': 2,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 0,
        'escada-2m-1x200': 2
      },
      '5M': {
        'painel-1x200': 10,
        'piso-1x200': 5,
        'diagonal-1x200': 2,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 1,
        'escada-2m-1x200': 2
      },
      '6M': {
        'painel-1x200': 12,
        'piso-1x200': 5,
        'diagonal-1x200': 3,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 0,
        'escada-2m-1x200': 3
      },
      '7M': {
        'painel-1x200': 14,
        'piso-1x200': 5,
        'diagonal-1x200': 3,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 1,
        'escada-2m-1x200': 3
      },
      '8M': {
        'painel-1x200': 16,
        'piso-1x200': 5,
        'diagonal-1x200': 4,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 0,
        'escada-2m-1x200': 4
      },
      '9M': {
        'painel-1x200': 18,
        'piso-1x200': 5,
        'diagonal-1x200': 4,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 1,
        'escada-2m-1x200': 4
      },
      '10M': {
        'painel-1x200': 20,
        'piso-1x200': 5,
        'diagonal-1x200': 4,
        'roda-1x200': 4,
        'sapata-1x200': 4,
        'guarda-corpo-sem-porta-1x200': 3,
        'guarda-corpo-porta-1x200': 1,
        'escada-1m-1x200': 0,
        'escada-2m-1x200': 5
      }
    }
  }
};