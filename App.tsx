import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  MapPin, Mountain, Camera, Trophy, User, Search, Filter, 
  ChevronRight, ChevronLeft, Star, Clock, TrendingUp, Download, Play, 
  Pause, Navigation, AlertTriangle, Battery, Wifi, WifiOff,
  Heart, Share2, Award, Target, Compass, Sun, Cloud, CloudRain,
  ThermometerSun, Wind, Leaf, Bird, TreePine, Info, X, Check,
  Home, Map, BarChart3, Menu, Bell, Settings, HelpCircle,
  Smartphone, Zap, Shield, Eye, Sparkles, ArrowLeft, ArrowRight,
  Plus, Minus, RotateCcw, Volume2, VolumeX, Moon, Layers,
  AlertCircle, CheckCircle, XCircle, Loader2, Image, MessageCircle,
  Send, ThumbsUp, Calendar, Footprints, Timer, Route, Flag,
  BookOpen, Bookmark, History, Trash2, Edit3, Globe, Lock,
  Unlock, RefreshCw, ChevronDown, ChevronUp, Copy, ExternalLink,
  Crosshair, ZoomIn, ZoomOut, Locate, Users, Gift, Percent,
  Store, Utensils, ShoppingBag, Ticket, Crown, Medal, Flame,
  ImageIcon, AtSign, Hash, Repeat2, MoreHorizontal, UserPlus,
  MapPinned, Share, Coffee, Tent, Bike, Car, Package, Mail, MessageSquare
} from 'lucide-react';
import { identifySpeciesFromImage, IdentificationResult } from './services/aiService';

// ============================================
// ISARD - Application de Randonnée Augmentée
// Version Complète + Social & Camera Standalone
// ============================================

// Base de données des randonnées
const RANDONNEES_DB = [
  {
    id: 1, nom: "Lac de Gaube", lieu: "Cauterets, Hautes-Pyrénées", region: "Hautes-Pyrénées",
    difficulte: "bleu", duree: 210, distance: 11.2, denivele: 520, altitudeMax: 1725,
    note: 4.8, avis: 234, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "Magnifique randonnée vers le lac de Gaube avec vue sur le Vignemale.",
    tags: ["Lac", "Montagne", "Famille", "Panorama"],
    faune: ["Isard", "Marmotte", "Gypaète barbu"], flore: ["Pin à crochets", "Rhododendron", "Gentiane"],
    coordonnees: { lat: 42.8367, lng: -0.1456 },
    traceGPS: [[42.8367, -0.1456], [42.8350, -0.1440], [42.8300, -0.1400], [42.8156, -0.1389]],
    offline: true
  },
  {
    id: 2, nom: "Pic du Midi d'Ossau", lieu: "Vallée d'Ossau, Pyrénées-Atlantiques", region: "Pyrénées-Atlantiques",
    difficulte: "rouge", duree: 420, distance: 14.5, denivele: 1250, altitudeMax: 2884,
    note: 4.9, avis: 189, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    description: "Ascension mythique du Pic du Midi d'Ossau, emblème des Pyrénées.",
    tags: ["Sommet", "Alpinisme", "Expert", "Lacs"],
    faune: ["Isard", "Marmotte", "Aigle royal"], flore: ["Edelweiss", "Gentiane", "Saxifrage"],
    coordonnees: { lat: 42.8417, lng: -0.4383 },
    traceGPS: [[42.8417, -0.4383], [42.8380, -0.4300], [42.8320, -0.4150]],
    offline: false
  },
  {
    id: 3, nom: "Cirque de Gavarnie", lieu: "Gavarnie, Hautes-Pyrénées", region: "Hautes-Pyrénées",
    difficulte: "vert", duree: 150, distance: 6.8, denivele: 280, altitudeMax: 1570,
    note: 4.7, avis: 512, image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
    description: "Découverte du célèbre cirque glaciaire classé UNESCO.",
    tags: ["Cascade", "UNESCO", "Facile", "Patrimoine"],
    faune: ["Vautour fauve", "Gypaète barbu", "Isard"], flore: ["Lis des Pyrénées", "Ramonde"],
    coordonnees: { lat: 42.7356, lng: -0.0089 },
    traceGPS: [[42.7356, -0.0089], [42.7250, -0.0095], [42.7050, -0.0100]],
    offline: true
  },
  {
    id: 4, nom: "Lac d'Oô", lieu: "Bagnères-de-Luchon, Haute-Garonne", region: "Haute-Garonne",
    difficulte: "bleu", duree: 240, distance: 9.4, denivele: 580, altitudeMax: 1504,
    note: 4.6, avis: 178, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    description: "Randonnée vers un lac glaciaire dominé par une cascade spectaculaire.",
    tags: ["Lac", "Cascade", "Refuge", "Nature"],
    faune: ["Marmotte", "Isard", "Aigle royal"], flore: ["Rhododendron", "Gentiane", "Arnica"],
    coordonnees: { lat: 42.7789, lng: 0.4967 },
    traceGPS: [[42.7789, 0.4967], [42.7700, 0.4880], [42.7600, 0.4800]],
    offline: true
  },
  {
    id: 5, nom: "Brèche de Roland", lieu: "Gavarnie, Hautes-Pyrénées", region: "Hautes-Pyrénées",
    difficulte: "rouge", duree: 390, distance: 12.8, denivele: 980, altitudeMax: 2807,
    note: 4.9, avis: 267, image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
    description: "Montée légendaire vers la brèche mythique.",
    tags: ["Légende", "Frontière", "Panorama", "Altitude"],
    faune: ["Lagopède alpin", "Isard", "Chocard"], flore: ["Edelweiss", "Androsace"],
    coordonnees: { lat: 42.6953, lng: -0.0347 },
    traceGPS: [[42.7100, -0.0500], [42.7000, -0.0400], [42.6953, -0.0347]],
    offline: false
  },
  {
    id: 6, nom: "Lac de Bethmale", lieu: "Bethmale, Ariège", region: "Ariège",
    difficulte: "vert", duree: 90, distance: 4.2, denivele: 150, altitudeMax: 1074,
    note: 4.4, avis: 156, image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    description: "Balade facile autour d'un lac pittoresque.",
    tags: ["Lac", "Famille", "Facile", "Tradition"],
    faune: ["Héron cendré", "Canard colvert"], flore: ["Nénuphar", "Iris des marais"],
    coordonnees: { lat: 42.8589, lng: 0.9456 },
    traceGPS: [[42.8589, 0.9456], [42.8550, 0.9500], [42.8589, 0.9456]],
    offline: true
  }
];

// Base de données des espèces (collection RA)
const ESPECES_DB = {
  flore: [
    { id: 1, nom: "Edelweiss", scientifique: "Leontopodium alpinum", description: "Fleur emblématique des montagnes. Espèce protégée.", altitude: "1800-3000m", rarete: "rare", image: "🌼", saison: "Juillet-Août", xp: 50 },
    { id: 2, nom: "Gentiane Jaune", scientifique: "Gentiana lutea", description: "Grande plante aux fleurs jaunes utilisée pour la liqueur.", altitude: "800-2500m", rarete: "commun", image: "🌻", saison: "Juin-Août", xp: 20 },
    { id: 3, nom: "Rhododendron", scientifique: "Rhododendron ferrugineum", description: "Arbuste aux fleurs rose vif couvrant les pentes.", altitude: "1500-2800m", rarete: "très commun", image: "🌺", saison: "Juin-Juillet", xp: 10 },
    { id: 4, nom: "Arnica Montana", scientifique: "Arnica montana", description: "Plante médicinale aux propriétés anti-inflammatoires.", altitude: "600-2800m", rarete: "assez rare", image: "🌼", saison: "Juin-Août", xp: 35 },
    { id: 5, nom: "Lis des Pyrénées", scientifique: "Lilium pyrenaicum", description: "Magnifique lis jaune endémique des Pyrénées.", altitude: "800-2200m", rarete: "rare", image: "🌷", saison: "Juin-Juillet", xp: 50 },
    { id: 6, nom: "Pin à crochets", scientifique: "Pinus uncinata", description: "Conifère caractéristique de l'étage subalpin.", altitude: "1600-2700m", rarete: "commun", image: "🌲", saison: "Toute l'année", xp: 15 },
    { id: 7, nom: "Myrtille", scientifique: "Vaccinium myrtillus", description: "Petit arbuste produisant des baies délicieuses.", altitude: "800-2500m", rarete: "très commun", image: "🫐", saison: "Juillet-Sept", xp: 10 },
    { id: 8, nom: "Iris des Pyrénées", scientifique: "Iris latifolia", description: "Iris bleu intense endémique des Pyrénées.", altitude: "1400-2400m", rarete: "rare", image: "💜", saison: "Juin-Juillet", xp: 50 }
  ],
  faune: [
    { id: 101, nom: "Isard", scientifique: "Rupicapra pyrenaica", description: "Chamois des Pyrénées, symbole de nos montagnes.", habitat: "Zones rocheuses 1000-3000m", rarete: "commun", image: "🦌", comportement: "Actif tôt le matin", xp: 30 },
    { id: 102, nom: "Marmotte", scientifique: "Marmota marmota", description: "Rongeur montagnard au sifflement caractéristique.", habitat: "Prairies alpines 1200-3000m", rarete: "très commun", image: "🐿️", comportement: "Siffle en cas de danger", xp: 15 },
    { id: 103, nom: "Gypaète barbu", scientifique: "Gypaetus barbatus", description: "Le plus grand rapace d'Europe (2.8m d'envergure).", habitat: "Falaises 500-4000m", rarete: "rare", image: "🦅", comportement: "Vol plané majestueux", xp: 75 },
    { id: 104, nom: "Desman des Pyrénées", scientifique: "Galemys pyrenaicus", description: "Petit mammifère aquatique endémique très rare.", habitat: "Torrents de montagne", rarete: "très rare", image: "🐁", comportement: "Nocturne", xp: 100 },
    { id: 105, nom: "Vautour fauve", scientifique: "Gyps fulvus", description: "Grand rapace charognard (2.6m d'envergure).", habitat: "Falaises et gorges", rarete: "commun", image: "🦅", comportement: "Vole en cercles", xp: 25 },
    { id: 106, nom: "Lagopède alpin", scientifique: "Lagopus muta", description: "Oiseau qui change de plumage selon les saisons.", habitat: "Pelouses alpines 2000-3000m", rarete: "assez rare", image: "🐓", comportement: "Se camoufle", xp: 45 },
    { id: 107, nom: "Aigle royal", scientifique: "Aquila chrysaetos", description: "Majestueux rapace pouvant atteindre 2.2m d'envergure.", habitat: "Montagnes 400-3000m", rarete: "assez rare", image: "🦅", comportement: "Cercles dans le ciel", xp: 60 },
    { id: 108, nom: "Ours brun", scientifique: "Ursus arctos", description: "Le plus grand carnivore d'Europe. Environ 80 individus.", habitat: "Forêts de montagne", rarete: "très rare", image: "🐻", comportement: "Discret, fuit l'homme", xp: 100 }
  ]
};

const MESSAGES_DB = [
  { id: 1, user: "Sophie M.", avatar: "👩‍🦰", lastMessage: "On se retrouve au parking à 9h ?", time: "10:30", unread: 1 },
  { id: 2, user: "Thomas G.", avatar: "👨‍🦱", lastMessage: "Merci pour les photos !", time: "Hier", unread: 0 },
  { id: 3, user: "Groupe Randos 31", avatar: "🏔️", lastMessage: "Pierre: Qui est chaud pour le Pic du Midi ?", time: "Hier", unread: 5 }
];

const GROUPS_DB = [
  { id: 1, nom: "Passion Pyrénées", membres: 1240, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80", desc: "Le groupe des amoureux des Pyrénées." },
  { id: 2, nom: "Randos Famille", membres: 856, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80", desc: "Balades accessibles pour petits et grands." },
  { id: 3, nom: "Alpinisme Expert", membres: 342, image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=200&q=80", desc: "Pour ceux qui visent les sommets." }
];

// Badges disponibles
const BADGES_DB = [
  { id: 1, nom: "Premier Pas", icon: "👣", description: "Complétez votre première randonnée", condition: { type: "randos", value: 1 }, xp: 100 },
  { id: 2, nom: "Explorateur", icon: "🧭", description: "Complétez 5 randonnées", condition: { type: "randos", value: 5 }, xp: 250 },
  { id: 3, nom: "Aventurier", icon: "🎒", description: "Complétez 10 randonnées", condition: { type: "randos", value: 10 }, xp: 500 },
  { id: 4, nom: "Sommet 2000m", icon: "🏔️", description: "Atteignez un sommet à plus de 2000m", condition: { type: "altitude", value: 2000 }, xp: 300 },
  { id: 5, nom: "Sommet 3000m", icon: "🗻", description: "Atteignez un sommet à plus de 3000m", condition: { type: "altitude", value: 3000 }, xp: 750 },
  { id: 6, nom: "Botaniste", icon: "🌿", description: "Identifiez 5 espèces de plantes", condition: { type: "flore", value: 5 }, xp: 200 },
  { id: 7, nom: "Naturaliste", icon: "🦅", description: "Observez 5 espèces animales", condition: { type: "faune", value: 5 }, xp: 200 },
  { id: 8, nom: "Marathonien", icon: "🏃", description: "Parcourez 50km au total", condition: { type: "distance", value: 50 }, xp: 400 },
  { id: 9, nom: "Social", icon: "👥", description: "Ajoutez 5 amis", condition: { type: "amis", value: 5 }, xp: 150 },
  { id: 10, nom: "Influenceur", icon: "📸", description: "Obtenez 50 likes sur vos posts", condition: { type: "likes", value: 50 }, xp: 300 }
];

// Challenges actifs
const CHALLENGES_DB = [
  { id: 1, nom: "Défi Hebdomadaire", description: "Parcourez 25km cette semaine", type: "distance", target: 25, reward: 200, endDate: "2025-02-09", icon: "🎯" },
  { id: 2, nom: "Chasseur de Sommets", description: "Atteignez 3 sommets ce mois", type: "sommets", target: 3, reward: 500, endDate: "2025-02-28", icon: "⛰️" },
  { id: 3, nom: "Photographe Nature", description: "Identifiez 10 espèces en RA", type: "especes", target: 10, reward: 300, endDate: "2025-02-15", icon: "📷" },
  { id: 4, nom: "Randonneur Matinal", description: "Commencez 3 randos avant 8h", type: "special", target: 3, reward: 250, endDate: "2025-02-28", icon: "🌅" },
  { id: 5, nom: "Challenge Communautaire", description: "Ensemble, parcourons 10 000km", type: "community", target: 10000, current: 7834, reward: 100, endDate: "2025-02-28", icon: "🌍" }
];

// Partenaires
const PARTENAIRES_DB = [
  { id: 1, nom: "Le Refuge Gourmand", type: "restaurant", description: "Restaurant de montagne avec spécialités pyrénéennes", reduction: 15, code: "ISARD15", image: "🍽️", location: "Cauterets", category: "Restauration", conditions: "Sur présentation de l'app, hors boissons" },
  { id: 2, nom: "Décathlon Tarbes", type: "equipement", description: "Équipement outdoor et randonnée", reduction: 10, code: "ISARD10", image: "🎒", location: "Tarbes", category: "Équipement", conditions: "Sur les articles randonnée, min 50€" },
  { id: 3, nom: "Intersport Lourdes", type: "equipement", description: "Spécialiste montagne et ski", reduction: 12, code: "ISARDSKI", image: "⛷️", location: "Lourdes", category: "Équipement", conditions: "Hors promotions en cours" },
  { id: 4, nom: "Auberge du Cirque", type: "hebergement", description: "Hébergement au pied du Cirque de Gavarnie", reduction: 20, code: "ISARD20", image: "🏠", location: "Gavarnie", category: "Hébergement", conditions: "2 nuits minimum" },
  { id: 5, nom: "La Cabane à Fromages", type: "restaurant", description: "Fromagerie et dégustation locale", reduction: 10, code: "FROMAGE10", image: "🧀", location: "Saint-Lary", category: "Restauration", conditions: "Sur les planches dégustation" },
  { id: 6, nom: "Pyré'Nature", type: "activite", description: "Location VTT et activités outdoor", reduction: 15, code: "PYRENATURE", image: "🚴", location: "Luchon", category: "Activités", conditions: "Location journée ou demi-journée" },
  { id: 7, nom: "Au Sommet", type: "equipement", description: "Boutique spécialisée alpinisme", reduction: 8, code: "SOMMET8", image: "🧗", location: "Pau", category: "Équipement", conditions: "Sur le matériel technique" },
  { id: 8, nom: "Éco-Lodge Pyrénées", type: "hebergement", description: "Hébergement écologique en pleine nature", reduction: 15, code: "ECOLODGE", image: "🌲", location: "Arrens-Marsous", category: "Hébergement", conditions: "Réservation via l'app" }
];

// Classement simulé
const CLASSEMENT_DB = {
  ville: [
    { rank: 1, nom: "Marie L.", avatar: "👩", xp: 12450, distance: 234.5, ville: "Toulouse" },
    { rank: 2, nom: "Pierre D.", avatar: "👨", xp: 11200, distance: 198.3, ville: "Toulouse" },
    { rank: 3, nom: "Sophie M.", avatar: "👩‍🦰", xp: 10890, distance: 187.2, ville: "Toulouse" },
    { rank: 4, nom: "Lucas R.", avatar: "👦", xp: 9750, distance: 165.8, ville: "Toulouse" },
    { rank: 5, nom: "Emma B.", avatar: "👧", xp: 8900, distance: 154.2, ville: "Toulouse" },
    { rank: 6, nom: "Thomas G.", avatar: "👨‍🦱", xp: 8450, distance: 142.1, ville: "Toulouse" },
    { rank: 7, nom: "Julie F.", avatar: "👩‍🦳", xp: 7800, distance: 128.5, ville: "Toulouse" },
    { rank: 8, nom: "Antoine C.", avatar: "🧔", xp: 7200, distance: 115.3, ville: "Toulouse" }
  ],
  national: [
    { rank: 1, nom: "Jean-Pierre M.", avatar: "🧔", xp: 45600, distance: 890.2, ville: "Chamonix" },
    { rank: 2, nom: "Amélie R.", avatar: "👩", xp: 42300, distance: 812.5, ville: "Grenoble" },
    { rank: 3, nom: "François H.", avatar: "👨", xp: 38900, distance: 756.8, ville: "Annecy" },
    { rank: 4, nom: "Claire D.", avatar: "👩‍🦰", xp: 35200, distance: 698.4, ville: "Lyon" },
    { rank: 5, nom: "Nicolas P.", avatar: "👦", xp: 32100, distance: 645.2, ville: "Toulouse" }
  ]
};

// Posts sociaux simulés
const POSTS_DB = [
  { id: 1, user: { nom: "Marie L.", avatar: "👩", niveau: 12 }, type: "rando", rando: "Lac de Gaube", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", text: "Magnifique journée au lac de Gaube ! L'eau était incroyablement turquoise 💙", likes: 45, comments: 12, time: "2h", liked: false },
  { id: 2, user: { nom: "Pierre D.", avatar: "👨", niveau: 8 }, type: "badge", badge: { nom: "Sommet 3000m", icon: "🗻" }, text: "Je viens de débloquer le badge Sommet 3000m ! Le Pic du Midi d'Ossau était incroyable 🎉", likes: 67, comments: 23, time: "5h", liked: true },
  { id: 3, user: { nom: "Sophie M.", avatar: "👩‍🦰", niveau: 15 }, type: "espece", espece: { nom: "Gypaète barbu", image: "🦅" }, text: "J'ai enfin pu observer un Gypaète barbu ! Moment magique près de Gavarnie ❤️", likes: 89, comments: 31, time: "1j", liked: false },
  { id: 4, user: { nom: "Lucas R.", avatar: "👦", niveau: 6 }, type: "rando", rando: "Cirque de Gavarnie", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&q=80", text: "Première fois au Cirque de Gavarnie, la cascade est impressionnante !", likes: 34, comments: 8, time: "1j", liked: false },
  { id: 5, user: { nom: "Emma B.", avatar: "👧", niveau: 10 }, type: "challenge", challenge: "Défi Hebdomadaire", text: "Challenge de la semaine terminé ! 25km parcourus 💪", likes: 52, comments: 15, time: "2j", liked: true }
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function IsardApp() {
  // États principaux
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedRando, setSelectedRando] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationData, setNavigationData] = useState<any>(null);
  const [showGlobalAR, setShowGlobalAR] = useState(false);
  const [showAR, setShowAR] = useState(false); // Navigation specific AR
  const [arResult, setArResult] = useState<IdentificationResult | null>(null);
  
  // Géolocalisation
  const [userLocation, setUserLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // États utilisateur
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('isard_user_v2');
      return saved ? JSON.parse(saved) : {
        nom: "Randonneur", prenom: "Alex", email: "", niveau: 5, xp: 1250,
        ville: "Toulouse", pays: "France", avatar: "🧑‍🦱",
        dateInscription: new Date().toISOString(),
        amis: [1, 2, 3], followers: 45, following: 32
      };
    } catch { return { nom: "Randonneur", prenom: "Alex", email: "", niveau: 5, xp: 1250, ville: "Toulouse", pays: "France", avatar: "🧑‍🦱", dateInscription: new Date().toISOString(), amis: [], followers: 0, following: 0 }; }
  });
  
  const [userStats, setUserStats] = useState(() => {
    try {
      const saved = localStorage.getItem('isard_stats_v2');
      return saved ? JSON.parse(saved) : {
        totalDistance: 45.6, totalDenivele: 2340, totalRandos: 8, totalHeures: 24,
        altitudeMax: 2450, especesFlore: [1, 2, 3, 6, 7], especesFaune: [101, 102, 105],
        randosCompletees: [], activiteHebdo: [5.2, 0, 8.1, 0, 3.4, 12.5, 6.8],
        challengeProgress: { 1: 18.5, 2: 1, 3: 8, 4: 1 },
        totalLikes: 23
      };
    } catch { return { totalDistance: 0, totalDenivele: 0, totalRandos: 0, totalHeures: 0, altitudeMax: 0, especesFlore: [], especesFaune: [], randosCompletees: [], activiteHebdo: [0,0,0,0,0,0,0], challengeProgress: {}, totalLikes: 0 }; }
  });
  
  const [favorites, setFavorites] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('isard_favorites_v2') || '[]'); } catch { return []; }
  });
  
  const [downloadedRandos, setDownloadedRandos] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('isard_downloads_v2') || '[]'); } catch { return []; }
  });
  
  const [unlockedBadges, setUnlockedBadges] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('isard_badges_v2') || '[1, 4, 6]'); } catch { return []; }
  });
  
  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('isard_settings_v2') || '{"notifications":true,"darkMode":false}'); } 
    catch { return { notifications: true, darkMode: false }; }
  });

  const [posts, setPosts] = useState(POSTS_DB);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ difficulte: 'tous', duree: 'tous', region: 'tous' });

  // Persistance
  useEffect(() => { try { localStorage.setItem('isard_user_v2', JSON.stringify(user)); } catch {} }, [user]);
  useEffect(() => { try { localStorage.setItem('isard_stats_v2', JSON.stringify(userStats)); } catch {} }, [userStats]);
  useEffect(() => { try { localStorage.setItem('isard_favorites_v2', JSON.stringify(favorites)); } catch {} }, [favorites]);
  useEffect(() => { try { localStorage.setItem('isard_downloads_v2', JSON.stringify(downloadedRandos)); } catch {} }, [downloadedRandos]);
  useEffect(() => { try { localStorage.setItem('isard_badges_v2', JSON.stringify(unlockedBadges)); } catch {} }, [unlockedBadges]);
  useEffect(() => { try { localStorage.setItem('isard_settings_v2', JSON.stringify(settings)); } catch {} }, [settings]);

  // Géolocalisation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocationError("Géolocalisation non supportée"); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: Date.now() });
        setIsLocating(false);
      },
      (err) => {
        setLocationError("Position indisponible");
        setIsLocating(false);
        setUserLocation({ lat: 43.6047, lng: 1.4442, accuracy: 0, isDefault: true });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: Date.now() }),
      () => {}, { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Splash screen
  useEffect(() => {
    if (currentScreen === 'splash') {
      requestLocation();
      setTimeout(() => {
        const hasOnboarded = localStorage.getItem('isard_onboarded_v2');
        setCurrentScreen(hasOnboarded ? 'main' : 'onboarding');
      }, 2000);
    }
  }, [currentScreen, requestLocation]);

  // Notification helper
  const addNotification = useCallback((notif: any) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notif, id }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  // Filtrer randonnées
  const filteredRandos = useMemo(() => {
    return RANDONNEES_DB.filter(r => {
      const matchSearch = r.nom.toLowerCase().includes(searchQuery.toLowerCase()) || r.lieu.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = filters.difficulte === 'tous' || r.difficulte === filters.difficulte;
      return matchSearch && matchDiff;
    });
  }, [searchQuery, filters]);

  // Distance calculator
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }, []);

  // Randos par distance
  const randosByDistance = useMemo(() => {
    if (!userLocation) return filteredRandos;
    return [...filteredRandos].map(r => ({
      ...r, distanceFromUser: calculateDistance(userLocation.lat, userLocation.lng, r.coordonnees.lat, r.coordonnees.lng)
    })).sort((a, b) => (a.distanceFromUser || 0) - (b.distanceFromUser || 0));
  }, [filteredRandos, userLocation, calculateDistance]);

  // Identifier espèce (BRIDGE AVEC AI SERVICE)
  const identifySpecies = useCallback((species: IdentificationResult) => {
    const typeKey = species.type === 'flore' ? 'especesFlore' : 'especesFaune';
    // On simule un ID pour la base de données
    const simulatedId = Date.now();
    
    setUserStats(prev => {
      return { ...prev, [typeKey]: [...prev[typeKey], simulatedId] };
    });
    setUser(prev => ({ ...prev, xp: prev.xp + species.xp }));
    // Si c'est le mode global, on update arResult mais on ne déclenche pas forcément une notif intrusive
    // setArResult(species); // Déjà fait dans le composant AR
    addNotification({ type: 'success', title: 'Nouvelle espèce !', message: `${species.nom} ajouté à votre collection`, icon: species.image });
  }, [addNotification]);

  // Compléter rando
  const completeRando = useCallback((rando: any, stats: any) => {
    setUserStats(prev => {
      const dayOfWeek = new Date().getDay();
      const newActivite = [...prev.activiteHebdo];
      newActivite[dayOfWeek === 0 ? 6 : dayOfWeek - 1] += stats.distance;
      return {
        ...prev,
        totalDistance: prev.totalDistance + stats.distance,
        totalDenivele: prev.totalDenivele + stats.denivele,
        totalRandos: prev.totalRandos + 1,
        totalHeures: prev.totalHeures + (stats.duree / 60),
        altitudeMax: Math.max(prev.altitudeMax, rando.altitudeMax),
        randosCompletees: [...prev.randosCompletees, { id: rando.id, date: new Date().toISOString(), stats }],
        activiteHebdo: newActivite
      };
    });
    setUser(prev => ({ ...prev, xp: prev.xp + Math.floor(stats.distance * 10 + stats.denivele / 10) }));
    addNotification({ type: 'success', title: 'Randonnée terminée !', message: `${stats.distance.toFixed(1)}km parcourus`, icon: '🎉' });
  }, [addNotification]);

  // Like post
  const toggleLikePost = useCallback((postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newLiked = !p.liked;
        return { ...p, liked: newLiked, likes: newLiked ? p.likes + 1 : p.likes - 1 };
      }
      return p;
    }));
  }, []);

  // Render screens
  if (currentScreen === 'splash') return <SplashScreen />;
  if (currentScreen === 'onboarding') return <OnboardingScreen onComplete={() => { localStorage.setItem('isard_onboarded_v2', 'true'); setCurrentScreen('main'); }} />;

  // Mode Caméra Autonome Global
  if (showGlobalAR) {
    return (
        <ARScannerScreen 
            onClose={() => setShowGlobalAR(false)}
            onIdentify={identifySpecies}
        />
    );
  }

  if (isNavigating && navigationData) {
    return <NavigationScreen rando={selectedRando} navigationData={navigationData} setNavigationData={setNavigationData} userLocation={userLocation} showAR={showAR} setShowAR={setShowAR} arResult={arResult} setArResult={setArResult} onIdentify={identifySpecies} onStop={(stats: any) => { setIsNavigating(false); if (stats?.completed) completeRando(selectedRando, stats); setNavigationData(null); setActiveTab('stats'); }} />;
  }

  if (selectedRando) {
    return <RandoDetailScreen rando={selectedRando} userLocation={userLocation} onBack={() => setSelectedRando(null)} onStart={() => { setNavigationData({ startTime: Date.now(), progress: 0, currentPosition: 0, paused: false }); setIsNavigating(true); }} isFavorite={favorites.includes(selectedRando.id)} isDownloaded={downloadedRandos.includes(selectedRando.id)} onToggleFavorite={() => setFavorites(prev => prev.includes(selectedRando.id) ? prev.filter(id => id !== selectedRando.id) : [...prev, selectedRando.id])} onDownload={() => { if (!downloadedRandos.includes(selectedRando.id)) { setDownloadedRandos(prev => [...prev, selectedRando.id]); addNotification({ type: 'success', title: 'Téléchargé', message: `${selectedRando.nom} disponible hors-ligne`, icon: '✅' }); }}} calculateDistance={calculateDistance} />;
  }

  return (
    <div className={`min-h-screen font-sans max-w-md mx-auto relative overflow-hidden ${settings.darkMode ? 'bg-stone-900' : 'bg-stone-50'}`}>
      <NotificationStack notifications={notifications} />
      <Header user={user} settings={settings} activeTab={activeTab} userLocation={userLocation} />
      
      <main className="pb-24 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar">
        {activeTab === 'discover' && <DiscoverTab randos={randosByDistance} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filters={filters} setFilters={setFilters} favorites={favorites} downloadedRandos={downloadedRandos} onSelectRando={setSelectedRando} userLocation={userLocation} settings={settings} />}
        {activeTab === 'map' && <MapTab randos={RANDONNEES_DB} onSelectRando={setSelectedRando} favorites={favorites} downloadedRandos={downloadedRandos} userLocation={userLocation} isLocating={isLocating} onRequestLocation={requestLocation} settings={settings} />}
        {activeTab === 'social' && <SocialTab posts={posts} user={user} userStats={userStats} onToggleLike={toggleLikePost} settings={settings} challenges={CHALLENGES_DB} classement={CLASSEMENT_DB} messages={MESSAGES_DB} groups={GROUPS_DB} />}
        {activeTab === 'stats' && <StatsTab stats={userStats} badges={BADGES_DB} unlockedBadges={unlockedBadges} user={user} settings={settings} challenges={CHALLENGES_DB} />}
        {activeTab === 'profile' && <ProfileTab user={user} setUser={setUser} stats={userStats} settings={settings} setSettings={setSettings} userLocation={userLocation} partenaires={PARTENAIRES_DB} especesFlore={ESPECES_DB.flore} especesFaune={ESPECES_DB.faune} />}
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} settings={settings} onOpenGlobalAR={() => setShowGlobalAR(true)} />
    </div>
  );
}

// ============================================
// COMPOSANTS UI DE BASE
// ============================================

function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="relative">
        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm animate-pulse">
          <Mountain className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="w-6 h-6 text-amber-900" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mt-8 tracking-tight">ISARD</h1>
      <p className="text-emerald-200 mt-2">Randonnée augmentée</p>
      <Loader2 className="w-8 h-8 text-white/50 animate-spin mt-8" />
    </div>
  );
}

function OnboardingScreen({ onComplete }: any) {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Bienvenue sur ISARD", subtitle: "L'app qui transforme vos randonnées", icon: <Mountain className="w-16 h-16 text-white" />, color: "from-emerald-600 to-teal-600" },
    { title: "Réalité Augmentée", subtitle: "Identifiez faune et flore", icon: <Camera className="w-16 h-16 text-white" />, color: "from-violet-600 to-purple-600" },
    { title: "Communauté", subtitle: "Partagez vos aventures", icon: <Users className="w-16 h-16 text-white" />, color: "from-blue-600 to-cyan-600" },
    { title: "Récompenses", subtitle: "Badges, défis et réductions", icon: <Gift className="w-16 h-16 text-white" />, color: "from-amber-500 to-orange-500" }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${steps[step].color} flex flex-col items-center justify-center p-6 max-w-md mx-auto transition-all duration-500`}>
      <button onClick={onComplete} className="absolute top-12 right-6 text-white/70 text-sm">Passer</button>
      <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mb-8">{steps[step].icon}</div>
      <h1 className="text-3xl font-bold text-white mb-2">{steps[step].title}</h1>
      <p className="text-white/80 text-lg">{steps[step].subtitle}</p>
      <div className="flex gap-2 mt-12">
        {steps.map((_, i) => <button key={i} onClick={() => setStep(i)} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />)}
      </div>
      <button onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()} className="mt-8 py-3 px-8 bg-white text-stone-800 rounded-xl font-semibold">
        {step < steps.length - 1 ? 'Suivant' : "C'est parti !"}
      </button>
    </div>
  );
}

function NotificationStack({ notifications }: any) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-14 px-4 pointer-events-none max-w-md mx-auto">
      {notifications.map((n: any) => (
        <div key={n.id} className="w-full bg-white rounded-2xl shadow-lg p-4 mb-2 flex items-center gap-3 animate-in slide-in-from-top pointer-events-auto">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">{n.icon}</div>
          <div><p className="font-semibold text-stone-800 text-sm">{n.title}</p><p className="text-stone-500 text-xs">{n.message}</p></div>
        </div>
      ))}
    </div>
  );
}

function Header({ user, settings, activeTab, userLocation }: any) {
  const titles: any = { discover: 'Découvrir', map: 'Carte', social: 'Communauté', stats: 'Statistiques', profile: 'Profil' };
  return (
    <header className={`${settings.darkMode ? 'bg-stone-800' : 'bg-gradient-to-br from-emerald-700 to-teal-600'} text-white px-4 pt-12 pb-6 sticky top-0 z-30`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Mountain className="w-6 h-6" /></div>
          <div>
            <span className="text-xl font-bold">ISARD</span>
            <p className="text-emerald-100 text-xs">Niv. {user.niveau} • {user.xp} XP</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">{user.avatar}</div>
        </div>
      </div>
      {userLocation && !userLocation.isDefault && (
        <div className="flex items-center gap-2 mt-2 text-emerald-100 text-xs"><Locate className="w-3 h-3" /><span>GPS actif • {Math.round(userLocation.accuracy)}m</span></div>
      )}
      <h1 className="text-lg font-semibold mt-3">{titles[activeTab]}</h1>
    </header>
  );
}

function BottomNavigation({ activeTab, setActiveTab, settings, onOpenGlobalAR }: any) {
  const tabs = [
    { id: 'discover', icon: Compass, label: 'Découvrir' },
    { id: 'map', icon: Map, label: 'Carte' },
    // Center Button
    { id: 'camera', icon: Camera, label: 'Scanner', isSpecial: true },
    { id: 'social', icon: Users, label: 'Social' },
    { id: 'profile', icon: User, label: 'Profil' }
  ];
  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${settings.darkMode ? 'bg-stone-800' : 'bg-white'} border-t border-stone-200 px-1 py-2 max-w-md mx-auto z-40`}>
      <div className="flex justify-around items-end">
        {tabs.map(t => {
            if (t.isSpecial) {
                return (
                    <button key={t.id} onClick={onOpenGlobalAR} className="flex flex-col items-center -mt-6">
                        <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform border-4 border-white dark:border-stone-800">
                            <t.icon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] mt-1 font-medium text-emerald-600">{t.label}</span>
                    </button>
                )
            }
            return (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${activeTab === t.id ? 'text-emerald-600 bg-emerald-50' : 'text-stone-400'}`}>
                    <t.icon className={`w-5 h-5 ${activeTab === t.id ? 'stroke-[2.5]' : ''}`} />
                    <span className="text-[10px] mt-0.5 font-medium">{t.label}</span>
                </button>
            )
        })}
      </div>
    </nav>
  );
}

// ============================================
// ONGLET DÉCOUVRIR
// ============================================

function DiscoverTab({ randos, searchQuery, setSearchQuery, filters, setFilters, favorites, downloadedRandos, onSelectRando, userLocation, settings }: any) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className={`px-4 py-6 ${settings.darkMode ? 'text-white' : ''}`}>
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full pl-12 pr-12 py-3 rounded-2xl border ${settings.darkMode ? 'bg-stone-800 border-stone-700 text-white' : 'bg-white border-stone-200'}`} />
        <button onClick={() => setShowFilters(!showFilters)} className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center ${showFilters ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-500'}`}>
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className={`rounded-2xl p-4 mb-4 border ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
          <div className="flex gap-2 flex-wrap">
            {['tous', 'vert', 'bleu', 'rouge'].map(d => (
              <button key={d} onClick={() => setFilters({ ...filters, difficulte: d })} className={`px-4 py-2 rounded-xl text-sm font-medium ${filters.difficulte === d ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {d === 'tous' ? 'Tous' : d === 'vert' ? 'Facile' : d === 'bleu' ? 'Modéré' : 'Difficile'}
              </button>
            ))}
          </div>
        </div>
      )}

      {userLocation && !userLocation.isDefault && (
        <div className="mb-6">
          <h3 className={`font-semibold mb-3 flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>
            <Locate className="w-5 h-5 text-emerald-600" />À proximité
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {randos.slice(0, 4).map((r: any) => (
              <div key={r.id} onClick={() => onSelectRando(r)} className={`flex-shrink-0 w-44 rounded-2xl overflow-hidden border cursor-pointer ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}>
                <div className="relative h-24">
                  <img src={r.image} alt={r.nom} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 right-2"><p className="text-white font-semibold text-sm truncate drop-shadow-lg">{r.nom}</p></div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs bg-white/90 font-medium">{r.distanceFromUser?.toFixed(0)} km</div>
                </div>
                <div className="p-2 flex justify-between text-xs">
                  <span className="flex items-center gap-1 text-stone-500"><Clock className="w-3 h-3" />{Math.floor(r.duree/60)}h</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{r.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-stone-500 mb-3">{randos.length} randonnée{randos.length > 1 ? 's' : ''}</p>
      <div className="space-y-3">
        {randos.map((r: any) => (
          <button key={r.id} onClick={() => onSelectRando(r)} className={`w-full rounded-2xl overflow-hidden border flex text-left ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}>
            <div className="relative w-24 h-24 flex-shrink-0">
              <img src={r.image} alt={r.nom} className="w-full h-full object-cover" />
              <div className={`absolute top-2 left-2 w-3 h-3 rounded-full ring-2 ring-white ${r.difficulte === 'vert' ? 'bg-green-400' : r.difficulte === 'bleu' ? 'bg-blue-400' : 'bg-red-400'}`} />
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className={`font-semibold truncate ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{r.nom}</h4>
                  {favorites.includes(r.id) && <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1 truncate"><MapPin className="w-3 h-3" />{r.lieu}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{Math.floor(r.duree/60)}h{r.duree%60>0?(r.duree%60).toString().padStart(2,'0'):''}</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{r.denivele}m</span>
                <span className="flex items-center gap-1 ml-auto"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{r.note}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// ONGLET CARTE (VRAIE CARTE LEAFLET)
// ============================================

function MapTab({ randos, onSelectRando, favorites, userLocation, isLocating, onRequestLocation, settings }: any) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedRando, setSelectedRando] = useState<any>(null);

  useEffect(() => {
    // Initialisation unique de la carte
    if (!mapInstanceRef.current && mapContainerRef.current && (window as any).L) {
      const L = (window as any).L;
      const center = userLocation ? [userLocation.lat, userLocation.lng] : [42.8, 0.0];
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(center, 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Mise à jour des marqueurs et de la position
  useEffect(() => {
    if (!mapInstanceRef.current || !(window as any).L) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;

    // Nettoyage des layers
    map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    // Marqueur Utilisateur
    if (userLocation) {
        const userIcon = L.divIcon({
            html: `<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.3);"></div>`,
            className: 'bg-transparent', iconSize: [16, 16]
        });
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
    }

    // Marqueurs Randos
    randos.forEach((r: any) => {
        const color = r.difficulte === 'vert' ? '#22c55e' : r.difficulte === 'bleu' ? '#3b82f6' : '#ef4444';
        const icon = L.divIcon({
            html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/></svg></div>`,
            className: 'bg-transparent', iconSize: [32, 32]
        });
        const marker = L.marker([r.coordonnees.lat, r.coordonnees.lng], { icon }).addTo(map);
        marker.on('click', () => setSelectedRando(r));
        
        if (r.traceGPS) {
            L.polyline(r.traceGPS, { color: color, weight: 4, opacity: 0.7 }).addTo(map);
        }
    });
  }, [randos, userLocation]);

  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 12);
    } else {
        onRequestLocation();
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full bg-stone-200" />
      
      <button 
        onClick={centerOnUser} 
        className="absolute bottom-4 right-4 z-[400] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-stone-700"
      >
        {isLocating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crosshair className="w-5 h-5" />}
      </button>

      {selectedRando && (
        <div className="absolute bottom-4 left-4 right-20 z-[400] bg-white rounded-2xl shadow-xl p-4 animate-in slide-in-from-bottom">
          <button onClick={() => setSelectedRando(null)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
          <div className="flex gap-3">
            <img src={selectedRando.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-stone-800 text-sm">{selectedRando.nom}</h3>
              <div className="flex gap-2 mt-1 text-xs text-stone-500">
                <span>{Math.floor(selectedRando.duree/60)}h</span>
                <span>{selectedRando.denivele}m</span>
                <span>⭐ {selectedRando.note}</span>
              </div>
            </div>
          </div>
          <button onClick={() => onSelectRando(selectedRando)} className="w-full mt-3 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold">Voir détails</button>
        </div>
      )}
    </div>
  );
}

// ============================================
// ONGLET SOCIAL
// ============================================

function SocialTab({ posts, user, userStats, onToggleLike, settings, challenges, classement, messages, groups }: any) {
  const [activeSubTab, setActiveSubTab] = useState('feed');

  return (
    <div className={`${settings.darkMode ? 'text-white' : ''}`}>
      {/* Sub tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-stone-200 overflow-x-auto no-scrollbar">
        {[
          { id: 'feed', label: 'Fil', icon: Home },
          { id: 'messages', label: 'Messages', icon: Mail },
          { id: 'groups', label: 'Groupes', icon: Users },
          { id: 'classement', label: 'Classement', icon: Crown },
          { id: 'challenges', label: 'Défis', icon: Target }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveSubTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeSubTab === t.id ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'feed' && (
        <div className="px-4 py-4 space-y-4">
          {/* Create post */}
          <div className={`rounded-2xl p-4 border ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">{user.avatar}</div>
              <input type="text" placeholder="Partagez votre aventure..." className={`flex-1 py-2 px-4 rounded-full text-sm ${settings.darkMode ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-800'}`} />
              <button className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white"><Camera className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post: any) => (
            <div key={post.id} className={`rounded-2xl border overflow-hidden ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">{post.user.avatar}</div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{post.user.nom}</p>
                    <p className="text-xs text-stone-500">Niveau {post.user.niveau} • {post.time}</p>
                  </div>
                  <button className="text-stone-400"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                
                <p className={`mb-3 text-sm ${settings.darkMode ? 'text-stone-200' : 'text-stone-700'}`}>{post.text}</p>
                
                {post.type === 'badge' && (
                  <div className="bg-amber-50 rounded-xl p-4 flex items-center gap-4 mb-3">
                    <span className="text-4xl">{post.badge.icon}</span>
                    <div>
                      <p className="font-semibold text-amber-800">Badge débloqué !</p>
                      <p className="text-amber-700 text-sm">{post.badge.nom}</p>
                    </div>
                  </div>
                )}
                
                {post.type === 'espece' && (
                  <div className="bg-green-50 rounded-xl p-4 flex items-center gap-4 mb-3">
                    <span className="text-4xl">{post.espece.image}</span>
                    <div>
                      <p className="font-semibold text-green-800">Espèce identifiée !</p>
                      <p className="text-green-700 text-sm">{post.espece.nom}</p>
                    </div>
                  </div>
                )}
                
                {post.image && <img src={post.image} alt="" className="w-full rounded-xl mb-3" />}
              </div>

              <div className={`flex items-center gap-6 px-4 py-3 border-t ${settings.darkMode ? 'border-stone-700' : 'border-stone-100'}`}>
                <button onClick={() => onToggleLike(post.id)} className={`flex items-center gap-2 text-sm ${post.liked ? 'text-red-500' : 'text-stone-500'}`}>
                  <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500' : ''}`} />{post.likes}
                </button>
                <button className="flex items-center gap-2 text-sm text-stone-500"><MessageCircle className="w-5 h-5" />{post.comments}</button>
                <button className="flex items-center gap-2 text-sm text-stone-500 ml-auto"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'messages' && (
        <div className="px-4 py-4 space-y-3">
            <h3 className={`font-semibold mb-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>Discussions récentes</h3>
            {messages.map((msg: any) => (
                <div key={msg.id} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}>
                    <div className="relative">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-xl">{msg.avatar}</div>
                        {msg.unread > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">{msg.unread}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className={`font-semibold text-sm ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{msg.user}</h4>
                            <span className="text-xs text-stone-400">{msg.time}</span>
                        </div>
                        <p className={`text-sm truncate ${msg.unread > 0 ? 'font-medium text-stone-800' : 'text-stone-500'}`}>{msg.lastMessage}</p>
                    </div>
                </div>
            ))}
            <button className="w-full py-3 mt-4 text-emerald-600 font-medium text-sm flex items-center justify-center gap-2 border border-emerald-200 rounded-xl bg-emerald-50">
                <Plus className="w-4 h-4" /> Nouveau message
            </button>
        </div>
      )}

      {activeSubTab === 'groups' && (
        <div className="px-4 py-4 space-y-4">
            <h3 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>Groupes populaires</h3>
            {groups.map((grp: any) => (
                <div key={grp.id} className={`rounded-2xl border overflow-hidden ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                    <div className="h-24 relative">
                        <img src={grp.image} className="w-full h-full object-cover" alt={grp.nom} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                            <h4 className="text-white font-bold">{grp.nom}</h4>
                        </div>
                    </div>
                    <div className="p-3">
                        <p className="text-sm text-stone-500 mb-3">{grp.desc}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-stone-400 flex items-center gap-1"><Users className="w-3 h-3" />{grp.membres} membres</span>
                            <button className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold">Rejoindre</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {activeSubTab === 'classement' && (
        <div className="px-4 py-4">
          {/* User rank card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 mb-6 text-white">
            <p className="text-emerald-100 text-sm mb-1">Votre classement</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">#8</div>
                <div>
                  <p className="font-bold text-lg">{user.prenom} {user.nom.charAt(0)}.</p>
                  <p className="text-emerald-100 text-sm">{user.xp} XP • {userStats.totalDistance.toFixed(1)} km</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-100">{user.ville}</p>
                <p className="text-xs text-emerald-200">Top 10%</p>
              </div>
            </div>
          </div>

          {/* Tabs ville/national */}
          <div className="flex gap-2 mb-4">
            <button className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-medium text-sm flex items-center justify-center gap-2">
              <MapPinned className="w-4 h-4" />{user.ville}
            </button>
            <button className="flex-1 py-2 rounded-xl bg-stone-100 text-stone-600 font-medium text-sm flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />France
            </button>
          </div>

          {/* Leaderboard */}
          <div className={`rounded-2xl border overflow-hidden ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
            {classement.ville.map((u: any, i: number) => (
              <div key={i} className={`flex items-center gap-3 p-3 ${i < classement.ville.length - 1 ? 'border-b border-stone-100' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${u.rank === 1 ? 'bg-amber-400 text-amber-900' : u.rank === 2 ? 'bg-stone-300 text-stone-700' : u.rank === 3 ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
                  {u.rank <= 3 ? ['🥇', '🥈', '🥉'][u.rank-1] : u.rank}
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-lg">{u.avatar}</div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{u.nom}</p>
                  <p className="text-xs text-stone-500">{u.distance.toFixed(1)} km</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-sm">{u.xp.toLocaleString()}</p>
                  <p className="text-xs text-stone-400">XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'challenges' && (
        <div className="px-4 py-4 space-y-4">
          <h3 className={`font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>
            <Flame className="w-5 h-5 text-orange-500" />Défis actifs
          </h3>
          
          {challenges.map((c: any) => {
            const progress = c.type === 'community' ? (c.current / c.target) * 100 : (userStats.challengeProgress[c.id] || 0) / c.target * 100;
            return (
              <div key={c.id} className={`rounded-2xl border p-4 ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">{c.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{c.nom}</h4>
                      <span className="text-xs text-emerald-600 font-medium">+{c.reward} XP</span>
                    </div>
                    <p className="text-sm text-stone-500">{c.description}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span>{c.type === 'community' ? c.current.toLocaleString() : (userStats.challengeProgress[c.id] || 0)} / {c.target.toLocaleString()}</span>
                    <span>{Math.min(progress, 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                </div>
                <p className="text-xs text-stone-400">Termine le {new Date(c.endDate).toLocaleDateString('fr-FR')}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// CAMERA RA AUTONOME (GLOBAL)
// ============================================

function ARScannerScreen({ onClose, onIdentify }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [arResult, setArResult] = useState<IdentificationResult | null>(null);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }, 
            audio: false 
        })
        .then(s => {
            stream = s;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        })
        .catch(err => {
            console.error("Erreur caméra:", err);
            setError("Impossible d'accéder à la caméra.");
        });

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    const handleCapture = async () => {
        if (!videoRef.current || !canvasRef.current) return;
        setAnalyzing(true);
        setArResult(null);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            const result = await identifySpeciesFromImage(imageData);
            
            setAnalyzing(false);
            if (result) {
                setArResult(result);
                onIdentify(result);
            } else {
                setArResult({
                    nom: "Non identifié",
                    description: "L'IA n'a pas pu identifier cet élément avec certitude.",
                    type: "autre",
                    image: "❓",
                    xp: 0,
                    scientifique: "Inconnu",
                    rarete: "commun",
                    habitat: "Inconnu"
                });
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={onClose} className="p-2 rounded-full bg-black/30 backdrop-blur text-white">
                    <X className="w-6 h-6" />
                </button>
                <div className="px-3 py-1 bg-black/30 backdrop-blur rounded-full text-white text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Scanner Intelligent
                </div>
                <div className="w-10"></div> 
            </div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
                {error ? (
                    <div className="flex items-center justify-center h-full text-white">{error}</div>
                ) : (
                    <>
                        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {!analyzing && !arResult && (
                            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                                </div>
                                <p className="mt-8 text-white/90 bg-black/40 px-4 py-2 rounded-full backdrop-blur text-sm">Pointez vers une plante ou un animal</p>
                            </div>
                        )}

                        {analyzing && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
                                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                                <p className="text-white font-medium">Analyse en cours...</p>
                            </div>
                        )}

                        {/* Result Modal */}
                        {arResult && (
                            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 pb-12 shadow-2xl animate-in slide-in-from-bottom z-40">
                                <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-6" />
                                <div className="text-center">
                                    <div className="text-7xl mb-4">{arResult.image}</div>
                                    <h2 className="text-2xl font-bold text-stone-800">{arResult.nom}</h2>
                                    <p className="text-emerald-600 italic font-medium mb-3">{arResult.scientifique}</p>
                                    <p className="text-stone-600 leading-relaxed mb-6">{arResult.description}</p>
                                    
                                    <div className="flex justify-center gap-2 mb-6">
                                        <span className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600 font-medium uppercase">{arResult.habitat}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${arResult.rarete === 'rare' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{arResult.rarete}</span>
                                    </div>

                                    <button onClick={() => setArResult(null)} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform">
                                        Nouveau Scan (+{arResult.xp} XP)
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer Controls */}
            {!arResult && !analyzing && (
                <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center gap-8">
                    <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                        <ImageIcon className="w-6 h-6" />
                    </button>
                    <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur active:scale-95 transition-transform shadow-lg shadow-black/20">
                        <div className="w-16 h-16 bg-white rounded-full"></div>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================
// ONGLET STATS
// ============================================

function StatsTab({ stats, badges, unlockedBadges, user, settings, challenges }: any) {
  const xpThresholds = [0, 200, 500, 1000, 2000, 4000, 8000, 16000];
  const nextThreshold = xpThresholds[user.niveau] || 32000;
  const prevThreshold = xpThresholds[user.niveau - 1] || 0;
  const xpProgress = ((user.xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  return (
    <div className={`px-4 py-6 ${settings.darkMode ? 'text-white' : ''}`}>
      {/* Level card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm">Votre niveau</p>
            <p className="text-3xl font-bold">Niveau {user.niveau}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span>{user.xp} XP</span>
          <span>{nextThreshold} XP</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: Route, value: stats.totalDistance.toFixed(1), unit: 'km', label: 'Distance' },
          { icon: TrendingUp, value: stats.totalDenivele.toLocaleString(), unit: 'm', label: 'Dénivelé' },
          { icon: Target, value: stats.totalRandos, unit: '', label: 'Randos' },
          { icon: Mountain, value: stats.altitudeMax.toLocaleString(), unit: 'm', label: 'Alt. max' }
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl p-4 border ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-100'}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-emerald-100">
              <s.icon className="w-5 h-5 text-emerald-600" />
            </div>
            <p className={`text-2xl font-bold ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{s.value}<span className="text-base font-normal text-stone-400">{s.unit}</span></p>
            <p className="text-sm text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>
          <Award className="w-5 h-5 text-amber-500" />Badges ({unlockedBadges.length}/{badges.length})
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {badges.slice(0, 8).map((b: any) => {
            const unlocked = unlockedBadges.includes(b.id);
            return (
              <div key={b.id} className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 relative ${unlocked ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300' : 'bg-stone-100 opacity-40'}`}>
                <span className="text-xl mb-1">{b.icon}</span>
                <span className="text-[8px] text-center font-medium text-stone-600 leading-tight">{b.nom}</span>
                {unlocked && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly activity */}
      <div className={`rounded-2xl border p-4 ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>
          <BarChart3 className="w-5 h-5 text-emerald-600" />Activité semaine
        </h3>
        <div className="flex items-end justify-between h-24 gap-2">
          {stats.activiteHebdo.map((km: number, i: number) => {
            const max = Math.max(...stats.activiteHebdo, 1);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg min-h-[4px]" style={{ height: `${Math.max((km / max) * 100, 4)}%` }} />
                <span className="text-[10px] text-stone-400">{['L','M','M','J','V','S','D'][i]}</span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm mt-4 pt-4 border-t border-stone-100">
          <span className="font-semibold text-emerald-600">{stats.activiteHebdo.reduce((a:number,b:number)=>a+b,0).toFixed(1)} km</span> cette semaine
        </p>
      </div>
    </div>
  );
}

// ============================================
// ONGLET PROFIL
// ============================================

function ProfileTab({ user, setUser, stats, settings, setSettings, userLocation, partenaires, especesFlore, especesFaune }: any) {
  const [activeSubTab, setActiveSubTab] = useState('collection');

  const collectedFlore = especesFlore.filter((e: any) => stats.especesFlore.includes(e.id));
  const collectedFaune = especesFaune.filter((e: any) => stats.especesFaune.includes(e.id));

  return (
    <div className={`${settings.darkMode ? 'text-white' : ''}`}>
      {/* Profile header */}
      <div className={`px-4 py-6 text-center ${settings.darkMode ? 'bg-stone-800' : 'bg-white'}`}>
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl">{user.avatar}</div>
        <h2 className={`text-xl font-bold ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{user.prenom} {user.nom}</h2>
        <p className="text-sm text-stone-500">Niveau {user.niveau} • {user.ville}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center"><p className="font-bold text-lg">{stats.totalRandos}</p><p className="text-xs text-stone-500">Randos</p></div>
          <div className="text-center"><p className="font-bold text-lg">{user.followers}</p><p className="text-xs text-stone-500">Followers</p></div>
          <div className="text-center"><p className="font-bold text-lg">{user.following}</p><p className="text-xs text-stone-500">Suivis</p></div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-stone-200 overflow-x-auto">
        {[
          { id: 'collection', label: 'Collection RA', icon: Camera },
          { id: 'partenaires', label: 'Partenaires', icon: Gift },
          { id: 'settings', label: 'Paramètres', icon: Settings }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveSubTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeSubTab === t.id ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'collection' && (
        <div className="px-4 py-4">
          {/* Flore */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>
                <Leaf className="w-5 h-5 text-green-600" />Flore ({collectedFlore.length}/{especesFlore.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {especesFlore.map((e: any) => {
                const collected = stats.especesFlore.includes(e.id);
                return (
                  <div key={e.id} className={`rounded-2xl p-4 border ${collected ? 'bg-green-50 border-green-200' : 'bg-stone-100 border-stone-200 opacity-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{e.image}</span>
                      <div>
                        <p className={`font-semibold text-sm ${collected ? 'text-green-800' : 'text-stone-500'}`}>{e.nom}</p>
                        <p className={`text-xs ${collected ? 'text-green-600' : 'text-stone-400'}`}>{e.rarete}</p>
                      </div>
                    </div>
                    {collected && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle className="w-4 h-4" />Collecté
                      </div>
                    )}
                    {!collected && <p className="text-xs text-stone-400">{e.altitude}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Faune */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-semibold flex items-center gap-2 ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>
                <Bird className="w-5 h-5 text-amber-600" />Faune ({collectedFaune.length}/{especesFaune.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {especesFaune.map((e: any) => {
                const collected = stats.especesFaune.includes(e.id);
                return (
                  <div key={e.id} className={`rounded-2xl p-4 border ${collected ? 'bg-amber-50 border-amber-200' : 'bg-stone-100 border-stone-200 opacity-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{e.image}</span>
                      <div>
                        <p className={`font-semibold text-sm ${collected ? 'text-amber-800' : 'text-stone-500'}`}>{e.nom}</p>
                        <p className={`text-xs ${collected ? 'text-amber-600' : 'text-stone-400'}`}>{e.rarete}</p>
                      </div>
                    </div>
                    {collected && (
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <CheckCircle className="w-4 h-4" />Observé
                      </div>
                    )}
                    {!collected && <p className="text-xs text-stone-400">{e.habitat}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'partenaires' && (
        <div className="px-4 py-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 mb-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Percent className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">Avantages exclusifs</p>
                <p className="text-purple-100 text-sm">Profitez de réductions chez nos partenaires</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {partenaires.map((p: any) => (
              <div key={p.id} className={`rounded-2xl border overflow-hidden ${settings.darkMode ? 'bg-stone-800 border-stone-700' : 'bg-white border-stone-200'}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-stone-100 rounded-xl flex items-center justify-center text-3xl">{p.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${settings.darkMode ? 'text-white' : 'text-stone-800'}`}>{p.nom}</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">-{p.reduction}%</span>
                      </div>
                      <p className="text-sm text-stone-500">{p.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                        <MapPin className="w-3 h-3" />{p.location}
                        <span className="px-2 py-0.5 bg-stone-100 rounded-full">{p.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-3 flex items-center justify-between border-t ${settings.darkMode ? 'border-stone-700 bg-stone-900' : 'border-stone-100 bg-stone-50'}`}>
                  <div>
                    <p className="text-xs text-stone-500">Code promo</p>
                    <p className="font-mono font-bold text-emerald-600">{p.code}</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium flex items-center gap-2">
                    <Copy className="w-4 h-4" />Copier
                  </button>
                </div>
                <p className="px-4 py-2 text-xs text-stone-400 bg-stone-50">{p.conditions}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="px-4 py-4">
          <div className={`rounded-2xl overflow-hidden ${settings.darkMode ? 'bg-stone-800' : 'bg-white'}`}>
            {[
              { icon: Bell, label: 'Notifications', key: 'notifications' },
              { icon: Moon, label: 'Mode sombre', key: 'darkMode' }
            ].map((s: any) => (
              <div key={s.key} className={`flex items-center justify-between px-4 py-4 border-b ${settings.darkMode ? 'border-stone-700' : 'border-stone-100'}`}>
                <div className="flex items-center gap-3">
                  <s.icon className="w-5 h-5 text-stone-500" />
                  <span className={settings.darkMode ? 'text-stone-200' : 'text-stone-700'}>{s.label}</span>
                </div>
                <button onClick={() => setSettings((prev: any) => ({ ...prev, [s.key]: !prev[s.key] }))} className={`w-12 h-6 rounded-full ${settings[s.key] ? 'bg-emerald-500' : 'bg-stone-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${settings[s.key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => { if(confirm('Effacer toutes les données ?')) { localStorage.clear(); window.location.reload(); }}} className="w-full mt-6 py-3 text-red-500 font-medium text-center">
            Effacer mes données
          </button>
          
          <p className="text-center text-xs text-stone-400 mt-8">ISARD v2.0.0 • Made with ❤️ in Pyrénées</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// ÉCRAN DÉTAIL RANDO
// ============================================

function RandoDetailScreen({ rando, userLocation, onBack, onStart, isFavorite, isDownloaded, onToggleFavorite, onDownload, calculateDistance }: any) {
  const [downloading, setDownloading] = useState(false);
  const distanceFromUser = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, rando.coordonnees.lat, rando.coordonnees.lng) : null;

  return (
    <div className="min-h-screen bg-stone-50 max-w-md mx-auto">
      <div className="relative h-64">
        <img src={rando.image} alt={rando.nom} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={onBack} className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ArrowLeft className="w-5 h-5" /></button>
        <div className="absolute top-12 right-4 flex gap-2">
          <button onClick={onToggleFavorite} className={`w-10 h-10 rounded-full flex items-center justify-center ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 backdrop-blur-md text-white'}`}>
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mb-2 ${rando.difficulte === 'vert' ? 'bg-green-500' : rando.difficulte === 'bleu' ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
            {rando.difficulte === 'vert' ? 'Facile' : rando.difficulte === 'bleu' ? 'Modéré' : 'Difficile'}
          </div>
          <h1 className="text-2xl font-bold text-white">{rando.nom}</h1>
          <p className="text-white/80 text-sm flex items-center gap-1"><MapPin className="w-4 h-4" />{rando.lieu}</p>
        </div>
      </div>

      <div className="px-4 py-6 -mt-2 bg-stone-50 rounded-t-3xl relative">
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { icon: Clock, value: `${Math.floor(rando.duree/60)}h`, label: 'Durée' },
            { icon: Route, value: `${rando.distance}km`, label: 'Distance' },
            { icon: TrendingUp, value: `${rando.denivele}m`, label: 'D+' },
            { icon: Mountain, value: `${rando.altitudeMax}m`, label: 'Alt.' }
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 text-center border border-stone-100">
              <s.icon className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <p className="font-bold text-stone-800 text-sm">{s.value}</p>
              <p className="text-xs text-stone-500">{s.label}</p>
            </div>
          ))}
        </div>

        {distanceFromUser && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-6 border border-blue-100 flex items-center gap-3">
            <Locate className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-800">{distanceFromUser.toFixed(1)} km de vous</p>
              <p className="text-sm text-blue-600">Environ {Math.round(distanceFromUser * 1.5)} min en voiture</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6 bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
          <div>
            <p className="text-2xl font-bold text-stone-800">{rando.note}</p>
            <p className="text-sm text-stone-500">{rando.avis} avis</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">Description</h3>
          <p className="text-stone-600 text-sm">{rando.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {rando.tags.map((t: string) => <span key={t} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">{t}</span>)}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2"><Leaf className="w-5 h-5 text-green-600" /><span className="font-medium text-green-800 text-sm">Flore</span></div>
            <div className="flex flex-wrap gap-1">{rando.flore.map((f: string, i: number) => <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{f}</span>)}</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-2"><Bird className="w-5 h-5 text-amber-600" /><span className="font-medium text-amber-800 text-sm">Faune</span></div>
            <div className="flex flex-wrap gap-1">{rando.faune.map((f: string, i: number) => <span key={i} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{f}</span>)}</div>
          </div>
        </div>

        <div className="flex gap-3 sticky bottom-4">
          {!isDownloaded ? (
            <button onClick={() => { setDownloading(true); setTimeout(() => { setDownloading(false); onDownload(); }, 1500); }} disabled={downloading} className="flex-1 py-4 rounded-2xl bg-stone-100 text-stone-700 font-semibold flex items-center justify-center gap-2">
              {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {downloading ? 'Téléchargement...' : 'Hors-ligne'}
            </button>
          ) : (
            <div className="flex-1 py-4 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-center gap-2 border border-emerald-200">
              <Check className="w-5 h-5" />Disponible
            </div>
          )}
          <button onClick={onStart} className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30">
            <Play className="w-5 h-5" />Démarrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// VRAIE CAMERA AR IMPLEMENTATION
// ---------------------------------------------
function NavigationScreen({ rando, navigationData, setNavigationData, userLocation, showAR, setShowAR, arResult, setArResult, onIdentify, onStop }: any) {
  const [batteryLevel] = useState(Math.floor(Math.random() * 30) + 70);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (navigationData.paused) return;
    const interval = setInterval(() => {
      setNavigationData((prev: any) => ({ ...prev, progress: Math.min(prev.progress + 0.3 + Math.random() * 0.2, 100) }));
    }, 500);
    return () => clearInterval(interval);
  }, [navigationData.paused, setNavigationData]);

  // Initialisation Caméra
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (showAR) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      })
      .then(s => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => {
        console.error("Erreur caméra:", err);
        setCameraError("Caméra non accessible");
      });
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [showAR]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setAnalyzing(true);
    setArResult(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        const result = await identifySpeciesFromImage(imageData);
        
        setAnalyzing(false);
        if (result) {
            onIdentify(result);
        } else {
             // Fallback visuel si erreur IA
            setArResult({
                nom: "Non identifié",
                description: "L'IA n'a pas pu identifier cet élément avec certitude.",
                type: "autre",
                image: "❓",
                xp: 0,
                scientifique: "Inconnu",
                rarete: "commun",
                habitat: "Inconnu"
            });
        }
    }
  };

  const handleStop = () => {
    onStop({
      completed: navigationData.progress >= 95,
      distance: rando.distance * navigationData.progress / 100,
      denivele: Math.floor(rando.denivele * navigationData.progress / 100),
      duree: (Date.now() - navigationData.startTime) / 60000
    });
  };

  const currentDistance = rando.distance * navigationData.progress / 100;
  const elapsed = Math.floor((Date.now() - navigationData.startTime) / 60000);

  return (
    <div className="min-h-screen bg-stone-900 max-w-md mx-auto relative flex flex-col">
      
      {/* HEADER DE NAVIGATION */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-12 pb-4 px-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between text-white">
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${userLocation ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'}`}>
            {userLocation ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {userLocation ? 'GPS actif' : 'GPS...'}
          </div>
          <div className={`flex items-center gap-1 text-sm ${batteryLevel < 20 ? 'text-red-400' : 'text-green-400'}`}>
            <Battery className="w-4 h-4" />{batteryLevel}%
          </div>
        </div>
        <h2 className="text-white font-semibold mt-4 text-lg drop-shadow-md">{rando.nom}</h2>
      </div>

      {/* ZONE CENTRALE (CARTE OU CAMERA) */}
      <div className="flex-1 relative bg-black overflow-hidden">
        
        {/* VUE AR / CAMERA */}
        {showAR && (
            <div className="absolute inset-0 z-10 bg-black">
                {cameraError ? (
                    <div className="flex items-center justify-center h-full text-white bg-stone-900">{cameraError}</div>
                ) : (
                    <>
                        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Overlay Scan */}
                        {!analyzing && !arResult && (
                           <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white/30 rounded-2xl">
                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl"></div>
                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl"></div>
                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl"></div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl"></div>
                              </div>
                              <p className="absolute bottom-32 w-full text-center text-white/80 font-medium text-sm bg-black/40 py-2 backdrop-blur-sm">Pointez vers une plante ou un animal</p>
                           </div>
                        )}

                        {/* Loader Analyse */}
                        {analyzing && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                                <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
                                <p className="text-white font-medium tracking-wide">L'IA analyse l'image...</p>
                            </div>
                        )}

                        {/* Resultat IA */}
                        {arResult && (
                            <div className="absolute bottom-24 left-4 right-4 bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom z-50">
                                <button onClick={() => setArResult(null)} className="absolute top-4 right-4 text-stone-400"><X className="w-5 h-5"/></button>
                                <div className="text-center">
                                    <div className="text-6xl mb-2">{arResult.image}</div>
                                    <h3 className="text-2xl font-bold text-stone-800">{arResult.nom}</h3>
                                    <p className="text-emerald-600 italic text-sm mb-2">{arResult.scientifique}</p>
                                    <p className="text-stone-600 text-sm mb-4 leading-relaxed">{arResult.description}</p>
                                    <div className="flex justify-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600">{arResult.habitat}</span>
                                        <span className="px-3 py-1 bg-amber-100 rounded-full text-xs text-amber-700">{arResult.rarete}</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-full font-bold text-sm shadow-lg shadow-emerald-600/30">
                                        <Trophy className="w-4 h-4" /> +{arResult.xp} XP
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Boutons Camera */}
                        {!analyzing && !arResult && (
                            <div className="absolute bottom-24 left-0 right-0 flex justify-center items-center gap-8 z-40">
                                <button onClick={() => setShowAR(false)} className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur hover:bg-black/60 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                                <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur active:scale-95 transition-transform shadow-lg shadow-black/20">
                                    <div className="w-16 h-16 bg-white rounded-full"></div>
                                </button>
                                <button className="w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur hover:bg-black/60 transition-colors">
                                    <Settings className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        )}

        {/* VUE MAP (NAVIGATION STANDARD) */}
        {!showAR && (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-800 relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://imgs.search.brave.com/J3yZk6k5aT6x6yC5j6z5x6yC5j6z5x6yC5j6z5/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzg5LzgzLzE3/LzM2MF9GXzg5ODMx/NzM1X3VwbkpLUmph/V1hZaFhZaFhZaFhZ/aFhZaFhZaFhZaFhZ/LmpwZw')] bg-cover bg-center grayscale mix-blend-overlay"></div>
                <div className="z-10 flex flex-col items-center">
                  <MapPin className="w-20 h-20 text-emerald-500 mb-6 animate-bounce drop-shadow-[0_10px_10px_rgba(16,185,129,0.3)]" />
                  <p className="text-2xl font-bold text-white tracking-tight">Suivez le tracé</p>
                  <p className="text-stone-400 mt-2">Restez sur le sentier balisé</p>
                </div>
            </div>
        )}
      </div>

      {/* FOOTER DE NAVIGATION */}
      <div className="bg-gradient-to-t from-stone-900 via-stone-900 to-transparent pt-6 pb-6 px-4 z-20">
        <div className="mb-4">
          <div className="flex items-center justify-between text-white mb-2">
            <span className="text-sm text-stone-400 font-mono">{currentDistance.toFixed(1)} km</span>
            <span className="text-sm font-medium text-emerald-400">{navigationData.progress.toFixed(0)}%</span>
            <span className="text-sm text-stone-400 font-mono">{(rando.distance - currentDistance).toFixed(1)} km</span>
          </div>
          <div className="h-2.5 bg-stone-800 rounded-full overflow-hidden border border-stone-700/50">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${navigationData.progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { icon: Timer, value: `${elapsed}'`, label: 'Temps' },
            { icon: TrendingUp, value: `${Math.floor(rando.denivele * navigationData.progress / 100)}m`, label: 'D+' },
            { icon: Zap, value: `${Math.floor(currentDistance * 50)}`, label: 'kcal' },
            { icon: Footprints, value: `${Math.floor(currentDistance * 1400)}`, label: 'Pas' }
          ].map((s, i) => (
            <div key={i} className="bg-stone-800/80 backdrop-blur rounded-2xl p-2.5 text-center border border-stone-700/50">
              <s.icon className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-[10px] text-stone-500 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setShowAR(true)} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 active:scale-95 transition-transform">
            <Camera className="w-5 h-5" />Scanner (IA)
          </button>
          <button onClick={() => setNavigationData((prev: any) => ({ ...prev, paused: !prev.paused }))} className={`py-4 px-6 rounded-2xl font-semibold shadow-lg active:scale-95 transition-transform ${navigationData.paused ? 'bg-emerald-500 text-white' : 'bg-stone-700 text-white'}`}>
            {navigationData.paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </button>
          <button onClick={handleStop} className="py-4 px-6 rounded-2xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20 active:scale-95 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}