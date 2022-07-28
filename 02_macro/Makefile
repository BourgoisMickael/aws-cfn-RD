region?=eu-west-3

managed_bucket?=$(shell aws cloudformation describe-stacks \
	--stack-name aws-sam-cli-managed-default \
	--query "Stacks[0].Outputs[?OutputKey=='SourceBucket']|[0].OutputValue" \
	--output text)

macroTestingOutput=$(shell aws cloudformation describe-stacks \
	--stack-name macro-test \
	--query "Stacks[0].Outputs[?OutputKey=='MacroTesting']|[0].OutputValue" \
	--output text)
macroTestingDescription=$(shell aws cloudformation describe-stacks \
	--stack-name macro-test \
	--query "Stacks[0].Outputs[?OutputKey=='MacroTesting']|[0].Description" \
	--output text)


all: deploy-macro deploy-macro-test assertions

assertions:
	@../assert.sh 'MacroTesting output should be reversed' test "$(macroTestingOutput)" = "elpmaxE"
	@../assert.sh 'MacroTesting description should be reversed' test "$(macroTestingDescription)" = "esrever gnitset orcam elpmaxE"

deploy-%:
	sam deploy \
		--region $(region) \
		--template-file sam/$*.yml \
		--no-fail-on-empty-changeset \
		--stack-name $* \
		--capabilities CAPABILITY_NAMED_IAM \
		--resolve-s3

clean-%:
	-sam delete \
		--region $(region) \
		--stack-name $* \
		--no-prompts \
		--s3-bucket $(managed_bucket)

clean: clean-macro-test clean-macro


.PHONY: all clean assertions
