// ===============================================
// CMS Nova - Schema de Prisma Base
// ===============================================

export const novaSchema = `
// CMS Nova - Base Schema
// This can be extended in your project's schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --------- USUARIOS Y AUTENTICACIÓN ---------
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  role          String    @default("USER")
  accounts      Account[]
  banned        Boolean?
  banReason     String?
  banExpires    DateTime?
  sessions      Session[]

  @@map("user")
}

model Account {
  id           String    @id @default(cuid())
  userId       String
  providerId   String?
  accessToken  String?   @db.Text
  refreshToken String?   @db.Text
  expiresAt    DateTime?
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  password     String?

  accountId             String
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  createdAt             DateTime
  updatedAt             DateTime

  @@unique([userId, providerId])
  @@map("account")
}

model Session {
  id             String   @id
  expiresAt      DateTime
  token          String
  createdAt      DateTime
  updatedAt      DateTime
  ipAddress      String?
  userAgent      String?
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  impersonatedBy String?

  @@unique([token])
  @@map("session")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verification")
}

// --------- CONTENIDO/PLANES ---------
model Plan {
  id                   String   @id @default(cuid())
  mainTitle            String
  articleAlias         String   @unique
  categoryAlias        String
  promotionalText      String   @db.Text
  attractionsTitle     String
  attractionsText      String   @db.Text
  transfersTitle       String
  transfersText        String   @db.Text
  holidayTitle         String
  holidayText          String   @db.Text
  destination          String
  includes             String   @db.Text
  notIncludes          String   @db.Text
  itinerary            Json[]
  priceOptions         Json[]
  generalPolicies      String?  @db.Text
  transportOptions     Json[]
  allowGroundTransport Boolean  @default(false)
  videoUrl             String?
  mainImage            Json?
  published            Boolean  @default(false)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  @@map("plans")
}

// --------- ACTIVIDAD Y LOGS ---------
model ActivityLog {
  id          String   @id @default(cuid())
  type        String
  description String
  userId      String?
  userName    String?
  metadata    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@map("activity_log")
}

// --------- CONFIGURACIÓN ---------
model NovaConfig {
  id       String @id @default(cuid())
  key      String @unique
  value    Json
  category String @default("general")
  updatedAt DateTime @updatedAt

  @@map("nova_config")
}
`;

// --------- UTILIDADES PARA EXTENDER EL SCHEMA ---------
export interface SchemaExtension {
  models?: string;
  enums?: string;
  custom?: string;
}

export function extendNovaSchema(extensions: SchemaExtension): string {
  let schema = novaSchema;
  
  if (extensions.enums) {
    const enumsSection = `
// Custom Enums
${extensions.enums}`;
    schema = schema.replace('// This can be extended in your project\'s schema.prisma', 
      '// This can be extended in your project\'s schema.prisma' + enumsSection);
  }
  
  if (extensions.models) {
    schema += `
// --------- MODELOS PERSONALIZADOS ---------
${extensions.models}`;
  }
  
  if (extensions.custom) {
    schema += `
// --------- CONFIGURACIÓN PERSONALIZADA ---------
${extensions.custom}`;
  }
  
  return schema;
}

// --------- CONFIGURACIONES PREDEFINIDAS ---------
export const schemaConfigs = {
  authOnly: {
    models: '',
    enums: '',
    custom: ''
  },
  
  withPlans: {
    models: '',
    enums: `
enum PlanStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum TransportType {
  FLIGHT
  BUS
  CAR
  TRAIN
}`,
    custom: ''
  }
}; 
