import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { GlobalModalHost } from '@/shared/components/layout/GlobalModalHost'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'
import { ApiError } from '@/core/api/global/errors'

interface ApiErrorBoundaryProps {
  children: ReactNode
}

interface ApiErrorBoundaryState {
  fatalError: Error | null
  overlayError: Error | null
}

let externalGlobalErrorHandler: ((error: Error) => void) | null = null

/**
 * Opens the global API error modal without crashing the render tree.
 * Useful for manual tests and non-rendering error flows.
 */
export const showGlobalApiError = (error: Error) => {
  externalGlobalErrorHandler?.(error)
}

/**
 * Global error boundary for API errors from TanStack Query.
 *
 * Catches ApiError instances and displays them in a modal with proper i18n translation.
 * Attempts to map error.code to i18n key format: common.api.errors.backendCodes.{code}
 *
 * Usage: Wrap AppProvider/AuthProvider with this component to handle API errors globally.
 */
export class ApiErrorBoundary extends React.Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props)
    this.state = {
      fatalError: null,
      overlayError: null,
    }
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return {
      fatalError: error,
      overlayError: null,
    }
  }

  componentDidMount() {
    externalGlobalErrorHandler = this.handleExternalError
  }

  componentWillUnmount() {
    if (externalGlobalErrorHandler === this.handleExternalError) {
      externalGlobalErrorHandler = null
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging
    console.error('[ApiErrorBoundary] Caught error:', error, errorInfo.componentStack)
  }

  handleExternalError = (error: Error) => {
    this.setState({ overlayError: error })
  }

  handleDismiss = () => {
    this.setState({ fatalError: null, overlayError: null })
  }

  render() {
    const activeError = this.state.overlayError ?? this.state.fatalError
    const shouldRenderChildren = this.state.fatalError === null

    return (
      <>
        {shouldRenderChildren ? this.props.children : null}
        {activeError ?
          <ApiErrorModal error={activeError} onDismiss={this.handleDismiss} />
        : null}
      </>
    )
  }
}

/**
 * Modal component that displays API error details with i18n translation.
 */
interface ApiErrorModalProps {
  error: Error
  onDismiss: () => void
}

const ApiErrorModal: React.FC<ApiErrorModalProps> = ({ error, onDismiss }) => {
  const { t } = useTranslation()

  // Extract error message and code
  let displayMessage = error.message
  let errorCode: number | null = null

  if (error instanceof ApiError) {
    errorCode = error.code
    // Try to get i18n translation for the backend error code
    const i18nKey = `common.api.errors.backendCodes.${errorCode}`
    const translatedMessage = t(i18nKey, { defaultValue: error.message })
    displayMessage = translatedMessage
  }

  return (
    <GlobalModalHost visible={true} onClose={onDismiss}>
      <View className='mx-3'>
        <Card className='border-destructive'>
          <CardHeader>
            <Text variant='large' className='text-destructive'>
              {t('common.global.error.prefix')}
              {errorCode && ` (${errorCode})`}
            </Text>
          </CardHeader>

          <CardContent className='gap-4'>
            <Text className='text-muted-foreground'>{displayMessage}</Text>

            <Button onPress={onDismiss} variant='outline'>
              {t('common.actions.dismiss')}
            </Button>
          </CardContent>
        </Card>
      </View>
    </GlobalModalHost>
  )
}
