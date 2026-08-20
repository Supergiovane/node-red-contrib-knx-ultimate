---
layout: wiki
title: "HUE Controller"
lang: fr
permalink: /wiki/fr-HUE%20Controller
---
# HUE Controller

[**KNX-Ultimate video tutorials (YouTube playlist)**](https://www.youtube.com/playlist?list=PL9Yh1bjbLAYrU8PsVhW4xzEug2WtVFv3E)

<div data-hue-controller-overview="hero" style="margin:18px 0 28px;padding:24px;border-radius:16px;background:linear-gradient(135deg,#0b2d5a 0%,#1767bf 55%,#2a8dff 100%);box-shadow:0 14px 30px rgba(11,45,90,0.24);color:#f4f9ff;">
  <div style="font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;color:#cfe4ff;">Hue API v2 · KNX · Node-RED</div>
  <div style="font-size:1.75rem;line-height:1.15;font-weight:800;margin:8px 0 10px;">Un nœud. Quinze fonctions Hue.</div>
  <p style="margin:0 0 18px;max-width:860px;line-height:1.6;color:#f4f9ff;">HUE Controller réunit toutes les fonctions éprouvées des anciens nœuds Hue dédiés dans un nœud autonome et maintenu. Choisissez un appareil ou une ressource Hue : son type est détecté automatiquement et l’éditeur, les mappages KNX et les ports du flow s’adaptent.</p>
  <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">15</strong><span style="font-size:0.76rem;color:#e8f3ff;">fonctions d’appareil</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">Hue API v2</strong><span style="font-size:0.76rem;color:#e8f3ff;">ressources natives</span></div>
    <div style="flex:1 1 150px;min-width:130px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,0.12);"><strong style="display:block;font-size:1.05rem;color:#fff;">KNX</strong><span style="font-size:0.76rem;color:#e8f3ff;">intégration facultative</span></div>
  </div>
</div>

## Tout depuis un seul nœud

| Domaine | Fonctions | Possibilités principales |
|---|---|---|
| **Éclairage & puissance** | Lampe / groupe, Prise | Marche/Arrêt, variation relative et absolue, blanc réglable, RGB/HSV, effets, profils jour/nuit, localisation, commande de puissance et retour bidirectionnel. |
| **Scènes & commandes** | Scène, Bouton, Tap dial | Rappel de scène simple ou numéroté, mappages DPT 1/18, appuis courts/longs/répétés, bascule et événements rotatifs. |
| **Présence & sécurité** | Mouvement, Mouvement de zone, Mouvement de caméra, Contact | États de mouvement et ouvert/fermé, synchronisation au démarrage, publication KNX et événements de flow facultatifs. |
| **Environnement** | Niveau de lumière, Température, Humidité | Mesures des capteurs Hue mappées vers les datapoints KNX appropriés. |
| **Santé de l’appareil** | Batterie, Connectivité Zigbee, Mise à jour logicielle | Pourcentage de batterie, état de connexion et disponibilité des mises à jour sur KNX ou dans le flow Node-RED. |

## Une expérience Controller cohérente

- Un sélecteur Hue orienté appareil avec autocomplétion et actualisation ; la fonction correspondante est déterminée automatiquement.
- Un clic ou le focus sur le champ de l'appareil ouvre toujours la liste Hue complète, même après une sélection ; la saisie la filtre.
- Mappages de lampe adaptés aux capacités : variation, blanc réglable, RGB/HSV et effets natifs suivent les propriétés live `dimming`, `color_temperature`, `color` et `effects` de la ressource lampe Hue API v2 sélectionnée.
- Éditeur Lampe non bloquant : les mappages enregistrés s'affichent immédiatement sans attendre le cache de ressources Hue de la runtime. Les capacités actuelles sont chargées en arrière-plan ; en cas d'échec, les mappages et le sélecteur de broches restent disponibles et une erreur Node-RED rouge et fixe apparaît.
- Éditeur Lampe résilient : Locate et le conteneur de mappage sont initialisés avant les widgets facultatifs Effets et onglets. Une passerelle KNX enregistrée survit aux valeurs de sélecteur temporairement vides pendant le démarrage de l'éditeur. Les erreurs du navigateur et le rejet de la première commande Locate produisent une erreur Node-RED rouge et fixe avec le détail technique, au lieu de laisser l'éditeur silencieux.
- Les lignes KNX compactes conservent GA, DPT et Nom sur une seule ligne ; DPT et Nom utilisent des largeurs réduites, et Nom peut encore se contracter dans un éditeur étroit sans modifier la valeur enregistrée. Les valeurs DPT enregistrées sont conservées pendant le chargement asynchrone des options du sélecteur.
- Passerelle KNX facultative : utilisez les adresses de groupe ou noms ETS importés ; les datapoints compatibles proviennent de la passerelle sélectionnée.
- Ports Node-RED dynamiques pour les entrées Hue API v2 validées et les événements Hue, lorsqu’ils sont pris en charge.
- Lecture au démarrage, synchronisation d’état Hue→KNX et protection contre les boucles conservées dans chaque profil privé.
- Migration entièrement locale des quinze types obsolètes, suivie d'un brouillon d'e-mail modifiable, d'un bouton de soutien facultatif dans le message final, d'une vérification locale et d'un Deploy manuel.

## Démarrer en quatre étapes

1. Configurez une fois le **Bridge Hue**.
2. Ajoutez **HUE Controller**, puis choisissez ou actualisez un **Appareil Hue** ; son **Type d’appareil** est renseigné automatiquement.
3. Sélectionnez une **Passerelle KNX** et mappez commandes/états, ou laissez `none` pour un usage réservé au flow.
4. Réglez le comportement et les ports propres à la fonction, déployez et vérifiez l’état live du nœud.

> **Aucune passerelle KNX ?** Le Controller reste utilisable comme intégration Hue–Node-RED. Les champs KNX sont masqués et les options de flow prises en charge par la fonction restent disponibles.

Les sections suivantes constituent la référence complète par fonction, consolidée à partir des anciens nœuds dédiés.

## Convertir les nœuds HUE legacy

Le bouton de migration apparaît uniquement lorsque l'éditeur Node-RED détecte au moins un nœud HUE legacy dans les flows actuels. Un lien vers la [vidéo explicative de la migration sur YouTube](https://youtu.be/f0Evf2QFI7c) apparaît juste avant le même bouton orange à contraste élevé avec texte blanc dans HUE Controller et chaque éditeur HUE legacy. L'avertissement confirme qu'aucune donnée de flow ou de nœud ne quitte le navigateur.

Cliquez sur **Convertir les nœuds HUE legacy** et confirmez. Le navigateur effectue toute la conversion localement et n'envoie aucune donnée de flow, de nœud, de `hue-config`, de `knxUltimate-config`, d'adresse de groupe, de câblage, d'identifiant, de nom, de position ou d'ID. Après la conversion, il ouvre uniquement un brouillon d'e-mail modifiable adressé à l'auteur sans quitter Node-RED. Le brouillon contient uniquement le nombre de nœuds convertis et un espace pour des notes facultatives ; vous décidez de l'envoyer et il ne part jamais automatiquement. Le message Node-RED final propose un bouton de soutien facultatif ; la page de don ne s'ouvre qu'après un clic sur ce bouton.

Avant de commencer, exportez une sauvegarde de vos flows. Le navigateur ferme l'éditeur du nœud actuel et transforme uniquement les nœuds HUE legacy détectés en instances HUE Controller. Les propriétés enregistrées, références de configuration, positions, groupes et connexions restent inchangés. L'espace de travail est marqué comme modifié, mais l'outil ne le déploie jamais automatiquement : vérifiez le résultat puis cliquez vous-même sur **Deploy**. Un nœud modifié, un flow verrouillé ou une erreur de conversion locale laisse l'espace de travail inchangé. **Contrôle de sécurité :** avant le Deploy, examinez chaque nœud HUE modifié et vérifiez sa fonction, ses références de configuration, ses ports d'entrée/sortie et son câblage. À la fin du processus, un message Node-RED fixe reste visible jusqu'à ce que vous cliquiez sur **OK**.

Les événements Hue restent des mises à jour d'état et ne deviennent pas de nouvelles commandes Hue. HUE Controller contient des profils privés pour le runtime, l'éditeur, les modèles et les traductions ; il ne dépend donc pas du chargement des types de nœuds obsolètes. Le nœud Hue Light d'origine reste inchangé. Les nœuds Hue dédiés restent enregistrés pour les flows existants, mais ils sont figés et ne reçoivent plus de nouvelles fonctions ni de mises à jour de maintenance. Node-RED masque leur catégorie spéciale `deprecated` dans la palette ; les instances existantes restent modifiables et déployables, utilisent une couleur plus claire que HUE Controller, sont marquées `(deprecated)` sur le canevas et affichent un avis de migration en haut de l'éditeur.

<!-- HUE_CONTROLLER_PROFILE_DOCS_START -->

## Fonction de l'appareil

- [Lampe / groupe de lampes (`light`)](#hue-controller-docs-light)
- [Prise / sortie (`plug`)](#hue-controller-docs-plug)
- [Bouton (`button`)](#hue-controller-docs-button)
- [Tap dial (`relative_rotary`)](#hue-controller-docs-relative_rotary)
- [Mouvement (`motion`)](#hue-controller-docs-motion)
- [Mouvement de zone (`area_motion`)](#hue-controller-docs-area_motion)
- [Mouvement de caméra (`camera_motion`)](#hue-controller-docs-camera_motion)
- [Contact (`contact`)](#hue-controller-docs-contact)
- [Niveau de lumière (`light_level`)](#hue-controller-docs-light_level)
- [Température (`temperature`)](#hue-controller-docs-temperature)
- [Humidité (`humidity`)](#hue-controller-docs-humidity)
- [Scène (`scene`)](#hue-controller-docs-scene)
- [Batterie (`device_power`)](#hue-controller-docs-device_power)
- [Connectivité Zigbee (`zigbee_connectivity`)](#hue-controller-docs-zigbee_connectivity)
- [Mise à jour logicielle (`device_software_update`)](#hue-controller-docs-device_software_update)

<span id="hue-controller-docs-light" data-hue-controller-type="light"></span>

## Lampe / groupe de lampes (`light`)

Ce nœud contrôle les lumières de Hue Philips (simple ou groupées) et mappe leurs commandes / états à KNX.

**Groupes de lampes :** lorsqu'une passerelle KNX est configurée, la sélection d'un `grouped_light` affiche toujours toutes les associations Interrupteur, Variation, Blanc réglable, RGB/HSV, Effets et Comportement. L'éditeur ne limite pas ces champs selon les lampes actuellement présentes dans le groupe.

**Général**

| Propriété | Description |
|-|-|
| KNX GW | Sélectionnez la passerelle KNX à utiliser |
| Hue Bridge | Sélectionnez la Hue Bridge à utiliser |
| Nom | Hue Light ou Lumière groupée à utiliser (Ambord d'auto-automatique pendant la frappe). |

**Localiser l’appareil**

Le bouton `Locate` (icône lecture) lance une session d’identification Hue pour la ressource sélectionnée. Lorsque la session est active, le bouton affiche l’icône stop et le pont fait clignoter la lampe — ou toutes les lampes du groupe — chaque seconde. Appuyez à nouveau pour l’arrêter immédiatement ; sinon la session s’arrête automatiquement au bout de 10 minutes.

**Options**

Ici, vous pouvez lier les adresses de groupe KNX aux commandes / états de Theaux disponibles.

Commencer à taper le champ GA (nom ou adresse de groupe); Les suggestions apparaissent pendant que vous tapez.

**Changer**

| Propriété | Description |
|-|-|
| Contrôle | Ce GA est utilisé pour allumer / éteindre la lumière via une valeur booléenne KNX True / False |
| Statut | LIENDEZ CECI À L'Adresse du groupe d'état du commutateur de Light |

**Faible**

| Propriété | Description |
|-|-|
| Contrôle DIM | Dim relatif de la lumière de la teinte. Vous pouvez régler la vitesse de gradation dans l'onglet **comportement** . |
| Contrôle% | Modifie la luminosité de la lumière absolue (0-100%) |
| Statut% | LIGNEZ CECI À L'Adresse du groupe KNX du statut de luminosité de la lumière |
| Dim Speed ​​(MS) | Vitesse de gradation en millisecondes. S'applique à la fois à la luminosité lumineuse et aux points de données blancs de réglage. Calculé sur la plage de 0% → 100%. |
| Min DIM luminosité | La luminosité minimale que la lampe peut atteindre. Par exemple, si vous tuez la lumière vers le bas, la lumière s'arrêtera à la baisse à la luminosité spécifiée%. |
| Luminosité maximale de DIM | La luminosité maximale que la lampe peut atteindre. Par exemple, si vous tuez la lumière, la lumière s'arrêtera à la baisse à la luminosité spécifiée%. |

**Blanc accordable**

| Propriété | Description |
|-|-|
| Contrôle DIM | Changer la température blanche à l'aide de DPT 3.007 Semballage. La vitesse est définie dans l'onglet **comportement** . |
| Contrôle% | Changer la température blanche à l'aide de DPT 5.001. 0 = CHAUD CHAUD, 100 = CHARD complet. |
| Statut% | État de la température GA. DPT 5.001 Valeur absolue: 0 = Full Warm, 100 = Full Cold. |
| Contrôle Kelvin | **DPT 7.600: ** Réglez la température à Kelvin en utilisant la gamme KNX 2000-6535 (convertie en Hue Mirek).
**DPT 9.002:** régler la température en utilisant la gamme Hue 2000-6535 K (l'ambiance commence à 2200 K). Les conversions peuvent introduire de petits écarts. |
| Statut Kelvin | **DPT 7.600: ** Température de lecture dans Kelvin en utilisant KNX Range 2000-6535 (converti à partir de Hue).
**DPT 9.002:** Température de lecture en utilisant la gamme Hue 2000-6535 K (l'ambiance commence à 2200 K). Les conversions peuvent introduire de petits écarts. |
| Invertissant la direction sombre | Inverse la direction sombre. |

**RGB / HSV**

| Propriété | Description |
|-|-|
| **Section RVB** ||
| Contrôle RVB | Changer la couleur à l'aide du triplet RVB (R, G, B). La correction de la gamme est gérée. L'envoi d'une couleur allume la lumière et définit la couleur / la luminosité (perceptuelle). Envoi r, g, b = 0 éteint la lumière. |
| Status RVB | L'adresse du groupe d'état des couleurs de la lumière. DataPoint accepté est RVB Triplet (R, G, B) |
| **Section HSV** ||
| Couleur h dim | Cycle à travers la teinte HSV à l'aide de DPT 3.007 Semballage. La vitesse est définie dans l'onglet **comportement** . |
| Statut H% | Statut du cercle chromatique HSV. |
| Contrôle s dim | Modifie la saturation des couleurs de la lumière, en utilisant DPT 3.007 Semballage. Vous pouvez définir la vitesse de gradation dans l'onglet du comportement **_ _** . |
| Statut S% | L'adresse du groupe d'état de saturation des couleurs légères. |
| Dim Speed ​​(MS) | La vitesse de gradation, en millisecondes, du bas à l'échelle supérieure. |

Pour contrôler le HSV "V" (luminosité), utilisez les contrôles standard sous l'onglet **Dim** .

**Effets**

_NE-HUE BASIC EFFETS_

| Propriété | Description |
|-|-|
| Clignotement | _True_ clignote la lumière, _false_ arrête de clignoter. Clignote la lumière allumée et éteinte. Utile pour la signalisation. Fonctionne avec toutes les lumières Hue. |
| Cycle de couleur | _True_ Cycle de démarrage, _false_ Stop Cycle. Modifie au hasard la couleur de la lumière de la teinte à intervalle régulier. Fonctionne avec toutes les lumières Hue ayant des capacités de couleur. L'effet de couleur commencera 10 secondes après le jeu. |

_Hue Effets natifs_

Utilisez le tableau des effets natifs **Hue** pour cartographier vos valeurs KNX aux effets pris en charge par la lumière sélectionnée (par exemple «bougie», `foyer», «prisme»). Chaque ligne relie une valeur KNX (booléen, numérique ou textuelle, selon le point de données que vous choisissez) avec un effet de teinte. Du côté KNX, vous pouvez:

- Envoyez la valeur mappée pour activer cet effet;
- Fournir éventuellement une adresse de groupe d'état: le nœud émet la valeur mappée chaque fois que le pont de teinte rapporte un changement d'effet; Si aucun mappage n'existe, le nom de l'effet brut est envoyé (nécessite un DPT textuel tel que 16.xxx).

**Comportement**

| Propriété | Description |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lire l'état au démarrage | Lisez l'état de la lumière de Hue au démarrage de Node-Red ou le déploiement complet de Node-Red, et envoyez ce statut au bus KNX |
| Statut de luminosité KNX | Met à jour l'état de l'adresse du groupe de luminosité KNX, chaque fois que la lampe à teinte est allumée / désactivée. Les options sont **lorsque Hue Light est éteint Envoyer 0%. Lorsque Hue On, restaurez la valeur précédente (comportement KNX par défaut) ** et**Laissez tel quel (comportement de teinte par défaut) ** . Si vous avez un gradateur KNX avec un statut de luminosité, comme le MDT, l'option suggérée est _**lorsque la lumière de Hue est éteinte envoyez 0%. Lorsque Hue on, restaurez la valeur précédente (comportement KNX par défaut)** _ |
| Mettre à jour l'état Hue local en cache à partir des écritures du bus KNX | Option avancee, activee par defaut. Lorsqu'elle est activee, les ecritures recues depuis le bus KNX mettent aussi a jour immediatement l'etat Hue local en cache du noeud, sans attendre les retours/evenements du pont Hue. Cela apporte des reactions locales plus rapides et des reponses immediates de lecture KNX plus coherentes, surtout lorsque la lumiere ou le groupe est eteint. Desactivez-la si vous preferez que le cache suive uniquement les retours/evenements reels du pont Hue. |
| Affoncher le comportement | Il définit le comportement de vos lumières lorsqu'il est allumé. Vous pouvez choisir parmi les différents comportements.
 **Sélectionner la couleur: ** La lumière sera allumée avec la couleur de votre choix. Pour modifier la couleur, cliquez simplement sur le sélecteur de couleurs (sous le contrôle de couleur _Select).
**Sélectionnez la température et la luminosité: ** La lumière sera allumée avec la température (Kelvin) et la luminosité (0-100) de votre choix.
**Aucun:** La lumière conservera son dernier statut. Dans le cas où vous permettez l'éclairage nocturne, après la fin de la nuit, la lampe reprendra l'état de couleur / température / luminosité réglé pendant le jour. |
| Éclairage nocturne | Il permet de définir une couleur / luminosité claire particulière la nuit. Les options sont les mêmes que la journée. Vous pouvez sélectionner une température / une luminosité ou une couleur. Une température confortable de 2700 Kelvin, avec une luminosité de 10% ou 20%, est un bon choix pour la veilleuse de la salle de bain. |
| Jour / nuit | Sélectionnez l'adresse de groupe utilisée pour définir le comportement de jour / nuit. La valeur d'adresse du groupe est _true_ si le jour, _false_ si nocturne. |
| Valeur de jour / nuit inversée | Inversez les valeurs de l'adresse du groupe _day / night_. La valeur par défaut est **non contrôlée** . |
| Lire l'état au démarrage | Lisez l'état au démarrage et émettez l'événement dans le bus KNX au démarrage / reconnexion. (Par défaut "non") |
| Remplacez le mode nuit | Vous pouvez remplacer le mode nuit en changeant manuellement la lumière comme décrit ici: **Passez au mode jour en changeant rapidement la ligth puis sur (cette lumière uniquement) ** fait ce qui décrit et n'agit que sur cette lumière.**Passez au mode jour en changeant rapidement la ligth puis sur (appliquez tous vos nœuds légers)** agit sur tous les nœuds légers, en définissant l'adresse du groupe jour / nuit sur le mode jour. |
| Pinons d'entrée / sortie de nœud | Masquer ou afficher les broches d'entrée / sortie. Les broches d'entrée / sortie permettent au nœud d'accepter l'entrée MSG de l'écoulement et d'envoyer une sortie MSG à l'écoulement. Le MSG d'entrée doit suivre les normes de l'API Hue V.2. Ceci est un exemple de msg, qui allume la lumière: <code> msg.on = {"on": true} </code>. Veuillez vous référer à la [page officielle de l'API Hue](https://developers.meethue.com/develop/hue-api-v2/api-reference/#resource_light__id__put) |

##### Note

La fonction de gradation fonctionne en mode **knx `start` et` `stop` ** . Pour commencer à tuer, envoyez un seul télégramme KNX "start". Pour arrêter de tuer, envoyez un télégramme KNX "stop". S'il vous plaît**N'oubliez pas cela** , lorsque vous définissez les propriétés de votre mur.

---

<span id="hue-controller-docs-plug" data-hue-controller-type="plug"></span>

## Prise / sortie (`plug`)

### Plug / prise

#### Aperçu

Le nœud Hue Plug relie une fiche Smart Hue Philips (Service `Plug`) avec des adresses de groupe KNX afin que vous puissiez contrôler l'alimentation et suivre l'état directement à partir du bus.

- prend en charge **Contrôle ON / OFF** et **Feedback d'état**.
- mappage facultatif de la teinte `power_state` (on / standby).
- Peut exposer les broches d'entrée / sortie de Node-Red pour transmettre les événements de teinte aux flux ou envoyer des charges utiles API avancées.

Configuration ##

| Champ | Description |
|-|-|
|KNX GW |KNX Gateway utilisé pour les télégrammes |
|Hue Bridge |Hue Bridge configurée |
|Nom |Sélectionnez la fiche Hue dans la liste de saisie semi-automatique |
|Contrôle |KNX GA pour les commandes ON / OFF (Boolean DPT) |
|Statut |GA pour les commentaires ON / OFF provenant de Hue |
|État de pouvoir |Hue en miroir en option `power_state` (booléen / texte) |
|Lire l'état au démarrage |Lorsqu'il est activé, le nœud émet l'état de fiche actuel sur le déploiement / la connexion |
|Broches d'E / S de nœud |Activer les broches d'entrée / sortie rouge-rouge.L'entrée attend des charges utiles de l'API Hue (par exemple `{on: {on: true}}`).La sortie transmet chaque événement Hue.|

#### conseils de mappage KNX

- Utilisez un point de données booléen (par exemple DPT 1.001) pour la commande et l'état.
- Si vous exposez `Power_State`, mappez-le à un GA booléen (true =` on`, false = `standby`).
- Pour les demandes de lecture (`GroupValue_Read`), le nœud renvoie la dernière valeur de teinte en cache.

#### Intégration de flux

Lorsque _Node E / S Pins_ sont activés:

- **Entrée:** Envoyer des charges utiles Hue V2 pour effectuer des actions avancées (par exemple `msg.on = {on: true}`).
- **sortie:** Recevoir un objet d'événement `{Payé: Boolean, ON, Power_State, RawEvent}` Chaque fois que Hue signale un changement.

#### Référence de l'API Hue

Le nœud utilise `/ ressource / plug / {id}` sur https.Les modifications d'état sont fournies via le flux d'événements Hue et mises en cache pour les réponses KNX Read.

---

<span id="hue-controller-docs-button" data-hue-controller-type="button"></span>

## Bouton (`button`)

Le nœud du bouton Hue mappe les événements du bouton de teinte aux adresses du groupe KNX et expose les mêmes événements sur sa sortie de flux via <code> Button.button_report.event </code>.

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Bouton de teinte |Bouton de teinte à utiliser (assortiment automatique pendant la frappe) |

**Changer**

| Propriété | Description |
|-|-|
|Commutation |GA déclenché par <code> court \ _release </code> (appuyez rapidement / version).|
|Statut GA |Feedback facultatif GA lorsque <em> Les valeurs de basculement </em> sont activées pour maintenir l'état de bascule interne aligné avec d'autres actionneurs.|

**Faible**

| Propriété | Description |
|-|-|
|DIM |GA utilisé pendant <code> long \ _press </code> / <code> répéter </code> des événements pour la gradation (généralement DPT 3.007).|

**Comportement**

| Propriété | Description |
|-|-|
|Basculer les valeurs |S'il est activé, le nœud alterne entre <code> true / false </code> et les charges utiles de gradation / bas.|
|Changer la charge utile |La charge utile envoyée à KNX / Flow lorsque les valeurs de bascule sont désactivées.|
|Téléche utile DIM |Direction envoyée à KNX / Flow Lorsque les valeurs de bascule sont désactivées.|

##### sorties

1. Sortie standard
: `msg.payload` transporte le booléen (ou objet DIM) envoyé à KNX;`msg.event` est la chaîne d'événements de teinte (par exemple` short_release`, `repeat`).

##### Détails

`msg.event` reflète` bouton.button_report.event`.L'événement Hue original est exposé dans «msg.rawevent».Utilisez l'état facultatif GA pour maintenir l'état de bascule en synchronisation avec les commutateurs muraux ou d'autres contrôleurs.

---

<span id="hue-controller-docs-relative_rotary" data-hue-controller-type="relative_rotary"></span>

## Tap dial (`relative_rotary`)

Le Node **Hue Tap Dial** Maps Le service rotatif du Tap Down Tap To KNX et transmet les événements de teinte brute à votre flux.Utilisez l'icône d'actualisation à côté du champ de périphérique après avoir associé un nouveau cadran sur le pont.

Onglets ###

- **Mappage** - Sélectionnez le KNX GA et le DPT utilisés pour les événements de rotation.Points de données pris en charge: DPT 3.007 (relative DIM), DPT 5.001 (niveau absolu 0-100%) et DPT 232.600 (contrôle des couleurs du fournisseur).
- **comportement** - afficher ou masquer la broche de sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est configurée, la sortie est maintenue activée, les événements de teinte atteignent toujours le flux.

##### Paramètres généraux

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway utilisée pour GA Assomple automatique.|
|Hue Bridge |Hue Bridge hébergeant le cadran du robinet.|
|Hue Tap Dial |Dispositif rotatif à contrôler (Ambordage automatique; le bouton de rafraîchissement recharge la liste).|

Onglet de mappage ###

| Propriété | Description |
|-|-|
|Tourner GA |KNX GA Receiving Rotation Events (prend en charge DPT 3.007, 5.001, 232.600).|
|Nom |Étiquette amicale pour le GA.|

##### sorties

| # | Port | Télélée utile |
|-|-| - |
| 1 | Sortie standard | `msg.payload` (objet) Événement de teinte brute émise par le cadran du robinet. |

> ℹ️ Les widgets spécifiques à KNX n'apparaissent qu'après avoir sélectionné une passerelle KNX;L'onglet de mappage reste caché jusqu'à la configuration du pont et de la passerelle.

---

<span id="hue-controller-docs-motion" data-hue-controller-type="motion"></span>

## Mouvement (`motion`)

Ce nœud écoute un capteur de mouvement de teinte et reflète les événements de KNX et / ou de votre flux rouge-rouge.

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les suggestions apparaissent pendant que vous tapez.Appuyez sur le bouton d'actualisation à côté du "capteur Hue" pour recharger la liste des périphériques à partir du pont si vous ajoutez de nouveaux capteurs.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway qui reçoit les mises à jour de mouvement (requise avant que les champs de mappage KNX n'apparaissent).|
|Hue Bridge |Hue Bridge à la question.|
|Capteur de mouvement de la teinte |Capteur de mouvement Hue (prend en charge la saisie semi-automatique et la rafraîchissement).|

**Mappage**

| Propriété | Description |
|-|-|
|Motion |KNX GA qui reçoit «True» lorsque le mouvement est détecté et «faux» lorsque la zone est claire.DPT recommandé: <b> 1.001 </b>.|

**Comportement**

| Propriété | Description |
|-|-|
|Pin de sortie de nœud |Afficher ou masquer la sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est sélectionnée, la broche de sortie reste activée afin que les événements de mouvement de teinte atteignent toujours votre flux.|

> ℹ️ Les widgets KNX restent cachés jusqu'à ce que vous sélectionniez une passerelle KNX, ce qui facilite l'utilisation du nœud purement comme une teinte → Écouteur rouge-rouge.

##### Sortir

1. Sortie standard - `msg.payload` (booléen)
: «True» sur le mouvement, «False» lorsque le mouvement se termine.

---

<span id="hue-controller-docs-area_motion" data-hue-controller-type="area_motion"></span>

## Mouvement de zone (`area_motion`)

Le nœud Hue Motion Area écoute les événements de mouvement agrégés d’une zone MotionAware (Hue Bridge Pro) et reflète l’état mouvement / pas de mouvement vers KNX ou votre flow Node-RED.

Commencez à saisir le nom ou l’adresse de groupe KNX dans le champ GA ; des suggestions apparaissent au fil de la saisie.

**Général**

|Propriété|Description|
|--|--|
| KNX GW | Passerelle KNX utilisée pour recevoir l’état de mouvement de la zone. |
| HUE Bridge | Hue Bridge Pro à utiliser. |
| HUE Area | Zone MotionAware (convenience ou security) à surveiller (saisie semi-automatique). |
| Lire l'état au démarrage | Au démarrage / à la reconnexion lit la valeur courante et l’envoie à KNX (par défaut : oui). |

**Mappage**

|Propriété|Description|
|--|--|
| Mouvement | GA KNX pour l’état de mouvement de la zone (booléen). DPT recommandé : <b>1.001</b>. |

**Comportement**

|Propriété|Description|
|--|--|
| Broche de sortie du nœud | Affiche ou masque la sortie Node-RED. Sans passerelle KNX, la sortie reste active afin que les événements MotionAware atteignent toujours votre flow. |

##### Sortie

1. Sortie standard
   : `msg.payload` (booléen) : `true` lorsque la zone est en mouvement, sinon `false`.

##### Détails

`msg.payload` contient le dernier état de mouvement agrégé fourni par le service MotionAware de la zone sélectionnée.

---

<span id="hue-controller-docs-camera_motion" data-hue-controller-type="camera_motion"></span>

## Mouvement de caméra (`camera_motion`)

Le nœud de mouvement de la caméra Hue écoute les services de mouvement de la caméra Hue Philips et reflète l'état détecté / non détecté à KNX.

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Motion de la caméra Hue |Capteur de mouvement de la caméra Hue (assortiment automatique pendant la frappe) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Motion |KNX GA pour le mouvement de la caméra (booléen).DPT recommandé: <b> 1.001 </b> |

##### sorties

1. Sortie standard
: `msg.payload` (booléen):« true »lorsque le mouvement est détecté;Sinon, «faux»

##### Détails

`msg.payload` comporte le dernier état de mouvement rapporté par le service de caméra Hue.

---

<span id="hue-controller-docs-contact" data-hue-controller-type="contact"></span>

## Contact (`contact`)

Ce nœud transmet les événements d'un capteur de contact de teinte et les mappe aux adresses de groupe KNX.

Commencez à taper le champ GA, le nom ou l'adresse de groupe de votre appareil KNX, les périphériques AVAIable commencent à apparaître pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de contact de la teinte |Capteur de contact de la teinte à utiliser (assortiment automatique pendant la frappe). |

|Propriété |Description |
|-|-|
|Contact |Lorsque le contact s'ouvre / ferme, envoyez une valeur KNX: _true_ sur actif / ouvert, sinon _false_.|

##### sorties

1. Sortie standard
: charge utile (booléen): la sortie standard de la commande.

##### Détails

`msg.payload` propose l'événement Raw Hue (boolean / objet).Utilisez-le pour une logique personnalisée si nécessaire.

---

<span id="hue-controller-docs-light_level" data-hue-controller-type="light_level"></span>

## Niveau de lumière (`light_level`)

Ce nœud lit les événements lux à partir d'un capteur de lumière de teinte et les mappe à Knx.

Il émet l'illuminance ambiante (lux) chaque fois qu'il change.Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de lumière |Capteur de lumière Hue à utiliser (assortiment automatique pendant la frappe). |
|Lire l'état au démarrage |Lisez l'état au démarrage et émettez l'événement dans le bus KNX au démarrage / reconnexion.(Par défaut "non") |

**Mappage**

|Propriété |Description |
|-|-|
|Lux |KNX GA qui reçoit la valeur lux.|

##### sorties

1. Sortie standard
: charge utile (numéro): valeur lux actuelle.

##### Détails

`msg.payload` comporte la valeur lux numérique.Utilisez-le pour une logique personnalisée si nécessaire.

---

<span id="hue-controller-docs-temperature" data-hue-controller-type="temperature"></span>

## Température (`temperature`)

Ce nœud lit la température (° C) à partir d'un capteur de température de teinte et le mappe à Knx.

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de température de teinte |Capteur de température de la teinte (Ambordage automatique pendant la saisie) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Temps |KNX GA pour la température à Celsius.DPT recommandé: <b> 9.001 </b> |

##### sorties

1. Sortie standard
: `msg.payload` (nombre): température du courant en ° C

##### Détails

`msg.payload` comporte la valeur de température numérique.

---

<span id="hue-controller-docs-humidity" data-hue-controller-type="humidity"></span>

## Humidité (`humidity`)

Ce nœud lit l'humidité relative (%) à partir d'un capteur d'humidité de teinte et le mappe à Knx.

Commencez à taper le champ GA (nom ou adresse de groupe) pour lier le KNX GA;Les appareils apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Capteur de teinte |Capteur d'humidité de la teinte (assortiment automatique pendant la frappe) |
|Lire l'état au démarrage |Au démarrage / reconnecter, lisez la valeur actuelle et envoyez-la à KNX (par défaut: non) |

**Mappage**

| Propriété | Description |
|-|-|
|Humidité |KNX GA pour l'humidité relative%.DPT recommandé: <b> 9.007 </b> |

##### sorties

1. Sortie standard
: `msg.payload` (numéro): Humidité relative actuelle en%

##### Détails

`msg.payload` comporte la valeur d'humidité numérique (pourcentage).

---

<span id="hue-controller-docs-scene" data-hue-controller-type="scene"></span>

## Scène (`scene`)

Le nœud **Hue Scene** expose des scènes de teinLe champ de scène prend en charge la saisie semi-automatique;Utilisez l'icône d'actualisation après avoir ajouté des scènes sur le pont afin que la liste reste à jour.

##### Tabs en un coup d'œil

- **Mapping** - Lien des adresses de groupe KNX à la scène Hue sélectionnée.DPT 1.xxx effectue un rappel Boolean, tandis que DPT 18.xxx envoie un numéro de scène KNX.
- **Multi Scene** - Créez une liste de règles qui associe les numéros de scène KNX à différentes scènes de teintes et choisit si chaque scène est rappelée comme _ACTIVE_, _DYMAMIC \ _PALETTE_ ou _STATIC_.
- **comportement** - basculer la broche de sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est configurée, la broche reste activée afin que les événements de pont atteignent toujours l'écoulement.

##### Paramètres généraux

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway Fourniture du catalogue d'adresses utilisé pour la saisie semi-automatique.|
|Hue Bridge |Hue Bridge qui héberge les scènes.|
|Scène de teinte |Scène à rappeler (Ambordage automatique; Bouton de rafraîchissement recharge le catalogue du pont).|

Onglet de mappage ###

| Propriété | Description |
|-|-|
|Rappel |Adresse du groupe KNX qui rappelle la scène.Utilisez DPT 1.xxx pour le contrôle booléen ou DPT 18.xxx pour transmettre un numéro de scène KNX.|
|DPT |DataPoint utilisé avec le rappel GA (1.xxx ou 18.001).|
|Nom |Étiquette amicale pour le rappel GA.|
|# |Apparaît lorsqu'une scène KNX DPT est choisie;Sélectionnez le numéro de scène KNX à envoyer.|
|Statut GA |Boolean GA en option qui reflète si la scène est actuellement active.|

Onglet ### Multi Scene

| Propriété | Description |
|-|-|
|Rappel |KNX GA (DPT 18.001) qui sélectionne les scènes par numéro.|
|Sélecteur de scène |Liste modifiable qui mappe les numéros de scène KNX aux scènes de teinte avec le mode de rappel souhaité.La traînée gère les entrées de réorganisation.|

> ℹ️ Les widgets spécifiques au KNX n'apparaissent qu'après la sélection d'une passerelle KNX.Les onglets de mappage restent masqués jusqu'à la configuration du pont et de la passerelle.

---

<span id="hue-controller-docs-device_power" data-hue-controller-type="device_power"></span>

## Batterie (`device_power`)

Ce nœud expose le niveau de batterie d'un dispositif de teinte à KNX et soulève un événement chaque fois que la valeur change.

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les entrées correspondantes apparaissent pendant que vous tapez.Utilisez l'icône de rafraîchissement à côté de <q> capteur de teinte </Q> pour recharger la liste à partir du pont de teinte après avoir ajouté de nouveaux appareils.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway a utilisé pour publier le niveau de la batterie (requis avant l'apparition des champs de mappage KNX).|
|Hue Bridge |Hue Bridge qui héberge l'appareil.|
|Capteur de batterie de teintes |Dispositif / capteur Hue Fournissant le niveau de la batterie (prend en charge la saisie semi-automatique et la rafraîchissement).|

**Mappage**

| Propriété | Description |
|-|-|
|Niveau |KNX GA pour le pourcentage de batterie (0-100%).DPT recommandé: <b> 5.001 </b>.|

**Comportement**

| Propriété | Description |
|-|-|
|Lire l'état au démarrage |Sur le déploiement / reconnecter, lisez la valeur actuelle de la batterie et publiez-la à KNX.Par défaut: "Oui".|
|Pin de sortie de nœud |Afficher ou masquer la sortie du nœud-rouge.Lorsqu'aucune passerelle KNX n'est sélectionnée, la sortie reste activée, les événements de teinte continuent d'atteindre le flux.|

> ℹ️ Les widgets de mappage KNX restent cachés jusqu'à ce qu'une passerelle KNX soit sélectionnée.Cela maintient l'éditeur bien rangé lorsque le nœud est utilisé uniquement pour transmettre les événements de teinte dans Node-Red.

---

<span id="hue-controller-docs-zigbee_connectivity" data-hue-controller-type="zigbee_connectivity"></span>

## Connectivité Zigbee (`zigbee_connectivity`)

Ce nœud récupère l'état de connectivité ZigBee à partir d'un périphérique de teinte et l'expose à KNX.

Commencez à taper le nom du périphérique KNX ou l'adresse de groupe dans le champ GA;Les suggestions apparaissent pendant que vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |KNX Gateway avait l'habitude de publier le statut.|
|Hue Bridge |Hue Bridge à la question.|
|Connectivité Hue Zigbee |Capteur / appareil Hue Fournissant les informations de connectivité ZigBee.Assomple automatique pendant la saisie.|

**Mappage**

| Propriété | Description |
|-|-|
|Statut |Adresse du groupe KNX qui reflète la connectivité zigbee.Devient _true_ lorsqu'il est connecté, sinon _false_.|
|Lire l'état au démarrage |Lit sur l'état actuel chez l'éditeur start / reconnection et émet à KNX.Par défaut: "Oui".|

##### sorties

1. Sortie standard
: charge utile (booléen): état de connectivité.

##### Détails

`msg.payload` porte l'état booléen (true / false). \
`msg.status` contient un statut textuel: l'un des **connectés, déconnectés, connectivité \ _issue, unidirectional \ _incoming** .

---

<span id="hue-controller-docs-device_software_update" data-hue-controller-type="device_software_update"></span>

## Mise à jour logicielle (`device_software_update`)

Ce nœud surveille si un périphérique Hue sélectionné a une mise à jour logicielle disponible et publie le statut de KNX.

Commencez à taper le nom ou l'adresse de groupe de votre appareil KNX dans le champ GA, les périphériques AVAIable commencent à apparaître pendant que
vous tapez.

**Général**

| Propriété | Description |
|-|-|
|KNX GW |Sélectionnez la passerelle KNX à utiliser |
|Hue Bridge |Sélectionnez la Hue Bridge à utiliser |
|Dispositif |Appareil Hue pour surveiller les mises à jour logicielles (assortie automatique pendant la frappe). |

**Mappage**

|Propriété |Description |
|-|-|
|Statut |KNX GA reflétant l'état de mise à jour._True_ Si une mise à jour est disponible / prêt / en cours d'installation, sinon _false_.|
|Lire l'état au démarrage |Lisez l'état actuel au démarrage / reconnexion et émettez à KNX (par défaut "Oui").|

##### sorties

1. Sortie standard
: charge utile (booléen): mettent à jour le drapeau.
: Status (String): l'un de **no \ _update, Update \ _Pending, Ready \ _To \ _install, installation** .

<!-- HUE_CONTROLLER_PROFILE_DOCS_END -->
