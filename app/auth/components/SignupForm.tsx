import { Link, Routes, useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR, InputControl } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { Box, Flex, Heading, Input } from "@chakra-ui/react"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <Flex w="50%" m={"auto"} h="100%" pt="32" alignItems={"center"} flexDirection={"column"}>
      <Heading mb="8">Signup</Heading>

      <Form
        submitText="Signup"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // TODO error for email field not working
              return { [FORM_ERROR]: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <InputControl name="email" label="Email" />
        <Box mb={"4"} />
        <InputControl name="password" label="Password" type="password" />
        <Box mb={"4"} />
      </Form>

      <Box mt="4">
        Or <Link href={Routes.LoginPage()}>Log in</Link>
      </Box>
    </Flex>
  )
}

export default SignupForm
