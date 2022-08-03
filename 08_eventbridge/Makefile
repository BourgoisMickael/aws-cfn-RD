region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

all: deploy deploy-testing

deploy:
	sam deploy \
		--region $(region) \
		--template-file sam/listener.yml \
		--no-fail-on-empty-changeset \
		--stack-name cf-event \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

deploy-testing:
	sam deploy \
		--region $(region) \
		--template-file sam/testing.yml \
		--no-fail-on-empty-changeset \
		--stack-name cf-event-testing \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

	sam deploy \
		--region $(region) \
		--template-file sam/testing-update.yml \
		--no-fail-on-empty-changeset \
		--stack-name cf-event-testing \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

	-sam delete \
		--region $(region) \
		--stack-name cf-event-testing \
		--no-prompts \
		--s3-bucket $(managed_bucket)
clean:
	-sam delete \
		--region $(region) \
		--stack-name cf-event \
		--no-prompts \
		--s3-bucket $(managed_bucket)

.PHONY: all deploy clean deploy-testing
