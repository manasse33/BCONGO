import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = {
  quickLinks: [
    { label: 'Accueil', path: '/' },
    { label: 'Bibliothèque', path: '/library' },
    { label: 'Livres Audio', path: '/audiobooks' },
    { label: 'Concours', path: '/contests' },
    { label: 'À Propos', path: '/about' },
  ],
  categories: [
    { label: 'Romans Africains', path: '/library?genre=roman-africain' },
    { label: 'Littérature Congolaise', path: '/library?genre=litterature-congolaise' },
    { label: 'Livres Scolaires', path: '/school' },
    { label: 'Bandes Dessinées', path: '/library?genre=bande-dessinee' },
    { label: 'Poésie', path: '/library?genre=poesie' },
  ],
  support: [
    { label: 'Centre d\'Aide', path: '/help' },
    { label: 'Contactez-nous', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Conditions d\'Utilisation', path: '/terms' },
    { label: 'Politique de Confidentialité', path: '/privacy' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'Youtube' },
];

export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-forest" />
              </div>
              <span className="font-serif text-xl font-bold">BiblioCongo</span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              La première plateforme numérique de lecture et d'édition en République du Congo. 
              Découvrez, lisez et publiez des œuvres congolaises et africaines.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Brazzaville, République du Congo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="w-4 h-4 text-gold" />
                <span>+242 06 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="w-4 h-4 text-gold" />
                <span>contact@bibliocongo.cg</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/80 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Catégories</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/80 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-sm text-white/80 mb-4">
              Abonnez-vous pour recevoir nos dernières actualités et nouveautés.
            </p>
            <form className="space-y-3">
              <Input
                type="email"
                placeholder="Votre email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-gold"
              />
              <Button className="w-full bg-gold hover:bg-gold-dark text-gray-dark font-semibold">
                S'abonner
              </Button>
            </form>
            <div className="mt-6">
              <p className="text-sm text-white/60 mb-3">Suivez-nous</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-gray-dark transition-all"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60 text-center md:text-left">
              © {new Date().getFullYear()} BiblioCongo. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.support.slice(3).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-white/60 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
