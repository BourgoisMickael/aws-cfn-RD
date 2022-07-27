/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { CloudFormationCustomResourceEvent, CloudFormationCustomResourceResponse, Context } from 'aws-lambda';
import axios from 'axios';

/** Leak custom resource abstraction to test properties from yaml file */
type Playground = CloudFormationCustomResourceResponse;

const isPlayground = (playground?: any): playground is Playground => !!playground && typeof playground === 'object';

export const handler = async (event: CloudFormationCustomResourceEvent, context: Context): Promise<void> => {
    console.log(JSON.stringify({ event, context }, null, 4));
    const responseUrl = new URL(event.ResponseURL);
    console.log(responseUrl);

    let response: CloudFormationCustomResourceResponse | undefined;
    const playground = event?.ResourceProperties?.Playground;

    if (event.RequestType === 'Delete') {
        response = {
            Status: 'SUCCESS',
            Reason: 'Delete without error',
            PhysicalResourceId: event.PhysicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: event.ResourceProperties
        };
    } else if (isPlayground(playground)) {
        response = {
            Status: playground.Status,
            Reason: playground.Reason || '<No Reason>',
            PhysicalResourceId: playground.PhysicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            NoEcho: playground.NoEcho,
            Data: playground.Data
        };
    } else {
        response = {
            Status: 'FAILED',
            Reason: 'Missing Playground property',
            PhysicalResourceId: context.awsRequestId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: {
                message: 'This is a test stack',
                usage: 'Use Playground property to test custom resource trigger',
                props: event.ResourceProperties
            }
        };
    }

    const body = JSON.stringify(response);
    const uploadRes = await axios.put(event.ResponseURL, body, {
        headers: {
            ContentType: 'application/json',
            ContentLength: body.length
        }
    });

    uploadRes.request = null;
    console.log('uploadResult', uploadRes);
};
console.log(handler);
