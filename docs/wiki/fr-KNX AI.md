---
layout: wiki
title: "KNX AI"
lang: fr
permalink: /wiki/fr-KNX%20AI
---
Ce nœud écoute **tous les télégrammes KNX** du gateway KNX Ultimate sélectionné, produit des statistiques de trafic, détecte des anomalies et peut interroger un LLM de façon optionnelle.

L'éditeur utilise deux onglets horizontaux : **Assistant IA** contient la configuration, les connaissances/le contexte et les limites du fournisseur ; **Conversations et maison** contient les canaux de chat, la maison proactive et la mémoire limitée.

## Sorties
1. **Résumé/Stats** (`msg.payload` JSON)
2. **Anomalies** (`msg.payload` JSON)
3. **Assistant IA** (`msg.payload` texte, avec `msg.summary`)
4. **Opérations KNX** (un message Universal Mode par lecture ou écriture validée)

Chaque message émis par les sorties 3 et 4 contient également une copie du message d'entrée original dans `msg.inputMessage`. Le payload, le topic, les métadonnées du chat et toutes les autres propriétés d'entrée restent ainsi disponibles pour les nœuds suivants. Les erreurs de clonage ou d'envoi sont interceptées et signalées sans se propager au runtime Node-RED.

## Commandes (entrée)
Envoyez `msg.topic` :
- `summary` (ou vide) : envoie le résumé immédiatement
- `reset` : efface l'historique, les compteurs, la mémoire domestique apprise et tous les contextes de chat persistants ; l'Éducation de l'IA reste inchangée
- `ask` : envoie une question au LLM configuré
- `confirm` / `cancel` : confirme ou annule les commandes KNX en attente sans rappeler le LLM
- `clear_chat` : efface les échanges récents, les instructions persistantes et les commandes en attente de la session courante

Pour `ask`, mettez la question dans `msg.prompt` (recommandé), `msg.payload` (chaîne), ou les champs Telegram courants `msg.payload.content` / `msg.payload.text`.

Si le traitement dure plus de 1,2 seconde, la sortie 3 émet immédiatement le message intermédiaire localisé « Je réfléchis… », avec `msg.knxAi.type = "thinking"` et `msg.knxAi.transient = true`. L’adaptateur de chat l’envoie au même utilisateur, puis la réponse finale arrive normalement dès qu’elle est prête. Ce message de progression n’est jamais enregistré dans le contexte de conversation ni dans la mémoire apprise.

Les requêtes Ollama et Bionic LM Studio utilisent automatiquement un délai minimal de 10 minutes ; les fournisseurs cloud conservent un minimum de 2 minutes. Aucun champ de délai n’est à gérer dans l’éditeur. Si même la limite locale est atteinte, KNX AI indique que le modèle n’a pas terminé et conseille de réessayer ou de réduire le contexte du prompt.

L’état du nœud sur le canvas est volontairement réservé à la dernière demande reçue et au message localisé « Je réfléchis… » pendant l’exécution du LLM. Les télégrammes KNX, mises à jour de la passerelle, débits de trafic, messages ready et résultats techniques ne l’écrasent jamais ; ils restent disponibles via les sorties, les journaux et les données de l’Assistant.

Chaque session Ask/chat conserve ses 8 derniers échanges et jusqu'à 20 instructions à long terme choisies par le modèle, séparées par `msg.knxAi.sessionId`, `msg.sessionId` ou l’ID de chat Telegram détecté. Le modèle décide sémantiquement, grâce à l’outil de mémoire structurée, ce que le sens d’une conversation doit mémoriser ou oublier ; aucune liste de mots-clés ni d’intents linguistiques n’est utilisée. Tous les nœuds KNX AI utilisant le même stockage partagent ce contexte en direct et le rechargent après un redémarrage de Node-RED depuis `knxultimatestorage/knxai/memory/knxai-chat-context.md`. Le fichier, écrit de façon atomique, est limité à 50 sessions et 512 Ko. Lorsque le contrôle KNX est activé, reliez la sortie 3 au nœud d'envoi du chat et la sortie 4 à un nœud KNX Ultimate en **mode universel**. Avec la confirmation active, la première réponse affiche GA, DPT et payload sans émettre d’écriture ; la même session doit répondre `CONFIRMER` ou `ANNULER` dans les 5 minutes. Une nouvelle demande remplace tout plan précédent. Chaque commande confirmée contient `msg.destination`, `msg.dpt`, `msg.payload` et `msg.event = "GroupValue_Write"`.
Pour les écritures DPT 1.xxx, les équivalents sûrs produits par l’IA `true`/`false`, `1`/`0` et `on`/`off` sont normalisés en véritables booléens avant la validation locale et la sortie.

### Lectures KNX actualisées
Lorsque l’utilisateur demande explicitement un état actuel ou actualisé, l’IA peut interroger les objets exacts du catalogue ETS importé, y compris les objets d’état et autres objets en lecture seule. La sortie 4 émet `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` et `msg.readstatus = true`. Le nœud attend jusqu’à 6 secondes chaque `GroupValue_Response` ou écriture récente, puis renvoie les valeurs décodées sur la sortie 3 et les détails dans `msg.knxAi.readResults`. Les lectures ne nécessitent jamais de confirmation et ne sont jamais transformées en écritures. Si un petit modèle local omet le type d’opération et le payload, les objets ETS exacts sont normalisés en toute sécurité comme lectures ; un élément contenant un payload reste une écriture validée.

### Routines conversationnelles multi-étapes
Des demandes comme « Je pars », « Bonne nuit » ou « Mode cinéma » peuvent coordonner une routine tenant compte de l’état courant sans nouvelle option dans l’éditeur. Au premier passage LLM, seules les lectures ETS exactes sont acceptées (20 au maximum) ; KNX AI les envoie puis fournit les résultats actualisés GA/DPT/valeur à un second passage de planification isolé. Celui-ci peut préparer jusqu’à 12 écritures validées, sans lancer un nouveau cycle de lecture. Lorsque la confirmation est active, le plan complet ne demande qu’une confirmation localisée et aucune écriture ni annonce TTS demandée n’est émise auparavant. Après confirmation, chaque écriture est revalidée, transmise dans l’ordre et observée jusqu’à 4 secondes pour détecter un retour immédiat correspondant sur le bus. La réponse finale distingue les retours observés des opérations sans retour immédiat, sans déclarer pour autant une panne de l’appareil. Les détails figurent dans `msg.knxAi.routine`, `readResults`, `verifiedCount` et `unverifiedCount`.

### Demande de confirmation pour les boutons du chat
Lorsqu'un plan est en attente, la sortie 3 contient `msg.knxAi.confirmationRequest`. L'objet comprend `required`, `status`, `sessionId`, `expiresAt`, `commandCount` et deux éléments dans `actions`. Utilisez `action.label` comme texte du bouton Telegram, `action.callbackData` comme callback et renvoyez `action.message` à KNX AI pour confirmer ou annuler sans saisir de texte.

### Préréglages d’adaptateur de chat
L’onglet **Adaptateurs de chat** charge ses mappages sélectionnables depuis `resources/KNXAIChatAdapterMappings.js`. Le choix d’un préréglage installe en interne deux mappages JavaScript synchrones prédéfinis : un avant le traitement de l’entrée par KNX AI et un avant l’émission sur la sortie 3. Les mappages restent masqués dans l’éditeur. Les erreurs de syntaxe et d’exécution sont interceptées et signalées sans arrêter Node-RED.

Le préréglage inclus **windkh/node-red-contrib-telegrambot** suit le contrat receiver/sender du paquet. Connectez directement un `telegram receiver` à KNX AI et la sortie 3 à un `telegram sender`. Pour les boutons de confirmation inline, connectez aussi un `telegram event` configuré pour `callback_query` à la même entrée KNX AI. Le mappage d’entrée extrait `msg.payload.content`, `msg.payload.chatId` et la langue Telegram. Le mappage de sortie crée `msg.payload.chatId`, `type` et `content`, puis ajoute `options.reply_markup` depuis `msg.knxAi.confirmationRequest` lorsqu’une écriture attend confirmation. Le paquet Telegram reste une dépendance optionnelle distincte.

Le préréglage inclus **RedBot / node-red-contrib-chatbot (Telegram)** suit le format de message commun de RedBot. Connectez directement `chatbot-telegram-receive` à KNX AI et la sortie 3 à `chatbot-telegram-send` ; aucun nœud de callback séparé n’est nécessaire, car RedBot convertit les postbacks des boutons inline en messages entrants ordinaires. Le mappage d’entrée lit `transport`, `chatId`, `type`, `content` et la langue Telegram. Le mappage de sortie conserve les données de suivi RedBot `originalMessage`, `chat`, `api` et `client`, puis émet soit un payload `message`, soit un payload `inline-buttons` avec des actions `postback` de confirmation. RedBot reste une dépendance optionnelle distincte.

### Adaptateurs de caméra détectés automatiquement
Les paquets de caméra installés peuvent publier à l’exécution un adaptateur pour KNX AI. Il n’existe aucun sélecteur ni nœud caméra à relier à KNX AI : les adaptateurs, contrôleurs et caméras disponibles sont détectés automatiquement et ajoutés au contexte du chat. `node-red-contrib-unifi-ultimate` est le premier fournisseur pris en charge ; d’autres paquets, tels que `hikvision-ultimate`, peuvent s’enregistrer avec le même contrat indépendant du fabricant.

L’utilisateur peut demander une capture actuelle ou demander au modèle de vision ce qui est visible. Les préréglages Telegram et RedBot envoient l’image comme photo native avec une légende. L’utilisateur peut aussi créer des notifications persistantes pour un mouvement, le franchissement d’une ligne intelligente ou l’entrée dans une zone d’intrusion/de stationnement, avec une limitation facultative aux personnes détectées et à une ligne ou zone nommée précise. Ces règles sont stockées dans le même fichier `knxai-chat-context.md` et restaurées après les redémarrages de Node-RED. Les abonnements aux événements UniFi et les demandes de capture passent directement par le fournisseur détecté ; la sortie 4 de KNX AI et un câblage intermédiaire ne sont pas nécessaires.

Chaque événement publié par un adaptateur détecté automatiquement est normalisé puis ajouté à un fichier quotidien `YYYY-MM-DD.jsonl` sous `knxultimatestorage/knxai/adapter-history/<id-nœud>/`. L’archive conserve 10 jours, garantit plus de 24 heures d’historique et stocke les métadonnées, mais pas les images. L’Assistant web et tous les canaux CHAT l’interrogent avec l’archive quotidienne KNX. Les totaux couvrent toutes les lignes stockées ; les détails sélectionnés ne sont qu’un échantillon pertinent.

### Annonces avec TTS Ultimate
Lorsque le paquet facultatif `node-red-contrib-tts-ultimate` est installé, il apparaît parmi les adaptateurs détectés automatiquement. Le sélecteur recense tous les nœuds `ttsultimate` de tous les flows du projet, avec le flow, le nom du nœud et le lecteur configuré. Sélectionnez le nœud chargé des annonces du chat, puis déployez le flow.

Le modèle décide d’utiliser cet adaptateur en raisonnant sur la demande actuelle, les instructions persistantes du chat et l’Éducation IA gérée par l’utilisateur ; il n’existe ni intent d’annonce ni liste de phrases déclencheuses. Les valeurs KNX, événements d’adaptateur, images et archives restent des données et non des instructions, mais les consignes fiables de l’utilisateur peuvent apprendre au modèle comment agir sur ces données. KNX AI envoie le texte choisi directement au nœud dans `msg.payload`, avec `msg.topic = "knx_ai_announcement"`. TTS Ultimate gère ensuite le lecteur Sonos, la voix, le volume, le signal et la file d’attente.

### Aperçu du contexte du chat
L’éditeur du nœud affiche une carte compacte résumant les sources disponibles pour le chat : trafic KNX actuel, sémantique ETS et projet Node-RED, mémoire de session et de la maison, Éducation IA et caméras détectées. Elle affiche aussi le contexte opérationnel maximal et la taille UTF-8 réelle du dernier prompt du chat ; les jetons d’entrée exacts du fournisseur sont utilisés lorsqu’ils sont fournis, sinon leur nombre est signalé comme estimé. Elle répertorie aussi `knxai-chat-context.md`, `knxai-home-memory.md` et `knxai-config-<id-nœud>.json`, ainsi que la racine absolue de l’archive des télégrammes KNX, le dossier propre au nœud et le format quotidien `YYYY-MM-DD.jsonl`. Les chemins sont déterminés à l’exécution depuis le répertoire de données réellement utilisé par la passerelle configurée.

Le modèle reçoit les lectures/écritures KNX, les adaptateurs caméra, les annonces TTS et la mémoire persistante comme outils structurés. Il peut les sélectionner et les combiner sémantiquement à partir de la demande actuelle et des consignes fiables apprises, sans routage par intents linguistiques. Le runtime ne valide que les arguments, la disponibilité des adaptateurs et les limites de sécurité ; les écritures KNX conservent la validation ETS/DPT locale et la confirmation configurée.

### Rôles appris des adresses de groupe KNX
Le rôle `neutral` représente une incertitude initiale, pas une interdiction permanente de commande. Le modèle peut utiliser l’outil structuré `gaRoleActions` pour apprendre qu’une adresse de groupe ETS exacte est un objet de commande, d’état ou neutre à partir d’un enseignement fiable de l’utilisateur, de consignes persistantes du chat, de l’Éducation IA ou d’une sémantique non équivoque du projet ETS. Aucun mot-clé ni intent de rôle n’est requis ; si les preuves sont ambiguës, le modèle demande une précision au lieu d’apprendre.

Le rôle, la justification et la preuve appris sont enregistrés par nœud dans `<userDir>/knxai/config/knxai-config-<id-nœud>.json` et synchronisés dans la mémoire sémantique domestique limitée. Un rôle appris comme `command` peut valider une écriture dans la même réponse et reste disponible après redémarrage ; le modèle peut aussi l’oublier et rétablir la classification automatique. L’apprentissage ne peut pas inventer une GA, modifier son DPT ETS, contourner la validation du payload ni ignorer la confirmation d’écriture configurée.

## Intelligence domestique proactive guidée par l’Éducation et mémoire limitée
À partir de la hiérarchie ETS, des noms, rôles et DPT, le nœud crée un modèle sémantique déterministe. Il n’existe ni interrupteur séparé ni paramètres proactifs avancés. Une notification n’est évaluée que si le LLM est actif et si **Éducation IA** la demande explicitement. L’Éducation définit seule les conditions, la durée, les heures silencieuses et la répétition. Sans règle explicite, ou si le LLM ne peut pas l’évaluer, aucun message n’est envoyé.

La dernière session de chat est mémorisée comme propriétaire et reçoit les messages spontanés. La sortie 3 émet `msg.knxAi.type = "proactive_notification"` et `msg.inputMessage` conserve la session pour l’adaptateur de chat. Une limite stricte de trois notifications proactives par heure évite les rafales. La sortie 4 n’est jamais utilisée de façon proactive et KNX n’est jamais modifié de manière autonome.

La référence apprise partagée est chargée au démarrage depuis `<userDir>/knxai/memory/knxai-home-memory.md`, réécrite atomiquement toutes les 15 minutes et toujours strictement limitée à 5 Mo. Elle conserve au maximum 120 observations importantes, 80 habitudes agrégées, 80 notifications et 300 objets ETS sémantiques, jamais un flux illimité de télégrammes bruts. Les éléments anciens et moins prioritaires sont supprimés en premier. **Éducation IA** est limitée à 16 000 caractères et provient toujours de la configuration du nœud : l’IA peut la lire comme une consigne faisant autorité, mais ne peut ni la modifier ni l’écraser. Si cette Éducation est présente mais que le LLM ne peut pas l’évaluer, la notification candidate est supprimée plutôt que de risquer de la contredire.

## Exemple pratique de configuration
Placez toute la politique de notification dans **Éducation IA** (`aiEducation`) :

```text
Appelle-moi Alex et réponds dans la même langue que moi.
Réponds brièvement, sauf si je demande des détails techniques.
Préviens mon dernier chat lorsqu’un volet, une fenêtre ou une porte reste ouvert au moins 120 minutes.
Ne me préviens pas entre 23:00 et 07:00 et ne répète pas la même alerte avant six heures.
Le volet du bureau peut rester ouvert le jour : ne m’envoie pas de notification.
Si « lumière du salon » est ambigu, demande-moi quel éclairage je veux dire.
N’affirme jamais qu’un actionneur a changé avant confirmation par un objet d’état KNX.
```

Avec ces réglages, la sortie 3 peut émettre une `proactive_notification` localisée après 120 minutes pour le volet du salon, tandis que l’Éducation supprime la notification du volet du bureau. Si Alex demande ensuite de fermer le volet du salon, KNX AI prépare la commande ETS exacte, mais conserve la validation et la confirmation normales avant la sortie 4.

Utilisez des hiérarchies et noms d’objet ETS explicites, avec des rôles état/commande corrects. L’Éducation personnalise les décisions et la formulation, mais ne peut ni inventer une adresse de groupe, ni changer un DPT, ni contourner la validation KNX.

## Workflow rapide : contrôle KNX
1. Importez le CSV ETS dans la passerelle et configurez le fournisseur, le modèle et les identifiants LLM.
2. Activez **Assistant LLM** et **lecture des états KNX et commande des actionneurs** ; laissez la confirmation activée.
3. Connectez l'entrée du chat à KNX AI en conservant un identifiant de session/chat stable.
4. Connectez la sortie 3 à la réponse du chat et la sortie 4 à KNX Ultimate en **mode universel**.
5. L'utilisateur envoie une demande ; les états actuels sont lus immédiatement, tandis que les écritures affichent d'abord GA, DPT et valeur sans écrire sur le bus.
6. Dans les 5 minutes, le même chat répond exactement `CONFIRMER` ou `ANNULER`.
7. Seul `CONFIRMER` revalide et émet les commandes sur la sortie 4 ; vérifiez l'exécution avec une GA d'état KNX.

## Champs de configuration
Voici tous les champs tels qu'affichés dans l'éditeur KNX AI.

### Général
- **Gateway** : gateway/config node KNX Ultimate utilisé comme source des télégrammes.
- **Name** : nom du nœud et titre du dashboard.
- **Topic** : topic de base utilisé dans les sorties.
- Bouton **Open KNX AI Web** : ouvre le dashboard web (`/knxUltimateAI/sidebar/page`).

### Assistant IA
- **Enable LLM assistant** : active les fonctions Ask/chat.
- **Provider** : backend LLM (OpenAI-compatible, Anthropic, Ollama ou Bionic LM Studio).
- **Endpoint URL** : URL endpoint chat/completions.
- **API key** : clé API (non requise avec Ollama local ; facultative pour Bionic LM Studio sauf si l’authentification du serveur est activée).
- **Model** : ID/nom du modèle.
- **Compatibilité du modèle de chat** : le modèle sélectionné doit prendre en charge l'endpoint Chat Completions configuré. Les anciens modèles réservés aux completions, comme `gpt-3.5-turbo-instruct`, sont exclus lors de l'actualisation de la liste. Si le fournisseur refuse une valeur de température personnalisée ou le paramètre de limite de tokens, KNX AI réessaie en supprimant ou remplaçant uniquement le champ incompatible.
- **Autoriser l’IA à lire les états KNX et commander les actionneurs** : active la sortie 4 et reste désactivé par défaut. Les objets exacts du catalogue ETS peuvent être lus ; seules les écritures vers des objets classés `command` sont acceptées. Les opérations inconnues, avec DPT discordant, invalides ou trop nombreuses, ainsi que les écritures vers des objets d'état ou neutres, sont rejetées localement.
- **Demander confirmation avant d’envoyer les commandes KNX** : activé par défaut. Affiche d'abord les modifications validées et n'émet aucune commande tant que la même session de chat ne les confirme pas. Lorsque des commandes attendent une confirmation, la réponse ajoute toujours les instructions exactes de confirmation ou d'annulation dans la langue de la demande courante. Les commandes sont à nouveau validées juste avant la sortie.
- **Préréglage d’adaptateur** : utilise **Aucun adaptateur** par défaut. La sélection charge la paire prédéfinie de mappages entrée/sortie ; les deux restent masqués dans l’éditeur.
- **Éducation de l’IA** : consignes autoritaires gérées uniquement par l'utilisateur, lues par l'IA et jamais modifiées. C’est le seul endroit où demander des notifications proactives et définir leurs conditions, durée, heures silencieuses et répétition.
- Les extraits fournis avec le paquet depuis l’aide, le README, le changelog, le wiki et les exemples ne sont pas inclus dans les prompts Telegram, RedBot ou CHAT personnalisés. Ils restent disponibles uniquement pour l’Assistant web lors des questions techniques sur le paquet.
- Bouton **Refresh** : interroge le provider et charge les modèles disponibles. Son icône tourne pendant le chargement ; une réussite ne produit volontairement aucun message.

### Démarrage rapide Ollama (local)
- Choisir **Provider = Ollama**.
- Endpoint par défaut : `http://localhost:11434/api/chat`.
- Si aucun modèle local n'est trouvé :
  - **1) Download model** : ouvre la page **Model library**.
  - **2) Install it** : télécharge et installe le modèle localement (ex. `llama3.1`).
- Pendant refresh/install, KNX AI tente aussi de démarrer automatiquement le serveur Ollama.
- Si l'installation échoue avec une erreur de connexion, vérifier qu'Ollama est lancé (app desktop ou `ollama serve`).
- Le contexte maximal déclaré par `/api/show` reste informatif. KNX AI envoie toujours `num_ctx = 16384` (ou le maximum du modèle s'il est inférieur) et utilise la même vue sémantique de 16K sélectionnée par pertinence, évitant une allocation KV cache surdimensionnée sans retirer de capacités à l'agent.
- Si Node-RED tourne dans Docker, utiliser `host.docker.internal` au lieu de `localhost` dans l'endpoint.

### Démarrage rapide Bionic LM Studio (local)
- Choisir **Provider = Bionic LM Studio**.
- Démarrer le serveur API LM Studio depuis la page **Developer** ou avec `lms server start`.
- Endpoint par défaut : `http://localhost:1234/v1/chat/completions`.
- Cliquer sur **Refresh** pour charger tous les modèles exposés par `/v1/models` ; le premier est sélectionné si aucun modèle n’est configuré.
- Lorsqu’un modèle est déjà chargé, KNX AI conserve la longueur de contexte active. KNX AI ne charge jamais un modèle Bionic inactif via l’API de gestion : la première requête de chat laisse Bionic le charger en JIT avec les valeurs par défaut enregistrées pour ce modèle. Indépendamment du contexte déclaré par Bionic, KNX AI limite toujours son propre prompt à une vue sémantique de 16K sélectionnée par pertinence ; cela évite d’envoyer l’ensemble complet de 131K sans supprimer les capacités de raisonnement, KNX, routines, caméras ou TTS.
- La clé API est facultative sauf si l’authentification est activée dans les paramètres du serveur LM Studio. Dans Docker, remplacer `localhost` par `host.docker.internal`.

## Note sécurité
Si le LLM est activé, le contexte trafic KNX peut être envoyé à l'endpoint configuré. Pour un usage strictement on-premise, utilisez un provider local. Une commande émise en sortie 4 a passé la validation locale et a été transmise au flow, sans prouver son exécution par l'actionneur. Utilisez une GA d'état KNX pour la confirmation.
