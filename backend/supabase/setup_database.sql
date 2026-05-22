-- SQL script to create tables in Supabase
-- This matches the Sequelize models created earlier

-- Users Table
CREATE TABLE IF NOT EXISTS public."Users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER', 'SUPERINTENDENT')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vessels Table
CREATE TABLE IF NOT EXISTS public."Vessels" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "vesselName" TEXT NOT NULL,
    "vesselType" TEXT NOT NULL,
    "imoNumber" TEXT UNIQUE NOT NULL,
    "createdBy" UUID REFERENCES public."Users"(id),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports Table
CREATE TABLE IF NOT EXISTS public."Reports" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "vesselId" UUID REFERENCES public."Vessels"(id),
    title TEXT NOT NULL,
    "inspectionDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    description TEXT,
    attachments TEXT[] DEFAULT '{}',
    "createdBy" UUID REFERENCES public."Users"(id),
    "approvedBy" UUID REFERENCES public."Users"(id),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
