import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type QuickExample = {
  label: string;
  cidr: string;
  description: string;
};

const COMMON_SUBNETS: QuickExample[] = [
  { label: "/24", cidr: "/24", description: "Rede doméstica comum (256 endereços)" },
  { label: "16", cidr: "/16", description: "Rede de pequena empresa (65.536 endereços)" },
  { label: "8", cidr: "/8", description: "Rede grande (16.777.216 endereços)" },
  { 
    label: "255.255.255.0", 
    cidr: "255.255.255.0", 
    description: "Máscara de classe C (256 endereços)" 
  },
  { 
    label: "255.255.0.0", 
    cidr: "255.255.0.0", 
    description: "Máscara de classe B (65.536 endereços)" 
  },
  { 
    label: "255.0.0.0", 
    cidr: "255.0.0.0", 
    description: "Máscara de classe A (16.777.216 endereços)" 
  },
];

interface QuickExamplesProps {
  onSelect: (mask: string) => void;
  className?: string;
}

export function QuickExamples({ onSelect, className = "" }: QuickExamplesProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Exemplos rápidos:</span>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {COMMON_SUBNETS.map((example) => (
              <Tooltip key={example.cidr}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => onSelect(example.cidr)}
                    aria-label={`Usar máscara ${example.cidr}: ${example.description}`}
                  >
                    {example.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{example.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default QuickExamples;
