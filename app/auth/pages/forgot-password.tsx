import { BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR, InputControl } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import { Box, Flex, Heading, Text } from "@chakra-ui/react"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <Flex w="50%" m={"auto"} h="100%" pt="32" alignItems={"center"} flexDirection={"column"}>
      <Heading mb="8">Forgot your password?</Heading>

      {isSuccess ? (
        <Box>
          <Text fontSize="xl">Request Submitted</Text>
          <Text>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </Text>
        </Box>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)
            } catch (error: any) {
              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
              }
            }
          }}
        >
          <InputControl name="email" label="Email" />
        </Form>
      )}
    </Flex>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>

export default ForgotPasswordPage
