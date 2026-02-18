/**
 * Supabaseのエラーメッセージを日本語に翻訳し、
 * ユーザーにわかりやすい説明を提供します
 */

interface ErrorMessage {
  title: string
  message: string
  suggestion: string
}

export function getAuthErrorMessage(errorMessage: string): ErrorMessage {
  const message = errorMessage.toLowerCase()

  // メールが確認されていない
  if (
    message.includes('email not confirmed') ||
    message.includes('email_not_confirmed')
  ) {
    return {
      title: 'メール確認が完了していません',
      message: 'このメールアドレスはまだ確認されていません。',
      suggestion:
        '登録時に送信された確認メールを確認して、メール内のリンクをクリックしてください。',
    }
  }

  // ログイン認証情報が無効
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password')
  ) {
    return {
      title: 'ログイン認証に失敗しました',
      message: 'メールアドレスまたはパスワードが正しくありません。',
      suggestion:
        'メールアドレスとパスワードをご確認ください。アカウントをお持ちでない場合は、新規登録からアカウントを作成してください。',
    }
  }

  // ユーザーが見つからない
  if (message.includes('user not found')) {
    return {
      title: 'アカウントが見つかりません',
      message: 'このメールアドレスで登録されたアカウントが存在しません。',
      suggestion:
        'メールアドレスをご確認ください。アカウントをお持ちでない場合は、新規登録からアカウントを作成してください。',
    }
  }

  // パスワードが無効またはリセット待ち
  if (
    message.includes('invalid password') ||
    message.includes('password reset') ||
    message.includes('email_recovery_code_expired')
  ) {
    return {
      title: 'パスワードが無効です',
      message: 'パスワードがリセットされているか、有効期限を超えています。',
      suggestion:
        'パスワードをリセットしてください。（パスワードリセット機能は準備中です）',
    }
  }

  // メール確認リンクが無効または期限切れ
  if (
    message.includes('invalid') && message.includes('link') ||
    message.includes('email link is invalid') ||
    message.includes('token') && message.includes('expired') ||
    message.includes('invalid otp') ||
    message.includes('otp_expired')
  ) {
    return {
      title: 'メール確認リンクが無効または有効期限が切れています',
      message:
        'メール内のリンクが無効になっているか、24時間以上経過しています。',
      suggestion:
        '新しい確認メールを再送信してもらってください。[確認メール再送信]ボタンをクリックしてください。',
    }
  }

  // メールアドレスが無効
  if (message.includes('invalid email')) {
    return {
      title: 'メールアドレスが無効です',
      message: 'メールアドレスの形式が正しくありません。',
      suggestion:
        '有効なメールアドレスを入力してください。（例: user@example.com）',
    }
  }

  // レート制限
  if (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('too_many_requests')
  ) {
    return {
      title: 'ログイン試行が多すぎます',
      message: 'セキュリティ上の理由から、一時的にログインがブロックされてます。',
      suggestion:
        '数分後にもう一度お試しください。繰り返される場合はお問い合わせください。',
    }
  }

  // メールが既に使用されている
  if (
    message.includes('user already exists') ||
    message.includes('email already registered')
  ) {
    return {
      title: 'このメールアドレスは既に登録されています',
      message: 'このメールアドレスのアカウントが既に存在します。',
      suggestion:
        'ログインページからログインしてください。パスワードを忘れた場合は、「パスワードをリセット」から新しいパスワードを設定できます。',
    }
  }

  // ネットワークエラー
  if (message.includes('network') || message.includes('fetch')) {
    return {
      title: 'ネットワークエラー',
      message: 'インターネット接続を確認してください。',
      suggestion:
        'インターネット接続が安定していることを確認してから、もう一度お試しください。',
    }
  }

  // デフォルトエラー
  return {
    title: 'ログインに失敗しました',
    message: errorMessage || 'ログイン処理中にエラーが発生しました。',
    suggestion:
      'メールアドレスとパスワードをご確認ください。問題が解決しない場合はお問い合わせください。',
  }
}
