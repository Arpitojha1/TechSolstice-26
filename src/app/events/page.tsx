import { EVENT_CATEGORIES } from "@/lib/constants/categories";
import { CategoryCard } from "@/components/categories/category-card";
import { PatternText } from "@/components/ui/pattern-text";

const EventsPage = async () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section - Fixed height to prevent CLS */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] px-4 overflow-hidden z-10 bg-black/10 flex items-center justify-center">

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex justify-center">
            {/* Add font-display: swap prevention and fixed dimensions */}
            <div className="min-h-[4rem] md:min-h-[6rem] lg:min-h-[8rem] flex items-center justify-center">
              <PatternText
                text="Events"
                className="michroma-regular !text-[4rem] md:!text-[6rem] lg:!text-[8rem] !text-white/90 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid - Fixed heights to prevent CLS */}
      <div className="max-w-6xl mx-auto px-4 pb-32 relative z-10 bg-black/10">
        {/* Reserve space for exact card dimensions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ minHeight: '800px' }}>
          {EVENT_CATEGORIES.map((category, index) => (
            <div key={category.id} className="h-[350px] md:h-[400px]">
              <CategoryCard category={category} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;