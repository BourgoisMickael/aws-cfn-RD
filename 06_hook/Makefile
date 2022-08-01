region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

hookTypeArn?=$(shell aws cloudformation list-types \
	--query "TypeSummaries[?TypeName=='MBO::Example::MyHook']|[0].TypeArn" \
	--output text)

all: validate submit activate-hook deploy

deploy:
	sam deploy \
		--region $(region) \
		--template-file sam/template.yml \
		--no-fail-on-empty-changeset \
		--stack-name hook-testing \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

clean:
	-sam delete \
		--region $(region) \
		--stack-name hook-testing \
		--no-prompts \
		--s3-bucket $(managed_bucket)

validate:
	cfn validate

submit:
	cfn submit --set-default

show-hook:
	aws cloudformation list-types \
		--query "TypeSummaries[?TypeName=='MBO::Example::MyHook']"

activate-hook:
	aws cloudformation set-type-configuration \
		--region $(region)
		--configuration "{\"CloudFormationConfiguration\":{\"HookConfiguration\":{\"TargetStacks\":\"ALL\",\"FailureMode\":\"WARN\",\"Properties\":{\"EncryptionAlgorithm\": \"AES256\"}}}}" \
		--type-arn $(hookTypeArn)

deactivate-hook:
	aws cloudformation set-type-configuration \
		--region $(region) \
		--configuration "{\"CloudFormationConfiguration\":{\"HookConfiguration\":{\"TargetStacks\":\"NONE\",\"FailureMode\":\"FAIL\",\"Properties\":{}}}}" \
		--type-arn $(hookTypeArn)

deregister-hook:
	aws cloudformation deregister-type --arn $(hookTypeArn)

deregister-hook-version:
	aws cloudformation deregister-type --arn $(hookTypeArn)/00000001


.PHONY: all deploy clean validate submit activate-hook
