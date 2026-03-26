# Pal Inbox セットアップガイド

## 目次
1. [Gmail 接続設定](#1-gmail-接続設定)
2. [Slack 接続設定](#2-slack-接続設定)
3. [OpenAI API 設定](#3-openai-api-設定)
4. [Vercel 環境変数の設定](#4-vercel-環境変数の設定)
5. [アプリ内設定ページでの入力](#5-アプリ内設定ページでの入力)

---

## 1. Gmail 接続設定

Gmail はGoogle OAuth 2.0 を使って接続します。ユーザーが Google ログインするとアクセストークンが発行され、そのトークンで Gmail API にアクセスします。

### Step 1: Google Cloud Console でプロジェクト作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 上部の「プロジェクトを選択」→「新しいプロジェクト」をクリック
3. プロジェクト名: `pal-inbox`（任意）
4. 「作成」をクリック

### Step 2: Gmail API を有効化

1. 左メニュー →「APIとサービス」→「ライブラリ」
2. 検索バーで `Gmail API` と検索
3. 「Gmail API」をクリック →「有効にする」をクリック

### Step 3: OAuth 同意画面の設定

1. 左メニュー →「APIとサービス」→「OAuth 同意画面」
2. **User Type**: 「外部」を選択 →「作成」
3. 以下を入力:
   - アプリ名: `Pal Inbox`
   - ユーザーサポートメール: `uenoyurika@basicinc.jp`
   - デベロッパーの連絡先メール: `uenoyurika@basicinc.jp`
4. 「保存して次へ」

5. **スコープの設定**:
   - 「スコープを追加または削除」をクリック
   - 以下を追加:
     - `https://www.googleapis.com/auth/gmail.readonly`
     - `https://www.googleapis.com/auth/gmail.modify`
     - `openid`
     - `email`
     - `profile`
   - 「更新」→「保存して次へ」

6. **テストユーザーの追加**:
   - 「ADD USERS」をクリック
   - `uenoyurika@basicinc.jp` を追加
   - 「保存して次へ」

> **重要**: アプリが「テスト」モードの間は、テストユーザーに追加したアカウントのみがログインできます。公開する場合は Google の審査が必要です。

### Step 4: OAuth クライアント ID の作成

1. 左メニュー →「APIとサービス」→「認証情報」
2. 「＋認証情報を作成」→「OAuth クライアント ID」
3. **アプリケーションの種類**: 「ウェブ アプリケーション」
4. **名前**: `Pal Inbox Web`
5. **承認済みの JavaScript 生成元**:
   - `http://localhost:3000`（ローカル開発用）
   - `https://pal-inbox.vercel.app`（本番用）
6. **承認済みのリダイレクト URI**:
   - `http://localhost:3000/api/auth/callback/google`（ローカル開発用）
   - `https://pal-inbox.vercel.app/api/auth/callback/google`（本番用）
7. 「作成」をクリック

8. 表示される **クライアント ID** と **クライアント シークレット** をメモ（後で Vercel に設定）

---

## 2. Slack 接続設定

Slack は Bot Token を使って接続します。Slack App を作成し、Bot Token をアプリの設定ページに入力します。

### Step 1: Slack App を作成

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」→「From scratch」を選択
3. **App Name**: `Pal Inbox`
4. **Workspace**: 自分のワークスペースを選択
5. 「Create App」をクリック

### Step 2: Bot Token の権限（Scopes）を設定

1. 左メニュー →「OAuth & Permissions」
2. 「Scopes」セクションの **Bot Token Scopes** で以下を追加:
   - `channels:history` — パブリックチャンネルのメッセージ履歴読み取り
   - `channels:read` — パブリックチャンネル一覧の読み取り
   - `groups:history` — プライベートチャンネルのメッセージ履歴読み取り
   - `groups:read` — プライベートチャンネル一覧の読み取り
   - `users:read` — ユーザー情報の読み取り（送信者名取得用）
   - `chat:write` — メッセージ送信（将来の返信機能用）

### Step 3: ワークスペースにインストール

1. 同じ「OAuth & Permissions」ページの上部
2. 「Install to Workspace」をクリック
3. 権限を確認して「許可する」をクリック
4. 表示される **Bot User OAuth Token** をコピー
   - `xoxb-` で始まる文字列です

> **重要**: Bot Token はこのページでいつでも確認できます。

### Step 4: Bot をチャンネルに招待

メンション検索するには、Bot がチャンネルのメンバーである必要があります。

1. Slack のチャンネルで `/invite @Pal Inbox` と入力
2. メンションを読み取りたい全チャンネルで繰り返す

### Slack User ID の確認方法

設定ページの Slack User ID（`U06NTAMKRF1`）の確認方法:

1. Slack デスクトップ/Web で自分のプロフィール画像をクリック
2. 「プロフィール」を選択
3. 「⋮」メニュー →「メンバーID をコピー」
4. `U` で始まる文字列が User ID です

---

## 3. OpenAI API 設定

### Step 1: API Key を取得

1. [OpenAI Platform](https://platform.openai.com/) にアクセス
2. ログイン後、右上のアイコン →「API keys」
3. 「Create new secret key」をクリック
4. 名前: `pal-inbox`（任意）
5. 「Create secret key」→ 表示されるキーをコピー
   - `sk-` で始まる文字列です

> **注意**: キーは作成時のみ表示されます。必ずコピーして保管してください。

### Step 2: 課金設定（必要な場合）

1. 左メニュー →「Settings」→「Billing」
2. クレジットカードを登録
3. `gpt-4o-mini` モデルは非常に安価（1Mトークンあたり約$0.15）

---

## 4. Vercel 環境変数の設定

Gmail の OAuth に必要な環境変数を Vercel に設定します。

1. [Vercel Dashboard](https://vercel.com/) → `pal-inbox` プロジェクト
2. 「Settings」→「Environment Variables」
3. 以下を追加:

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `GOOGLE_CLIENT_ID` | Google Cloud で取得した Client ID | Google OAuth用 |
| `GOOGLE_CLIENT_SECRET` | Google Cloud で取得した Client Secret | Google OAuth用 |
| `NEXTAUTH_SECRET` | ランダムな文字列（32文字以上） | NextAuth セッション暗号化用 |
| `NEXTAUTH_URL` | `https://pal-inbox.vercel.app` | NextAuth コールバックURL |

> **NEXTAUTH_SECRET の生成方法**: ターミナルで `openssl rand -base64 32` を実行

4. 「Save」→ プロジェクトを「Redeploy」

---

## 5. アプリ内設定ページでの入力

Vercel の環境変数を設定したあと:

1. `https://pal-inbox.vercel.app` にアクセス
2. ログイン（メールアドレスを入力）
3. サイドバーの「設定」をクリック
4. 以下を入力:
   - **OpenAI API Key**: `sk-` で始まるキー
   - **Slack Bot Token**: `xoxb-` で始まるトークン
   - **Slack User ID**: `U06NTAMKRF1`（確認済み）
5. 「保存」をクリック

---

## 現在の構成の注意点

### Gmail について
現在のアプリは Google OAuth のフローで Gmail のアクセストークンを取得する仕組みです。ログイン後に Google 認証を行うことで、`googleAccessToken` がセッションに保存され、Gmail API にアクセスできるようになります。

ただし、現在のログインページはシンプルなメールアドレス入力のみです。Gmail 連携を有効にするには、**Google ログインボタン**を追加して NextAuth の Google OAuth フローを通す必要があります。これは追加の実装が必要になりますので、必要であればお知らせください。

### Slack について
Slack は Bot Token を設定ページに直接入力する方式なので、上記の手順で即座に使えます。

### セキュリティ
- OpenAI API Key と Slack Bot Token はブラウザの暗号化 Cookie に保存されます
- Vercel の環境変数はサーバー側のみでアクセスされます
- 他のユーザーが設定を見ることはできません
