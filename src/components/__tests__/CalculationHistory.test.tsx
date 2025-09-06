import { render, screen, fireEvent } from '@testing-library/react';
import { HistoricoCalculos } from '../HistoricoCalculos';
import { describe, it, expect, vi } from 'vitest';

const mockHistory = [
  {
    id: '1',
    timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    ipAddress: '192.168.1.1',
    subnetMask: '/24',
    result: {
      networkAddress: '192.168.1.0',
      broadcastAddress: '192.168.1.255',
      firstHost: '192.168.1.1',
      lastHost: '192.168.1.254',
      totalHosts: 256,
      subnetMask: '255.255.255.0'
    }
  },
  {
    id: '2',
    timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    ipAddress: '10.0.0.1',
    subnetMask: '255.0.0.0',
    result: {
      networkAddress: '10.0.0.0',
      broadcastAddress: '10.255.255.255',
      firstHost: '10.0.0.1',
      lastHost: '10.255.255.254',
      totalHosts: 16777216,
      subnetMask: '255.0.0.0'
    }
  }
];

describe('HistoricoCalculos', () => {
  it('deve renderizar os itens do histórico corretamente', () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();
    
    render(
      <HistoricoCalculos 
        history={mockHistory} 
        onSelect={onSelect} 
        onClear={onClear} 
      />
    );

    // Verifica se o componente está renderizando
    expect(screen.getByText('Histórico')).toBeInTheDocument();
    
    // Verifica se os itens do histórico estão sendo renderizados
    // O IP e a máscara estão em elementos separados, então precisamos verificar separadamente
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    expect(screen.getByText('/24')).toBeInTheDocument();
    expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
    expect(screen.getByText('255.0.0.0')).toBeInTheDocument();
    
    // Verifica se os horários estão sendo renderizados (usando regex para corresponder parte do texto)
    expect(screen.getByText(/há 5 minuto/)).toBeInTheDocument();
    expect(screen.getByText(/há cerca de 1 hora/)).toBeInTheDocument();
    
    // Verifica se o botão de limpar está visível
    expect(screen.getByText('Limpar')).toBeInTheDocument();
  });

  it('deve chamar onSelect com os parâmetros corretos quando um item do histórico for clicado', () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();
    
    render(
      <HistoricoCalculos 
        history={mockHistory} 
        onSelect={onSelect} 
        onClear={onClear} 
      />
    );

    // Clica em um item do histórico
    // O botão contém o IP e a máscara em elementos separados
    const button = screen.getByRole('button', { name: /Recarregar cálculo para 192.168.1.1/ });
    fireEvent.click(button);
    
    // Verifica se onSelect foi chamado com os parâmetros corretos
    expect(onSelect).toHaveBeenCalledWith('192.168.1.1', '/24');
  });

  it('deve chamar onClear quando o botão de limpar for clicado', () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();
    
    render(
      <HistoricoCalculos 
        history={mockHistory} 
        onSelect={onSelect} 
        onClear={onClear} 
      />
    );

    // Clica no botão de limpar
    fireEvent.click(screen.getByText('Limpar'));
    
    // Verifica se onClear foi chamado
    expect(onClear).toHaveBeenCalled();
  });

  it('applies custom className when provided', () => {
    const onSelect = vi.fn();
    const onClear = vi.fn();
    
    const { container } = render(
      <HistoricoCalculos 
        history={mockHistory} 
        onSelect={onSelect} 
        onClear={onClear}
        className="custom-class" 
      />
    );
    
    // Check if the custom class is applied
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
