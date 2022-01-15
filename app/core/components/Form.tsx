import { ReactNode, PropsWithoutRef, HTMLInputTypeAttribute } from "react"
import { Form as FinalForm, FormProps as FinalFormProps, useField } from "react-final-form"
import { z } from "zod"
import { validateZodSchema } from "blitz"
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react"
export { FORM_ERROR } from "final-form"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"]
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"]
}

export const Control = ({ name, ...rest }) => {
  const {
    meta: { error, touched },
  } = useField(name, { subscription: { touched: true, error: true } })
  return <FormControl {...rest} isInvalid={error && touched} />
}

export const Error = ({ name }) => {
  const {
    meta: { error },
  } = useField(name, { subscription: { error: true } })
  return <FormErrorMessage>{error}</FormErrorMessage>
}

export const InputControl = ({
  name,
  label,
  type,
}: {
  name: string
  label: string
  type?: HTMLInputTypeAttribute
}) => {
  const { input, meta } = useField(name)
  return (
    <Control name={name} my={4} w="100%">
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...input}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={label}
        type={type}
      />
      <Error name={name} />
    </Control>
  )
}

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <Box w="100%" px="16" as={"form"} onSubmit={handleSubmit}>
          {children}

          {submitError && (
            <div role="alert" style={{ color: "red" }}>
              {submitError}
            </div>
          )}

          {submitText && (
            <Button
              display={"block"}
              mt="4"
              ml={"auto"}
              isLoading={submitting}
              loadingText="Submitting"
              type="submit"
            >
              {submitText}
            </Button>
          )}
        </Box>
      )}
    />
  )
}

export default Form
