from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import csv
import io
import os
from typing import List, Dict, Any
import aiofiles

app = FastAPI(
    title="SERP Checker", 
    description="Outil pour scraper les SERP via ValueSerp API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration ValueSerp API
VALUESERP_API_KEY = os.getenv("VALUESERP_API_KEY", "your_api_key_here")
VALUESERP_API_URL = "https://api.valueserp.com/search"

# Servir les fichiers statiques
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    async with aiofiles.open("static/index.html", mode="r", encoding="utf-8") as f:
        content = await f.read()
    return HTMLResponse(content=content)

@app.post("/api/scrape-serp")
async def scrape_serp(request: Dict[str, Any]):
    """
    Scrape les SERP pour une liste de mots-clés
    """
    keywords = request.get("keywords", [])
    api_key = request.get("api_key", "")
    
    if not keywords:
        raise HTTPException(status_code=400, detail="Aucun mot-clé fourni")
    
    if not api_key:
        raise HTTPException(status_code=400, detail="Clé API requise")
    
    results = []
    
    for keyword in keywords:
        keyword = keyword.strip()
        if not keyword:
            continue
            
        try:
            # Appel à l'API ValueSerp
            params = {
                "api_key": api_key,
                "q": keyword,
                "gl": "fr",  # France
                "hl": "fr",  # Langue française
                "num": 10    # Nombre de résultats
            }
            
            response = requests.get(VALUESERP_API_URL, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Traitement des résultats
            serp_results = []
            if "organic_results" in data:
                for i, result in enumerate(data["organic_results"], 1):
                    serp_results.append({
                        "position": i,
                        "titre": result.get("title", ""),
                        "url": result.get("link", ""),
                        "snippet": result.get("snippet", ""),
                        "type_resultat": "organique"
                    })
            
            # Ajout des résultats vidéo si disponibles
            if "video_results" in data:
                for i, result in enumerate(data["video_results"], len(serp_results) + 1):
                    serp_results.append({
                        "position": i,
                        "titre": result.get("title", ""),
                        "url": result.get("link", ""),
                        "snippet": result.get("snippet", ""),
                        "type_resultat": "video"
                    })
            
            results.append({
                "mot_cle": keyword,
                "serp_results": serp_results
            })
            
        except requests.exceptions.RequestException as e:
            results.append({
                "mot_cle": keyword,
                "serp_results": [],
                "error": f"Erreur API: {str(e)}"
            })
        except Exception as e:
            results.append({
                "mot_cle": keyword,
                "serp_results": [],
                "error": f"Erreur: {str(e)}"
            })
    
    return {"results": results}

@app.post("/api/download-csv")
async def download_csv(data: Dict[str, Any]):
    """
    Génère et retourne un fichier CSV des résultats SERP
    """
    output = io.StringIO()
    writer = csv.writer(output)
    
    # En-têtes
    writer.writerow(["Mot-clé", "Position", "Titre", "URL", "Snippet", "Type de résultat"])
    
    # Données
    for result in data.get("results", []):
        keyword = result.get("mot_cle", "")
        for serp_result in result.get("serp_results", []):
            writer.writerow([
                keyword,
                serp_result.get("position", ""),
                serp_result.get("titre", ""),
                serp_result.get("url", ""),
                serp_result.get("snippet", ""),
                serp_result.get("type_resultat", "")
            ])
    
    output.seek(0)
    csv_content = output.getvalue()
    
    return {
        "filename": "serp_results.csv",
        "content": csv_content,
        "content_type": "text/csv"
    }

@app.post("/api/download-json")
async def download_json(data: Dict[str, Any]):
    """
    Retourne les résultats au format JSON
    """
    return {
        "filename": "serp_results.json",
        "content": json.dumps(data.get("results", []), ensure_ascii=False, indent=2),
        "content_type": "application/json"
    }

# Endpoint de santé pour vérifier que l'API fonctionne
@app.get("/health")
async def health_check():
    """Endpoint de santé pour vérifier que l'API fonctionne"""
    return {
        "status": "healthy",
        "message": "SERP Checker API fonctionne correctement",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 