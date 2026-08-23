import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    throw new Error("SEED_ADMIN_PASSWORD must be set to at least 12 characters before seeding");
  }

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin",
      password,
      role: Role.ADMIN
    }
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Urban Hoodie",
        slug: "urban-hoodie",
        description: "Minimal everyday hoodie with a clean streetwear style.",
        price: 89,
        stock: 25,
        category: "Clothing",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80"
      },
      {
        name: "Classic Sneakers",
        slug: "classic-sneakers",
        description: "Comfortable sneakers for daily wear.",
        price: 129,
        stock: 18,
        category: "Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
      },
      {
        name: "City Backpack",
        slug: "city-backpack",
        description: "Compact backpack for laptop and everyday carry.",
        price: 99,
        stock: 12,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80"
      },
      {
        name: "Everyday Watch",
        slug: "everyday-watch",
        description: "Simple watch with a modern minimal design.",
        price: 169,
        stock: 10,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  });
}

main().finally(() => prisma.$disconnect());
