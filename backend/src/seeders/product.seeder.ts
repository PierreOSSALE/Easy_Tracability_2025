// backend/seeders/product.seeder.ts
import { ProductModel } from "../models/product";

export async function seedProducts() {
  const products = [
    {
      name: "Pommes Golden",
      barcode: "12345678901234",
      description: "Pommes douces, parfaites pour les tartes",
      price: 2.5,
      stockQuantity: 150,
      imageUrl: "../../../frontend/src/assets/apple-174861_1920.jpg",
    },
    {
      name: "Pain Complet Bio",
      barcode: "98765432109876",
      description: "Pain bio à base de farine complète",
      price: 3.1,
      stockQuantity: 20,
      imageUrl:
        "../../../frontend/src/assets/Bio-Sonnenblumenkern-Brot-Switzerland.jpg",
    },
    {
      name: "Jus d'orange",
      barcode: "54321098765432",
      description: "Pur jus pressé sans sucre ajouté",
      price: 1.9,
      stockQuantity: 200,
      imageUrl:
        "../../../frontend/src/assets/JUS-DELICE-DE-FRUITS-AU-ORANGE-1L.jpg",
    },
    {
      name: "Lait Entier Bio",
      barcode: "11112222333344",
      description: "Lait entier issu de l'agriculture biologique",
      price: 1.5,
      stockQuantity: 120,
      imageUrl: "../../../frontend/src/assets/lait_bio_entier.png",
    },
    {
      name: "Fromage Brie",
      barcode: "55556666777788",
      description: "Fromage de Brie fondant et savoureux",
      price: 5.9,
      stockQuantity: 50,
      imageUrl: "../../../frontend/src/assets/briefamily-2-1.png",
    },
    {
      name: "Bananes",
      barcode: "99990000111122",
      description: "Bananes fraîches importées",
      price: 1.2,
      stockQuantity: 180,
      imageUrl: "../../../frontend/src/assets/banana.jpg",
    },
    {
      name: "Carottes Bio",
      barcode: "33334444555566",
      description: "Carottes biologiques riches en vitamines",
      price: 2.0,
      stockQuantity: 0,
      imageUrl: "../../../frontend/src/assets/carottes-bio.jpg",
    },
    {
      name: "Yaourt Nature",
      barcode: "77778888999900",
      description: "Yaourt nature sans sucre ajouté",
      price: 0.9,
      stockQuantity: 250,
      imageUrl: "../../../frontend/src/assets/100017701_46b8.jpg",
    },
    {
      name: "Eau Minérale",
      barcode: "11223344556677",
      description: "Eau de source naturelle en bouteille",
      price: 0.6,
      stockQuantity: 300,
      imageUrl: "../../../frontend/src/assets/eaux-minerales.jpg",
    },
    {
      name: "Poulet Fermier",
      barcode: "22334455667788",
      description: "Poulet fermier élevé en plein air",
      price: 7.5,
      stockQuantity: 40,
      imageUrl: "../../../frontend/src/assets/poulet-fermier.jpg",
    },
    {
      name: "Tomates Cœur de Bœuf",
      barcode: "33445566778899",
      description: "Tomates cœur de bœuf juteuses et charnues",
      price: 3.2,
      stockQuantity: 90,
      imageUrl:
        "../../../frontend/src/assets/istockphoto-501964847-612x612.jpg",
    },
    {
      name: "Café Moulu",
      barcode: "44556677889900",
      description: "Café moulu pur Arabica",
      price: 4.3,
      stockQuantity: 3,
      imageUrl: "../../../frontend/src/assets/cafe-moulu.jpg",
    },
    {
      name: "Shampoing Doux",
      barcode: "55667788990011",
      description: "Shampoing pour usage quotidien sans sulfates",
      price: 6.2,
      stockQuantity: 60,
      imageUrl: "../../../frontend/src/assets/shampoing.jpeg",
    },
    {
      name: "Savon Liquide Mains",
      barcode: "66778899001122",
      description: "Savon liquide antibactérien pour les mains",
      price: 3.7,
      stockQuantity: 150,
      imageUrl: "../../../frontend/src/assets/savon-liquide.jpg",
    },
  ];

  await ProductModel.bulkCreate(products);
  console.log("✅ Products seeded");
}
