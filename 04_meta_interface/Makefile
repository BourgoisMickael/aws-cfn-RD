region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

all: deploy

deploy:
	sam deploy \
		--region $(region) \
		--template-file sam/template.yml \
		--no-fail-on-empty-changeset \
		--stack-name meta-interface \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3
	@echo Go in AWS console cloudformation create changeset or update to see groups

clean:
	-sam delete \
		--region $(region) \
		--stack-name meta-interface \
		--no-prompts \
		--s3-bucket $(managed_bucket)

.PHONY: all deploy clean
