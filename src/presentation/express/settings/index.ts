import { config } from "dotenv";
config({ quiet: true });

import "reflect-metadata";
import "source-map-support";
import app from "./app";
import { DatabaseService } from "@/infrastructure/db/mongoose/connect.db";


const PORT = process.env.PORT;

const bootstrap = async () => {
  await DatabaseService.connect()
  app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
  });
};

bootstrap()