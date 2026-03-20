interface ProductMediaProps {
  title: string
  description?: string
  videoUrl?: string
  thumbnailSrc?: string
}

export function ProductMedia({ title, description, videoUrl, thumbnailSrc }: ProductMediaProps) {
  return (
    <div className="rounded-xl border border-border-primary bg-bg-elevated overflow-hidden">
      <div className="relative aspect-video">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-bg-deep/80"
            style={
              thumbnailSrc
                ? {
                    backgroundImage: `url(${thumbnailSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          >
            {thumbnailSrc && <div className="absolute inset-0 bg-bg-deep/60" />}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-system/20 border border-accent-system/40 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent-system ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-text-muted text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        )}
      </div>

      {(title || description) && (
        <div className="p-4">
          <h4 className="text-text-primary font-semibold">{title}</h4>
          {description && <p className="text-text-secondary text-sm mt-1">{description}</p>}
        </div>
      )}
    </div>
  )
}
