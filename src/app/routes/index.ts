import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { JobRoutes } from "../modules/Job/job.route";
import { ApplicationRoutes } from "../modules/Application/application.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/jobs",
    route: JobRoutes,
  },
  {
    path: "/applications",
    route: ApplicationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
