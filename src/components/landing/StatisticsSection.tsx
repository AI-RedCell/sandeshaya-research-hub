import { School, FileText, MapPin } from "lucide-react";

const StatisticsSection = () => {
  const stats = [
    { icon: School, value: "500+", label: "Schools Invited" },
    { icon: FileText, value: "30", label: "Questions" },
    { icon: MapPin, value: "9", label: "Provinces" },
  ];

  return (
    <section className="py-12 bg-maroon relative overflow-hidden">
      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-secondary" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
      
      <div className="container-narrow">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-white">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" strokeWidth={1.5} />
                </div>
                <div className="text-2xl sm:text-4xl font-bold mb-1 text-secondary">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/80">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
