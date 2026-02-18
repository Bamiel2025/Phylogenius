import { Collection, MatrixData, TreeNode, BoxGroup } from './types';

// Images are placeholders for now
const getImg = (text: string) => `https://placehold.co/200x200/e2e8f0/1e293b?text=${encodeURIComponent(text)}`;

// --- Collection 0: Vertébrés (Niveau 1 - Exemple du cours) ---

const vert1Species = [
  { id: 'sardine', name: 'Sardine', image: '/images/sardine.jpg', description: 'Poisson à nageoires rayonnées.' },
  { id: 'grenouille', name: 'Grenouille', image: '/images/grenouille.jpg', description: 'Amphibien au cycle de vie aquatique et terrestre.' },
  { id: 'lezard', name: 'Lézard', image: '/images/lézard.jpg', description: 'Reptile à écailles.' },
];

const vert1Chars = [
  { id: 'vertebres', name: 'Vertèbres', image: getImg('Vertèbres'), description: 'Présence d\'une colonne vertébrale.' },
  { id: 'poumons', name: 'Poumons', image: getImg('Poumons'), description: 'Organes respiratoires aériens.' },
  { id: 'amnios', name: 'Amnios', image: getImg('Amnios'), description: 'Enveloppe protégeant l\'embryon.' },
];

// Based on Image 1
const vert1Matrix: MatrixData = {
  'sardine': { 'vertebres': true, 'poumons': false, 'amnios': false },
  'grenouille': { 'vertebres': true, 'poumons': true, 'amnios': false },
  'lezard': { 'vertebres': true, 'poumons': true, 'amnios': true },
};

// Tree Level 1 (Bottom-Up)
const vert1Tree: TreeNode = {
  id: 'root', type: 'node', expectedItemId: 'vertebres', x: 50, y: 80,
  children: [
    { id: 'l_sardine', type: 'leaf', expectedItemId: 'sardine', x: 15, y: 20 },
    {
      id: 'n_poumons', type: 'node', expectedItemId: 'poumons', x: 80, y: 55,
      children: [
        { id: 'l_grenouille', type: 'leaf', expectedItemId: 'grenouille', x: 50, y: 20 },
        {
          id: 'n_amnios', type: 'node', expectedItemId: 'amnios', x: 90, y: 35,
          children: [
            { id: 'l_lezard', type: 'leaf', expectedItemId: 'lezard', x: 90, y: 10 }
          ]
        }
      ]
    }
  ]
};

// Based on Image 2 (Boxes)
const vert1Boxes: BoxGroup[] = [
  {
    id: 'box_vert', expectedCharacterId: 'vertebres', rect: { x: 0, y: 0, w: 100, h: 100, color: 'bg-rose-100' }, // Red/Rose
    children: [
      'sardine',
      {
        id: 'box_poum', expectedCharacterId: 'poumons', rect: { x: 25, y: 10, w: 70, h: 85, color: 'bg-sky-100' }, // Blue/Sky
        children: [
          'grenouille',
          {
            id: 'box_amnios', expectedCharacterId: 'amnios', rect: { x: 35, y: 10, w: 60, h: 60, color: 'bg-fuchsia-100' }, // Purple/Fuchsia
            children: ['lezard']
          }
        ]
      }
    ]
  }
];

// --- Collection 1: Vertébrés (Fossils & Current) ---

const vertSpecies = [
  { id: 'lezard', name: 'Lézard', image: '/images/lézard.jpg', description: 'Reptile actuel à écailles.' },
  { id: 'croco', name: 'Crocodile', image: '/images/crocodile.jpg', description: 'Reptile aquatique prédateur.' },
  { id: 'compso', name: 'Compsognathus', image: '/images/Compsognathus.png', description: 'Petit dinosaure carnivore bipède.' },
  { id: 'archaeo', name: 'Archéoptéryx', image: '/images/Archeopteryx.png', description: 'Fossile avec des plumes et des griffes aux ailes.' },
  { id: 'pigeon', name: 'Pigeon', image: '/images/pigeon.jpg', description: 'Oiseau actuel très commun, capable de vol.' },
];

const vertChars = [
  { id: 'vertebres_cerv', name: 'Plus de 3 vertèbres cervicales', image: getImg('Cou'), description: 'Le cou est bien différencié du tronc.' },
  { id: 'fenetre_mand', name: 'Fenêtre mandibulaire', image: getImg('Mâchoire'), description: 'Ouverture supplémentaire dans la mâchoire inférieure.' },
  { id: 'doigts_sol', name: '3 doigts sur le sol', image: getImg('Pied'), description: 'Seuls 3 doigts touchent le sol à la marche (bipédie).' },
  { id: 'plumes', name: 'Plumes', image: getImg('Plumes'), description: 'Téguments complexes recouvrant le corps.' },
  { id: 'doigts_aile', name: 'Doigts libres sur l\'aile', image: getImg('Griffes Aile'), description: 'Les doigts des membres antérieurs sont séparés et griffus.' },
  { id: 'brechet', name: 'Bréchet', image: getImg('Bréchet'), description: 'Os du sternum très développé pour les muscles du vol.' },
];

const vertMatrix: MatrixData = {
  'lezard': { 'vertebres_cerv': true, 'fenetre_mand': false, 'doigts_sol': false, 'plumes': false, 'doigts_aile': false, 'brechet': false },
  'croco': { 'vertebres_cerv': true, 'fenetre_mand': true, 'doigts_sol': false, 'plumes': false, 'doigts_aile': false, 'brechet': false },
  'compso': { 'vertebres_cerv': true, 'fenetre_mand': true, 'doigts_sol': true, 'plumes': false, 'doigts_aile': false, 'brechet': false },
  'archaeo': { 'vertebres_cerv': true, 'fenetre_mand': true, 'doigts_sol': true, 'plumes': true, 'doigts_aile': true, 'brechet': false },
  'pigeon': { 'vertebres_cerv': true, 'fenetre_mand': true, 'doigts_sol': true, 'plumes': true, 'doigts_aile': false, 'brechet': true },
};

// Tree updated: Time-Axis Aware
// Y=5 (Top) = Present day (Extant species)
// Y>20 = Past (Extinct species stop short)
const vertTreeRefined: TreeNode = {
  id: 'root', type: 'node', expectedItemId: 'vertebres_cerv', x: 20, y: 90,
  children: [
    { id: 'l_lezard', type: 'leaf', expectedItemId: 'lezard', x: 10, y: 5 }, // Extant -> Top
    {
      id: 'n_fenetre', type: 'node', expectedItemId: 'fenetre_mand', x: 35, y: 75,
      children: [
        { id: 'l_croco', type: 'leaf', expectedItemId: 'croco', x: 25, y: 5 }, // Extant -> Top
        {
          id: 'n_doigts', type: 'node', expectedItemId: 'doigts_sol', x: 50, y: 60,
          children: [
            { id: 'l_compso', type: 'leaf', expectedItemId: 'compso', x: 40, y: 35 }, // Extinct -> Stops short
            {
              id: 'n_plumes', type: 'node', expectedItemId: 'plumes', x: 65, y: 45,
              children: [
                {
                  id: 'n_doigts_aile', type: 'node', expectedItemId: 'doigts_aile', x: 60, y: 30,
                  children: [{ id: 'l_archaeo', type: 'leaf', expectedItemId: 'archaeo', x: 60, y: 25 }] // Extinct -> Stops short
                },
                {
                  id: 'n_brechet', type: 'node', expectedItemId: 'brechet', x: 85, y: 30,
                  children: [{ id: 'l_pigeon', type: 'leaf', expectedItemId: 'pigeon', x: 85, y: 5 }] // Extant -> Top
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const vertBoxes: BoxGroup[] = [
  {
    id: 'box_vert', expectedCharacterId: 'vertebres_cerv', rect: { x: 0, y: 0, w: 100, h: 100, color: 'bg-rose-100' },
    children: [
      'lezard',
      {
        id: 'box_fenetre', expectedCharacterId: 'fenetre_mand', rect: { x: 20, y: 10, w: 78, h: 85, color: 'bg-orange-100' },
        children: [
          'croco',
          {
            id: 'box_doigts_sol', expectedCharacterId: 'doigts_sol', rect: { x: 25, y: 10, w: 70, h: 70, color: 'bg-yellow-100' },
            children: [
              'compso',
              {
                id: 'box_plumes', expectedCharacterId: 'plumes', rect: { x: 30, y: 10, w: 65, h: 55, color: 'bg-green-100' },
                children: [
                  {
                    id: 'box_doigts_aile', expectedCharacterId: 'doigts_aile', rect: { x: 5, y: 10, w: 25, h: 40, color: 'bg-blue-100' },
                    children: ['archaeo']
                  },
                  {
                    id: 'box_brechet', expectedCharacterId: 'brechet', rect: { x: 35, y: 10, w: 25, h: 40, color: 'bg-purple-100' },
                    children: ['pigeon']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// --- Collection 2: Lignée Humaine ---

const humanSpecies = [
  { id: 'australo', name: 'Australopithèque', image: '/images/Australopithèque.jpg', description: 'Hominine bipède ancien.' },
  { id: 'habilis', name: 'Homo habilis', image: '/images/Homo habilis.jpg', description: 'Premier représentant du genre Homo.' },
  { id: 'neander', name: 'Homo neanderthalensis', image: '/images/Homo neanderthalensis.jpg', description: 'Homme de Neandertal, robuste.' },
  { id: 'sapiens', name: 'Homo sapiens', image: '/images/Homo sapiens.png', description: 'Homme moderne.' },
];

const humanChars = [
  {
    id: 'email', name: 'Émail des dents', treeLabel: 'Émail des dents épais', image: getImg('Dents'), description: 'Épaisseur de l\'émail dentaire.',
    options: ['Fin', 'Épais']
  },
  {
    id: 'mandibule', name: 'Forme de la mandibule', treeLabel: 'Mandibule parabolique', image: getImg('Mandibule'), description: 'Forme de l\'arcade dentaire.',
    options: ['En U', 'Parabolique']
  },
  {
    id: 'occipital', name: 'Position du trou occipital', treeLabel: 'Trou occipital avancé et Disp. prognathisme', image: getImg('Crâne'), description: 'Position du foramen magnum.',
    options: ['Arrière', 'Intermédiaire', 'Avancée']
  },
  {
    id: 'prognathisme', name: 'Prognathisme', treeLabel: 'Disparition du prognathisme', image: getImg('Face'), description: 'Avancement de la mâchoire.',
    options: ['Marqué', 'Réduit', 'Absent']
  },
  {
    id: 'bourrelet', name: 'Bourrelet sus-orbitaire', treeLabel: 'Disparition du bourrelet', image: getImg('Arcade'), description: 'Relief osseux au-dessus des yeux.',
    options: ['Développé', 'Absent']
  }
];

const humanMatrix: MatrixData = {
  'australo': { 'email': 'Épais', 'mandibule': 'En U', 'occipital': 'Intermédiaire', 'prognathisme': 'Marqué', 'bourrelet': 'Développé' },
  'habilis': { 'email': 'Épais', 'mandibule': 'Parabolique', 'occipital': 'Intermédiaire', 'prognathisme': 'Réduit', 'bourrelet': 'Développé' },
  'neander': { 'email': 'Épais', 'mandibule': 'Parabolique', 'occipital': 'Avancée', 'prognathisme': 'Absent', 'bourrelet': 'Développé' },
  'sapiens': { 'email': 'Épais', 'mandibule': 'Parabolique', 'occipital': 'Avancée', 'prognathisme': 'Absent', 'bourrelet': 'Absent' },
};

// Tree Updated: Bottom-Up Diagonal
const humanTreeFinal: TreeNode = {
  id: 'root', type: 'node', expectedItemId: 'email', x: 20, y: 90,
  children: [
    { id: 'l_australo', type: 'leaf', expectedItemId: 'australo', x: 10, y: 10 },
    {
      id: 'n_mandibule', type: 'node', expectedItemId: 'mandibule', x: 40, y: 70,
      children: [
        { id: 'l_habilis', type: 'leaf', expectedItemId: 'habilis', x: 30, y: 10 },
        {
          id: 'n_occipital', type: 'node', expectedItemId: 'occipital', x: 60, y: 50,
          children: [
            { id: 'l_neander', type: 'leaf', expectedItemId: 'neander', x: 50, y: 10 },
            {
              id: 'n_bourrelet', type: 'node', expectedItemId: 'bourrelet', x: 80, y: 30,
              children: [
                { id: 'l_sapiens', type: 'leaf', expectedItemId: 'sapiens', x: 90, y: 10 }
              ]
            }
          ]
        }
      ]
    }
  ]
};

const humanBoxes: BoxGroup[] = [
  {
    id: 'box_email', expectedCharacterId: 'email', rect: { x: 0, y: 0, w: 100, h: 100, color: 'bg-slate-200' },
    children: [
      'australo',
      {
        id: 'box_mandibule', expectedCharacterId: 'mandibule', rect: { x: 25, y: 10, w: 70, h: 85, color: 'bg-blue-100' },
        children: [
          'habilis',
          {
            id: 'box_occipital', expectedCharacterId: 'occipital', rect: { x: 30, y: 10, w: 65, h: 70, color: 'bg-green-100' },
            children: [
              'neander',
              {
                id: 'box_bourrelet', expectedCharacterId: 'bourrelet', rect: { x: 35, y: 10, w: 60, h: 50, color: 'bg-red-100' },
                children: ['sapiens']
              }
            ]
          }
        ]
      }
    ]
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'vertebres_niv1',
    name: 'Vertébrés',
    subtitle: 'Niveau 1',
    description: 'Introduction à la classification : Sardine, Grenouille et Lézard.',
    thumbnail: '/images/Theme vertebres1.png',
    hoverImage: '/images/vertebres1.png',
    species: vert1Species,
    characters: vert1Chars,
    correctMatrix: vert1Matrix,
    treeStructure: vert1Tree,
    boxStructure: vert1Boxes,
    quiz: {
      question: "D'après tes observations, qui est le plus proche parent du Lézard ?",
      options: [
        { id: 'sardine', label: 'La Sardine', isCorrect: false },
        { id: 'grenouille', label: 'La Grenouille', isCorrect: true },
      ],
      explanation: "Le Lézard est plus proche de la Grenouille que de la Sardine car ils partagent le caractère 'Poumons', que la Sardine ne possède pas."
    }
  },
  {
    id: 'vertebres',
    name: 'Vertébrés',
    subtitle: 'Niveau 2 (Actuels et Fossiles)',
    description: 'Comprendre les liens de parenté entre dinosaures, oiseaux et mammifères.',
    thumbnail: '/images/Theme vertebres 2.png',
    hoverImage: '/images/vertebres2.png',
    species: vertSpecies,
    characters: vertChars,
    correctMatrix: vertMatrix,
    treeStructure: vertTreeRefined,
    boxStructure: vertBoxes,
    quiz: {
      question: "Qui est le plus proche parent du Crocodile dans cette collection ?",
      options: [
        { id: 'lezard', label: 'Le Lézard', isCorrect: false },
        { id: 'pigeon', label: 'Le Pigeon', isCorrect: true },
      ],
      explanation: "Bien que le Crocodile ressemble au Lézard, il partage une 'Fenêtre mandibulaire' with le Pigeon and the dinosaurs, a character that the Lizard doesn't have."
    }
  },
  {
    id: 'humaine',
    name: 'Lignée Humaine',
    subtitle: '',
    description: 'Compare les crânes des hominines pour reconstituer notre histoire évolutive récente.',
    thumbnail: '/images/theme ligneehumaine.jpg',
    hoverImage: '/images/ligneehumaine1.jpg',
    species: humanSpecies,
    characters: humanChars,
    correctMatrix: humanMatrix,
    treeStructure: humanTreeFinal,
    boxStructure: humanBoxes,
    quiz: {
      question: "Qui est le plus proche parent d'Homo sapiens dans cette liste ?",
      options: [
        { id: 'australo', label: 'L\'Australopithèque', isCorrect: false },
        { id: 'neander', label: 'Homo neanderthalensis', isCorrect: true },
        { id: 'habilis', label: 'Homo habilis', isCorrect: false },
      ],
      explanation: "Homo sapiens and Neanderthals share a more recent common ancestor than the others. They share the character 'Advanced occipital hole' and a large cranial volume."
    }
  }
];
