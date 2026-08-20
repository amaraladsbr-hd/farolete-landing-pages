/* Farolete — catálogo da loja (tipos + SEO + veículos da planilha)
 * Imagens ilustrativas. Confirmação de peça/veículo no WhatsApp.
 * STORAGE_KEY v5 — remove roda_liga e correia; só calotas na categoria rodas.
 */
(function (global) {
  const STORAGE_KEY = 'farolete_catalog_v5';
  const IMG = (id) => 'assets/imagens/catalogo/hq/catalogo_' + id + '.jpg?v=13';

  const CATEGORIES = {
    iluminacao: 'Iluminação',
    vidros: 'Vidros',
    visual: 'Visual',
    trancas: 'Trancas',
    retrovisores: 'Retrovisores',
    rodas: 'Calotas',
    eletrica: 'Elétrica',
    motor: 'Motor',
    outros: 'Outros'
  };

  /** SEO + copy padrão por tipo (imagem sempre ilustrativa) */
  function seo(name, category, extraKeywords) {
    const cat = CATEGORIES[category] || category;
    return {
      seoTitle: name + ' para carros em Sarzedo | Farolete Casa de Peças',
      seoDescription: 'Consulte ' + name.toLowerCase() + ' (' + cat.toLowerCase() + ') na Farolete em Sarzedo. Imagem meramente ilustrativa — confirme veículo, ano e disponibilidade no WhatsApp.',
      keywords: [name, cat, 'autopeças', 'Sarzedo', 'Farolete'].concat(extraKeywords || []),
      disclaimer: 'Imagem meramente ilustrativa. A peça do seu veículo é confirmada pela loja conforme modelo e ano.'
    };
  }

  const BASE = [
    { id: 'farol_principal', name: 'Farol principal', category: 'iluminacao', aliases: ['farol','lanternagem'] },
    { id: 'farol_milha', name: 'Farol de milha', category: 'iluminacao', aliases: ['milha','auxiliar'] },
    { id: 'lanterna_traseira', name: 'Lanterna traseira', category: 'iluminacao', aliases: ['lant','lanterna'] },
    { id: 'lanterna_pisca', name: 'Lanterna de pisca', category: 'iluminacao', aliases: ['pisca','seta'] },
    { id: 'lampada_h4', name: 'Lâmpada H4', category: 'iluminacao', aliases: ['lamp','lâmpada','h4'] },
    { id: 'lampada_h1', name: 'Lâmpada H1', category: 'iluminacao', aliases: ['h1'] },
    { id: 'lampada_1polo', name: 'Lâmpada 1 polo', category: 'iluminacao', aliases: ['1 polo','lampada'] },
    { id: 'lampada_led', name: 'Lâmpada LED', category: 'iluminacao', aliases: ['led'] },
    { id: 'lampada_torpedo', name: 'Lâmpada torpedo', category: 'iluminacao', aliases: ['torpedo'] },
    { id: 'lente', name: 'Lente', category: 'iluminacao', aliases: ['lente farol','lente lanterna'] },
    { id: 'parabrisa', name: 'Para-brisa', category: 'vidros', aliases: ['p/ brisa','parabrisa','vidro dianteiro'] },
    { id: 'vidro_porta', name: 'Vidro de porta', category: 'vidros', aliases: ['vidro lateral'] },
    { id: 'vidro_vigia', name: 'Vidro vigia', category: 'vidros', aliases: ['vigia','traseiro'] },
    { id: 'borracha_porta', name: 'Borracha de porta', category: 'vidros', aliases: ['borracha','vedação'] },
    { id: 'palhetas', name: 'Palhetas', category: 'vidros', aliases: ['limpador'] },
    { id: 'calha_chuva', name: 'Calha de chuva', category: 'vidros', aliases: ['calha'] },
    { id: 'maquina_vidro_manual', name: 'Máquina de vidro manual', category: 'vidros', aliases: ['máquina','maquina'] },
    { id: 'maquina_vidro_eletrica', name: 'Máquina de vidro elétrica', category: 'vidros', aliases: ['máquina elétrica','maquina eletrica'] },
    { id: 'pestana', name: 'Pestana', category: 'vidros', aliases: ['pestana porta'] },
    { id: 'canaleta', name: 'Canaleta', category: 'vidros', aliases: ['canaleta vidro'] },
    { id: 'parachoque', name: 'Para-choque', category: 'visual', aliases: ['pch','para-choque'] },
    { id: 'grade', name: 'Grade', category: 'visual', aliases: ['grade dianteira'] },
    { id: 'friso', name: 'Friso', category: 'visual', aliases: ['friso porta'] },
    { id: 'moldura_paralama', name: 'Moldura paralama', category: 'visual', aliases: ['mold','paralama'] },
    { id: 'spoiler', name: 'Spoiler traseiro', category: 'visual', aliases: ['aerofólio','aerofolio'] },
    { id: 'pingadeira', name: 'Pingadeira', category: 'visual', aliases: [] },
    { id: 'parabarro', name: 'Para-barro', category: 'visual', aliases: ['parabarro'] },
    { id: 'emblema', name: 'Emblema', category: 'visual', aliases: ['emb','logo'] },
    { id: 'macaneta', name: 'Maçaneta', category: 'trancas', aliases: ['macaneta'] },
    { id: 'fechadura', name: 'Fechadura', category: 'trancas', aliases: ['trava'] },
    { id: 'cilindro', name: 'Cilindro', category: 'trancas', aliases: ['miolo','ignição'] },
    { id: 'retrovisor', name: 'Retrovisor', category: 'retrovisores', aliases: ['retrov'] },
    { id: 'capa_retrovisor', name: 'Capa de retrovisor', category: 'retrovisores', aliases: ['capa'] },
    { id: 'refil_espelho', name: 'Refil de espelho', category: 'retrovisores', aliases: ['refil','espelho'] },
    { id: 'calota', name: 'Calota', category: 'rodas', aliases: ['calotas','roda','rodas'] },
    { id: 'botao_vidro', name: 'Botão de vidro elétrico', category: 'eletrica', aliases: ['botao','botão'] },
    { id: 'chave_seta', name: 'Chave de seta', category: 'eletrica', aliases: ['chave','seta'] },
    { id: 'fusivel', name: 'Fusível', category: 'eletrica', aliases: ['fusivel'] },
    { id: 'chicote', name: 'Chicote elétrico', category: 'eletrica', aliases: ['chicote'] },
    { id: 'cabo', name: 'Cabo', category: 'eletrica', aliases: ['cabo aço','cabo de aço'] },
    { id: 'soquete', name: 'Soquete', category: 'eletrica', aliases: ['soquete lâmpada'] },
    { id: 'reservatorio_agua', name: 'Reservatório de água', category: 'motor', aliases: ['reservatorio'] },
    { id: 'tampa', name: 'Tampa', category: 'motor', aliases: ['tampa óleo','tampa combustível'] },
    { id: 'amortecedor', name: 'Amortecedor', category: 'outros', aliases: ['amortecedor porta','amortecedor capô'] }
  ];

  function enrich(p) {
    const idx = global.FaroleteCatalogIndex || {};
    const vehicles = (idx.typeVehicles && idx.typeVehicles[p.id]) || [];
    const stockSkus = (idx.typeStock && idx.typeStock[p.id]) || 0;
    const samples = (idx.typeSamples && idx.typeSamples[p.id]) || [];
    const meta = seo(p.name, p.category, (p.aliases || []).concat(vehicles.slice(0, 12)));
    // searchText sem "Farolete" (evita "farol" bater em todos)
    const searchText = [p.name, p.category, CATEGORIES[p.category]]
      .concat(p.aliases || [])
      .concat(vehicles)
      .concat(samples)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return Object.assign({}, p, meta, {
      image: IMG(p.id),
      vehicles: vehicles,
      stockSkus: stockSkus,
      samples: samples,
      searchText: searchText
    });
  }

  const DEFAULT_PRODUCTS = BASE.map(enrich);

  function uid() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PRODUCTS.map(p => Object.assign({}, p));
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_PRODUCTS.map(p => Object.assign({}, p));
      // merge SEO from defaults; drop ids removidos (ex.: roda_liga)
      const allowed = new Set(DEFAULT_PRODUCTS.map(p => p.id));
      return parsed
        .filter(p => p && allowed.has(p.id))
        .map(p => {
          const d = DEFAULT_PRODUCTS.find(x => x.id === p.id);
          return d ? Object.assign({}, d, p, { image: d.image, vehicles: d.vehicles, searchText: d.searchText, disclaimer: d.disclaimer }) : p;
        });
    } catch (e) {
      return DEFAULT_PRODUCTS.map(p => Object.assign({}, p));
    }
  }

  function saveProducts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function resetProducts() {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_PRODUCTS.map(p => Object.assign({}, p));
  }

  function categoryLabel(cat) {
    return CATEGORIES[cat] || cat || 'Outros';
  }

  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function getVehicles() {
    const idx = global.FaroleteCatalogIndex || {};
    return (idx.vehicles || []).slice();
  }

  /** Busca: peça, categoria, aliases, modelo/marca de veículo (planilha) */
  function searchProducts(query, categoryFilter) {
    const q = normalize(query);
    let list = getProducts();
    if (categoryFilter && categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter);
    }
    if (!q) return { products: list, matchedVehicle: null, relatedSkus: [] };

    const vehicles = getVehicles();
    // Prioriza match exato de modelo; depois includes; evita marca genérica sozinha (ex.: "fiat")
    let matchedVehicle = vehicles.find(v => normalize(v.name) === q);
    if (!matchedVehicle) {
      matchedVehicle = vehicles.find(v => {
        const n = normalize(v.name);
        return n.length >= 2 && (n.includes(q) || q.includes(n));
      });
    }
    if (!matchedVehicle && q.length >= 3) {
      matchedVehicle = vehicles.find(v => {
        const full = normalize((v.brand || '') + ' ' + v.name);
        return full.includes(q) || q.includes(full);
      });
    }

    if (matchedVehicle) {
      const model = normalize(matchedVehicle.name);
      const related = list.filter(p =>
        (p.vehicles || []).some(v => normalize(v) === model) ||
        (p.searchText || '').includes(model)
      );
      return {
        products: related,
        matchedVehicle: matchedVehicle,
        relatedSkus: matchedVehicle.samples || []
      };
    }

    const products = list.filter(p => {
      const hay = p.searchText || normalize(p.name);
      if (hay.includes(q)) return true;
      // tokens: "farol principal" etc.
      return q.split(/\s+/).every(tok => tok.length < 2 || hay.includes(tok));
    });
    return { products: products, matchedVehicle: null, relatedSkus: [] };
  }

  global.FaroleteCatalog = {
    STORAGE_KEY,
    CATEGORIES,
    DEFAULT_PRODUCTS,
    uid,
    getProducts,
    saveProducts,
    resetProducts,
    categoryLabel,
    getVehicles,
    searchProducts,
    normalize
  };
})(window);
