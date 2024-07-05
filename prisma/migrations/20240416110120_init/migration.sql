-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('EMAIL', 'PHONE', 'WALLET', 'GOOGLE', 'APPLE', 'FACEBOOK', 'TWITTER', 'GITHUB', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "SettingDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'OBJECT');

-- CreateTable
CREATE TABLE "tbl_users" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "email" TEXT,
    "phone" TEXT,
    "wallet" TEXT,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth_roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER
);

-- CreateTable
CREATE TABLE "tbl_auth_permissions" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "action" VARCHAR NOT NULL,
    "subject" VARCHAR NOT NULL,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "conditions" JSONB,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "tbl_users_roles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,

    CONSTRAINT "tbl_users_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "service" "Service" NOT NULL,
    "serviceId" TEXT NOT NULL,
    "details" JSONB,
    "challenge" TEXT,
    "falseAttempts" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockedOnAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "tbl_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_auth_sessions" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "authId" INTEGER NOT NULL,
    "ip" TEXT,
    "details" JSONB,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_auth_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_settings" (
    "name" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "dataType" "SettingDataType" NOT NULL,
    "requiredFields" TEXT[],
    "isReadOnly" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tbl_settings_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "tbl_pdf_templates" (
    "name" TEXT NOT NULL,
    "template" JSONB[],
    "fonts" TEXT[],
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_pdf_templates_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_uuid_key" ON "tbl_users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_id_key" ON "tbl_auth_roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_roles_name_key" ON "tbl_auth_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_permissions_id_key" ON "tbl_auth_permissions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_roles_userId_roleId_key" ON "tbl_users_roles"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_service_serviceId_key" ON "tbl_auth"("service", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_auth_sessions_sessionId_key" ON "tbl_auth_sessions"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_settings_name_key" ON "tbl_settings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_pdf_templates_name_key" ON "tbl_pdf_templates"("name");

-- AddForeignKey
ALTER TABLE "tbl_auth_permissions" ADD CONSTRAINT "tbl_auth_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tbl_auth_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_roles" ADD CONSTRAINT "tbl_users_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_users_roles" ADD CONSTRAINT "tbl_users_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "tbl_auth_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth" ADD CONSTRAINT "tbl_auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_auth_sessions" ADD CONSTRAINT "tbl_auth_sessions_authId_fkey" FOREIGN KEY ("authId") REFERENCES "tbl_auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
