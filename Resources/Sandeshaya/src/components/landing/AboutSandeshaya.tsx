import { useLanguage } from "@/contexts/LanguageContext";
import { Megaphone, X } from "lucide-react";
import { useState } from "react";
import awardsImg from "@/assets/sandeshaya-awards.jpeg";
import event1 from "@/assets/sandeshaya-event-1.jpeg";
import event2 from "@/assets/sandeshaya-event-2.jpeg";
import event3 from "@/assets/sandeshaya-event-3.jpeg";

const AboutSandeshaya = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="about" className="section-spacing section-cream scroll-mt-20">
      <div className="container-narrow">
        <div className="flex justify-center mb-6">
          <div className="icon-container">
            <Megaphone strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-maroon text-center mb-4 font-bold">{t('about.title')}</h2>
        <div className="gold-divider mb-8" />

        {/* Awards Image */}
        <div className="mb-10 flex justify-center">
          <img
            src={awardsImg}
            alt="Sandeshaya Awards"
            className="w-full max-w-2xl rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 border-4 border-white"
          />
        </div>

        <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-base sm:text-lg leading-relaxed text-justify hyphens-auto">
          <p>{t('about.para1')}</p>
          <p>{t('about.para2')}</p>
          <p>{t('about.para3')}</p>
          <p>{t('about.para4')}</p>
          <p>{t('about.para5')}</p>
          <p>{t('about.para6')}</p>
          <p>{t('about.para7')}</p>
        </div>

        {/* Event Gallery */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[event1, event2, event3].map((img, index) => (
            <div key={index} className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer" onClick={() => setSelectedImage(img)}>
              <img
                src={img}
                alt={`Sandeshaya History ${index + 1}`}
                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Gold line accent at bottom */}
        <div className="gold-line-accent mt-16" />
      </div>

      {/* Lightbox / Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/20 hover:bg-white/10 rounded-full p-2 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          {/* Large Image */}
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl scale-in-95 animate-in duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          />
        </div>
      )}
    </section>
  );
};

export default AboutSandeshaya;
