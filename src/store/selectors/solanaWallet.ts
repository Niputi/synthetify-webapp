import { BN } from '@project-serum/anchor'
import { createSelector } from '@reduxjs/toolkit'
import { assets, collaterals, exchangeAccount, swaplines, synthetics, userDebtValue } from '@selectors/exchange'
import { ISolanaWallet, solanaWalletSliceName, ITokenAccount } from '../reducers/solanaWallet'
import { keySelectors, AnyProps } from './helpers'
import { PublicKey } from '@solana/web3.js'
import { ACCURACY, DEFAULT_PUBLICKEY, ORACLE_OFFSET } from '@consts/static'
import { ICollateral, ISynthetic } from '@reducers/exchange'
import { Asset, Swapline } from '@synthetify/sdk/lib/exchange'

const store = (s: AnyProps) => s[solanaWalletSliceName] as ISolanaWallet

export const { address, balance, accounts, status } = keySelectors(store, [
  'address',
  'balance',
  'accounts',
  'status'
])

export const tokenBalance = (tokenAddress: PublicKey) =>
  createSelector(accounts, balance, (tokensAccounts, solBalance) => {
    if (tokenAddress.equals(DEFAULT_PUBLICKEY)) {
      return { balance: solBalance, decimals: 9 }
    } else {
      if (!tokensAccounts[tokenAddress.toString()]) {
        return { balance: new BN(0), decimals: 9 }
      }
      return {
        balance: tokensAccounts[tokenAddress.toString()].balance,
        decimals: tokensAccounts[tokenAddress.toString()].decimals
      }
    }
  })
export const tokenAccount = (tokenAddress: PublicKey) =>
  createSelector(accounts, tokensAccounts => {
    if (tokensAccounts[tokenAddress.toString()]) {
      return tokensAccounts[tokenAddress.toString()]
    }
  })

export type ExchangeSyntheticTokens = Asset & ISynthetic & { balance: BN }
export const exchangeTokensWithUserBalance = createSelector(
  accounts,
  synthetics,
  assets,
  (tokensAccounts, allSynthetics, exchangeAssets) => {
    return Object.values(allSynthetics)
      .map(asset => {
        const userAccount = tokensAccounts[asset.assetAddress.toString()]
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return {
          ...exchangeAssets[allSynthetics[asset.assetAddress.toString()].assetIndex],
          ...allSynthetics[asset.assetAddress.toString()],
          balance: userAccount ? userAccount.balance : new BN(0)
        } as ExchangeSyntheticTokens
      })
  }
)

export type ExchangeCollateralTokens = Asset & ICollateral & { balance: BN }
export interface SwaplinePair extends Swapline {
  collateralData: ExchangeCollateralTokens
  syntheticData: ExchangeSyntheticTokens
}

export const swaplinePairs = createSelector(
  swaplines,
  synthetics,
  collaterals,
  accounts,
  assets,
  balance,
  (allSwaplines, allSynthetics, allCollaterals, tokensAccounts, allAssets, wSOLBalance) => {
    return Object.values(allSwaplines).map((swapline) => {
      const syntheticAccount = tokensAccounts[swapline.synthetic.toString()]
      const collateralAccount = tokensAccounts[swapline.collateral.toString()]
      const pair: SwaplinePair = {
        ...swapline,
        syntheticData: {
          ...allAssets[allSynthetics[swapline.synthetic.toString()].assetIndex],
          ...allSynthetics[swapline.synthetic.toString()],
          balance: syntheticAccount ? syntheticAccount.balance : new BN(0)
        },
        collateralData: allCollaterals[swapline.collateral.toString()].symbol !== 'WSOL'
          ? {
            ...allAssets[allCollaterals[swapline.collateral.toString()].assetIndex],
            ...allCollaterals[swapline.collateral.toString()],
            balance: collateralAccount ? collateralAccount.balance : new BN(0)
          } : {
            ...allAssets[allCollaterals[swapline.collateral.toString()].assetIndex],
            ...allCollaterals[swapline.collateral.toString()],
            balance: wSOLBalance
          }
      }

      return pair
    })
  }
)

export type TokenAccounts = ITokenAccount & {
  symbol: string,
  usdValue: BN,
  assetDecimals: number
}
export const syntheticAccountsArray = createSelector(
  accounts,
  synthetics,
  assets,
  (tokensAccounts, allSynthetics, exchangeAssets): TokenAccounts[] => {
    return Object.values(tokensAccounts).reduce((acc, account) => {
      if (allSynthetics[account.programId.toString()]) {
        const asset = allSynthetics[account.programId.toString()]
        acc.push({
          ...account,
          symbol: asset.symbol,
          assetDecimals: asset.supply.scale,
          usdValue: exchangeAssets[asset.assetIndex].price.val
            .mul(account.balance)
            .mul(new BN(10 ** account.decimals))
            .div(new BN(10 ** (exchangeAssets[asset.assetIndex].price.scale)))
            .div(new BN(10 ** asset.supply.scale))
        })
      }
      return acc
    }, [] as TokenAccounts[])
  }
)

export const collateralAccountsArray = createSelector(
  accounts,
  collaterals,
  assets,
  address,
  balance,
  (tokensAccounts, allCollaterals, exchangeAssets, wSOLAddress, wSOLBalance): TokenAccounts[] => {
    const accounts: TokenAccounts[] = []

    for (const collateral of Object.values(allCollaterals)) {
      const account = tokensAccounts[collateral.collateralAddress.toString()]
      if (collateral.symbol === 'WSOL') {
        accounts.push({
          symbol: collateral.symbol,
          assetDecimals: collateral.reserveBalance.scale,
          usdValue: exchangeAssets[collateral.assetIndex].price.val
            .mul(wSOLBalance)
            .div(new BN(10 ** (exchangeAssets[collateral.assetIndex].price.scale))),
          decimals: collateral.reserveBalance.scale,
          programId: collateral.collateralAddress,
          balance: wSOLBalance,
          address: wSOLAddress
        })
      } else if (account) {
        accounts.push({
          ...account,
          symbol: collateral.symbol,
          assetDecimals: collateral.reserveBalance.scale,
          usdValue: exchangeAssets[collateral.assetIndex].price.val
            .mul(account.balance)
            .mul(new BN(10 ** account.decimals))
            .div(new BN(10 ** (exchangeAssets[collateral.assetIndex].price.scale)))
            .div(new BN(10 ** collateral.reserveBalance.scale))
        })
      } else {
        accounts.push({
          symbol: collateral.symbol,
          assetDecimals: collateral.reserveBalance.scale,
          usdValue: new BN(0),
          decimals: collateral.reserveBalance.scale,
          programId: collateral.collateralAddress,
          balance: new BN(0),
          address: DEFAULT_PUBLICKEY
        })
      }
    }

    return accounts
  }
)
export const stakedAccountsArray = createSelector(
  exchangeAccount,
  collaterals,
  assets,
  address,
  accounts,
  (account, allCollaterals, allAssets, wSOLAddress, tokensAccounts): TokenAccounts[] => {
    const accounts: TokenAccounts[] = []

    for (const collateral of account.collaterals) {
      const collateralAddress = collateral.collateralAddress.toString()
      if (allCollaterals[collateralAddress]) {
        accounts.push({
          symbol: allCollaterals[collateralAddress].symbol,
          programId: allCollaterals[collateralAddress].collateralAddress,
          decimals: allCollaterals[collateralAddress].reserveBalance.scale,
          address: allCollaterals[collateralAddress].symbol === 'WSOL' ? wSOLAddress : tokensAccounts[collateralAddress].address,
          assetDecimals: allCollaterals[collateralAddress].reserveBalance.scale,
          balance: collateral.amount,
          usdValue: collateral.amount
            .mul(allAssets[allCollaterals[collateralAddress].assetIndex].price.val)
            .div(new BN(10 ** (allAssets[allCollaterals[collateralAddress].assetIndex].price.scale)))
        })
      }
    }

    return accounts
  }
)
export const userMaxBurnToken = (assetAddress: PublicKey) =>
  createSelector(userDebtValue, synthetics, assets, tokenAccount(assetAddress), (debt, allSynthetics, allAssets, account) => {
    const token = allSynthetics[assetAddress.toString()]
    if (debt.eq(new BN(0)) || !token) {
      return new BN(0)
    }
    const decimalChange = 10 ** (token.supply.scale + ORACLE_OFFSET - ACCURACY)

    const assetToBurnBalance = account ? allAssets[token.assetIndex].price.val.mul(account.balance).div(new BN(decimalChange)) : new BN(0)

    const val = debt.lt(assetToBurnBalance) ? debt : assetToBurnBalance

    return val.mul(new BN(decimalChange)).div(allAssets[token.assetIndex].price.val)
  })

export const userMaxDeposit = (assetAddress: PublicKey) =>
  createSelector(tokenBalance(assetAddress), collaterals, balance, (assetBalance, allCollaterals, wSOLBalance) => {
    if (!allCollaterals[assetAddress.toString()]) {
      return {
        maxDeposit: new BN(0),
        decimals: 6
      }
    }

    if (allCollaterals[assetAddress.toString()]?.symbol === 'WSOL') {
      let newBalance = wSOLBalance.sub(
        new BN(21 *
          (10 **
            (allCollaterals[assetAddress.toString()].reserveBalance.scale - 4)
          )
        )
      )
      newBalance = newBalance.lt(
        allCollaterals[assetAddress.toString()].maxCollateral.val
          .sub(allCollaterals[assetAddress.toString()].reserveBalance.val)
      )
        ? newBalance
        : allCollaterals[assetAddress.toString()].maxCollateral.val
          .sub(allCollaterals[assetAddress.toString()].reserveBalance.val)
      return {
        maxDeposit: newBalance.lt(new BN(0)) ? new BN(0) : newBalance,
        decimals: allCollaterals[assetAddress.toString()].reserveBalance.scale
      }
    }

    return {
      decimals: assetBalance.decimals,
      maxDeposit: assetBalance.balance.lt(
        allCollaterals[assetAddress.toString()].maxCollateral.val
          .sub(allCollaterals[assetAddress.toString()].reserveBalance.val)
      )
        ? assetBalance.balance
        : allCollaterals[assetAddress.toString()].maxCollateral.val
          .sub(allCollaterals[assetAddress.toString()].reserveBalance.val)
    }
  })

export const solanaWalletSelectors = {
  address,
  balance,
  accounts,
  status,
  syntheticAccountsArray,
  tokenAccount,
  exchangeTokensWithUserBalance,
  userMaxBurnToken
}
export default solanaWalletSelectors
