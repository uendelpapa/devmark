import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projetos-Cb4u1bvV.js
var $$splitComponentImporter = () => import("./projetos-IdsuLcAq.mjs");
var Route = createFileRoute("/_authenticated/projetos")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (search) => {
		return { status: typeof search.status === "string" ? search.status : void 0 };
	}
});
//#endregion
export { Route as t };
