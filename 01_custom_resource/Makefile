region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

stackName?=custom-resource

all: build deploy-custom deploy-sample-valid deploy-sample-invalid deploy-sample-invalid2

build:
	@npm i
	@npm run build

deploy-custom:
	sam deploy \
		--region $(region) \
		--template-file sam/custom_resource.yml \
		--no-fail-on-empty-changeset \
		--stack-name $(stackName) \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

deploy-sample-%:
	-sam deploy \
		--region $(region) \
		--template-file sam/sample_$*.yml \
		--no-fail-on-empty-changeset \
		--stack-name sample-$* \
		--resolve-s3 \
		--parameter-overrides \
			CustomResourceStack=$(stackName)

clean-sample-%:
	-sam delete \
		--region $(region) \
		--stack-name sample-$* \
		--no-prompts \
		--s3-bucket $(managed_bucket)

clean: clean-sample-valid clean-sample-invalid clean-sample-invalid2
	-sam delete \
		--region $(region) \
		--stack-name $(stackName) \
		--no-prompts \
		--s3-bucket $(managed_bucket)

.PHONY: all build deploy-custom clean
