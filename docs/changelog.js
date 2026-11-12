// Notes de mise à jour affichées dans Voksy (fenêtre « Nouveautés »).
// Ajouter une entrée en tête de liste à chaque nouvelle version (même numéro que package.json).
// kind : 'new' (Nouveau), 'better' (Amélioré), 'fix' (Corrigé)
export const CHANGELOG = [
  {
    version: '0.12.2',
    date: '2026-11-12',
    title: 'Nouveau V au démarrage',
    items: [
      ['better', "Écran de démarrage : le V de Voksy est maintenant un vrai V plein en 3D (comme sur le site), qui arrive en tournant et se balance pendant le chargement, aux couleurs de ton thème."],
    ],
  },
  {
    version: '0.12.1',
    date: '2026-11-12',
    title: 'Badges plus discrets',
    items: [
      ['better', "Les badges (Dev, Vérifié, Premium, Pionnier) s'affichent en petites icônes à côté du pseudo sur la carte de profil, à la place des étiquettes sous l'avatar."],
      ['new', "Passe la souris sur un badge pour voir son nom et ce qu'il veut dire, sur la carte de profil comme dans la liste d'amis."],
    ],
  },
  {
    version: '0.12.0',
    date: '2026-11-11',
    title: 'Trois nouveaux plugins',
    items: [
      ['new', "Galerie de captures : toutes tes captures Roblox dans une page Captures, classées par jeu et par jour. Visionneuse avec flèches, copie, « Afficher dans le dossier », suppression (corbeille) et bouton Jouer."],
      ['new', "Galerie : option pour copier automatiquement tes captures dans Images › Roblox (Roblox les garde dans un dossier temporaire), et petite carte par-dessus le jeu à chaque capture."],
      ['new', "Alertes de mise à jour : Voksy surveille tes favoris et te prévient quand un jeu est mis à jour, même réduit ou pendant une partie. Badge « Mis à jour » sur les cartes."],
      ['new', "Raccourcis clavier : rejoindre ton dernier serveur (Ctrl + Alt + R), afficher ou cacher Voksy (Ctrl + Alt + V), relancer Roblox sur le même serveur ou fermer Roblox, partout dans Windows."],
      ['better', "Ces plugins s'ajoutent depuis Plugins › Ajouter."],
    ],
  },
  {
    version: '0.11.0',
    date: '2026-11-11',
    title: 'Tes amis pendant tes parties',
    items: [
      ['new', "Chat rapide par-dessus Roblox (Alt + C) : un petit panneau amis et messages sur le côté du jeu, pour répondre sans quitter ta partie. Même raccourci ou Échap pour revenir au jeu."],
      ['new', "Notifications en jeu : messages, demandes d'ami, amis qui se connectent ou lancent un jeu s'affichent dans un coin de l'écran pendant que tu joues."],
      ['new', "Bouton « Rejoindre » directement dans la liste d'amis et dans le chat rapide : un clic et tu arrives sur le serveur de ton ami."],
      ['new', "Notification quand un ami se connecte (désactivable dans Réglages › Social)."],
      ['better', "Réglages › En jeu : la carte « Par-dessus Roblox » regroupe le raccourci Voksy, le chat rapide et les notifications en jeu."],
    ],
  },
  {
    version: '0.10.1',
    date: '2026-11-11',
    title: 'Mise en avant offerte',
    items: [
      ['new', "Badge Dev : mise en avant gratuite d'un jeu dans la ligne « Sponsorisé », depuis « Promouvoir mon jeu » (bouton « Gratuit (Dev) »)."],
      ['new', "Bouton « Arrêter » dans Mes campagnes pour retirer une mise en avant offerte."],
    ],
  },
  {
    version: '0.10.0',
    date: '2026-11-11',
    title: 'Jeux sponsorisés',
    items: [
      ['new', "Ligne « Sponsorisé » tout en haut de l'accueil : des jeux mis en avant par leurs créateurs, signalés comme annonces."],
      ['new', "« Promouvoir mon jeu » : colle le lien de ton jeu, choisis 3, 7 ou 30 jours et paie par carte (paiement sécurisé par Stripe)."],
      ['new', "Mes campagnes : suis les vues et les clics de ton jeu sponsorisé (connexion aux Amis Voksy)."],
    ],
  },
  {
    version: '0.9.1',
    date: '2026-11-11',
    title: 'Ta plaque dans la barre latérale',
    items: [
      ['better', "Ta plaque nominative s'affiche aussi derrière ton profil, en bas de la barre latérale, et s'anime au survol."],
    ],
  },
  {
    version: '0.9.0',
    date: '2026-11-11',
    title: 'Plaques nominatives',
    items: [
      ['new', "Plaques nominatives : un décor animé à droite de ton nom dans la liste d'amis de tes amis. 9 plaques : Sakura, Voxel, Néon, Aurore, Flammes, Océan, Galaxie, Pixels et Or."],
      ['new', "Les plaques s'animent quand la souris passe sur la ligne."],
      ['better', "Éditeur de profil : aperçu de ta ligne dans la liste d'amis, en plus de la carte de profil."],
    ],
  },
  {
    version: '0.8.1',
    date: '2026-11-11',
    title: 'Badges et bouton Enregistrer',
    items: [
      ['new', "Badges avec icônes : Dev, Vérifié, Premium et Pionnier, sur la carte de profil et à côté du nom."],
      ['new', "Badge Vérifié automatique pour les comptes vérifiés par Roblox."],
      ['fix', "Éditeur de profil : le bouton « Enregistrer » reste toujours visible en bas, avec un rappel « Modifications non enregistrées ». Ctrl+S enregistre aussi."],
      ['fix', "Les cadres d'avatar s'affichent aussi sur les avatars sans image."],
    ],
  },
  {
    version: '0.8.0',
    date: '2026-11-11',
    title: 'Profil personnalisable',
    items: [
      ['new', "Profil Voksy : statut perso (émojis compris), bio, bannière voxel, couleur et cadre d'avatar, jeu favori."],
      ['new', "Carte de profil : clique sur un ami (ou sur « Profil » dans la discussion) pour voir son profil, lui écrire ou rejoindre sa partie."],
      ['new', "Badge « Pionnier » pour les joueurs arrivés pendant la bêta."],
      ['better', "Dans la liste d'amis, le statut perso de chacun s'affiche sous son nom."],
      ['better', "Tes amis voient tes changements de profil tout de suite, sans recharger."],
    ],
  },
  {
    version: '0.7.0',
    date: '2026-11-11',
    title: 'Amis Voksy en ligne',
    items: [
      ['new', "Amis Voksy en ligne : le serveur d'amis tourne maintenant sur Internet. Tes amis peuvent t'ajouter par ton pseudo Roblox, discuter avec toi et voir à quoi tu joues."],
      ['better', "Connexion Roblox : après l'autorisation dans le navigateur, clique sur « Ouvrir Voksy » et c'est fini."],
      ['better', "Nouveau serveur : reconnecte-toi une fois avec Roblox dans Amis."],
    ],
  },
  {
    version: '0.6.0',
    date: '2026-11-10',
    title: 'Réglages plus clairs et statut Discord',
    items: [
      ['better', "Réglages rangés en 6 groupes : Général, Apparence, Son, En jeu, Social et Roblox. Le sommaire en haut t'emmène directement au bon endroit."],
      ['new', 'Recherche dans les réglages : tape un mot (« FPS », « musique », « thème »…) ou fais Ctrl+F.'],
      ['new', 'Statut Discord « Browsing games » quand Voksy est ouvert sans jeu lancé.'],
      ['new', 'Statut Discord « AFK in Voksy launcher » après 5 minutes sans toucher au PC.'],
      ['better', 'Option « Statut quand je ne joue pas » dans le plugin Discord, et raccourci vers ce plugin depuis Réglages › Social.'],
    ],
  },
  {
    version: '0.5.0',
    date: '2026-11-10',
    title: 'Musique de fond',
    items: [
      ['new', 'Musique de fond composée en direct par Voksy, en trois ambiances originales : Chill, Espace et Arcade.'],
      ['new', 'Ma musique : choisis ton propre fichier (MP3, OGG, WAV, M4A, AAC ou FLAC).'],
      ['new', 'Bouton ♪ dans la barre du haut pour couper ou remettre la musique, et réglage du volume dans Réglages › Musique.'],
      ['better', 'La musique se met en pause pendant que tu joues à Roblox et quand Voksy est réduit, avec un fondu.'],
    ],
  },
  {
    version: '0.4.1',
    date: '2026-11-10',
    title: 'Effet au clic',
    items: [
      ['new', "Effet au clic : une onde ronde s'ouvre sous la souris, avec un halo doux et quelques points qui s'éloignent, aux couleurs de ton thème."],
      ['better', 'Réglages › Apparence › « Effet au clic » pour le couper.'],
    ],
  },
  {
    version: '0.4.0',
    date: '2026-11-10',
    title: 'Éditeur de thème',
    items: [
      ['new', "Mon thème : choisis l'accent, le fond, le texte et l'arrondi des coins. Voksy se recolore en direct pendant que tu règles."],
      ['new', "Image de fond : mets ta propre image derrière Voksy et règle son assombrissement."],
      ['new', 'Code de thème : copie le tien pour tes amis, ou colle le leur pour essayer leurs couleurs.'],
      ['better', "Un indicateur de lisibilité te prévient si le texte ou l'accent ressortent mal."],
      ['better', "L'écran de démarrage, le curseur et sa traînée prennent les couleurs de ton thème."],
    ],
  },
  {
    version: '0.3.1',
    date: '2026-11-10',
    title: 'Statut Discord aux couleurs de Voksy',
    items: [
      ['better', "Statut Discord : le logo Voksy s'affiche à la place de l'icône du jeu. Le nom du jeu, le serveur et le bouton « Rejoindre » ne changent pas."],
      ['fix', "Mises à jour : « Rechercher » affiche « Recherche… » pendant la vérification, et une même notification ne s'empile plus."],
    ],
  },
  {
    version: '0.3.0',
    date: '2026-11-10',
    title: 'Démarrage animé et mises à jour automatiques',
    items: [
      ['new', "Écran de démarrage : le V de Voksy se construit en blocs pendant le chargement, aux couleurs de ton thème."],
      ['new', 'Mises à jour automatiques : Voksy vérifie au démarrage puis toutes les 4 heures, et télécharge les nouvelles versions en arrière-plan.'],
      ['new', 'Bouton « Redémarrer » dans la barre du haut quand une mise à jour est prête : installation en quelques secondes, sans fenêtre d’installation.'],
      ['better', "Réglages › Mises à jour : rechercher à la main, suivre le téléchargement, couper l'installation automatique."],
      ['better', "Les animations de la page d'accueil démarrent quand Voksy apparaît, plus derrière l'écran de chargement."],
    ],
  },
  {
    version: '0.2.2',
    date: '2026-11-10',
    title: 'Notes de mise à jour',
    items: [
      ['new', 'Cette fenêtre : après chaque mise à jour, Voksy te montre ce qui a changé.'],
      ['new', 'Les notes de toutes les versions restent disponibles dans Réglages, section Mises à jour.'],
    ],
  },
  {
    version: '0.2.1',
    date: '2026-11-10',
    title: 'Raccourci en jeu plus fiable',
    items: [
      ['fix', "Voksy s'affiche bien par-dessus Roblox en plein écran : Roblox reste en plein écran sans bordure tant que le raccourci est activé."],
      ['better', "Avec deux écrans, Voksy s'ouvre sur celui du jeu."],
      ['better', "Fondu à l'ouverture et au retour au jeu."],
      ['better', 'Le raccourci ramène aussi au jeu quand Voksy est déjà au premier plan.'],
      ['better', 'Le raccourci marche quelques secondes après le lancement, sans attendre.'],
    ],
  },
  {
    version: '0.2.0',
    date: '2026-11-10',
    title: 'Nouvelle interface',
    items: [
      ['new', 'Raccourci en jeu (Alt+T par défaut, modifiable) : ouvre Voksy par-dessus Roblox pendant une partie.'],
      ['new', 'Curseur Voksy aux couleurs du thème, avec une traînée de blocs quand la souris bouge.'],
      ['new', 'Identité visuelle « Voxel » : scènes en blocs, nouvelles couleurs, polices Montserrat et Inter.'],
      ['new', 'Recherche dans la barre du haut (Ctrl+K) et raccourcis clavier : Ctrl+1 à 8 pour les pages, Alt+← pour revenir.'],
      ['better', 'Navigation : barre latérale regroupée, indicateur animé, retour en arrière, sommaire dans les Réglages.'],
      ['better', "Animations partout (pages, fenêtres, statistiques), avec un réglage pour les couper ou suivre Windows."],
      ['better', 'Chargements et pages vides plus clairs, défilement des listes avec des flèches.'],
    ],
  },
  {
    version: '0.1.0',
    date: '2026-11-09',
    title: 'Première version',
    items: [
      ['new', 'Voksy installe et met à jour Roblox lui-même, et lance tes jeux en un clic.'],
      ['new', 'Favoris, jeux récents, retour sur ton dernier serveur et statistiques de temps de jeu.'],
      ['new', 'Amis Voksy : chat, groupes, invitations et bouton « Rejoindre ».'],
      ['new', 'Réglages client (FastFlags) avec des profils, y compris un profil par jeu.'],
      ['new', 'Mods (curseur, son de mort, police) et plugins : Discord, multi-instance, overlay FPS et ping, mode streamer.'],
      ['new', '6 thèmes pour l’interface.'],
    ],
  },
];
