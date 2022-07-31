region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

all: validate submit deploy

deploy:
	sam deploy \
		--region $(region) \
		--template-file sam/template.yml \
		--no-fail-on-empty-changeset \
		--stack-name module-testing \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

clean:
	-sam delete \
		--region $(region) \
		--stack-name module-testing \
		--no-prompts \
		--s3-bucket $(managed_bucket)

validate:
	cfn validate

submit:
	cfn submit --set-default

.PHONY: all deploy clean validate submit
