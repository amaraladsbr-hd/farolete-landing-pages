/* Farolete — catálogo local (admin + loja)
 * Tipos alinhados à prancha do catálogo + kickoff.
 * Imagens: paginas/assets/imagens/catalogo/hq/catalogo_{id}.jpg
 */
(function (global) {
  const STORAGE_KEY = 'farolete_catalog_v3';

  const CATEGORIES = {
    iluminacao: 'Iluminação',
    vidros: 'Vidros',
    visual: 'Visual',
    trancas: 'Trancas',
    retrovisores: 'Retrovisores',
    rodas: 'Rodas',
    eletrica: 'Elétrica',
    motor: 'Motor',
    outros: 'Outros'
  };

  const DEFAULT_PRODUCTS = [
    // Iluminação
    { id: 'farol_principal', name: 'Farol principal', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_farol_principal.jpg?v=3' },
    { id: 'farol_milha', name: 'Farol de milha', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_farol_milha.jpg?v=3' },
    { id: 'lanterna_traseira', name: 'Lanterna traseira', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lanterna_traseira.jpg?v=3' },
    { id: 'lanterna_pisca', name: 'Lanterna de pisca', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lanterna_pisca.jpg?v=3' },
    { id: 'lampada_h4', name: 'Lâmpada H4', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_h4.jpg?v=3' },
    { id: 'lampada_h1', name: 'Lâmpada H1', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_h1.jpg?v=3' },
    { id: 'lampada_1polo', name: 'Lâmpada 1 polo', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_1polo.jpg?v=3' },
    { id: 'lampada_led', name: 'Lâmpada LED', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_led.jpg?v=3' },
    { id: 'lampada_torpedo', name: 'Lâmpada torpedo', category: 'iluminacao', image: 'assets/imagens/catalogo/hq/catalogo_lampada_torpedo.jpg?v=3' },
    // Vidros
    { id: 'parabrisa', name: 'Para-brisa', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_parabrisa.jpg?v=3' },
    { id: 'vidro_porta', name: 'Vidro de porta', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_vidro_porta.jpg?v=3' },
    { id: 'borracha_porta', name: 'Borracha de porta', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_borracha_porta.jpg?v=3' },
    { id: 'palhetas', name: 'Palhetas', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_palhetas.jpg?v=3' },
    { id: 'calha_chuva', name: 'Calha de chuva', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_calha_chuva.jpg?v=3' },
    { id: 'maquina_vidro_manual', name: 'Máquina de vidro manual', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_maquina_vidro_manual.jpg?v=3' },
    { id: 'maquina_vidro_eletrica', name: 'Máquina de vidro elétrica', category: 'vidros', image: 'assets/imagens/catalogo/hq/catalogo_maquina_vidro_eletrica.jpg?v=3' },
    // Visual
    { id: 'parachoque', name: 'Para-choque', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_parachoque.jpg?v=3' },
    { id: 'grade', name: 'Grade', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_grade.jpg?v=3' },
    { id: 'friso', name: 'Friso', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_friso.jpg?v=3' },
    { id: 'moldura_paralama', name: 'Moldura paralama', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_moldura_paralama.jpg?v=3' },
    { id: 'spoiler', name: 'Spoiler traseiro', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_spoiler.jpg?v=3' },
    { id: 'pingadeira', name: 'Pingadeira', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_pingadeira.jpg?v=3' },
    { id: 'parabarro', name: 'Para-barro', category: 'visual', image: 'assets/imagens/catalogo/hq/catalogo_parabarro.jpg?v=3' },
    // Trancas
    { id: 'macaneta', name: 'Maçaneta', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_macaneta.jpg?v=3' },
    { id: 'fechadura', name: 'Fechadura', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_fechadura.jpg?v=3' },
    { id: 'cilindro', name: 'Cilindro', category: 'trancas', image: 'assets/imagens/catalogo/hq/catalogo_cilindro.jpg?v=3' },
    // Retrovisores
    { id: 'retrovisor', name: 'Retrovisor', category: 'retrovisores', image: 'assets/imagens/catalogo/hq/catalogo_retrovisor.jpg?v=3' },
    { id: 'capa_retrovisor', name: 'Capa de retrovisor', category: 'retrovisores', image: 'assets/imagens/catalogo/hq/catalogo_capa_retrovisor.jpg?v=3' },
    { id: 'refil_espelho', name: 'Refil de espelho', category: 'retrovisores', image: 'assets/imagens/catalogo/hq/catalogo_refil_espelho.jpg?v=3' },
    // Rodas
    { id: 'calota', name: 'Calota', category: 'rodas', image: 'assets/imagens/catalogo/hq/catalogo_calota.jpg?v=3' },
    { id: 'roda_liga', name: 'Roda de liga', category: 'rodas', image: 'assets/imagens/catalogo/hq/catalogo_roda_liga.jpg?v=3' },
    // Elétrica
    { id: 'botao_vidro', name: 'Botão de vidro elétrico', category: 'eletrica', image: 'assets/imagens/catalogo/hq/catalogo_botao_vidro.jpg?v=3' },
    { id: 'chave_seta', name: 'Chave de seta', category: 'eletrica', image: 'assets/imagens/catalogo/hq/catalogo_chave_seta.jpg?v=3' },
    { id: 'fusivel', name: 'Fusível', category: 'eletrica', image: 'assets/imagens/catalogo/hq/catalogo_fusivel.jpg?v=3' },
    // Motor
    { id: 'reservatorio_agua', name: 'Reservatório de água', category: 'motor', image: 'assets/imagens/catalogo/hq/catalogo_reservatorio_agua.jpg?v=3' },
    { id: 'correia', name: 'Correia', category: 'motor', image: 'assets/imagens/catalogo/hq/catalogo_correia.jpg?v=3' }
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
