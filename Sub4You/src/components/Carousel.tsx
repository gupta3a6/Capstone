import { useState, type ReactNode } from 'react'
import { IoArrowForward, IoArrowBack } from "react-icons/io5";

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  itemsPerPage?: number
  title?: string
  className?: string
}

export const Carousel = <T,>({ 
  items, 
  renderItem, 
  itemsPerPage = 4,
  title,
  className = ''
}: CarouselProps<T>) => {
  const totalPages = Math.ceil(items.length / itemsPerPage)
  const [currentPage, setCurrentPage] = useState(0)

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <div className={`w-full mx-auto mt-10 px-4 sm:px-8 lg:px-12 py-8 overflow-hidden ${className}`}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div>
          {title && <h1 className="text-3xl font-bold text-black/80">{title}</h1>}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`p-2 rounded-full border border-black/5 transition-colors ${
              currentPage === 0 
                ? 'bg-black/5 text-black/20 cursor-not-allowed' 
                : 'bg-white/50 hover:bg-white/80 text-black'
            }`}
            aria-label="Previous page"
          >
            <IoArrowBack />
          </button>
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`p-2 rounded-full border border-black/5 transition-colors ${
              currentPage === totalPages - 1
                ? 'bg-black/5 text-black/20 cursor-not-allowed' 
                : 'bg-white/50 hover:bg-white/80 text-black'
            }`}
            aria-label="Next page"
          >
            <IoArrowForward />
          </button>
        </div>
      </div>
      
      {/* Visual Window / Viewport */}
      <div className="relative w-full overflow-hidden">
        {/* Sliding Track - using marginLeft instead of transform */}
        <div 
          className="flex transition-all duration-500 ease-in-out w-full py-4"
          style={{ marginLeft: `-${currentPage * 100}%` }}
        >
          {/* Render Pages */}
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div 
              key={pageIndex} 
              className="w-full min-w-full flex-shrink-0 px-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
                {items
                  .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                  .map((item, index) => (
                    <div key={index}>
                      {renderItem(item)}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
