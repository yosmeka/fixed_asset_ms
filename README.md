# Fixed Asset Management System (FAMS)

A comprehensive web application for managing fixed assets, built with Next.js 15, Prisma, and MySQL.

## Features

- Asset Management (Create, Read, Update, Delete)
- Asset Depreciation Calculation
- Asset Disposal Management
- Asset History Tracking
- User Authentication and Authorization
- Report Generation
- Dashboard Analytics

## Prerequisites

- Node.js 18.x or later
- MySQL 8.0 or later
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fams-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/fams_db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup the database**
   ```bash
   npx prisma db push
   # or
   yarn prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
fams-app/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   ├── assets/           # Asset management pages
│   ├── auth/             # Authentication pages
│   ├── components/       # Reusable components
│   └── dashboard/        # Dashboard pages
├── prisma/               # Database schema and migrations
├── public/               # Static files
└── lib/                  # Utility functions
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
