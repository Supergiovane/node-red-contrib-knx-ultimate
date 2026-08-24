---
layout: wiki
title: "KNX AI"
lang: fr
permalink: /wiki/fr-KNX%20AI
---
Ce nœud écoute **tous les télégrammes KNX** du gateway KNX Ultimate sélectionné, produit des statistiques de trafic, détecte des anomalies et peut interroger un LLM de façon optionnelle.

L'éditeur utilise trois sections principales en accordéon : **Assistant IA** contient la configuration, les connaissances/le contexte et les limites du fournisseur ; **Conversations et maison** contient les canaux de chat, la maison proactive et la mémoire limitée ; **Analyse du trafic KNX** contient les télégrammes du bus, l'historique/les résumés et les anomalies/motifs. L'ouverture d'une section principale affiche ensemble toutes ses options. Les identifiants et valeurs enregistrés restent inchangés.

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

Chaque session Ask/chat conserve ses 8 derniers échanges et jusqu'à 20 instructions explicites à long terme, séparées par `msg.knxAi.sessionId`, `msg.sessionId` ou l’ID de chat Telegram détecté. Les demandes telles que « Souviens-toi de ne pas employer le terme unknown » deviennent des instructions persistantes. Tous les nœuds KNX AI utilisant le même stockage partagent ce contexte en direct et le rechargent après un redémarrage de Node-RED depuis `knxultimatestorage/knxai/memory/knxai-chat-context.md`. Le fichier, écrit de façon atomique, est limité à 50 sessions et 512 Ko. Lorsque le contrôle KNX est activé, reliez la sortie 3 au nœud d'envoi du chat et la sortie 4 à un nœud KNX Ultimate en **mode universel**. Avec la confirmation active, la première réponse affiche GA, DPT et payload sans émettre d’écriture ; la même session doit répondre `CONFIRMER` ou `ANNULER` dans les 5 minutes. Une nouvelle demande remplace tout plan précédent. Chaque commande confirmée contient `msg.destination`, `msg.dpt`, `msg.payload` et `msg.event = "GroupValue_Write"`.
Pour les écritures DPT 1.xxx, les équivalents sûrs produits par l’IA `true`/`false`, `1`/`0` et `on`/`off` sont normalisés en véritables booléens avant la validation locale et la sortie.

### Lectures KNX actualisées
Lorsque l’utilisateur demande explicitement un état actuel ou actualisé, l’IA peut interroger les objets exacts du catalogue ETS importé, y compris les objets d’état et autres objets en lecture seule. La sortie 4 émet `msg.destination`, `msg.dpt`, `msg.event = "GroupValue_Read"` et `msg.readstatus = true`. Le nœud attend jusqu’à 6 secondes chaque `GroupValue_Response` ou écriture récente, puis renvoie les valeurs décodées sur la sortie 3 et les détails dans `msg.knxAi.readResults`. Les lectures ne nécessitent jamais de confirmation et ne sont jamais transformées en écritures.

### Demande de confirmation pour les boutons du chat
Lorsqu'un plan est en attente, la sortie 3 contient `msg.knxAi.confirmationRequest`. L'objet comprend `required`, `status`, `sessionId`, `expiresAt`, `commandCount` et deux éléments dans `actions`. Utilisez `action.label` comme texte du bouton Telegram, `action.callbackData` comme callback et renvoyez `action.message` à KNX AI pour confirmer ou annuler sans saisir de texte.

### Préréglages d’adaptateur de chat
L’onglet **Adaptateurs de chat** charge ses mappages sélectionnables depuis `resources/KNXAIChatAdapterMappings.js`. Le choix d’un préréglage insère deux mappages JavaScript synchrones et modifiables dans des zones de texte pleine largeur : un avant le traitement de l’entrée par KNX AI et un avant l’émission sur la sortie 3. Renvoyez `msg` pour continuer ou aucune valeur pour écarter le message. Les erreurs de syntaxe et d’exécution sont interceptées et signalées sans arrêter Node-RED.

Le préréglage inclus **windkh/node-red-contrib-telegrambot** suit le contrat receiver/sender du paquet. Connectez directement un `telegram receiver` à KNX AI et la sortie 3 à un `telegram sender`. Pour les boutons de confirmation inline, connectez aussi un `telegram event` configuré pour `callback_query` à la même entrée KNX AI. Le mappage d’entrée extrait `msg.payload.content`, `msg.payload.chatId` et la langue Telegram. Le mappage de sortie crée `msg.payload.chatId`, `type` et `content`, puis ajoute `options.reply_markup` depuis `msg.knxAi.confirmationRequest` lorsqu’une écriture attend confirmation. Le paquet Telegram reste une dépendance optionnelle distincte.

Le préréglage inclus **RedBot / node-red-contrib-chatbot (Telegram)** suit le format de message commun de RedBot. Connectez directement `chatbot-telegram-receive` à KNX AI et la sortie 3 à `chatbot-telegram-send` ; aucun nœud de callback séparé n’est nécessaire, car RedBot convertit les postbacks des boutons inline en messages entrants ordinaires. Le mappage d’entrée lit `transport`, `chatId`, `type`, `content` et la langue Telegram. Le mappage de sortie conserve les données de suivi RedBot `originalMessage`, `chat`, `api` et `client`, puis émet soit un payload `message`, soit un payload `inline-buttons` avec des actions `postback` de confirmation. RedBot reste une dépendance optionnelle distincte.

### Adaptateurs de caméra détectés automatiquement
Les paquets de caméra installés peuvent publier à l’exécution un adaptateur pour KNX AI. Il n’existe aucun sélecteur ni nœud caméra à relier à KNX AI : les adaptateurs, contrôleurs et caméras disponibles sont détectés automatiquement et ajoutés au contexte du chat. `node-red-contrib-unifi-ultimate` est le premier fournisseur pris en charge ; d’autres paquets, tels que `hikvision-ultimate`, peuvent s’enregistrer avec le même contrat indépendant du fabricant.

L’utilisateur peut demander une capture actuelle ou demander au modèle de vision ce qui est visible. Les préréglages Telegram et RedBot envoient l’image comme photo native avec une légende. L’utilisateur peut aussi créer des notifications persistantes pour un mouvement, le franchissement d’une ligne intelligente ou l’entrée dans une zone d’intrusion/de stationnement, avec une limitation facultative aux personnes détectées et à une ligne ou zone nommée précise. Ces règles sont stockées dans le même fichier `knxai-chat-context.md` et restaurées après les redémarrages de Node-RED. Les abonnements aux événements UniFi et les demandes de capture passent directement par le fournisseur détecté ; la sortie 4 de KNX AI et un câblage intermédiaire ne sont pas nécessaires.

## Intelligence domestique proactive et mémoire limitée
La sous-section **Maison proactive et mémoire** de **Conversations et maison** active les notifications proactives sur choix de l’utilisateur. À partir de la hiérarchie ETS, des noms, rôles et DPT, le nœud crée un modèle sémantique déterministe pour les volets, fenêtres, portes, éclairages, températures, climat, présence et alarmes avec des termes italiens, anglais, allemands, français, espagnols et chinois. Le premier détecteur proactif surveille uniquement les états hors commande de volets/fenêtres/portes reconnus avec une fiabilité suffisante. Après la durée d’ouverture configurée et hors heures silencieuses, la sortie 3 émet un message localisé avec `msg.knxAi.type = "proactive_notification"`. Il n’émet jamais sur la sortie 4 et ne modifie jamais KNX de façon autonome ; une demande ultérieure de l’utilisateur passe toujours par la validation et la confirmation normales.

La dernière session de chat est mémorisée comme propriétaire, ou **Destinataire principal / ID de chat** permet de la définir explicitement. Un `msg.inputMessage` synthétique conserve le destinataire afin que l’adaptateur Telegram puisse envoyer une notification spontanée. Le délai de répétition et la limite de trois notifications proactives par heure évitent les rafales.

La référence apprise partagée est chargée au démarrage depuis `<userDir>/knxai/memory/knxai-home-memory.md`, réécrite atomiquement toutes les 15 minutes et toujours strictement limitée à 5 Mo. Elle conserve au maximum 120 observations importantes, 80 habitudes agrégées, 80 notifications et 300 objets ETS sémantiques, jamais un flux illimité de télégrammes bruts. Les éléments anciens et moins prioritaires sont supprimés en premier. **Éducation IA** est limitée à 16 000 caractères et provient toujours de la configuration du nœud : l’IA peut la lire comme une consigne faisant autorité, mais ne peut ni la modifier ni l’écraser. Si cette Éducation est présente mais que le LLM ne peut pas l’évaluer, la notification candidate est supprimée plutôt que de risquer de la contredire.

## Exemple pratique de configuration
Cet exemple crée un assistant concis qui signale les ouvertures importantes, tout en acceptant que le volet du bureau reste ouvert :

| Champ de l’éditeur | Valeur d’exemple | Résultat |
|---|---|---|
| **Activer les notifications domestiques proactives** (`proactiveEnabled`) | activé | Le nœud évalue les états ouverts de volet/fenêtre/porte reconnus avec fiabilité. |
| **Destinataire principal / ID de chat** (`proactiveRecipient`) | `123456789` | Les messages spontanés vont vers ce chat ; laissez vide pour mémoriser la dernière session Ask. |
| **Notifier après ouverture** (`proactiveOpenMinutes`) | `120` | Une notification potentielle est évaluée après deux heures. |
| **Début / fin des heures silencieuses** | `23:00` / `07:00` | Aucun message proactif n’est émis pendant la nuit. |
| **Délai de répétition** (`proactiveCooldownMinutes`) | `360` | Le même objet ne peut pas notifier à nouveau pendant six heures. |

Exemple pour **Éducation IA** (`aiEducation`) :

```text
Appelle-moi Alex et réponds dans la même langue que moi.
Réponds brièvement, sauf si je demande des détails techniques.
Le volet du bureau peut rester ouvert le jour : ne m’envoie pas de notification.
Préviens-moi lorsqu’un autre volet, une fenêtre ou une porte reste ouvert anormalement longtemps.
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

KNX AI écoute automatiquement les télégrammes `GroupValue_Write`, `GroupValue_Response` et `GroupValue_Read`. L'analyse des motifs et anomalies est toujours initialisée avec les valeurs intégrées par défaut ; aucune configuration des événements du bus ou de la détection n'est nécessaire.

### Analysis
- **Analysis window (seconds)** : fenêtre principale pour résumé/débits.
- **History window (seconds)** : fenêtre de rétention de l'historique interne.
- **Archiver aussi sur disque les telegrammes captures** : stocke aussi les télégrammes dans `knxultimatestorage/knxai/history/<node-id>/YYYY-MM-DD.jsonl`, en plus de la RAM.
- **Retention de l'archive disque (jours)** : nombre de jours conservés sur disque avant suppression automatique des anciens fichiers.
- **Max stored events** : nombre maximal de télégrammes en mémoire.
- **Auto emit summary (seconds, 0=off)** : intervalle périodique d'émission du résumé.
- **Top list size** : nombre de group addresses/sources dans le top.

### Assistant IA
- **Enable LLM assistant** : active les fonctions Ask/chat.
- **Provider** : backend LLM (OpenAI-compatible ou Ollama).
- **Endpoint URL** : URL endpoint chat/completions.
- **API key** : clé API (non requise avec Ollama local).
- **Model** : ID/nom du modèle.
- **Compatibilité du modèle de chat** : le modèle sélectionné doit prendre en charge l'endpoint Chat Completions configuré. Les anciens modèles réservés aux completions, comme `gpt-3.5-turbo-instruct`, sont exclus lors de l'actualisation de la liste. Si le fournisseur refuse une valeur de température personnalisée ou le paramètre de limite de tokens, KNX AI réessaie en supprimant ou remplaçant uniquement le champ incompatible.
- **Autoriser l’IA à lire les états KNX et commander les actionneurs** : active la sortie 4 et reste désactivé par défaut. Les objets exacts du catalogue ETS peuvent être lus ; seules les écritures vers des objets classés `command` sont acceptées. Les opérations inconnues, avec DPT discordant, invalides ou trop nombreuses, ainsi que les écritures vers des objets d'état ou neutres, sont rejetées localement.
- **Demander confirmation avant d’envoyer les commandes KNX** : activé par défaut. Affiche d'abord les modifications validées et n'émet aucune commande tant que la même session de chat ne les confirme pas. Lorsque des commandes attendent une confirmation, la réponse ajoute toujours les instructions exactes de confirmation ou d'annulation dans la langue de la demande courante. Les commandes sont à nouveau validées juste avant la sortie.
- **Préréglage d’adaptateur** : utilise **Aucun adaptateur** par défaut. Les éditeurs JavaScript restent masqués jusqu’à la sélection d’un adaptateur, puis les mappages entrée/sortie modifiables sont chargés et affichés.
- **Mappage d’entrée (chat → KNX AI)** : JavaScript synchrone exécuté avant le traitement de la commande d’entrée dans l’éditeur JavaScript vert.
- **Mappage de sortie (KNX AI → chat)** : JavaScript synchrone appliqué uniquement aux messages de la sortie 3 dans l’éditeur JavaScript jaune.
- **Activer les notifications domestiques proactives** : détecteur optionnel des états ouverts de volet/fenêtre/porte reconnus de façon fiable ; il n'écrit jamais de manière autonome sur KNX.
- **Destinataire principal / ID de chat** : destination facultative des messages spontanés ; sinon la dernière session Ask est mémorisée.
- **Notifier après ouverture (minutes)** : seuil de durée avant d'envisager une notification proactive ; 120 minutes par défaut.
- **Début / fin des heures silencieuses** : intervalle quotidien pendant lequel les messages proactifs sont supprimés.
- **Éducation de l’IA** : consignes autoritaires gérées uniquement par l'utilisateur, lues par l'IA et jamais modifiées.
- **Délai de répétition (minutes)** : intervalle minimal avant qu'un même objet puisse notifier à nouveau ; 360 minutes par défaut.
- Si l'archive disque est active, **Ask** l'utilise par défaut : les dates/plages explicites sont respectées, sinon l'assistant cherche sur les dernières 24 heures plus les événements RAM courants.
- **Inclure l'inventaire du projet Node-RED** : inclut dans le prompt l'inventaire de tout le projet Node-RED, avec les nœuds KNX et d'autres nœuds utiles comme function/change/inject/template lorsqu'ils contiennent de la logique KNX ou des adresses de groupe.
- Les extraits pertinents de l’aide, du README et des exemples sont toujours inclus automatiquement.
- **Docs language** : langue préférée des extraits de documentation inclus automatiquement.
- Bouton **Refresh** : interroge le provider et charge les modèles disponibles. Son icône tourne pendant le chargement ; une réussite ne produit volontairement aucun message.

### Advanced
- **Analysis window (seconds)** : fenêtre principale pour résumé/débits.
- **Max stored events** : nombre maximal de télégrammes en mémoire.
- **Top list size** : nombre de group addresses/sources dans le top.

### Démarrage rapide Ollama (local)
- Choisir **Provider = Ollama**.
- Endpoint par défaut : `http://localhost:11434/api/chat`.
- Si aucun modèle local n'est trouvé :
  - **1) Download model** : ouvre la page **Model library**.
  - **2) Install it** : télécharge et installe le modèle localement (ex. `llama3.1`).
- Pendant refresh/install, KNX AI tente aussi de démarrer automatiquement le serveur Ollama.
- Si l'installation échoue avec une erreur de connexion, vérifier qu'Ollama est lancé (app desktop ou `ollama serve`).
- Si Node-RED tourne dans Docker, utiliser `host.docker.internal` au lieu de `localhost` dans l'endpoint.

## Note sécurité
Si le LLM est activé, le contexte trafic KNX peut être envoyé à l'endpoint configuré. Pour un usage strictement on-premise, utilisez un provider local. Une commande émise en sortie 4 a passé la validation locale et a été transmise au flow, sans prouver son exécution par l'actionneur. Utilisez une GA d'état KNX pour la confirmation.
