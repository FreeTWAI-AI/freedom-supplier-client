# 自由工坊 · 供應端客戶端

[開始刊登商品](https://freetwai.com/#supplier) · [Fork 我的客戶端](https://github.com/FreeTWAI-AI/freedom-supplier-client/fork) · [核准／撤銷讀取連線](https://freetwai.com/#account)

這是供貨者可以 Fork、改造的第一本技能書。現在先在自由工坊網站刊登商品、整理供貨條件與處理合作申請；這個客戶端連回同一個中央平台，讀取**你自己的商品和供貨申請**。不需要重新輸入一份商品資料，也不建立另一套會員、資料庫或收款帳。

## 開始

需要 Node.js 24。沒有第三方 runtime 套件。

```sh
npm ci --ignore-scripts
npm test
npm run connect
```

終端會顯示五分鐘有效的連線代碼和自由工坊網站連結。在**自己的瀏覽器**登入、完成定位，到「我的名片」輸入代碼；確認名稱與 `supplier:read` 範圍後核准。密碼不會交給客戶端。

核准後：

```sh
npm run read
npm run read -- products
npm run read -- requests
npm run read -- connection
```

預設平台是 `https://freetwai.com`。輸出為私人 JSON，可用自己的工具整理；它不是可公開販售的商品 feed。商品上架、改價和供貨決定仍在[供應端工作台](https://freetwai.com/#supplier)完成；這個連線沒有寫入或付款權限。

## 連線保存與撤銷

連線檔存在 repo 外的 `~/.config/freedom-clients/supplier.json`，權限 `0600`。CLI 不列印 token、不接受瀏覽器 session、不跟隨帶憑證請求的重新導向，也不自動重試資料操作。

在[我的名片](https://freetwai.com/#account)撤銷連線後立即失效。重新連線前，先撤銷舊連線，再自行移除舊的本機連線檔；CLI 不覆寫既有檔案。

本機開發可設定 `FREEDOM_PLATFORM_ORIGIN=http://127.0.0.1:4310`。如果使用多個平台或商店，以 `FREEDOM_CREDENTIAL_FILE` 指定不同的私人檔案。`FREEDOM_CLIENT_NAME` 可設定要在核准畫面顯示的名稱。

不要將連線檔、環境變數檔、讀取結果或客戶資料 commit／部署到 GitHub Pages。`.gitignore` 已排除常用憑證與私人輸出目錄；這不取代核對將要發布的檔案。

## 程式接入

```js
import {ScopedReadClient,loadSupplierWorkspace} from './src/index.mjs';

// token 由本機私人連線檔讀取；不可寫進程式或前端 bundle。
const client = new ScopedReadClient({origin: 'https://freetwai.com', token});
const workspace = await loadSupplierWorkspace(client);
```

資料權限由中央平台每次查核。停用帳號、連線到期或撤銷都會拒絕讀取。客戶端不取得其他供貨者的私人商品，也不改寫會員身分、公會或供貨資料。

`client/` 的共用 transport 與 CLI 來自 `freedom-platform/packages/client-connections`；來源 commit、檔案路徑與 SHA-256 記錄在 `client-source.lock.json`。執行 `npm run verify:client-source -- --remote` 可驗證固定版本。修改客戶端介面時，保留原始 transport 或經明確更新來源與測試後再同步。

本 repo 尚未選定額外程式授權，沒有自動授予第三方商用或再授權權利；平台原作者與引用專案的授權各自保留。此模板不包含買家結帳、金流、訂單履約或正式供貨合約。
