import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as string, i as object, r as number } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos_._projectId.editar-usACm32N.js
var $$splitComponentImporter = () => import("./projetos_._projectId.editar-0X64K8Vs.mjs");
var Route = createFileRoute("/_authenticated/projetos_/$projectId/editar")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
object({
	client_id: string().min(1, "Obrigatório"),
	name: string().min(1, "Obrigatório"),
	area: string().min(1, "Obrigatório"),
	specialty: string().min(1, "Obrigatório"),
	project_value: number().min(0, "Inválido"),
	amount_received: number().min(0, "Inválido"),
	payment_status: string().min(1, "Obrigatório"),
	start_date: string().min(1, "Obrigatório"),
	expected_delivery_date: string().min(1, "Obrigatório"),
	estimated_hours: number().min(1, "Inválido"),
	priority: string().min(1, "Obrigatório"),
	status: string().min(1, "Obrigatório")
});
//#endregion
export { Route as t };
