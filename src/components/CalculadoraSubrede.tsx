import { useState, type KeyboardEvent, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Network, Info, History } from "lucide-react";
import ResultadosSubrede from "./ResultadosSubrede";
import { QuickExamples } from "./QuickExamples";
import { HistoricoCalculos } from "./HistoricoCalculos";
import { TrocaTema } from "./TrocaTema";
import { calculateSubnet, validateIP, validateSubnetMask } from "@/lib/subnet-utils";
import { useToast } from "@/hooks/use-toast";
import { useHistoricoCalculos } from "@/hooks/useHistoricoCalculos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface SubnetInfo {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binaryIP: string;
  binaryMask: string;
}

type SubnetMask = `/${number}` | string;

type FormTouched = {
  ip: boolean;
  mask: boolean;
};

interface SubnetCalculatorState {
  ipAddress: string;
  subnetMask: SubnetMask;
  results: SubnetInfo | null;
  isCalculating: boolean;
  isTouched: FormTouched;
  showHistory: boolean;
}

/**
 * Componente principal da calculadora de sub-redes
 * Permite ao usuário inserir um endereço IP e uma máscara de sub-rede
 * e exibe informações detalhadas sobre a sub-rede calculada
 */
const CalculadoraSubrede = () => {
  // Estados do componente
  const [state, setState] = useState<Omit<SubnetCalculatorState, 'showHistory'>>({
    ipAddress: "",
    subnetMask: "/24", // Valor padrão para facilitar o usuário
    results: null,
    isCalculating: false,
    isTouched: { ip: false, mask: false },
  });
  
  const [showHistory, setShowHistory] = useState(false);
  
  // Desestruturação para facilitar o uso
  const { ipAddress, subnetMask, results, isCalculating, isTouched } = state;
  
  // Atualizadores de estado tipados
  const setIpAddress = (value: string) => setState(prev => ({ ...prev, ipAddress: value }));
  const setSubnetMask = (value: SubnetMask) => setState(prev => ({ ...prev, subnetMask: value }));
  const setResults = (value: SubnetInfo | null) => setState(prev => ({ ...prev, results: value }));
  const setIsCalculating = (value: boolean) => setState(prev => ({ ...prev, isCalculating: value }));
  const setIsTouched = (value: FormTouched | ((prev: FormTouched) => FormTouched)) => 
    setState(prev => ({
      ...prev, 
      isTouched: typeof value === 'function' ? value(prev.isTouched) : value 
    }));
  const { toast } = useToast();
  const { history, addToHistory, clearHistory } = useHistoricoCalculos();

  // Validações
  const isValidIP = ipAddress === "" || validateIP(ipAddress.trim());
  const isValidMask = subnetMask === "" || validateSubnetMask(subnetMask.trim());
  
  // Efeito para limpar resultados quando os inputs são alterados
  useEffect(() => {
    if (ipAddress || subnetMask) {
      setResults(null);
    }
  }, [ipAddress, subnetMask]);

  /**
   * Manipula o cálculo da sub-rede quando o usuário clica no botão ou pressiona Enter
   */
  const handleCalculate = async () => {
    setIsTouched({ ip: true, mask: true });
    
    // Validação dos campos
    if (!ipAddress.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um endereço IP",
        variant: "destructive",
      });
      return;
    }

    if (!subnetMask.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira uma máscara de sub-rede",
        variant: "destructive",
      });
      return;
    }
    
    // Validação do formato do IP
    if (!isValidIP) {
      toast({
        title: "Endereço IP inválido",
        description: "O endereço IP informado não é válido. Use o formato xxx.xxx.xxx.xxx",
        variant: "destructive",
      });
      return;
    }
    
    // Validação do formato da máscara
    if (!isValidMask) {
      toast({
        title: "Máscara de sub-rede inválida",
        description: "A máscara de sub-rede informada não é válida. Use o formato /xx ou xxx.xxx.xxx.xxx",
        variant: "destructive",
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const result = calculateSubnet(ipAddress.trim(), subnetMask.trim());
      setResults(result);
      
      // Adiciona ao histórico
      addToHistory(ipAddress.trim(), subnetMask.trim(), result);
      
      // Rola até os resultados quando disponíveis
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          // Foco no elemento de resultados para acessibilidade
          resultsSection.setAttribute('tabindex', '-1');
          resultsSection.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Erro ao calcular sub-rede:', error);
      
      let errorMessage = "Ocorreu um erro ao calcular a sub-rede";
      
      if (error instanceof Error) {
        // Mensagens de erro mais amigáveis para o usuário
        if (error.message.includes('Endereço IP inválido')) {
          errorMessage = "O endereço IP informado não é válido. Verifique o formato e tente novamente.";
        } else if (error.message.includes('Máscara de sub-rede inválida')) {
          errorMessage = "A máscara de sub-rede informada não é válida. Use o formato /xx ou xxx.xxx.xxx.xxx";
        } else if (error.message.includes('fora do intervalo')) {
          errorMessage = "O endereço IP está fora do intervalo permitido para a máscara de sub-rede informada.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro no cálculo",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleExampleSelect = (mask: string) => {
    setSubnetMask(mask);
    setIsTouched(prev => ({ ...prev, mask: true }));
    // Foca no campo de IP após selecionar um exemplo
    document.getElementById('ip')?.focus();
  };
  
  const handleHistorySelect = (ip: string, mask: string) => {
    setIpAddress(ip);
    setSubnetMask(mask);
    setShowHistory(false);
    // Foca no botão de calcular após selecionar do histórico
    setTimeout(() => {
      document.getElementById('calculate-button')?.focus();
    }, 100);
  };

  const ipError = ipAddress && !isValidIP ? "Endereço IP inválido" : "";
  const maskError = subnetMask && !isValidMask ? "Máscara inválida (use /CIDR ou decimal válida)" : "";

  const canCalculate = Boolean(ipAddress && subnetMask && isValidIP && isValidMask && !isCalculating);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && canCalculate) {
      e.preventDefault();
      handleCalculate();
    }
  };

  const handleClear = () => {
    setIpAddress("");
    setSubnetMask("");
    setResults(null);
  };

  return (
    <div 
      className="min-h-screen bg-background p-4 md:p-6"
      role="main"
      aria-label="Calculadora de Sub-redes IPv4"
    >
      <div className="mx-auto max-w-6xl relative">
        {/* Botões de controle */}
        <div className="absolute right-0 top-0 flex items-center gap-2">
          {/* Botão de alternar tema */}
          <TrocaTema />
          
          {/* Botão de histórico */}
          {history.length > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              aria-expanded={showHistory}
              aria-label={showHistory ? "Ocultar histórico" : "Mostrar histórico"}
              className="h-9 rounded-md px-3"
            >
              <History className="h-4 w-4 mr-2" />
              {showHistory ? 'Ocultar' : 'Histórico'}
            </Button>
          )}
        </div>
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div 
              className="rounded-full bg-primary/10 p-4"
              aria-hidden="true"
            >
              <Network className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Calculadora de Sub-redes IPv4
          </h1>
          <p className="text-lg text-muted-foreground">
            Calcule informações detalhadas sobre sub-redes IPv4
          </p>
        </header>

        {/* Formulário de entrada */}
        <form 
          className="space-y-4" 
          onSubmit={(e) => {
            e.preventDefault();
            if (isValidIP && isValidMask) {
              handleCalculate();
            }
          }}
          aria-label="Formulário de cálculo de sub-rede"
        >
          {/* Campo de Endereço IP */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="ip">Endereço IP</Label>
              <Tooltip>
                <TooltipTrigger 
                  type="button" 
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  aria-label="Informações sobre o campo de endereço IP"
                >
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Digite um endereço IPv4 (ex: 192.168.1.1)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="ip"
              name="ip-address"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Ex: 192.168.1.1"
              value={ipAddress}
              onChange={(e) => {
                setIpAddress(e.target.value);
                setIsTouched(prev => ({ ...prev, ip: true }));
              }}
              className={`shadow-sm dark:shadow-none ${!isValidIP && isTouched.ip ? "border-destructive focus-visible:ring-destructive" : ""}`}
              aria-invalid={!isValidIP && isTouched.ip}
              aria-describedby={!isValidIP && isTouched.ip ? "ip-error" : undefined}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && isValidIP && isValidMask) {
                  handleCalculate();
                }
              }}
            />
            {!isValidIP && isTouched.ip && (
              <p id="ip-error" className="text-sm text-destructive" role="alert">
                Por favor, insira um endereço IP válido (ex: 192.168.1.1)
              </p>
            )}
          </div>

          {/* Campo de Máscara de Sub-rede */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="subnet">Máscara de Sub-rede</Label>
              <Tooltip>
                <TooltipTrigger 
                  type="button" 
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                  aria-label="Informações sobre o campo de máscara de sub-rede"
                >
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Digite a máscara em formato CIDR (ex: /24) ou decimal (ex: 255.255.255.0)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="subnet"
              name="subnet-mask"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Ex: /24 ou 255.255.255.0"
              value={subnetMask}
              onChange={(e) => {
                setSubnetMask(e.target.value);
                setIsTouched(prev => ({ ...prev, mask: true }));
              }}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter' && isValidIP && isValidMask) {
                  handleCalculate();
                }
              }}
              className={`shadow-sm dark:shadow-none ${!isValidMask && isTouched.mask ? "border-destructive focus-visible:ring-destructive" : ""}`}
              aria-invalid={!isValidMask && isTouched.mask}
              aria-describedby={!isValidMask && isTouched.mask ? "mask-error" : undefined}
            />
            {!isValidMask && isTouched.mask && (
              <p id="mask-error" className="text-sm text-destructive" role="alert">
                {subnetMask.startsWith('/') 
                  ? 'CIDR deve estar entre /0 e /32' 
                  : 'Máscara inválida. Use /24 ou 255.255.255.0'}
              </p>
            )}
          </div>

          {/* Exemplos Rápidos */}
          <QuickExamples 
            onSelect={handleExampleSelect} 
            className="pt-1"
          />
          
          {/* Botão de Calcular */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isValidIP || !isValidMask || isCalculating}
              id="calculate-button"
              className="w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              size="lg"
              aria-busy={isCalculating}
              aria-live="polite"
            >
              {isCalculating ? (
                <>
                  <span className="sr-only">Calculando, aguarde...</span>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span aria-hidden="true">Calculando...</span>
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>Calcular Sub-rede</span>
                  <span className="sr-only">Pressione Enter para calcular</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Histórico */}
        {showHistory && (
          <div className="mt-6 p-4 border rounded-lg bg-card shadow-sm dark:shadow-none">
            <HistoricoCalculos
              history={history}
              onSelect={handleHistorySelect}
              onClear={clearHistory}
            />
          </div>
        )}

        {/* Resultados */}
        <section id="results-section" aria-live="polite" aria-atomic="true">
          {results && (
            <div className="mt-8 animate-fade-in">
              <h2 className="sr-only">Resultados do cálculo da sub-rede</h2>
              <ResultadosSubrede results={results} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CalculadoraSubrede;