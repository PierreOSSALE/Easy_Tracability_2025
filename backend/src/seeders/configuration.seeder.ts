// EASY-TRACABILITY: backend/seeders/inventoryMovement.seeder.ts
import { ConfigurationModel } from "../models/configuration";

export async function seedConfigurations() {
  const parameters = [
    {
      uuid: "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
      parameterKey: "critical_stock_threshold",
      parameterValue: "5",
      lastModifiedAt: new Date(),
    },
    {
      uuid: "b2c3d4e5-f6a7-8901-2345-6789abcdef01",
      parameterKey: "report_format",
      parameterValue: "PDF",
      lastModifiedAt: new Date(),
    },
    {
      uuid: "c3d4e5f6-a7b8-9012-3456-789abcdef012",
      parameterKey: "report_frequency",
      parameterValue: "weekly",
      lastModifiedAt: new Date(),
    },
    {
      uuid: "d4e5f6a7-b8c9-0123-4567-89abcdef0123",
      parameterKey: "enable_notifications",
      parameterValue: "true",
      lastModifiedAt: new Date(),
    },
    {
      uuid: "e5f6a7b8-c9d0-1234-5678-9abcdef01234",
      parameterKey: "max_users",
      parameterValue: "100",
      lastModifiedAt: new Date(),
    },
    {
      uuid: "f6a7b8c9-d0e1-2345-6789-abcdef012345",
      parameterKey: "role_permissions",
      parameterValue: JSON.stringify({
        Administrateur: ["ALL"],
        Gestionnaire: ["READ", "WRITE"],
        Operateur: ["READ"],
      }),
      lastModifiedAt: new Date(),
    },
    {
      uuid: "a7b8c9d0-e1f2-3456-789a-bcdef0123456",
      parameterKey: "theme_color",
      parameterValue: "#2E86C1",
      lastModifiedAt: new Date(),
    },
  ];

  await ConfigurationModel.bulkCreate(parameters);
  console.log("✅ Configurations seeded");
}
