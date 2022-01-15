import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR, InputControl } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Box, Flex, Heading, Input, Text } from "@chakra-ui/react"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <Flex w="50%" m={"auto"} h="100%" pt="32" alignItems={"center"} flexDirection={"column"}>
      <Heading mb="8">Login</Heading>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <InputControl name="email" label="Email" />
        <Box mb={"4"} />
        <InputControl name="password" label="Password" type="password" />
        <Box mb={"4"} />
        <Box textAlign={"right"}>
          <Link href={Routes.ForgotPasswordPage()}>Forgot your password?</Link>
        </Box>
      </Form>

      <Box mt="4">
        Or <Link href={Routes.SignupPage()}>Sign Up</Link>
      </Box>
    </Flex>
  )
}

export default LoginForm
