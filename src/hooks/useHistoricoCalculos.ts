import { useState, useEffect } from 'react';
import { SubnetInfo } from '@/components/ResultadosSubrede';

interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  ipAddress: string;
  subnetMask: string;
  result: SubnetInfo;
}

const HISTORY_LIMIT = 5;
const STORAGE_KEY = 'ip-subnet-calculator-history';

export function useCalculationHistory() {
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);

  // Carrega o histórico do localStorage ao inicializar
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, []);

  // Salva o histórico no localStorage quando ele é atualizado
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Erro ao salvar histórico:', error);
      }
    }
  }, [history]);

  const addToHistory = (ipAddress: string, subnetMask: string, result: SubnetInfo) => {
    const newItem: CalculationHistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ipAddress,
      subnetMask,
      result,
    };

    setHistory(prev => {
      // Remove itens duplicados e limita o histórico
      const filtered = prev.filter(
        item => !(item.ipAddress === ipAddress && item.subnetMask === subnetMask)
      );
      return [newItem, ...filtered].slice(0, HISTORY_LIMIT);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
}

export default useCalculationHistory;

// Alias em PT-BR para manter consistência com nomes traduzidos
export { useCalculationHistory as useHistoricoCalculos };
