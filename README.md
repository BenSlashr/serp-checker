# SERP Checker

Outil ultra-simple pour scraper les SERP (Search Engine Results Pages) via l'API ValueSerp avec une interface web moderne.

## 🚀 Fonctionnalités

- **Interface web intuitive** : Interface HTML/JS/CSS moderne et responsive
- **Scraping SERP** : Récupération des résultats de recherche pour vos mots-clés
- **Export multiple** : Téléchargement des résultats en CSV ou JSON
- **API FastAPI** : Backend robuste et performant
- **Gestion d'erreurs** : Interface claire pour les erreurs et exceptions
- **Déploiement Docker** : Configuration simple avec Docker Compose

## 📋 Prérequis

- Python 3.8+ (pour le développement local)
- Docker et Docker Compose (pour le déploiement)
- Clé API ValueSerp (obtenez-la sur [valueserp.com](https://valueserp.com))

## 🛠️ Installation

### Option 1 : Développement local

1. **Cloner le projet**
   ```bash
   git clone https://github.com/BenSlashr/serp-checker.git
   cd serp-checker
   ```

2. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurer la clé API**
   
   **Option 1 : Variable d'environnement (recommandé)**
   ```bash
   export VALUESERP_API_KEY="votre_cle_api_ici"
   ```
   
   **Option 2 : Modifier directement dans le code**
   Éditez `main.py` et remplacez `"your_api_key_here"` par votre clé API.

4. **Lancer l'application**
   ```bash
   python main.py
   ```

### Option 2 : Déploiement Docker

1. **Cloner le projet**
   ```bash
   git clone https://github.com/BenSlashr/serp-checker.git
   cd serp-checker
   ```

2. **Configurer la clé API**
   ```bash
   export VALUESERP_API_KEY="votre_cle_api_ici"
   ```

3. **Créer le réseau Docker (si nécessaire)**
   ```bash
   docker network create seo-tools-network
   ```

4. **Lancer avec Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🌐 URLs d'accès

### Développement local
- Interface web : http://localhost:8000/serp-checker/
- Documentation API : http://localhost:8000/serp-checker/docs
- Endpoint de santé : http://localhost:8000/serp-checker/health

### Déploiement Docker
- Interface web : http://localhost:8015/serp-checker/
- Documentation API : http://localhost:8015/serp-checker/docs
- Endpoint de santé : http://localhost:8015/serp-checker/health

### Production (agence-slashr.fr)
- Interface web : https://agence-slashr.fr/serp-checker/
- Documentation API : https://agence-slashr.fr/serp-checker/docs
- Endpoint de santé : https://agence-slashr.fr/serp-checker/health

## 📖 Utilisation

### 1. Interface Web

1. Ouvrez votre navigateur et allez sur l'URL correspondante
2. Saisissez votre clé API ValueSerp dans le champ correspondant
3. Collez vos mots-clés dans la zone de texte (1 mot-clé par ligne)
4. Cliquez sur "Lancer le scraping SERP"
5. Attendez le traitement des résultats
6. Téléchargez les résultats en CSV ou JSON

### 2. Exemple de mots-clés

```
vice caché immobilier
créer sa micro-entreprise
réparation smartphone
formation python
```

### 3. Format des résultats

#### JSON
```json
[
  {
    "mot_cle": "vice caché immobilier",
    "serp_results": [
      {
        "position": 1,
        "titre": "Vice caché immobilier : définition, recours et délais",
        "url": "https://www.service-public.fr/particuliers/vosdroits/F11007",
        "snippet": "Un vice caché est un défaut qui rend le logement impropre à l'habitation...",
        "type_resultat": "organique"
      }
    ]
  }
]
```

#### CSV
```csv
Mot-clé,Position,Titre,URL,Snippet,Type de résultat
vice caché immobilier,1,Vice caché immobilier : définition...,https://www.service-public.fr/...,Un vice caché est un défaut...,organique
```

## 🔧 Configuration

### Variables d'environnement

- `VALUESERP_API_KEY` : Votre clé API ValueSerp

### Paramètres de l'API

Dans `main.py`, vous pouvez modifier :

- `gl` : Pays de recherche (défaut: "fr" pour la France)
- `hl` : Langue (défaut: "fr" pour le français)
- `num` : Nombre de résultats par mot-clé (défaut: 10)

## 📁 Structure du projet

```
SERP-checker/
├── main.py              # API FastAPI principale
├── requirements.txt      # Dépendances Python
├── Dockerfile           # Configuration Docker
├── docker-compose.yml   # Configuration Docker Compose
├── .dockerignore        # Fichiers ignorés par Docker
├── .gitignore          # Fichiers ignorés par Git
├── README.md           # Documentation
└── static/             # Fichiers frontend
    ├── index.html      # Interface utilisateur
    ├── style.css       # Styles CSS
    └── script.js       # JavaScript client
```

## 🔌 API Endpoints

- `GET /serp-checker/` : Interface web principale
- `GET /serp-checker` : Interface web (sans slash final)
- `POST /serp-checker/api/scrape-serp` : Scraping des SERP
- `POST /serp-checker/api/download-csv` : Téléchargement CSV
- `POST /serp-checker/api/download-json` : Téléchargement JSON
- `GET /serp-checker/health` : Endpoint de santé
- `GET /serp-checker/docs` : Documentation interactive de l'API

## 🐳 Commandes Docker utiles

```bash
# Construire l'image
docker-compose build

# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f serp-checker

# Arrêter les services
docker-compose down

# Redémarrer un service
docker-compose restart serp-checker

# Voir le statut des services
docker-compose ps
```

## 🐛 Dépannage

### Erreur de clé API
- Vérifiez que votre clé API ValueSerp est correcte
- Assurez-vous d'avoir des crédits disponibles sur votre compte

### Erreur de connexion
- Vérifiez votre connexion internet
- Vérifiez que l'API ValueSerp est accessible

### Problèmes Docker
- Vérifiez que Docker et Docker Compose sont installés
- Vérifiez que le réseau `seo-tools-network` existe
- Consultez les logs : `docker-compose logs serp-checker`

### Problèmes de performance
- Limitez le nombre de mots-clés par session
- Ajoutez des délais entre les requêtes si nécessaire

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## ⚠️ Avertissements

- Respectez les conditions d'utilisation de l'API ValueSerp
- N'abusez pas de l'API pour éviter la suspension de votre compte
- Utilisez cet outil de manière responsable et éthique

## 📞 Support

Pour toute question ou problème :

1. Vérifiez la documentation de l'API ValueSerp
2. Consultez les logs de l'application
3. Ouvrez une issue sur GitHub si nécessaire 