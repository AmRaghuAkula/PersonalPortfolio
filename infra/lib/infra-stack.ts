import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const leadsTable = new dynamodb.TableV2(this, "LeadsTable", {
      tableName: "leads",
      partitionKey: { name: "leadId", type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true },
    });

    const leadIntakeFn = new lambda.NodejsFunction(this, "LeadIntakeFunction", {
      functionName: "lead-intake",
      entry: path.join(__dirname, "../lambda/lead-intake/index.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_24_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: {
        LEADS_TABLE_NAME: leadsTable.tableName,
        // Tighten to the deployed Amplify domain once known; "*" only until then.
        ALLOWED_ORIGIN: "*",
      },
    });

    // Least-privilege, add-only: this Lambda may PutItem into the leads
    // table and nothing else. grantWriteData() is intentionally not used
    // here since it also grants DeleteItem/UpdateItem/BatchWriteItem, none
    // of which the handler ever calls.
    leadsTable.grant(leadIntakeFn, "dynamodb:PutItem");

    const api = new apigateway.RestApi(this, "PortalApi", {
      restApiName: "portal-api",
      deployOptions: {
        stageName: "prod",
        throttlingRateLimit: 5, // steady-state requests/sec across the API
        throttlingBurstLimit: 10, // burst capacity above the steady rate
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["POST", "OPTIONS"],
      },
    });

    const contact = api.root.addResource("contact");
    contact.addMethod("POST", new apigateway.LambdaIntegration(leadIntakeFn));

    new cdk.CfnOutput(this, "ApiUrl", { value: api.url });
  }
}
