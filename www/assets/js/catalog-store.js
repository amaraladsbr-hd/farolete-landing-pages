/* Farolete — catálogo local (admin + site institucional) */
(function (global) {
  const STORAGE_KEY = 'farolete_catalog_v1';

  const CATEGORIES = {
    vidros: 'Vidros',
    iluminacao: 'Iluminação',
    trancas: 'Trancas',
    visual: 'Visual',
    retrovisores: 'Retrovisores',
    rodas: 'Rodas',
    outros: 'Outros'
  };

  const DEFAULT_PRODUCTS = [
    { id: 'parabrisa', name: 'Para-brisa', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_parabrisa.jpg' },
    { id: 'vidro_porta', name: 'Vidro de porta', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_vidro_porta.jpg' },
    { id: 'farol_principal', name: 'Farol principal', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_farol_principal.jpg' },
    { id: 'farol_milha', name: 'Farol de milha', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_farol_milha.jpg' },
    { id: 'lanterna_traseira', name: 'Lanterna traseira', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lanterna_traseira.jpg' },
    { id: 'lanterna_pisca', name: 'Lanterna de pisca', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lanterna_pisca.jpg' },
    { id: 'lampada_h4', name: 'Lâmpada H4', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_h4.jpg' },
    { id: 'lampada_1polo', name: 'Lâmpada 1 polo', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_1polo.jpg' },
    { id: 'macaneta', name: 'Maçaneta', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_macaneta.jpg' },
    { id: 'fechadura', name: 'Fechadura', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_fechadura.jpg' },
    { id: 'cilindro', name: 'Cilindro', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_cilindro.jpg' },
    { id: 'borracha_porta', name: 'Borracha de porta', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_borracha_porta.jpg' },
    { id: 'parachoque', name: 'Parachoque', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_parachoque.jpg' },
    { id: 'grade', name: 'Grade', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_grade.jpg' },
    { id: 'friso', name: 'Friso', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_friso.jpg' },
    { id: 'moldura_paralama', name: 'Moldura paralama', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_moldura_paralama.jpg' },
    { id: 'retrovisor', name: 'Retrovisor', category: 'retrovisores', image: 'assets/imagens/catalogo/hq/catalogo_retrovisor.jpg' },
    { id: 'capa_retrovisor', name: 'Capa', category: 'retrovisores', image: 'assets/imagens/catalogo/hq/catalogo_capa_retrovisor.jpg' },
    { id: 'refil_espelho', name: 'Refil de espelho', category: 'retrovisores', image: 'assets/imagens/catalogo/hq/catalogo_refil_espelho.jpg' },
    { id: 'calota', name: 'Calota', category: 'rodas', image: 'assets/imagens/catalogo/hq/catalogo_calota.jpg' },
    { id: 'roda_liga', name: 'Roda de liga', category: 'rodas', image: 'assets/imagens/catalogo/hq/catalogo_roda_liga.jpg' }
  ];

  function uid() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getProducts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PRODUCTS.map(p => ({ ...p }));
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return DEFAULT_PRODUCTS.map(p => ({ ...p }));
      return parsed;
    } catch (e) {
      return DEFAULT_PRODUCTS.map(p => ({ ...p }));
    }
  }

  function saveProducts(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function resetProducts() {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_PRODUCTS.map(p => ({ ...p }));
  }

  function categoryLabel(cat) {
    return CATEGORIES[cat] || cat || 'Outros';
  }

  global.FaroleteCatalog = {
    STORAGE_KEY,
    CATEGORIES,
    DEFAULT_PRODUCTS,
    uid,
    getProducts,
    saveProducts,
    resetProducts,
    categoryLabel
  };
})(window);
