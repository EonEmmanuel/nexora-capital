import { PrismaClient, TransactionType } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const pools = [
  {
    slug: "atlas-quant-pool",
    name: "Atlas Quant Pool",
    riskLevel: "MODERATE",
    min: "1000",
    max: "100000",
    cap: "2500000",
    allocated: "610000",
  },
  {
    slug: "helix-market-neutral",
    name: "Helix Market Neutral",
    riskLevel: "CONSERVATIVE",
    min: "5000",
    max: "250000",
    cap: "4000000",
    allocated: "820000",
  },
  {
    slug: "momentum-alpha",
    name: "Momentum Alpha",
    riskLevel: "AGGRESSIVE",
    min: "2500",
    max: "75000",
    cap: "1500000",
    allocated: "240000",
  },
  {
    slug: "sentinel-digital-assets",
    name: "Sentinel Digital Assets",
    riskLevel: "BALANCED",
    min: "1000",
    max: "150000",
    cap: "3000000",
    allocated: "975000",
  },
] as const;
async function main() {
  const passwordHash = await bcrypt.hash("DemoPassword123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nexora.example" },
    update: {},
    create: {
      firstName: "Super",
      lastName: "Admin",
      email: "admin@nexora.example",
      passwordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      kycStatus: "APPROVED",
      referralCode: "NEXORAADMIN",
    },
  });
  const user = await prisma.user.upsert({
    where: { email: "demo@nexora.example" },
    update: {},
    create: {
      firstName: "Avery",
      lastName: "Stone",
      email: "demo@nexora.example",
      passwordHash,
      role: "USER",
      status: "ACTIVE",
      kycStatus: "APPROVED",
      referralCode: "AVERY2026",
      referredById: admin.id,
    },
  });
  await prisma.user.upsert({
    where: { email: "ops@nexora.example" },
    update: {},
    create: {
      firstName: "Olivia",
      lastName: "Ops",
      email: "ops@nexora.example",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      kycStatus: "APPROVED",
      referralCode: "OPS2026",
    },
  });
  await prisma.user.upsert({
    where: { email: "finance@nexora.example" },
    update: {},
    create: {
      firstName: "Finn",
      lastName: "Ledger",
      email: "finance@nexora.example",
      passwordHash,
      role: "FINANCE",
      status: "ACTIVE",
      kycStatus: "APPROVED",
      referralCode: "FIN2026",
    },
  });
  await prisma.user.upsert({
    where: { email: "support@nexora.example" },
    update: {},
    create: {
      firstName: "Sam",
      lastName: "Care",
      email: "support@nexora.example",
      passwordHash,
      role: "SUPPORT",
      status: "ACTIVE",
      kycStatus: "APPROVED",
      referralCode: "SUP2026",
    },
  });
  await prisma.user.upsert({
    where: { email: "analyst@nexora.example" },
    update: {},
    create: {
      firstName: "Ana",
      lastName: "Signal",
      email: "analyst@nexora.example",
      passwordHash,
      role: "ANALYST",
      status: "ACTIVE",
      kycStatus: "APPROVED",
      referralCode: "ANA2026",
    },
  });
  for (const p of pools) {
    const pool = await prisma.tradingPool.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        riskLevel: p.riskLevel,
        status: p.slug === "momentum-alpha" ? "UPCOMING" : "OPEN",
        featured: true,
        shortDescription: "Seeded demo pool",
        fullDescription:
          "Deterministic demo pool for local development. Returns are not guaranteed.",
        strategyDescription: "Structured crypto strategy with risk controls.",
        minimumAllocation: p.min,
        maximumAllocation: p.max,
        totalCapacity: p.cap,
        currentlyAllocated: p.allocated,
        managementFeePercent: "1.5",
        performanceFeePercent: "20",
        baseCurrency: "USDT",
        flexibleDuration: true,
      },
    });
    for (let i = 0; i < 180; i += 15)
      await prisma.poolPerformance.upsert({
        where: {
          poolId_date: {
            poolId: pool.id,
            date: new Date(Date.UTC(2026, 0, 1 + i)),
          },
        },
        update: {},
        create: {
          poolId: pool.id,
          date: new Date(Date.UTC(2026, 0, 1 + i)),
          nav: (100 + i / 8).toString(),
          dailyReturnPercent: "0.12",
          cumulativeReturnPercent: (i / 8).toString(),
          benchmarkReturnPercent: (i / 12).toString(),
          drawdownPercent: "-2.2",
          assetsUnderManagement: p.allocated,
        },
      });
  }
  const atlas = await prisma.tradingPool.findUniqueOrThrow({
    where: { slug: "atlas-quant-pool" },
  });
  const allocation = await prisma.allocation.upsert({
    where: { reference: "ALC-DEMO-ACTIVE" },
    update: {},
    create: {
      userId: user.id,
      poolId: atlas.id,
      reference: "ALC-DEMO-ACTIVE",
      amount: "12500",
      currency: "USDT",
      status: "ACTIVE",
      initialValue: "12500",
      currentValue: "13480",
      realizedProfit: "250",
      unrealizedProfit: "730",
      totalDistributed: "250",
      activatedAt: new Date("2026-04-12"),
    },
  });
  await prisma.payment.upsert({
    where: { paymentReference: "MOCK-ALC-DEMO-ACTIVE" },
    update: {},
    create: {
      userId: user.id,
      allocationId: allocation.id,
      paymentReference: "MOCK-ALC-DEMO-ACTIVE",
      provider: "mock",
      method: "USDT",
      requestedAmount: "12500",
      receivedAmount: "12500",
      currency: "USDT",
      network: "TRON",
      walletAddress: "TMockNexoraDemoWalletAddressDoNotSendFunds",
      status: "COMPLETED",
      confirmations: 3,
      paidAt: new Date("2026-04-12"),
    },
  });
  await prisma.transaction.upsert({
    where: { reference: "TX-MOCK-ALC-DEMO-ACTIVE" },
    update: {},
    create: {
      userId: user.id,
      allocationId: allocation.id,
      type: TransactionType.ALLOCATION,
      amount: "12500",
      currency: "USDT",
      status: "COMPLETED",
      reference: "TX-MOCK-ALC-DEMO-ACTIVE",
      description: "Activated demo allocation",
    },
  });
  await prisma.withdrawal.upsert({
    where: { reference: "WDR-DEMO-001" },
    update: {},
    create: {
      userId: user.id,
      allocationId: allocation.id,
      reference: "WDR-DEMO-001",
      amount: "150",
      fee: "0.75",
      netAmount: "149.25",
      currency: "USDT",
      network: "TRON",
      destinationAddress: "TSeededWithdrawalAddressxxxxxxxx",
      status: "REQUESTED",
    },
  });
  await prisma.withdrawal.upsert({
    where: { reference: "WDR-DEMO-APPROVED" },
    update: {},
    create: {
      userId: user.id,
      allocationId: allocation.id,
      reference: "WDR-DEMO-APPROVED",
      amount: "200",
      fee: "1",
      netAmount: "199",
      currency: "USDT",
      network: "TRON",
      destinationAddress: "TApprovedWithdrawalAddressxxxxxxx",
      status: "APPROVED",
      reviewedById: admin.id,
      reviewedAt: new Date("2026-06-15"),
    },
  });
  await prisma.withdrawal.upsert({
    where: { reference: "WDR-DEMO-REJECTED" },
    update: {},
    create: {
      userId: user.id,
      allocationId: allocation.id,
      reference: "WDR-DEMO-REJECTED",
      amount: "90",
      fee: "0.45",
      netAmount: "89.55",
      currency: "USDT",
      network: "TRON",
      destinationAddress: "TRejectedWithdrawalAddressxxxxxxx",
      status: "REJECTED",
      rejectionReason: "Below operational review threshold in demo data",
      reviewedById: admin.id,
      reviewedAt: new Date("2026-06-20"),
    },
  });
  const ticket = await prisma.supportTicket.upsert({
    where: { id: "seed-support-ticket" },
    update: {},
    create: {
      id: "seed-support-ticket",
      userId: user.id,
      subject: "Question about allocation timing",
      category: "Pool",
      priority: "Normal",
      status: "OPEN",
      messages: {
        create: {
          authorId: user.id,
          body: "Can you confirm when my pool allocation activates after payment?",
          internal: false,
        },
      },
    },
  });
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Welcome to Nexora",
      message: "Your demo dashboard is ready.",
      type: "SUCCESS",
      actionUrl: "/dashboard",
    },
  });
  await prisma.referral.upsert({
    where: { referredUserId: user.id },
    update: {},
    create: {
      referrerId: admin.id,
      referredUserId: user.id,
      conversionStatus: "QUALIFIED",
      rewardAmount: "0",
      rewardStatus: "CONFIGURABLE",
    },
  });
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "seed.created",
      entityType: "SupportTicket",
      entityId: ticket.id,
      description: "Seed data created for local development.",
    },
  });
  await prisma.platformSetting.upsert({
    where: { key: "riskDisclosure" },
    update: {},
    create: {
      key: "riskDisclosure",
      value:
        "Cryptocurrency trading involves substantial risk. Past performance does not guarantee future results.",
      description: "Public risk disclosure",
    },
  });
}
main().finally(() => prisma.$disconnect());
