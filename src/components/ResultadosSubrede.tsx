import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Radio, 
  Users, 
  Binary, 
  Eye,
  Copy,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Interface que define a estrutura das informações da sub-rede
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
 * Propriedades do componente SubnetResults
 */
interface SubnetResultsProps {
  /** Objeto contendo os resultados do cálculo da sub-rede */
  results: SubnetInfo;
}

/**
 * Componente que exibe os resultados detalhados do cálculo de sub-rede
 * 
 * @component
 * @example
 * return (
 *   <SubnetResults results={subnetInfo} />
 * )
 */
const ResultadosSubrede = ({ results }: SubnetResultsProps): JSX.Element => {
  const { toast } = useToast();

  /**
   * Copia o texto para a área de transferência e exibe um toast de confirmação
   * @param text - Texto a ser copiado
   * @param label - Rótulo do que está sendo copiado (para feedback)
   */
  const copyToClipboard = async (text: string, label: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência`,
        action: <CheckCircle2 className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência",
        variant: "destructive",
        action: <AlertCircle className="h-5 w-5" />
      });
    }
  };

  /**
   * Componente de item de resultado individual
   */
  const ResultItem: React.FC<{
    /** Ícone do item */
    icon: React.ComponentType<{ className?: string }>;
    /** Rótulo do item */
    label: string;
    /** Valor a ser exibido */
    value: string | number;
    /** Descrição adicional (opcional) */
    description?: string;
    /** Variante de estilo */
    variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
    /** Texto de tooltip (opcional) */
    tooltip?: string;
  }> = ({ 
    icon: Icon, 
    label, 
    value, 
    description,
    variant = "default",
    tooltip
  }) => (
    <div className="flex flex-col space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {tooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1 text-sm font-medium cursor-help">
                    {label}
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-sm font-medium">{label}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm">{value}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => copyToClipboard(String(value), label)}
            aria-label={`Copiar ${label}`}
          >
            <Copy className="h-3 w-3" />
            <span className="sr-only">Copiar {label}</span>
          </Button>
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground pl-6">{description}</p>
      )}
    </div>
  );

  // Verifica se estamos no navegador antes de renderizar
  const isBrowser = typeof window !== 'undefined';
  
  if (!isBrowser) {
    return <div>Carregando...</div>;
  }

  return (
    <Card className="p-6 shadow-sm dark:shadow-none">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Resultados do Cálculo</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-success/20 text-success">
            {results.usableHosts} hosts utilizáveis
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {/* Network Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground mb-3">Informações da Rede</h3>
          
          <ResultItem
            icon={Network}
            label="Endereço da Rede"
            value={results.networkAddress}
            description="Primeiro endereço da sub-rede"
            variant="default"
          />

          <ResultItem
            icon={Radio}
            label="Endereço de Broadcast"
            value={results.broadcastAddress}
            description="Último endereço da sub-rede"
            variant="destructive"
          />

          <ResultItem
            icon={Users}
            label="Faixa de Hosts"
            value={`${results.firstHost} - ${results.lastHost}`}
            description="Endereços utilizáveis para dispositivos"
            variant="success"
          />
        </div>

        {/* Subnet Details */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground mb-3">Detalhes da Máscara</h3>
          
          <ResultItem
            icon={Network}
            label="Máscara de Sub-rede"
            value={results.subnetMask}
            description="Máscara no formato decimal"
          />

          <ResultItem
            icon={Binary}
            label="Máscara Wildcard"
            value={results.wildcardMask}
            description="Máscara inversa para ACLs"
          />
        </div>

        {/* Binary Representation */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground mb-3">Representação Binária</h3>
          
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Endereço IP:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(results.binaryIP, "IP Binário")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <code className="block text-xs font-mono text-foreground break-all">
                {results.binaryIP}
              </code>
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Máscara de Sub-rede:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(results.binaryMask, "Máscara Binária")}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <code className="block text-xs font-mono text-foreground break-all">
                {results.binaryMask}
              </code>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{results.totalHosts}</p>
            <p className="text-sm text-muted-foreground">Total de IPs</p>
          </div>
          <div className="rounded-lg bg-success/10 p-4 text-center">
            <p className="text-2xl font-bold text-success">{results.usableHosts}</p>
            <p className="text-sm text-muted-foreground">IPs Utilizáveis</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultadosSubrede;