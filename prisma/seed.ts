import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.food.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const bcrypt = require('bcryptjs')
  const adminPassword = await bcrypt.hash('admin123', 12)
  
  await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@foodorder.com',
      password: adminPassword,
      role: 'admin'
    }
  })

  // Seed food items
  const foods = [
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, onion, and our special sauce',
      price: 12.99,
      imageUrl: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Margherita Pizza',
      description: 'Fresh tomatoes, mozzarella cheese, and basil on crispy crust',
      price: 15.99,
      imageUrl: 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Chicken Caesar Salad',
      description: 'Grilled chicken breast on fresh romaine lettuce with Caesar dressing',
      price: 10.99,
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Fish & Chips',
      description: 'Beer-battered cod with crispy fries and tartar sauce',
      price: 14.99,
      imageUrl: 'https://images.pexels.com/photos/1885057/pexels-photo-1885057.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with bacon, eggs, and parmesan cheese',
      price: 13.99,
      imageUrl: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Chocolate Brownie',
      description: 'Rich chocolate brownie served with vanilla ice cream',
      price: 6.99,
      imageUrl: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Grilled Chicken Sandwich',
      description: 'Grilled chicken breast with avocado, lettuce, and chipotle mayo',
      price: 11.99,
      imageUrl: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Vegetable Stir Fry',
      description: 'Fresh vegetables stir-fried with garlic and soy sauce, served with rice',
      price: 9.99,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'
    }
  ]

  for (const food of foods) {
    await prisma.food.create({
      data: food
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })