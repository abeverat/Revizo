// ── NATURE DES MOTS ──
const natureQuestions = [
    // ─── Noms ───
    { level: "ce2", sentence: "Le <span class='highlight'>chat</span> dort sur le canapé.", answer: "nom", choices: ["nom", "verbe", "adjectif", "adverbe"], explanation: "« Chat » désigne un animal, c'est un nom commun." },
    { level: "ce2", sentence: "La <span class='highlight'>liberté</span> est une valeur importante.", answer: "nom", choices: ["nom", "verbe", "adjectif", "adverbe"], explanation: "« Liberté » est un nom commun abstrait." },
    { level: "ce2", sentence: "Mon <span class='highlight'>frère</span> joue au football.", answer: "nom", choices: ["nom", "verbe", "adjectif", "déterminant"], explanation: "« Frère » désigne une personne, c'est un nom commun." },
    { level: "ce2", sentence: "Les <span class='highlight'>fleurs</span> du jardin sont magnifiques.", answer: "nom", choices: ["nom", "adjectif", "verbe", "pronom"], explanation: "« Fleurs » est un nom commun désignant des végétaux." },
    { level: "ce2", sentence: "Elle a fait preuve de <span class='highlight'>courage</span>.", answer: "nom", choices: ["nom", "verbe", "adjectif", "adverbe"], explanation: "« Courage » est un nom commun abstrait." },
    { level: "ce2", sentence: "Le <span class='highlight'>soleil</span> brille dans le ciel.", answer: "nom", choices: ["nom", "verbe", "adjectif", "adverbe"], explanation: "« Soleil » est un nom commun." },
    { level: "ce2", sentence: "Cette <span class='highlight'>histoire</span> est passionnante.", answer: "nom", choices: ["nom", "adjectif", "verbe", "pronom"], explanation: "« Histoire » est un nom commun." },
    { level: "ce2", sentence: "Il a posé son <span class='highlight'>cartable</span> à l'entrée.", answer: "nom", choices: ["nom", "verbe", "adjectif", "préposition"], explanation: "« Cartable » est un nom commun désignant un objet." },

    // ─── Verbes ───
    { level: "ce2", sentence: "Le chien <span class='highlight'>court</span> dans le parc.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "adverbe"], explanation: "« Court » est le verbe courir conjugué au présent." },
    { level: "ce2", sentence: "Elle <span class='highlight'>chante</span> une jolie chanson.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "adverbe"], explanation: "« Chante » est le verbe chanter conjugué au présent." },
    { level: "ce2", sentence: "Nous <span class='highlight'>apprenons</span> une nouvelle leçon.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "pronom"], explanation: "« Apprenons » est le verbe apprendre au présent." },
    { level: "ce2", sentence: "Les enfants <span class='highlight'>jouent</span> dans la cour.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "adverbe"], explanation: "« Jouent » est le verbe jouer conjugué au présent." },
    { level: "ce2", sentence: "Tu <span class='highlight'>réfléchis</span> avant de répondre.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "adverbe"], explanation: "« Réfléchis » est le verbe réfléchir au présent." },
    { level: "ce2", sentence: "Il <span class='highlight'>peint</span> un beau tableau.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "préposition"], explanation: "« Peint » est le verbe peindre au présent." },
    { level: "ce2", sentence: "Vous <span class='highlight'>lisez</span> un roman passionnant.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "pronom"], explanation: "« Lisez » est le verbe lire au présent." },
    { level: "ce2", sentence: "Je <span class='highlight'>dessine</span> un paysage.", answer: "verbe", choices: ["verbe", "nom", "adjectif", "adverbe"], explanation: "« Dessine » est le verbe dessiner au présent." },

    // ─── Adjectifs ───
    { level: "ce2", sentence: "Une <span class='highlight'>grande</span> maison se dresse au bout de la rue.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Grande » qualifie le nom « maison », c'est un adjectif." },
    { level: "ce2", sentence: "Il porte un pull <span class='highlight'>bleu</span>.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Bleu » décrit la couleur du pull, c'est un adjectif." },
    { level: "ce2", sentence: "Ce problème est très <span class='highlight'>difficile</span>.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Difficile » qualifie le nom « problème », c'est un adjectif." },
    { level: "ce2", sentence: "Elle a une voix <span class='highlight'>douce</span>.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Douce » qualifie le nom « voix »." },
    { level: "ce2", sentence: "Le gâteau est <span class='highlight'>délicieux</span>.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Délicieux » qualifie le nom « gâteau »." },
    { level: "ce2", sentence: "Un vent <span class='highlight'>glacial</span> souffle ce matin.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Glacial » qualifie le nom « vent »." },
    { level: "ce2", sentence: "Les routes sont <span class='highlight'>glissantes</span> après la pluie.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Glissantes » qualifie le nom « routes »." },
    { level: "ce2", sentence: "C'est une réponse <span class='highlight'>correcte</span>.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Correcte » qualifie le nom « réponse »." },
    { level: "ce2", sentence: "Il a un regard <span class='highlight'>malicieux</span>.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "pronom"], explanation: "« Malicieux » qualifie le nom « regard »." },
    { level: "ce2", sentence: "La mer est <span class='highlight'>calme</span> aujourd'hui.", answer: "adjectif", choices: ["adjectif", "nom", "verbe", "adverbe"], explanation: "« Calme » qualifie le nom « mer »." },

    // ─── Adverbes ───
    { level: "cm1", sentence: "Elle chante <span class='highlight'>bien</span>.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "verbe"], explanation: "« Bien » modifie le verbe « chante », c'est un adverbe." },
    { level: "cm1", sentence: "Il court <span class='highlight'>vite</span>.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "verbe"], explanation: "« Vite » modifie le verbe « court », c'est un adverbe." },
    { level: "cm1", sentence: "Nous partirons <span class='highlight'>demain</span>.", answer: "adverbe", choices: ["adverbe", "nom", "adjectif", "verbe"], explanation: "« Demain » indique le temps, c'est un adverbe." },
    { level: "cm1", sentence: "Le chat mange <span class='highlight'>beaucoup</span>.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "verbe"], explanation: "« Beaucoup » indique la quantité, c'est un adverbe." },
    { level: "cm1", sentence: "Il parle <span class='highlight'>doucement</span>.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "verbe"], explanation: "« Doucement » modifie le verbe « parle », c'est un adverbe en -ment." },
    { level: "cm1", sentence: "Elle est <span class='highlight'>très</span> contente.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "pronom"], explanation: "« Très » modifie l'adjectif « contente », c'est un adverbe d'intensité." },
    { level: "cm1", sentence: "Nous irons <span class='highlight'>ailleurs</span>.", answer: "adverbe", choices: ["adverbe", "nom", "adjectif", "préposition"], explanation: "« Ailleurs » indique le lieu, c'est un adverbe." },
    { level: "cm1", sentence: "Il a <span class='highlight'>souvent</span> raison.", answer: "adverbe", choices: ["adverbe", "nom", "adjectif", "verbe"], explanation: "« Souvent » indique la fréquence, c'est un adverbe." },
    { level: "cm1", sentence: "Le travail est <span class='highlight'>presque</span> fini.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "conjonction"], explanation: "« Presque » modifie l'adjectif « fini », c'est un adverbe." },
    { level: "cm1", sentence: "Il mange <span class='highlight'>lentement</span> son repas.", answer: "adverbe", choices: ["adverbe", "adjectif", "nom", "verbe"], explanation: "« Lentement » modifie le verbe « mange », adverbe en -ment." },

    // ─── Déterminants ───
    { level: "ce2", sentence: "<span class='highlight'>Les</span> oiseaux chantent au printemps.", answer: "déterminant", choices: ["déterminant", "pronom", "nom", "adverbe"], explanation: "« Les » est un article défini pluriel, c'est un déterminant." },
    { level: "ce2", sentence: "J'ai vu <span class='highlight'>trois</span> étoiles filantes.", answer: "déterminant", choices: ["déterminant", "nom", "adjectif", "adverbe"], explanation: "« Trois » indique le nombre, c'est un déterminant numéral." },
    { level: "ce2", sentence: "<span class='highlight'>Mon</span> chien s'appelle Rex.", answer: "déterminant", choices: ["déterminant", "pronom", "adjectif", "nom"], explanation: "« Mon » est un déterminant possessif." },
    { level: "ce2", sentence: "Il a mangé <span class='highlight'>une</span> pomme.", answer: "déterminant", choices: ["déterminant", "pronom", "adjectif", "nom"], explanation: "« Une » est un article indéfini, c'est un déterminant." },
    { level: "ce2", sentence: "<span class='highlight'>Cette</span> maison est ancienne.", answer: "déterminant", choices: ["déterminant", "pronom", "adjectif", "nom"], explanation: "« Cette » est un déterminant démonstratif." },
    { level: "ce2", sentence: "<span class='highlight'>Quelques</span> élèves sont absents.", answer: "déterminant", choices: ["déterminant", "pronom", "adverbe", "adjectif"], explanation: "« Quelques » est un déterminant indéfini." },
    { level: "ce2", sentence: "<span class='highlight'>Chaque</span> enfant a reçu un cadeau.", answer: "déterminant", choices: ["déterminant", "pronom", "adjectif", "adverbe"], explanation: "« Chaque » est un déterminant indéfini singulier." },

    // ─── Pronoms ───
    { level: "cm1", sentence: "<span class='highlight'>Il</span> part à l'école à pied.", answer: "pronom", choices: ["pronom", "déterminant", "nom", "adverbe"], explanation: "« Il » remplace un nom masculin singulier, c'est un pronom personnel." },
    { level: "cm1", sentence: "Pierre a un vélo, <span class='highlight'>le mien</span> est rouge.", answer: "pronom", choices: ["pronom", "déterminant", "nom", "adjectif"], explanation: "« Le mien » remplace « mon vélo », c'est un pronom possessif." },
    { level: "cm1", sentence: "<span class='highlight'>Celle-ci</span> est plus grande que celle-là.", answer: "pronom", choices: ["pronom", "déterminant", "nom", "adjectif"], explanation: "« Celle-ci » remplace un nom féminin, c'est un pronom démonstratif." },
    { level: "cm1", sentence: "J'ai deux chats, <span class='highlight'>les deux</span> sont noirs.", answer: "pronom", choices: ["pronom", "déterminant", "nom", "adverbe"], explanation: "« Les deux » reprend « deux chats », c'est un pronom." },
    { level: "cm1", sentence: "La fille <span class='highlight'>qui</span> parle est ma voisine.", answer: "pronom", choices: ["pronom", "conjonction", "déterminant", "adverbe"], explanation: "« Qui » reprend « la fille » et introduit la relative, c'est un pronom relatif." },
    { level: "cm1", sentence: "<span class='highlight'>Nous</span> partons en vacances demain.", answer: "pronom", choices: ["pronom", "déterminant", "nom", "adverbe"], explanation: "« Nous » est un pronom personnel sujet." },
    { level: "cm1", sentence: "<span class='highlight'>Personne</span> n'a répondu à la question.", answer: "pronom", choices: ["pronom", "nom", "adverbe", "adjectif"], explanation: "« Personne » est ici un pronom indéfini (≠ une personne)." },
    { level: "cm1", sentence: "Tu veux <span class='highlight'>celui</span> en bleu ou en rouge ?", answer: "pronom", choices: ["pronom", "déterminant", "nom", "adjectif"], explanation: "« Celui » est un pronom démonstratif." },

    // ─── Prépositions ───
    { level: "cm2", sentence: "Le livre est <span class='highlight'>sur</span> la table.", answer: "préposition", choices: ["préposition", "adverbe", "conjonction", "déterminant"], explanation: "« Sur » introduit le complément de lieu, c'est une préposition." },
    { level: "cm2", sentence: "Il va <span class='highlight'>à</span> la piscine.", answer: "préposition", choices: ["préposition", "déterminant", "adverbe", "conjonction"], explanation: "« À » introduit le complément de lieu, c'est une préposition." },
    { level: "cm2", sentence: "Elle part <span class='highlight'>avec</span> ses amis.", answer: "préposition", choices: ["préposition", "adverbe", "conjonction", "pronom"], explanation: "« Avec » introduit un complément d'accompagnement, c'est une préposition." },
    { level: "cm2", sentence: "Le cadeau est <span class='highlight'>pour</span> toi.", answer: "préposition", choices: ["préposition", "adverbe", "conjonction", "pronom"], explanation: "« Pour » introduit le destinataire, c'est une préposition." },
    { level: "cm2", sentence: "Il habite <span class='highlight'>dans</span> une grande ville.", answer: "préposition", choices: ["préposition", "adverbe", "conjonction", "déterminant"], explanation: "« Dans » introduit le lieu, c'est une préposition." },
    { level: "cm2", sentence: "Le chat se cache <span class='highlight'>derrière</span> le canapé.", answer: "préposition", choices: ["préposition", "adverbe", "conjonction", "nom"], explanation: "« Derrière » introduit le lieu, c'est une préposition." },

    // ─── Conjonctions ───
    { level: "cm2", sentence: "Il est fatigué <span class='highlight'>mais</span> il continue.", answer: "conjonction", choices: ["conjonction", "préposition", "adverbe", "pronom"], explanation: "« Mais » relie deux propositions avec une opposition, c'est une conjonction de coordination." },
    { level: "cm2", sentence: "Tu veux du thé <span class='highlight'>ou</span> du café ?", answer: "conjonction", choices: ["conjonction", "préposition", "adverbe", "pronom"], explanation: "« Ou » propose un choix entre deux éléments, c'est une conjonction de coordination." },
    { level: "cm2", sentence: "Je reste à la maison <span class='highlight'>car</span> il pleut.", answer: "conjonction", choices: ["conjonction", "préposition", "adverbe", "nom"], explanation: "« Car » introduit la cause, c'est une conjonction de coordination." },
    { level: "cm2", sentence: "Il est parti <span class='highlight'>quand</span> la cloche a sonné.", answer: "conjonction", choices: ["conjonction", "adverbe", "préposition", "pronom"], explanation: "« Quand » introduit une proposition temporelle, c'est une conjonction de subordination." },
];
