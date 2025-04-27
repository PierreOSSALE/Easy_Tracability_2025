##//src/backend/entrypoint.sh
#!/bin/sh

echo "⏳ Attente de la base de données..."
./wait-for-it.sh db 3306

echo "🌱 Vérification si la base a besoin d'être seedée..."

# Seed la DB si on ne l'a pas déjà fait
if [ ! -f "./.seeded" ]; then
  echo "🧪 Running seeders..."
  npm run seed
  touch ./.seeded
else
  echo "✅ Les seeders ont déjà été exécutés. Skip."
fi

echo "🚀 Démarrage du backend en mode dev..."
npm run dev
