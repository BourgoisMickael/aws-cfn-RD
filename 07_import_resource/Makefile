region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

stackDriftId?=$(shell aws cloudformation detect-stack-drift \
	--stack-name importExample \
	--query "StackDriftDetectionId" \
	--output text)

all: create-table create-change-set review-change-set execute-change-set detect-drift

resources-to-import:
	aws --region $(region) cloudformation get-template-summary \
		--template-body file://sam/template.yml \
		--query "ResourceIdentifierSummaries[].{ \
			ResourceType: ResourceType, \
			LogicalResourceId: LogicalResourceIds[0], \
			ResourceIdentifier: { TableName: 'abc' } \
		}" \
		> resources-to-import.json

create-change-set: resources-to-import
	aws --region $(region) cloudformation create-change-set \
		--stack-name importExample \
		--change-set-name ImportTableChangeSet \
		--change-set-type IMPORT \
		--resources-to-import file://resources-to-import.json \
		--template-body file://sam/template.yml

	 aws --region $(region) cloudformation wait change-set-create-complete \
		--stack-name importExample \
		--change-set-name ImportTableChangeSet

review-change-set:
	 aws --region $(region) cloudformation describe-change-set \
	 	--change-set-name ImportTableChangeSet \
		--stack-name importExample

execute-change-set:
	 aws --region $(region) cloudformation execute-change-set \
	 	--change-set-name ImportTableChangeSet \
		--stack-name importExample

	 aws --region $(region) cloudformation wait stack-import-complete \
		--stack-name importExample

	aws --region $(region) cloudformation describe-stack-events \
		--stack-name importExample \
		--query "StackEvents[].{ \
			LogicalResourceId: LogicalResourceId, \
			ResourceStatus: ResourceStatus, \
			ResourceStatusReason: ResourceStatusReason \
		}" \
		--output table

detect-drift:
	aws --region $(region) cloudformation describe-stack-drift-detection-status \
		--stack-drift-detection-id $(stackDriftId)

	aws --region $(region) cloudformation describe-stack-resource-drifts \
		--stack-name importExample

create-table:
	aws --region $(region) dynamodb create-table \
		--table-name abc \
		--attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
		--key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
		--billing-mode PAY_PER_REQUEST \
		--sse-specification Enabled=true \
		--tags Key=hello,Value=world

	aws --region $(region) dynamodb wait table-exists \
		--table-name abc

clean:
	-sam delete \
		--region $(region) \
		--stack-name importExample \
		--no-prompts \
		--s3-bucket $(managed_bucket)

	-aws --region $(region) dynamodb delete-table \
		--table-name abc

.PHONY: all resources-to-import create-change-set review-change-set execute-change-set detect-drift create-table clean
