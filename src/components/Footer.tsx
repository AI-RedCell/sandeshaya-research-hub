import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin } from "lucide-react";

// Import logos safely
let schoolLogoSrc: string | null = null;
let acbuLogoSrc: string | null = null;
try {
  schoolLogoSrc = new URL('../assets/school-logo.png', import.meta.url).href;
  acbuLogoSrc = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  schoolLogoSrc = null;
  acbuLogoSrc = null;
}

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/sandeshaya", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com/sandeshaya", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com/sandeshaya", label: "YouTube" },
    { icon: Twitter, href: "https://twitter.com/sandeshaya", label: "Twitter" },
  ];

  return (
    <footer className="bg-maroon text-white">
      {/* Gold accent line */}
      <div className="h-1 bg-secondary" />
      
      <div className="container-narrow py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Logos and School Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              {/* School Logo */}
              {schoolLogoSrc ? (
                <img src={schoolLogoSrc} alt="Ananda College" className="h-14 w-auto" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AC</span>
                </div>
              )}
              {/* ACBU Logo */}
              {acbuLogoSrc ? (
                <img src={acbuLogoSrc} alt="ACBU" className="h-14 w-auto" />
              ) : (
                <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">ACBU</span>
                </div>
              )}
            </div>
            <div className="mb-2">
              <h3 className="font-bold text-lg text-white">Ananda College</h3>
              <p className="text-white/70 text-sm">Broadcasting Unit</p>
            </div>
            <p className="text-white/60 text-sm">
              Sandeshaya - Youth Media Initiative
            </p>
          </div>
          
          {/* Contact Info */}
          <div className="text-center">
            <h4 className="font-semibold text-secondary mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                <span>sandeshaya@anandacollege.edu.lk</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Maradana Road, Colombo 10</span>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-secondary mb-4">Follow Us</h4>
            <div className="flex items-center justify-center md:justify-end gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary hover:text-maroon transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Gold divider */}
        <div className="gold-line-accent my-8 opacity-50" />
        
        {/* Copyright */}
        <div className="text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Sandeshaya - Ananda College Broadcasting Unit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
