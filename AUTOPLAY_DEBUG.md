# Guide de dépannage pour l'Autoplay (DisTube v5.x)

## 🎵 Comment fonctionne l'autoplay dans DisTube v5.x :

- L'autoplay est **natif** et utilise **YouTube Music** pour les recommandations
- Plus besoin d'options spéciales dans la configuration
- L'autoplay fonctionne automatiquement quand activé avec `/autoplay`

## Étapes pour tester l'autoplay :

1. **Lancer une musique populaire** avec `/play` (ex: "despacito", "shape of you", "bad bunny")
2. **Activer l'autoplay** avec `/autoplay`
3. **Vérifier le statut** avec `/autoplay-status`
4. **Attendre que la musique se termine** ou utiliser `/skip`
5. **Observer les logs** pour voir si DisTube trouve des musiques recommandées

## ⚠️ Points importants DisTube v5.x :

### Configuration validée :
```javascript
client.distube = new Distube(client, {
    plugins: [new YouTubePlugin()],
    emitNewSongOnly: true,
    savePreviousSongs: true,
    nsfw: false,
});
```

### Options supprimées dans v5.x :
- ❌ `searchSongs` (n'existe plus)
- ❌ `leaveOnEmpty` (géré automatiquement)  
- ❌ `leaveOnFinish` (géré automatiquement)
- ❌ `emptyCooldown` (géré automatiquement)

## 🔍 Problèmes possibles :

### 1. YouTube ne trouve pas de recommandations
- Essayer avec des **musiques très populaires**
- Vérifier que la musique actuelle est **disponible sur YouTube Music**
- Les musiques obscures ou très récentes peuvent ne pas avoir de recommandations

### 2. Configuration incorrecte
- S'assurer que DisTube v5.x est bien installé
- Vérifier que YouTubePlugin est à jour

### 3. Événements
- Les nouveaux événements `empty`, `noRelated`, `addSong` doivent être chargés

## 🛠️ Commandes de debug :
- `/autoplay-status` : Voir le statut complet
- `/autoplay` : Activer/désactiver l'autoplay
- Regarder les logs du serveur pour les événements DisTube

## 📊 Logs à surveiller :
- `[DISTUBE_FINISH_SONG]` : Quand une musique se termine
- `[DISTUBE_EMPTY]` : Quand la queue devient vide  
- `[DISTUBE_ADD_SONG]` : Quand une nouvelle musique est ajoutée
- `[DISTUBE_NO_RELATED]` : Quand aucune musique recommandée n'est trouvée

## 🎯 Test recommandé avec nouvelles commandes :

### 🧪 **Méthode de test automatisée :**
1. `/test-autoplay` avec "Pop populaire (Ed Sheeran)"
2. Observer les logs détaillés
3. Attendre la fin ou `/skip`
4. Vérifier si des musiques sont ajoutées automatiquement

### 🔍 **Méthode de test manuelle :**
1. `/play never gonna give you up` (Rick Astley)
2. `/autoplay` pour activer  
3. `/autoplay-status` pour vérifier
4. `/skip` et attendre les recommandations

**Rick Astley et Ed Sheeran ont TOUJOURS des recommandations sur YouTube Music ! 😄**

## 🛠️ Nouvelles commandes de debug :
- `/test-autoplay` : Test automatisé avec musiques garanties
- `/autoplay-status` : Voir le statut complet
- `/autoplay` : Activer/désactiver l'autoplay
