import React, { ReactNode } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { GlobalModalHost } from '@/shared/components/layout/GlobalModalHost'
import { Button, Card, CardContent, CardHeader, Text } from '@/shared/components/ui'
import { ApiError, AppError } from '@/core/api/global/errors'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  fatalError: Error | null
  overlayError: Error | null
}

let externalGlobalErrorHandler: ((error: Error) => void) | null = null

/**
 * Opens the global error modal without crashing the render tree.
 * Useful for manual tests and non-rendering error flows (mutations, permissions, etc.).
 */
export const showGlobalApiError = (error: Error) => {
  externalGlobalErrorHandler?.(error)
}

/**
 * Global error boundary for API and application errors.
 *
 * Catches ApiError and AppError instances and displays them in a modal with proper i18n translation.
 * - ApiError: Maps error.code to i18n key format: common.api.errors.backendCodes.{code}
 * - AppError: Translates error.translationKey directly
 *
 * Usage: Wrap AppProvider/AuthProvider with this component to handle errors globally.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      fatalError: null,
      overlayError: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
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
    console.error('[ErrorBoundary] Caught error:', error, errorInfo.componentStack)
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

  if (error instanceof AppError) {
    // Translate the i18n key
    displayMessage = t(error.translationKey)
  } else if (error instanceof ApiError) {
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
