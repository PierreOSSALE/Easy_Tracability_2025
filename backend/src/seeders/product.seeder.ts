// backend/seeders/product.seeder.ts
import { ProductModel } from "../models/product";

export async function seedProducts() {
  const products = [
    {
      uuid: "a12bc3d4-5678-4ef0-8abc-1234567890ab",
      name: "Pommes Golden",
      barcode: "12345678901234",
      description: "Pommes douces, parfaites pour les tartes",
      price: 2.5,
      stockQuantity: 150,
      imageUrl: "../../../frontend/src/assets/apple-174861_1920.jpg",
    },
    {
      uuid: "b23cd4e5-6789-4f01-9bcd-2345678901bc",
      name: "Pain Complet Bio",
      barcode: "98765432109876",
      description: "Pain bio à base de farine complète",
      price: 3.1,
      stockQuantity: 20,
      imageUrl:
        "../../../frontend/src/assets/Bio-Sonnenblumenkern-Brot-Switzerland.jpg",
    },
    {
      uuid: "c34de5f6-7890-4f12-abcd-3456789012cd",
      name: "Jus d'orange",
      barcode: "54321098765432",
      description: "Pur jus pressé sans sucre ajouté",
      price: 1.9,
      stockQuantity: 200,
      imageUrl:
        "../../../frontend/src/assets/JUS-DELICE-DE-FRUITS-AU-ORANGE-1L.jpg",
    },
    {
      uuid: "d45ef6a7-8901-4f23-bcde-4567890123de",
      name: "Lait Entier Bio",
      barcode: "11112222333344",
      description: "Lait entier issu de l'agriculture biologique",
      price: 1.5,
      stockQuantity: 120,
      imageUrl: "../../../frontend/src/assets/lait_bio_entier.png",
    },
    {
      uuid: "e56fa7b8-9012-4f34-cdef-5678901234ef",
      name: "Fromage Brie",
      barcode: "55556666777788",
      description: "Fromage de Brie fondant et savoureux",
      price: 5.9,
      stockQuantity: 50,
      imageUrl: "../../../frontend/src/assets/briefamily-2-1.png",
    },
    {
      uuid: "f67ab8c9-0123-4f45-def0-6789012345f0",
      name: "Bananes",
      barcode: "99990000111122",
      description: "Bananes fraîches importées",
      price: 1.2,
      stockQuantity: 180,
      imageUrl: "../../../frontend/src/assets/banana.jpg",
    },
    {
      uuid: "a78bc9d0-1234-4f56-ef01-7890123456a1",
      name: "Carottes Bio",
      barcode: "33334444555566",
      description: "Carottes biologiques riches en vitamines",
      price: 2.0,
      stockQuantity: 0,
      imageUrl: "../../../frontend/src/assets/carottes-bio.jpg",
    },
    {
      uuid: "b89cd0e1-2345-4f67-f012-8901234567b2",
      name: "Yaourt Nature",
      barcode: "77778888999900",
      description: "Yaourt nature sans sucre ajouté",
      price: 0.9,
      stockQuantity: 250,
      imageUrl: "../../../frontend/src/assets/100017701_46b8.jpg",
    },
    {
      uuid: "c90de1f2-3456-4f78-0123-9012345678c3",
      name: "Eau Minérale",
      barcode: "11223344556677",
      description: "Eau de source naturelle en bouteille",
      price: 0.6,
      stockQuantity: 300,
      imageUrl: "../../../frontend/src/assets/eaux-minerales.jpg",
    },
    {
      uuid: "d01ef2a3-4567-4f89-1234-0123456789d4",
      name: "Poulet Fermier",
      barcode: "22334455667788",
      description: "Poulet fermier élevé en plein air",
      price: 7.5,
      stockQuantity: 40,
      imageUrl: "../../../frontend/src/assets/poulet-fermier.jpg",
    },
    {
      uuid: "e12fa3b4-5678-4f90-2345-1234567890e5",
      name: "Tomates Cœur de Bœuf",
      barcode: "33445566778899",
      description: "Tomates cœur de bœuf juteuses et charnues",
      price: 3.2,
      stockQuantity: 90,
      imageUrl:
        "../../../frontend/src/assets/istockphoto-501964847-612x612.jpg",
    },
    {
      uuid: "f23ab4c5-6789-4fa1-3456-2345678901f6",
      name: "Café Moulu",
      barcode: "44556677889900",
      description: "Café moulu pur Arabica",
      price: 4.3,
      stockQuantity: 3,
      imageUrl: "../../../frontend/src/assets/cafe-moulu.jpg",
    },
    {
      uuid: "a34bc5d6-7890-4fb2-4567-3456789012a7",
      name: "Shampoing Doux",
      barcode: "55667788990011",
      description: "Shampoing pour usage quotidien sans sulfates",
      price: 6.2,
      stockQuantity: 60,
      imageUrl: "../../../frontend/src/assets/shampoing.jpeg",
    },
    {
      uuid: "b45cd6e7-8901-4fc3-5678-4567890123b8",
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
