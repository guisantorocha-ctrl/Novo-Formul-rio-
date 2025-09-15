document.addEventListener('DOMContentLoaded', () => {
    const scaffoldTypeRadios = document.querySelectorAll('input[name="scaffoldType"]');
    const scaffoldItemsDiv = document.getElementById('scaffoldItems');
    const scaffoldForm = document.getElementById('scaffoldForm');
    const heightSelectionDiv = document.getElementById('heightSelection');
    const scaffoldHeightSelect = document.getElementById('scaffoldHeight');
    const towerQuantityDiv = document.getElementById('towerQuantity');
    const decreaseTowerBtn = document.getElementById('decreaseTower');
    const increaseTowerBtn = document.getElementById('increaseTower');
    const towerCountSpan = document.getElementById('towerCount');

    let towerQuantity = 1; // Valor inicial da quantidade de torres
    let selectedScaffoldType = '1x1'; // Tipo selecionado por padrão
    let savedQuantities = {}; // Objeto para armazenar as quantidades salvas

    const scaffoldData = {
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

    // Dados dos presets de altura
    const heightPresets = {
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

    function updateHeightOptions() {
        scaffoldHeightSelect.innerHTML = '';
        
        const heights = heightPresets[selectedScaffoldType].heights;
        
        heights.forEach(height => {
            const option = document.createElement('option');
            option.value = height;
            option.textContent = height;
            scaffoldHeightSelect.appendChild(option);
        });
    }

    function applyHeightPreset(height) {
        // Primeiro, limpar todas as seleções
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:not([name="scaffoldType"]):not(#completeScaffold)');
        const quantityInputs = document.querySelectorAll('.quantity-input');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        quantityInputs.forEach(input => {
            input.disabled = true;
            input.value = 0;
        });
        
        // Aplicar as quantidades do preset para o tipo selecionado
        const preset = heightPresets[selectedScaffoldType].presets[height];
        
        for (const itemId in preset) {
            const checkbox = document.getElementById(itemId);
            const quantityInput = document.getElementById(`${itemId}-qty`);
            
            if (checkbox && quantityInput) {
                checkbox.checked = true;
                quantityInput.disabled = false;
                quantityInput.value = preset[itemId] * towerQuantity;
            }
        }
    }

    function renderScaffoldItems() {
        scaffoldItemsDiv.innerHTML = ''; // Limpa os itens existentes
        
        const items = scaffoldData[selectedScaffoldType];
        const typeTitle = document.createElement('h2');
        typeTitle.textContent = `Andaime Tubular ${selectedScaffoldType.replace('x', 'x')}`;
        typeTitle.style.color = '#667eea';
        typeTitle.style.marginBottom = '20px';
        typeTitle.style.fontSize = '1.5rem';
        scaffoldItemsDiv.appendChild(typeTitle);

        for (const category in items) {
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('item-group');
            categoryDiv.innerHTML = `<h3>🔹 ${category}</h3>`;

            items[category].forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.innerHTML = `
                    <input type="checkbox" id="${item.id}" name="${item.id}">
                    <label for="${item.id}">${item.name}</label>
                    <input type="number" id="${item.id}-qty" name="${item.id}-qty" min="0" value="0" class="quantity-input" disabled>
                `;
                categoryDiv.appendChild(itemDiv);

                // Habilita/desabilita o campo de quantidade ao marcar/desmarcar o checkbox
                const checkbox = itemDiv.querySelector(`#${item.id}`);
                const quantityInput = itemDiv.querySelector(`#${item.id}-qty`);
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        // Se está marcando, habilita o campo e restaura o valor salvo (se houver)
                        quantityInput.disabled = false;
                        if (savedQuantities[item.id] !== undefined) {
                            quantityInput.value = savedQuantities[item.id];
                        } else {
                            quantityInput.value = 0;
                        }
                    } else {
                        // Se está desmarcando, salva o valor atual e zera
                        if (quantityInput.value > 0) {
                            savedQuantities[item.id] = quantityInput.value;
                        }
                        quantityInput.value = 0;
                        quantityInput.disabled = true;
                    }
                });
                
                // Adiciona listener para salvar a quantidade quando o usuário digitar
                quantityInput.addEventListener('input', () => {
                    if (checkbox.checked && quantityInput.value > 0) {
                        savedQuantities[item.id] = quantityInput.value;
                    }
                });
            });
            scaffoldItemsDiv.appendChild(categoryDiv);
        }
    }

    // Adiciona listeners para os radio buttons de tipo de andaime
    scaffoldTypeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                selectedScaffoldType = event.target.value;
                renderScaffoldItems();
                updateHeightOptions();
                
                // Sempre aplicar o preset da altura selecionada
                applyHeightPreset(scaffoldHeightSelect.value);
            }
        });
    });

    // Adiciona listener para mudança na altura
    scaffoldHeightSelect.addEventListener('change', (event) => {
        applyHeightPreset(event.target.value);
    });

    // Listeners para os botões de quantidade de torres
    decreaseTowerBtn.addEventListener('click', () => {
        if (towerQuantity > 1) {
            towerQuantity--;
            towerCountSpan.textContent = towerQuantity;
            applyHeightPreset(scaffoldHeightSelect.value);
        }
    });

    increaseTowerBtn.addEventListener('click', () => {
        towerQuantity++;
        towerCountSpan.textContent = towerQuantity;
        applyHeightPreset(scaffoldHeightSelect.value);
    });

    // Lógica para enviar o orçamento via WhatsApp
    scaffoldForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Capturar dados do cliente
        const clientName = document.getElementById('clientName').value.trim();
        const clientPhone = document.getElementById('clientPhone').value.trim();
        const clientEmail = document.getElementById('clientEmail').value.trim();

        // Validar campos obrigatórios
        if (!clientName || !clientPhone || !clientEmail) {
            alert('Por favor, preencha todos os dados do cliente (Nome, Telefone e Email).');
            return;
        }

        // Montar mensagem estruturada
        let message = `*SOLICITAÇÃO DE ORÇAMENTO - ANDAIMES TUBULARES*\n\n`;
        
        message += `*Cliente:* ${clientName.toUpperCase()}\n`;
        message += `*Telefone:* ${clientPhone}\n`;
        message += `*Email:* ${clientEmail}\n\n`;
        
        message += `*Tipo de Andaime:* Andaime Tubular ${selectedScaffoldType.replace('x', 'x')}\n`;
        message += `*Altura:* ${scaffoldHeightSelect.value}\n`;
        message += `*Torres:* ${towerQuantity}\n\n`;

        let hasSelectedItem = false;
        const currentItems = scaffoldData[selectedScaffoldType];
        
        // Agrupar itens por categoria
        for (const category in currentItems) {
            let categoryHasItems = false;
            let categoryMessage = `*${category}*\n`;
            
            currentItems[category].forEach(item => {
                const checkbox = document.getElementById(item.id);
                const quantityInput = document.getElementById(`${item.id}-qty`);
                
                if (checkbox && checkbox.checked && quantityInput && quantityInput.value > 0) {
                    categoryMessage += `• ${item.name} → Quantidade: ${quantityInput.value}\n`;
                    categoryHasItems = true;
                    hasSelectedItem = true;
                }
            });
            
            if (categoryHasItems) {
                message += categoryMessage + '\n';
            }
        }

        if (!hasSelectedItem) {
            alert('Por favor, selecione pelo menos um item e informe a quantidade.');
            return;
        }

        message += `Aguardo retorno com o orçamento. Obrigado!`;

        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://api.whatsapp.com/send/?phone=5541997630212&text=${encodedMessage}&type=phone_number&app_absent=0`;
        
        // Abre o WhatsApp
        window.open(whatsappURL, '_blank');
    });

    // Inicialização: seleciona o primeiro tipo por padrão
    document.getElementById('scaffoldType1x1').checked = true;
    renderScaffoldItems();
    updateHeightOptions();
    applyHeightPreset(scaffoldHeightSelect.value);
});

