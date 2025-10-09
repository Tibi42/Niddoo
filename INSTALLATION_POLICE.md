# Installation de la police TT Interphases Pro

## 📥 Téléchargement

1. **Visitez le site DaFont** : [TT Interphases Pro](https://www.dafont.com/fr/tt-interphases-pro.font)
2. **Cliquez sur "Télécharger"**
3. **Extrayez le fichier ZIP** téléchargé

## 📁 Installation dans le projet

1. **Ouvrez le dossier** `public/assets/fonts/` du projet
2. **Copiez les fichiers de police** (.ttf ou .otf) dans ce dossier
3. Les fichiers devraient être nommés ainsi :
   - `TTInterphasesPro-Regular.ttf`
   - `TTInterphasesPro-Bold.ttf`
   - `TTInterphasesPro-Light.ttf` (optionnel)
   - `TTInterphasesPro-Medium.ttf` (optionnel)

## ✅ Configuration déjà effectuée

La configuration CSS a déjà été faite pour vous :

- ✓ Fichier `src/fonts.css` créé avec les définitions @font-face
- ✓ Import dans `src/main.jsx`
- ✓ Police appliquée dans `src/index.css` et `src/App.css`

## 🚀 Utilisation

Une fois les fichiers de police copiés dans le dossier `public/assets/fonts/`, la police TT Interphases Pro sera automatiquement utilisée sur tout le site !

Si les fichiers ne sont pas trouvés, le site utilisera les polices de secours (system-ui, Avenir, Helvetica, Arial).

## ⚖️ Licence

**Usage personnel uniquement** (gratuit)

Pour un usage commercial, veuillez acheter une licence sur [TypeType](https://typetype.org).

## 🔍 Vérification

Pour vérifier que la police fonctionne :

1. Ouvrez les outils de développement du navigateur (F12)
2. Allez dans l'onglet "Elements" ou "Inspecteur"
3. Sélectionnez un élément de texte
4. Dans l'onglet "Computed" ou "Calculé", vérifiez la propriété `font-family`
5. Vous devriez voir "TT Interphases Pro" si les fichiers sont correctement installés
