"use client"

interface PowerBIEmbedProps {
  reportId: string
  title: string
  pageName?: string
  filters?: any
  className?: string
}

export const PowerBIConfig = {
  getEmbedUrl: (reportId: string) => {
    if (reportId.startsWith("https://app.powerbi.com/")) {
      return reportId
    }
    return `https://app.powerbi.com/reportEmbed?reportId=${reportId}&autoAuth=true`
  },

  getEmbedParameters: (reportId: string, pageName?: string, filters?: any) => {
    let url = PowerBIConfig.getEmbedUrl(reportId)

    if (reportId.startsWith("https://app.powerbi.com/")) {
      return url
    }

    if (pageName) {
      url += `&pageName=${pageName}`
    }

    if (filters) {
      const filterString = encodeURIComponent(JSON.stringify(filters))
      url += `&$filter=${filterString}`
    }

    return url
  },

  getIframeConfig: (title: string) => {
    return {
      title,
      width: "100%",
      height: "100%",
      frameBorder: "0" as const,
      allowFullScreen: true,
    }
  },
}

export function PowerBIEmbed({
  reportId,
  title,
  pageName,
  filters,
  className = ""
}: PowerBIEmbedProps) {
  const embedUrl = PowerBIConfig.getEmbedParameters(reportId, pageName, filters)
  const iframeConfig = PowerBIConfig.getIframeConfig(title)

  return (
    <div className={`w-full h-full ${className}`}>
      <iframe
        src={embedUrl}
        title={iframeConfig.title}
        width={iframeConfig.width}
        height={iframeConfig.height}
        frameBorder={iframeConfig.frameBorder}
        allowFullScreen={iframeConfig.allowFullScreen}
        className="w-full h-full min-h-[500px] border-0"
      />
    </div>
  )
}