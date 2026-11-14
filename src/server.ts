import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Redirect /crm without trailing slash to /crm/
    if (url.pathname === "/crm") {
      return Response.redirect(`${url.origin}/crm/`, 301);
    }

    // Route /crm to the CRM frontend service
    if (url.pathname.startsWith("/crm/")) {
      const crmHost =
        (env as Record<string, string>)?.CRM_FRONTEND_URL ||
        (typeof process !== "undefined" && process.env?.CRM_FRONTEND_URL) ||
        "http://localhost:5173";
      const targetUrl = new URL(url.pathname + url.search, crmHost);
      try {
        const proxyHeaders = new Headers(request.headers);
        proxyHeaders.set("host", new URL(crmHost).host);
        proxyHeaders.set("x-forwarded-host", url.host);
        proxyHeaders.set("x-forwarded-proto", url.protocol.replace(":", ""));

        const proxyReq = new Request(targetUrl.toString(), {
          method: request.method,
          headers: proxyHeaders,
          body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
          redirect: "manual",
        });
        return await fetch(proxyReq);
      } catch (err) {
        console.error("CRM proxy error:", err);
      }
    }

    // Route /api to the CRM backend REST API
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      const apiHost =
        (env as Record<string, string>)?.CRM_API_URL ||
        (typeof process !== "undefined" && process.env?.CRM_API_URL) ||
        "http://localhost:5001";
      const targetUrl = new URL(url.pathname + url.search, apiHost);
      try {
        const proxyHeaders = new Headers(request.headers);
        proxyHeaders.set("host", new URL(apiHost).host);
        proxyHeaders.set("x-forwarded-host", url.host);
        proxyHeaders.set("x-forwarded-proto", url.protocol.replace(":", ""));

        const proxyReq = new Request(targetUrl.toString(), {
          method: request.method,
          headers: proxyHeaders,
          body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
          redirect: "manual",
        });
        return await fetch(proxyReq);
      } catch (err) {
        console.error("API proxy error:", err);
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
