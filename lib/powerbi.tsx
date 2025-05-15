"use client";

interface PowerBIEmbedProps {
  reportId: string; // Deve ser a URL de visualização completa do Power BI
  title: string;
  className?: string; // Para controlar w-full, h-full, min-height, etc. do contêiner
}

export function PowerBIEmbed({ reportId, title, className = "" }: PowerBIEmbedProps) {
  if (!reportId) {
    return (
      <div className={`p-4 text-red-500 ${className}`}>
        URL do relatório Power BI não fornecida.
      </div>
    );
  }

  return (
    // Este div wrapper receberá as classes de dimensionamento (ex: h-full, min-h-screen)
    <div className={className}>
      <iframe
        title={title}
        width="100%"
        height="100%" // O iframe deve ocupar 100% da altura do seu contêiner pai (o div acima)
        src={reportId}
        frameBorder="0"
        allowFullScreen={true}
        style={{ display: 'block', border: 'none' }} // Estilos para garantir bom comportamento
      ></iframe>
    </div>
  );
}

