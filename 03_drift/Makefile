region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

s3BucketName=$(shell aws cloudformation describe-stack-resources \
	--stack-name drift \
	--query "StackResources[0].PhysicalResourceId" \
	--output text)

driftId=$(shell aws cloudformation detect-stack-drift \
	--stack-name drift \
	--query "StackDriftDetectionId" \
	--output text)

all: deploy-drift show-drifts

show-drifts:
	aws cloudformation describe-stack-drift-detection-status \
		--stack-drift-detection-id $(driftId)

	aws cloudformation describe-stack-resource-drifts \
		--stack-name drift

deploy-%:
	sam deploy \
		--region $(region) \
		--template-file sam/$*.yml \
		--no-fail-on-empty-changeset \
		--stack-name $* \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3
	aws s3api delete-bucket --bucket $(s3BucketName)

clean-%:
	-sam delete \
		--region $(region) \
		--stack-name $* \
		--no-prompts \
		--s3-bucket $(managed_bucket)

clean: clean-drift


.PHONY: all clean show-drifts
