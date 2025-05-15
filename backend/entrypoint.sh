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










# ##//src/backend/entrypoint.sh
# #!/bin/sh
# set -e

# echo "⏳ Attente de la base de données (db:3306)..."
# ./wait-for-it.sh db 3306 --timeout=30 --strict -- echo "✔ Database ready"

# echo "🌱 Vérification si la base a besoin d'être seedée..."
# if [ ! -f "/usr/src/app/.seeded" ]; then
#   echo "🧪 Exécution des seeders..."
#   npm run seed
#   touch /usr/src/app/.seeded
# else
#   echo "✅ Seeders déjà exécutés, skip."
# fi

# echo "🚀 Démarrage du backend en mode ${NODE_ENV:-development}..."
# if [ "$NODE_ENV" = "production" ]; then
#   exec npm run start
# else
#   # Mode développement : hot-reload avec nodemon
#   exec nodemon --legacy-watch --watch src src/index.js
# fi
