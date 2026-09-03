import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first"); // Force IPv4 globally — required on Render (no outbound IPv6)
import "dotenv/config";
import "reflect-metadata";
import "source-map-support";
import app from "./app";
import { DatabaseService } from "@/infrastructure/db/mongoose/connect.db";
import { SignalingGateway } from "../../socket/signaling.gateway";


const PORT = process.env.PORT;

import { seedDefaultFreePlan } from "@/infrastructure/db/seeders/plan.seeder";
import { logger } from "@/infrastructure/providers/logs/logger.service";

const bootstrap = async () => {
  await DatabaseService.connect()
  await seedDefaultFreePlan();

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server started on http://localhost:${PORT}`);
  });

  // Initialize Socket.io Signaling Gateway
  new SignalingGateway(server);
};

bootstrap()