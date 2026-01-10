import { EVENT_CATEGORIES } from "@/lib/constants/categories";
import { CategoryCard } from "@/components/categories/category-card";
import { PatternText } from "@/components/ui/pattern-text";

const EventsPage = async () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden z-10 bg-black/10">\

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <PatternText
              text="Events"
              className="michroma-regular !text-[4rem] md:!text-[6rem] lg:!text-[8rem] !text-white/90 drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-32 relative z-10 bg-black/10">\
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {EVENT_CATEGORIES.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;