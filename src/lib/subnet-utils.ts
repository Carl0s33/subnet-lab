/**
 * Utilitários para cálculos de sub-redes IP
 * 
 * Este módulo contém funções para manipulação e cálculo de endereços IP e máscaras de sub-rede.
 */

/**
 * Informações da sub-rede calculada
 */
export interface SubnetInfo {
  /** Endereço de rede */
  networkAddress: string;
  /** Endereço de broadcast */
  broadcastAddress: string;
  /** Primeiro host utilizável */
  firstHost: string;
  /** Último host utilizável */
  lastHost: string;
  /** Número total de hosts possíveis */
  totalHosts: number;
  /** Número de hosts utilizáveis */
  usableHosts: number;
  /** Máscara de sub-rede em formato decimal */
  subnetMask: string;
  /** Máscara wildcard */
  wildcardMask: string;
  /** Representação binária do IP */
  binaryIP: string;
  /** Representação binária da máscara */
  binaryMask: string;
}

/**
 * Valida o formato de um endereço IPv4
 * @param ip - Endereço IP para validar (ex: '192.168.1.1')
 * @returns true se o formato for válido, false caso contrário
 */
export const validateIP = (ip: string): boolean => {
  // Expressão regular para validar formato de IP (4 grupos de 1-3 dígitos separados por .)
  const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipRegex);
  
  // Se não corresponde ao formato básico, retorna falso
  if (!match) return false;
  
  // Converte os octetos para números e verifica se estão entre 0 e 255
  const octets = match.slice(1, 5).map(Number);
  return octets.every(octet => octet >= 0 && octet <= 255);
};

/**
 * Valida uma máscara de sub-rede em formato CIDR ou decimal
 * @param mask - Máscara de sub-rede (ex: '255.255.255.0' ou '/24')
 * @returns true se a máscara for válida, false caso contrário
 */
export const validateSubnetMask = (mask: string): boolean => {
  // Verifica se está em notação CIDR (ex: /24)
  if (mask.startsWith('/')) {
    const cidr = parseInt(mask.substring(1), 10);
    return !isNaN(cidr) && cidr >= 0 && cidr <= 32;
  }
  
  // Verifica se é uma máscara em formato decimal (ex: 255.255.255.0)
  if (validateIP(mask)) {
    const binary = ipToBinary(mask).replace(/\./g, '');
    
    // Verifica se é uma máscara válida (1s consecutivos seguidos de 0s consecutivos)
    const hasOnlyBinary = /^[01]+$/.test(binary);
    const hasLeadingOnes = /^1*0*$/.test(binary);
    
    return hasOnlyBinary && hasLeadingOnes && binary.length === 32;
  }
  
  return false;
};

/**
 * Converte um endereço IP para sua representação binária
 * @param ip - Endereço IP em formato decimal (ex: '192.168.1.1')
 * @returns String com a representação binária do IP (ex: '11000000.10101000.00000001.00000001')
 */
export const ipToBinary = (ip: string): string => {
  if (!validateIP(ip)) {
    throw new Error('Endereço IP inválido');
  }
  
  return ip.split('.').map(octet => 
    parseInt(octet, 10).toString(2).padStart(8, '0')
  ).join('.');
};

/**
 * Converte uma string binária para um endereço IP decimal
 * @param binary - String binária no formato '11000000.10101000.00000001.00000001'
 * @returns Endereço IP no formato decimal (ex: '192.168.1.1')
 * @throws {Error} Se o formato binário for inválido
 */
export const binaryToIp = (binary: string): string => {
  // Verifica se o formato está correto (4 octetos binários de 8 bits cada)
  const binaryRegex = /^([01]{8}\.?){4}$/;
  if (!binaryRegex.test(binary)) {
    throw new Error('Formato binário inválido. Use o formato: 11000000.10101000.00000001.00000001');
  }
  
  try {
    return binary.split('.').map(octet => 
      parseInt(octet, 2).toString()
    ).join('.');
  } catch (error) {
    throw new Error('Falha ao converter binário para IP: ' + error.message);
  }
};

/**
 * Converte notação CIDR para máscara de sub-rede decimal
 * @param cidr - Valor CIDR (0-32)
 * @returns Máscara de sub-rede no formato decimal (ex: '255.255.255.0')
 * @throws {Error} Se o valor CIDR for inválido
 */
export const cidrToMask = (cidr: number): string => {
  // Valida o valor CIDR
  if (isNaN(cidr) || cidr < 0 || cidr > 32) {
    throw new Error('CIDR deve estar entre 0 e 32');
  }
  
  // Cria a máscara octeto por octeto
  const mask = [];
  for (let i = 0; i < 4; i++) {
    // Calcula quantos bits devem ser 1s neste octeto
    const bits = Math.min(8, Math.max(0, cidr - (i * 8)));
    // Converte para decimal (ex: 24 bits = 255.255.255.0)
    mask.push(bits === 0 ? 0 : 256 - Math.pow(2, 8 - bits));
  }
  
  return mask.join('.');
};

/**
 * Converte máscara de sub-rede decimal para notação CIDR
 * @param mask - Máscara de sub-rede (ex: '255.255.255.0')
 * @returns Valor CIDR (0-32)
 * @throws {Error} Se a máscara for inválida
 */
export const maskToCidr = (mask: string): number => {
  if (!validateSubnetMask(mask)) {
    throw new Error('Máscara de sub-rede inválida');
  }
  
  try {
    // Remove os pontos e conta os '1's para obter o valor CIDR
    const binary = ipToBinary(mask).replace(/\./g, '');
    return (binary.match(/1/g) || []).length;
  } catch (error) {
    throw new Error('Falha ao converter máscara para CIDR: ' + error.message);
  }
};

/**
 * Calcula a máscara wildcard a partir da máscara de sub-rede
 * @param subnetMask - Máscara de sub-rede (ex: '255.255.255.0')
 * @returns Máscara wildcard (ex: '0.0.0.255')
 * @throws {Error} Se a máscara for inválida
 */
export const getWildcardMask = (subnetMask: string): string => {
  if (!validateSubnetMask(subnetMask)) {
    throw new Error('Máscara de sub-rede inválida');
  }
  
  try {
    // A máscara wildcard é o complemento bit a bit da máscara de sub-rede
    return subnetMask
      .split('.')
      .map(octet => (255 - parseInt(octet, 10)).toString())
      .join('.');
  } catch (error) {
    throw new Error('Falha ao calcular máscara wildcard: ' + error.message);
  }
};

/**
 * Realiza operação AND bit a bit entre dois IPs
 * @param ip1 - Primeiro IP
 * @param ip2 - Segundo IP
 * @returns Resultado da operação AND bit a bit
 */
export const bitwiseAnd = (ip1: string, ip2: string): string => {
  const octets1 = ip1.split('.').map(Number);
  const octets2 = ip2.split('.').map(Number);
  
  return octets1.map((octet, index) => 
    (octet & octets2[index]).toString()
  ).join('.');
};

/**
 * Realiza operação OR bit a bit entre dois endereços IP
 * @param ip1 - Primeiro endereço IP
 * @param ip2 - Segundo endereço IP
 * @returns Resultado da operação OR bit a bit
 * @throws {Error} Se algum dos IPs for inválido
 */
export const bitwiseOr = (ip1: string, ip2: string): string => {
  if (!validateIP(ip1) || !validateIP(ip2)) {
    throw new Error('Um ou mais endereços IP são inválidos');
  }
  
  try {
    const octets1 = ip1.split('.').map(Number);
    const octets2 = ip2.split('.').map(Number);
    
    return octets1.map((octet, index) => 
      (octet | octets2[index]).toString()
    ).join('.');
  } catch (error) {
    throw new Error('Falha ao realizar operação OR: ' + error.message);
  }
};

/**
 * Incrementa um endereço IP em 1
 * @param ip - Endereço IP a ser incrementado
 * @returns Novo endereço IP incrementado
 * @throws {Error} Se o IP for inválido ou estourar o limite máximo
 */
export const incrementIp = (ip: string): string => {
  if (!validateIP(ip)) {
    throw new Error('Endereço IP inválido');
  }
  
  try {
    let octets = ip.split('.').map(Number);
    
    // Percorre os octetos da direita para a esquerda
    for (let i = 3; i >= 0; i--) {
      if (octets[i] < 255) {
        octets[i]++;
        return octets.join('.');
      } else {
        octets[i] = 0;
        // Se for o último octeto e estiver estourando, lança erro
        if (i === 0) {
          throw new Error('Estouro: endereço IP máximo atingido (255.255.255.255)');
        }
      }
    }
    
    return octets.join('.');
  } catch (error) {
    throw new Error('Falha ao incrementar IP: ' + error.message);
  }
};

/**
 * Decrementa um endereço IP em 1
 * @param ip - Endereço IP a ser decrementado
 * @returns Novo endereço IP decrementado
 * @throws {Error} Se o IP for inválido ou estiver no limite mínimo
 */
export const decrementIp = (ip: string): string => {
  if (!validateIP(ip)) {
    throw new Error('Endereço IP inválido');
  }
  
  try {
    let octets = ip.split('.').map(Number);
    
    // Verifica se já está no IP mínimo
    if (octets.every(octet => octet === 0)) {
      throw new Error('Estouro: endereço IP mínimo atingido (0.0.0.0)');
    }
    
    // Percorre os octetos da direita para a esquerda
    for (let i = 3; i >= 0; i--) {
      if (octets[i] > 0) {
        octets[i]--;
        return octets.join('.');
      } else {
        octets[i] = 255;
      }
    }
    
    return octets.join('.');
  } catch (error) {
    throw new Error('Falha ao decrementar IP: ' + error.message);
  }
};

/**
 * Calcula informações detalhadas sobre uma sub-rede com base no IP e máscara fornecidos
 * @param ipAddress - Endereço IP (ex: '192.168.1.1')
 * @param subnetMask - Máscara de sub-rede (ex: '255.255.255.0' ou '/24')
 * @returns Objeto com todas as informações da sub-rede
 * @throws {Error} Se o IP ou máscara forem inválidos
 */
export const calculateSubnet = (ipAddress: string, subnetMask: string): SubnetInfo => {
  // Valida o endereço IP
  if (!validateIP(ipAddress)) {
    throw new Error('Endereço IP inválido');
  }

  // Converte notação CIDR para máscara decimal, se necessário
  let mask = subnetMask;
  if (subnetMask.startsWith('/')) {
    try {
      const cidr = parseInt(subnetMask.substring(1), 10);
      if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        throw new Error('Valor CIDR inválido. Deve estar entre 0 e 32');
      }
      mask = cidrToMask(cidr);
    } catch (error) {
      throw new Error('Falha ao converter CIDR para máscara: ' + error.message);
    }
  }
  
  // Calculate network address (IP AND Mask)
  const networkAddress = bitwiseAnd(ipAddress, mask);
  
  // Calculate wildcard mask
  const wildcardMask = getWildcardMask(mask);
  
  // Calculate broadcast address (Network OR Wildcard)
  const broadcastAddress = bitwiseOr(networkAddress, wildcardMask);
  
  // Valida a máscara de sub-rede
  if (!validateSubnetMask(mask)) {
    throw new Error('Máscara de sub-rede inválida');
  }
  
  try {
    // Converte IP e máscara para binário para exibição
    const binaryIP = ipToBinary(ipAddress);
    const binaryMask = ipToBinary(mask);
    
    // Calcula o endereço de rede (IP AND máscara)
    const networkAddress = bitwiseAnd(ipAddress, mask);
    
    // Calcula o endereço de broadcast (rede OR wildcard)
    const wildcard = getWildcardMask(mask);
    const broadcastAddress = bitwiseOr(networkAddress, wildcard);
    
    // Calcula primeiro e último host utilizáveis
    let firstHost = incrementIp(networkAddress);
    let lastHost = decrementIp(broadcastAddress);
    
    // Casos especiais para redes /31 e /32 (RFC 3021)
    const cidr = maskToCidr(mask);
    if (cidr >= 31) {
      firstHost = networkAddress;
      lastHost = broadcastAddress;
    }
    
    // Calcula o número total de hosts e hosts utilizáveis
    const totalHosts = Math.pow(2, 32 - cidr);
    let usableHosts = Math.max(0, totalHosts - 2);
    
    // Ajusta para redes /31 e /32 que têm regras especiais
    if (cidr >= 31) {
      usableHosts = totalHosts;
    }
    
    // Retorna todas as informações da sub-rede
    return {
      networkAddress,
      broadcastAddress,
      firstHost,
      lastHost,
      totalHosts,
      usableHosts,
      subnetMask: mask,
      wildcardMask: wildcard,
      binaryIP,
      binaryMask: binaryMask
    };
  } catch (error) {
    throw new Error('Falha ao calcular informações da sub-rede: ' + error.message);
  }
};