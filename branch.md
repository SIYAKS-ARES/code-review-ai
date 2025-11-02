git checkout main
git pull origin main

# 1. backend-api
git checkout -b backend-api
git push -u origin backend-api

# 2. ai-evaluation
git checkout main
git checkout -b ai-evaluation
git push -u origin ai-evaluation

# 3. frontend-ui
git checkout main
git checkout -b frontend-ui
git push -u origin frontend-ui

# 4. data-pipeline
git checkout main
git checkout -b data-pipeline
git push -u origin data-pipeline

# 5. docs-research
git checkout main
git checkout -b docs-research
git push -u origin docs-research
# 1. backend-api
git checkout backend-api
git pull origin backend-api
git checkout -b feature/your-task-name
# → Geliştirmeyi yap, commit et, push et, PR’ı backend-api’ya aç

# 2. ai-evaluation
git checkout ai-evaluation
git pull origin ai-evaluation
git checkout -b eval/your-task-name
# → Deneyleri yap, commit et, push et, PR’ı ai-evaluation’a aç

# 3. frontend-ui
git checkout frontend-ui
git pull origin frontend-ui
git checkout -b ui/your-task-name
# → Arayüz geliştir, commit et, push et, PR’ı frontend-ui’ya aç

# 4. data-pipeline
git checkout data-pipeline
git pull origin data-pipeline
git checkout -b data/your-task-name
# → ETL işlemleri yap, commit et, push et, PR’ı data-pipeline’a aç

# 5. docs-research
git checkout docs-research
git pull origin docs-research
git checkout -b docs/your-task-name
# → Rapor/doküman yaz, commit et, push et, PR’ı docs-research’a aç

