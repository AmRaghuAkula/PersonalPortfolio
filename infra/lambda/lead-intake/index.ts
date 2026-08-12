import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.LEADS_TABLE_NAME!;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LEN = 200;
const MAX_EMAIL_LEN = 320;
const MAX_MESSAGE_LEN = 2000;

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function respond(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return respond(204, {});
  }

  let payload: { name?: unknown; email?: unknown; message?: unknown };
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return respond(400, { error: "Invalid JSON body" });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || name.length > MAX_NAME_LEN) {
    return respond(400, { error: "Invalid name" });
  }
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return respond(400, { error: "Invalid email" });
  }
  if (!message || message.length > MAX_MESSAGE_LEN) {
    return respond(400, { error: "Invalid message" });
  }

  const leadId = randomUUID();
  const submittedAt = new Date().toISOString();

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        leadId,
        name,
        email,
        message,
        submittedAt,
        source: "portal-contact-form",
      },
    }),
  );

  return respond(201, { leadId });
};
