import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin } from "lucide-react";
import { Logo } from "@/components/common";

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
      
      <div className="container-narrow py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          
          {/* Logos and School Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <Logo type="school" size="lg" />
              <Logo type="acbu" size="lg" />
            </div>
            <div className="mb-2">
              <h3 className="font-bold text-lg">Ananda College</h3>
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
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">sandeshaya@anandacollege.edu.lk</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Maradana Road, Colombo 10</span>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-secondary mb-4">Follow Us</h4>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
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
