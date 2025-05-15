"use client"

interface PowerBIEmbedProps {
  reportId: string; // Deve ser a URL de visualização completa do Power BI (ex: https://app.powerbi.com/view?r=...)
  title: string;
  className?: string; // Ex: "w-full h-full min-h-[600px]"
}

export function PowerBIEmbed({ reportId, title, className = "" }: PowerBIEmbedProps) {
  if (!reportId) {
    return <div className="p-4 text-red-500">URL do relatório Power BI não fornecida.</div>;
  }

  // Garante que a URL, se for um link de embed do Power BI, seja usada diretamente.
  // Se for um ID de relatório, idealmente deveria ser processado para formar a URL de embed.
  // Para este teste, estamos assumindo que reportId já é a URL de visualização direta que funcionou no HTML.

  return (
    // O className (com w-full, h-full, min-h-[600px]) é aplicado a este div wrapper pelo page.tsx
    <div className={className}>
      <iframe
        title={title}
        width="100%"
        height="40%" // O iframe tentará ocupar 100% da altura do seu pai (o div acima)
        src={reportId}
        frameBorder="0"
        allowFullScreen={true}
        style={{ display: 'block', border: 'none' }} // Estilos básicos para o iframe
      ></iframe>
    </div>
  );
}

