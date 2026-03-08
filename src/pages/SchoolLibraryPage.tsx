import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileText, 
  ClipboardList, 
  HelpCircle, 
  Video,
  Download,
  ChevronLeft,
  GraduationCap,
  Calculator,
  FlaskConical,
  Globe,
  Atom,
  BookMarked,
  Languages,
  TrendingUp,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { schoolLevels, subjects, books } from '@/data/mockData';

const quickAccessItems = [
  { icon: BookOpen, label: 'Tous les Manuels', href: '#' },
  { icon: ClipboardList, label: 'Guides d\'Étude', href: '#' },
  { icon: FileText, label: 'Fiches de Révision', href: '#' },
];

const studyMaterials = [
  { icon: FileText, label: 'Anciens Examens', color: 'bg-blue-100 text-blue-600' },
  { icon: ClipboardList, label: 'Corrigés Types', color: 'bg-green-100 text-green-600' },
  { icon: HelpCircle, label: 'Questions Types', color: 'bg-purple-100 text-purple-600' },
  { icon: Video, label: 'Tutoriels Vidéo', color: 'bg-red-100 text-red-600' },
];

const subjectIcons: Record<string, any> = {
  'Mathématiques': Calculator,
  'Français': BookMarked,
  'Histoire-Géographie': Globe,
  'SVT': FlaskConical,
  'Physique-Chimie': Atom,
  'Philosophie': BookOpen,
  'Anglais': Languages,
  'Économie': TrendingUp,
  'Informatique': Monitor,
  'Éducation Civique': GraduationCap,
};

const examPapers = [
  { title: 'Bac 2023 - Session Normale', year: '2023', format: 'PDF', downloads: 1250 },
  { title: 'Bac 2023 - Session de Rattrapage', year: '2023', format: 'PDF', downloads: 890 },
  { title: 'Bac 2022 - Session Normale', year: '2022', format: 'PDF', downloads: 2100 },
  { title: 'Brevet 2023', year: '2023', format: 'PDF', downloads: 1560 },
];

export default function SchoolLibraryPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  // Selected subject for future implementation
  // const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const schoolBooks = books.filter(book => book.type === 'scolaire');

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-medium mb-2">
              <Link to="/" className="hover:text-forest">Accueil</Link>
              <span>/</span>
              <span className="text-forest">Bibliothèque Scolaire</span>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-dark">
                Bibliothèque Scolaire
              </h1>
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access & Grade Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="font-semibold text-gray-dark mb-4">Accès Rapide</h3>
            <div className="space-y-3">
              {quickAccessItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-light hover:border-forest hover:shadow-light transition-all"
                >
                  <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-forest" />
                  </div>
                  <span className="font-medium text-gray-dark">{item.label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Grade Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="font-semibold text-gray-dark mb-4">Filtrer par Niveau</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedLevel === null
                    ? 'bg-forest text-white'
                    : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
                }`}
              >
                Tous
              </button>
              {schoolLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLevel === level.name
                      ? 'bg-forest text-white'
                      : 'bg-white text-gray-dark border border-gray-light hover:border-forest'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Study Materials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
            Matériaux d'Étude
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {studyMaterials.map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-light hover:border-gold hover:shadow-light transition-all"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-dark text-center">{item.label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Curriculum Organized Books */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
            Livres par Matière
          </h3>
          <div className="space-y-6">
            {subjects.slice(0, 5).map((subject, index) => {
              const Icon = subjectIcons[subject.name] || BookOpen;
              const subjectBooks = schoolBooks.filter((_, i) => i % 5 === index).slice(0, 3);
              
              return (
                <div key={subject.id} className="bg-white rounded-xl border border-gray-light p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-forest" />
                    </div>
                    <h4 className="font-serif text-xl font-semibold text-gray-dark">{subject.name}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {subjectBooks.length > 0 ? subjectBooks.map((book) => (
                      <div key={book.id} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-dark line-clamp-1">{book.title}</p>
                          <p className="text-xs text-gray-medium">{book.pages_count} pages</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-forest">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-medium col-span-3">Aucun livre disponible pour cette matière</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Exam Papers Archive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10"
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
            Archives des Examens
          </h3>
          <div className="bg-white rounded-xl border border-gray-light overflow-hidden">
            {examPapers.map((paper, index) => (
              <div
                key={paper.title}
                className={`flex items-center justify-between p-4 ${
                  index !== examPapers.length - 1 ? 'border-b border-gray-light' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-dark">{paper.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-medium">
                      <span>{paper.year}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs">{paper.format}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-medium hidden sm:block">
                    {paper.downloads} téléchargements
                  </span>
                  <Button size="sm" className="bg-forest hover:bg-forest-dark text-white">
                    <Download className="w-4 h-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Summary Notes */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="font-serif text-2xl font-bold text-gray-dark mb-6">
            Fiches de Révision
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Histoire - La colonisation', 'Mathématiques - Algèbre', 'SVT - La photosynthèse', 'Français - La dissertation'].map((title) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-gray-light p-4 hover:border-gold hover:shadow-light transition-all"
              >
                <p className="font-medium text-gray-dark mb-3">{title}</p>
                <Button size="sm" variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
                  Voir la fiche
                </Button>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
