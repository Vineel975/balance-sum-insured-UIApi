import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

/**
 * POST /api/claims/process
 *
 * Called by Spectra's StartClaimAuditProxy controller action.
 * Accepts claim PDFs as base64, creates a Convex job, and starts processing.
 *
 * Body:
 * {
 *   claimId:            string,
 *   hospitalBillBase64: string,   // base64 PDF
 *   hospitalFileName:   string,
 *   tariffBase64?:      string,   // optional base64 PDF
 *   tariffFileName?:    string,
 * }
 *
 * Returns: { jobId: string }
 */
http.route({
  path: "/api/claims/process",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    try {
      const body = await request.json() as {
        claimId?:            string;
        hospitalBillBase64?: string;
        hospitalFileName?:   string;
        tariffBase64?:       string;
        tariffFileName?:     string;
      };

      if (!body.hospitalBillBase64) {
        return jsonResponse({ error: "hospitalBillBase64 is required" }, 400);
      }

      // Upload hospital bill PDF to Convex storage
      const hospitalStorageId = await uploadBase64(
        ctx,
        body.hospitalBillBase64,
        "application/pdf",
      );

      // Upload tariff PDF if provided
      let tariffStorageId: string | undefined;
      if (body.tariffBase64) {
        tariffStorageId = await uploadBase64(
          ctx,
          body.tariffBase64,
          "application/pdf",
        );
      }

      // Create job and start processing
      const jobId = await ctx.runMutation(api.jobMutations.createJobWithFiles, {
        claimId:         body.claimId,
        hospitalStorageId,
        hospitalFileName: body.hospitalFileName ?? "hospital-bill.pdf",
        tariffStorageId,
        tariffFileName:   body.tariffFileName,
      });

      return jsonResponse({ jobId }, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse({ error: message }, 500);
    }
  }),
});

/**
 * GET /api/claims/status?jobId=xxx
 *
 * Returns the current status and results of a processing job.
 */
http.route({
  path: "/api/claims/status",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    try {
      const url   = new URL(request.url);
      const jobId = url.searchParams.get("jobId");

      if (!jobId) {
        return jsonResponse({ error: "jobId is required" }, 400);
      }

      const job = await ctx.runQuery(api.processing.getJobById, {
        jobId: jobId as Parameters<typeof api.processing.getJobById>[0]["jobId"],
      });

      if (!job) {
        return jsonResponse({ error: `Job not found: ${jobId}` }, 404);
      }

      return jsonResponse(job, 200);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return jsonResponse({ error: message }, 500);
    }
  }),
});

// ── OPTIONS handlers for CORS preflight ─────────────────────────────────────
http.route({
  path: "/api/claims/process",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

http.route({
  path: "/api/claims/status",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders() })),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(),
    },
  });
}

async function uploadBase64(
  ctx: { storage: { generateUploadUrl: () => Promise<string> } },
  base64: string,
  contentType: string,
): Promise<string> {
  const binaryStr = atob(base64);
  const bytes     = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  const uploadUrl = await ctx.storage.generateUploadUrl();
  const response  = await fetch(uploadUrl, {
    method:  "POST",
    headers: { "Content-Type": contentType },
    body:    bytes,
  });

  if (!response.ok) {
    throw new Error(
      `Storage upload failed: ${response.status} ${await response.text()}`,
    );
  }

  const { storageId } = await response.json() as { storageId: string };
  return storageId;
}

export default http;
