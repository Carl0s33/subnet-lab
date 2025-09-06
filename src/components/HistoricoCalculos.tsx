import { Clock, X } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  ipAddress: string;
  subnetMask: string;
  result: {
    networkAddress: string;
    broadcastAddress: string;
    firstHost: string;
    lastHost: string;
    totalHosts: number;
    subnetMask: string;
  };
}

interface CalculationHistoryProps {
  history: CalculationHistoryItem[];
  onSelect: (ip: string, mask: string) => void;
  onClear: () => void;
  className?: string;
}

export function HistoricoCalculos({
  history,
  onSelect,
  onClear,
  className = "",
}: CalculationHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Histórico
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Limpar histórico"
        >
          Limpar
        </Button>
      </div>
      
      <ul className="space-y-2">
        {history.map((item) => (
          <li key={item.id} className="relative group">
            <button
              type="button"
              onClick={() => onSelect(item.ipAddress, item.subnetMask)}
              className="w-full text-left p-2 rounded-md border border-border hover:bg-accent/50 transition-colors text-sm flex justify-between items-center group-hover:pr-8"
              aria-label={`Recarregar cálculo para ${item.ipAddress}${item.subnetMask.startsWith('/') ? item.subnetMask : ` com máscara ${item.subnetMask}`}`}
            >
              <div className="truncate">
                <div className="font-medium">
                  {item.ipAddress}
                  <span className="text-muted-foreground ml-1">
                    {item.subnetMask}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {item.result.networkAddress} • {item.result.totalHosts} hosts
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(item.timestamp), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {new Date(item.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoricoCalculos;
