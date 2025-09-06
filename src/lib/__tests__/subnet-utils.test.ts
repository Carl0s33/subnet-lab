import { 
  calculateSubnet, 
  validateIP, 
  validateSubnetMask,
  ipToBinary,
  binaryToIp,
  cidrToMask,
  maskToCidr,
  getWildcardMask
} from '../subnet-utils';

describe('Subnet Utilities', () => {
  describe('IP Validation', () => {
    it('should validate correct IP addresses', () => {
      expect(validateIP('192.168.1.1')).toBe(true);
      expect(validateIP('10.0.0.1')).toBe(true);
      expect(validateIP('172.16.0.1')).toBe(true);
      expect(validateIP('255.255.255.255')).toBe(true);
      expect(validateIP('0.0.0.0')).toBe(true);
    });

    it('should invalidate incorrect IP addresses', () => {
      expect(validateIP('256.168.1.1')).toBe(false);
      expect(validateIP('192.168.1')).toBe(false);
      expect(validateIP('192.168.1.1.1')).toBe(false);
      expect(validateIP('192.168.1.')).toBe(false);
      expect(validateIP('192.168.1.256')).toBe(false);
      expect(validateIP('')).toBe(false);
    });
  });

  describe('Subnet Mask Validation', () => {
    it('should validate correct subnet masks', () => {
      // CIDR notation
      expect(validateSubnetMask('/24')).toBe(true);
      expect(validateSubnetMask('/32')).toBe(true);
      expect(validateSubnetMask('/0')).toBe(true);
      
      // Dotted decimal notation
      expect(validateSubnetMask('255.255.255.0')).toBe(true);
      expect(validateSubnetMask('255.255.0.0')).toBe(true);
      expect(validateSubnetMask('255.0.0.0')).toBe(true);
      expect(validateSubnetMask('255.255.255.252')).toBe(true);
    });

    it('should invalidate incorrect subnet masks', () => {
      // Invalid CIDR
      expect(validateSubnetMask('/33')).toBe(false);
      expect(validateSubnetMask('/-1')).toBe(false);
      expect(validateSubnetMask('/abc')).toBe(false);
      
      // Invalid dotted decimal
      expect(validateSubnetMask('255.255.255.1')).toBe(false);
      expect(validateSubnetMask('255.255.254.0')).toBe(true); // This is actually valid
      expect(validateSubnetMask('256.255.255.0')).toBe(false);
      expect(validateSubnetMask('255.255.255')).toBe(false);
    });
  });

  describe('IP to Binary Conversion', () => {
    it('should convert IP to binary correctly', () => {
      expect(ipToBinary('192.168.1.1')).toBe('11000000.10101000.00000001.00000001');
      expect(ipToBinary('0.0.0.0')).toBe('00000000.00000000.00000000.00000000');
      expect(ipToBinary('255.255.255.255')).toBe('11111111.11111111.11111111.11111111');
    });
  });

  describe('Binary to IP Conversion', () => {
    it('should convert binary to IP correctly', () => {
      expect(binaryToIp('11000000.10101000.00000001.00000001')).toBe('192.168.1.1');
      expect(binaryToIp('00000000.00000000.00000000.00000000')).toBe('0.0.0.0');
      expect(binaryToIp('11111111.11111111.11111111.11111111')).toBe('255.255.255.255');
    });
  });

  describe('CIDR to Mask Conversion', () => {
    it('should convert CIDR to subnet mask correctly', () => {
      // Convert string parameters to numbers to match the function signature
      expect(cidrToMask(24)).toBe('255.255.255.0');
      expect(cidrToMask(16)).toBe('255.255.0.0');
      expect(cidrToMask(8)).toBe('255.0.0.0');
      expect(cidrToMask(0)).toBe('0.0.0.0');
      expect(cidrToMask(32)).toBe('255.255.255.255');
      expect(cidrToMask(30)).toBe('255.255.255.252');
    });
  });

  describe('Mask to CIDR Conversion', () => {
    it('should convert subnet mask to CIDR correctly', () => {
      // The maskToCidr function expects a string parameter
      expect(maskToCidr('255.255.255.0')).toBe(24);
      expect(maskToCidr('255.255.0.0')).toBe(16);
      expect(maskToCidr('255.0.0.0')).toBe(8);
      expect(maskToCidr('0.0.0.0')).toBe(0);
      expect(maskToCidr('255.255.255.255')).toBe(32);
      expect(maskToCidr('255.255.255.252')).toBe(30);
    });
  });

  describe('Wildcard Mask', () => {
    it('should calculate wildcard mask correctly', () => {
      expect(getWildcardMask('255.255.255.0')).toBe('0.0.0.255');
      expect(getWildcardMask('255.255.0.0')).toBe('0.0.255.255');
      expect(getWildcardMask('255.0.0.0')).toBe('0.255.255.255');
      expect(getWildcardMask('255.255.255.252')).toBe('0.0.0.3');
    });

    it('should throw error for invalid subnet mask', () => {
      expect(() => getWildcardMask('invalid')).toThrow('Máscara de sub-rede inválida');
    });
  });

  describe('Subnet Calculation', () => {
    it('should calculate subnet information correctly', () => {
      const result = calculateSubnet('192.168.1.1', '255.255.255.0');
      
      expect(result).toEqual({
        networkAddress: '192.168.1.0',
        broadcastAddress: '192.168.1.255',
        firstHost: '192.168.1.1',
        lastHost: '192.168.1.254',
        totalHosts: 256,
        usableHosts: 254,
        subnetMask: '255.255.255.0',
        wildcardMask: '0.0.0.255',
        binaryIP: '11000000.10101000.00000001.00000001',
        binaryMask: '11111111.11111111.11111111.00000000'
      });
    });

    it('should handle /31 network correctly', () => {
      const result = calculateSubnet('192.168.1.0', '255.255.255.254');
      
      expect(result).toEqual({
        networkAddress: '192.168.1.0',
        broadcastAddress: '192.168.1.1',
        firstHost: '192.168.1.0',
        lastHost: '192.168.1.1',
        totalHosts: 2,
        usableHosts: 2, // In /31, both addresses are usable
        subnetMask: '255.255.255.254',
        wildcardMask: '0.0.0.1',
        binaryIP: '11000000.10101000.00000001.00000000',
        binaryMask: '11111111.11111111.11111111.11111110'
      });
    });

    it('should handle /32 network correctly', () => {
      const result = calculateSubnet('192.168.1.1', '255.255.255.255');
      
      expect(result).toEqual({
        networkAddress: '192.168.1.1',
        broadcastAddress: '192.168.1.1',
        firstHost: '192.168.1.1',
        lastHost: '192.168.1.1',
        totalHosts: 1,
        usableHosts: 1, // In /32, the single address is considered usable
        subnetMask: '255.255.255.255',
        wildcardMask: '0.0.0.0',
        binaryIP: '11000000.10101000.00000001.00000001',
        binaryMask: '11111111.11111111.11111111.11111111'
      });
    });

    it('should throw error for invalid IP address', () => {
      expect(() => calculateSubnet('invalid', '255.255.255.0')).toThrow('Endereço IP inválido');
    });

    it('should throw error for invalid subnet mask', () => {
      expect(() => calculateSubnet('192.168.1.1', 'invalid')).toThrow('Máscara de sub-rede inválida');
    });
  });
});
