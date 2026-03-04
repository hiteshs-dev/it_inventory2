import { onRequest as __api_bills_js_onRequest } from "C:\\it_inventory\\frontend\\functions\\api\\bills.js"

export const routes = [
    {
      routePath: "/api/bills",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_bills_js_onRequest],
    },
  ]