region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

all: deploy-length deploy-prod deploy-staging

# https://github.com/aws/aws-sam-cli/releases/tag/v1.56.1
# Use sam version 1.56.1

deploy-length:
	sam deploy \
		--region $(region) \
		--template-file sam/length.yml \
		--no-fail-on-empty-changeset \
		--stack-name length \
		--resolve-s3

deploy-prod:
	sam deploy \
		--region $(region) \
		--template-file sam/template.yml \
		--no-fail-on-empty-changeset \
		--stack-name ref-in-policy-prod \
		--resolve-s3 \
		--parameter-overrides \
			Stage=Prod

deploy-staging:
	sam deploy \
		--region $(region) \
		--template-file sam/template.yml \
		--no-fail-on-empty-changeset \
		--stack-name ref-in-policy-staging \
		--resolve-s3 \
		--parameter-overrides \
			Stage=Staging

clean:
	-sam delete \
		--region $(region) \
		--stack-name length \
		--no-prompts \
		--s3-bucket $(managed_bucket)

	-sam delete \
		--region $(region) \
		--stack-name ref-in-policy-prod \
		--no-prompts \
		--s3-bucket $(managed_bucket)

	-sam delete \
		--region $(region) \
		--stack-name ref-in-policy-staging \
		--no-prompts \
		--s3-bucket $(managed_bucket)

.PHONY: all deploy-length deploy-prod deploy-staging clean
