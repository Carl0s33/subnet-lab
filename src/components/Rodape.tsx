import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Rodape() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 bg-background text-foreground">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} Carlos Eduardo. Todos os direitos reservados.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="https://www.instagram.com/carlosdu.03/" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="https://www.facebook.com/profile.php?id=100012093076125" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="mailto:carloseduardosantosvitor4@gmail.com" 
              aria-label="Enviar email"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </a>
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="https://wa.me/558499618472" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <Phone className="h-5 w-5" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
